# billing/webhooks.py
import json
import hmac
import hashlib
import base64
import logging
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.http import (
    HttpResponse,
    HttpResponseBadRequest,
    HttpResponseForbidden,
)
from django.utils import timezone
from django.conf import settings
from django.db import transaction

log = logging.getLogger(__name__)

# =========================
# ======== STRIPE =========
# =========================
import stripe

stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
STRIPE_ENDPOINT_SECRET = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)


@csrf_exempt
@require_http_methods(["POST"])
def stripe_webhook_view(request):
    """
    Webhook do Stripe.
    Trata:
      - payment_intent.succeeded   (Stripe Elements / PaymentIntent direto)
      - checkout.session.completed (Checkout Session)
      - invoice.payment_succeeded  (renovações de assinatura)
    Em todos os casos, aplica a assinatura (plan_code) e envia convite único.
    """
    if not STRIPE_ENDPOINT_SECRET:
        log.error("Stripe webhook: STRIPE_WEBHOOK_SECRET não configurado.")
        return HttpResponseForbidden("STRIPE_WEBHOOK_SECRET não configurado.")

    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_ENDPOINT_SECRET)
    except Exception as e:
        log.exception("Stripe webhook: assinatura inválida/construção falhou: %s", e)
        return HttpResponseBadRequest("Assinatura inválida.")

    type_ = event.get("type")
    obj = (event.get("data") or {}).get("object") or {}
    log.info("Stripe webhook recebido: type=%s", type_)

    # Importações locais (para evitar import circular)
    from .services import ensure_customer, maybe_send_single_invite, get_or_create_subscription

    # ============================================================
    # =========== 1) PaymentIntent (Stripe Elements) ==============
    # ============================================================
    if type_ == "payment_intent.succeeded":
        pi = obj
        metadata = pi.get("metadata") or {}

        email = metadata.get("customer_email")
        name = metadata.get("customer_name", "")
        plan_code = metadata.get("plan_code") or "mensal"  # fallback p/ teste
        external_payment_id = pi.get("id")

        # fallback: tenta buscar billing_details caso metadata não tenha
        if not email:
            charges = (pi.get("charges") or {}).get("data") or []
            if charges:
                billing = charges[0].get("billing_details") or {}
                email = billing.get("email") or email
                name = billing.get("name") or name

        if not email:
            log.warning("Stripe PI succeeded ignorado: faltam dados. email=%s", email)
            return HttpResponse("Ignorado: faltam dados.")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            maybe_send_single_invite(customer)
            log.info("Stripe PI: convite enviado para %s (plano=%s)", email, plan_code)

        return HttpResponse("OK")

    # ============================================================
    # =========== 2) Checkout Session concluído ==================
    # ============================================================
    if type_ == "checkout.session.completed":
        session = obj
        email = (session.get("customer_details") or {}).get("email") or session.get("customer_email")
        plan_code = (session.get("metadata") or {}).get("plan_code") or "mensal"
        external_payment_id = session.get("id") or session.get("payment_intent") or session.get("invoice")
        name = (session.get("customer_details") or {}).get("name", "")

        if not email:
            log.warning("Stripe CS completed ignorado: faltam dados. email=%s", email)
            return HttpResponse("Ignorado: faltam dados.")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            maybe_send_single_invite(customer)
            log.info("Stripe CS: convite enviado para %s (plano=%s)", email, plan_code)

        return HttpResponse("OK")

    # ============================================================
    # =========== 3) Fatura paga (renovações) =====================
    # ============================================================
    if type_ == "invoice.payment_succeeded":
        invoice = obj
        email = invoice.get("customer_email")
        name = (invoice.get("customer_details") or {}).get("name", "")

        plan_code = None
        lines = (invoice.get("lines") or {}).get("data") or []
        if lines:
            price = lines[0].get("price") or {}
            meta = price.get("metadata") or {}
            plan_code = meta.get("plan_code") or price.get("lookup_key") or "mensal"

        external_payment_id = invoice.get("id") or invoice.get("payment_intent") or invoice.get("charge")

        if not email:
            log.warning("Stripe invoice succeeded ignorado: faltam dados. email=%s", email)
            return HttpResponse("Ignorado: faltam dados.")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            maybe_send_single_invite(customer)
            log.info("Stripe invoice: convite enviado para %s (plano=%s)", email, plan_code)

        return HttpResponse("OK")

    # ============================================================
    # =========== Eventos não tratados ============================
    # ============================================================
    log.info("Stripe webhook não tratado: %s", type_)
    return HttpResponse("Unhandled")


# =============================
# ======== ABACATEPAY =========
# =============================

POSSIBLE_ABACATE_HEADERS = [
    "HTTP_X_ABACATEPAY_SIGNATURE",
    "HTTP_X_WEBHOOK_SIGNATURE",
    "HTTP_X_SIGNATURE",
]


def _get_abacate_signature(meta) -> str:
    for h in POSSIBLE_ABACATE_HEADERS:
        if h in meta:
            return meta[h]
    return ""


def _valid_abacatepay_signature(raw_body: bytes, signature: str) -> bool:
    secret = getattr(settings, "ABACATEPAY_WEBHOOK_SECRET", None)
    if not secret or not signature:
        return False

    digest = hmac.new(secret.encode(), raw_body, hashlib.sha256).digest()
    computed_hex = digest.hex()
    computed_b64 = base64.b64encode(digest).decode()

    sig = signature.strip()
    if "=" in sig:
        try:
            parts = dict(kv.split("=", 1) for kv in sig.split(",") if "=" in kv)
            sig = parts.get("v1", sig)
        except Exception:
            pass

    return hmac.compare_digest(sig, computed_hex) or hmac.compare_digest(sig, computed_b64)


@csrf_exempt
@require_http_methods(["POST"])
def abacatepay_webhook_view(request):
    """
    Webhook do AbacatePay (PIX).
    Mantido exatamente como antes — sem alterações.
    """
    body = request.body or b""
    sig = _get_abacate_signature(request.META)

    if not _valid_abacatepay_signature(body, sig):
        received = [k for k in request.META.keys() if k.startswith("HTTP_")]
        log.warning("AbacatePay webhook: assinatura inválida. Headers recebidos: %s", received)
        return HttpResponseForbidden("Assinatura inválida.")

    try:
        payload = json.loads(body.decode("utf-8") or "{}")
    except Exception as e:
        log.exception("AbacatePay webhook: JSON inválido: %s", e)
        return HttpResponseBadRequest("JSON inválido.")

    event_type = payload.get("event")
    data = payload.get("data", {}) or {}
    log.info("AbacatePay webhook: event=%s", event_type)

    from .services import ensure_customer, maybe_send_single_invite, get_or_create_subscription

    if event_type in ("charge.paid", "payment.succeeded"):
        email = (data.get("customer") or {}).get("email") or data.get("email")
        plan_code = (data.get("metadata") or {}).get("plan_code") or data.get("plan_code")
        external_payment_id = data.get("id") or data.get("charge_id")
        name = (data.get("customer") or {}).get("name", "")

        if not email or not plan_code or not external_payment_id:
            log.warning(
                "AbacatePay ignorado: faltam dados. email=%s plan_code=%s external_id=%s",
                email, plan_code, external_payment_id
            )
            return HttpResponse("Ignorado: faltam dados.")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            log.info(
                "AbacatePay: assinatura aplicada? sub_id=%s | plan=%s | email=%s",
                sub.id, plan_code, email
            )
            maybe_send_single_invite(customer)

        return HttpResponse("OK")

    log.info("AbacatePay webhook não tratado: %s", event_type)
    return HttpResponse("Unhandled")
