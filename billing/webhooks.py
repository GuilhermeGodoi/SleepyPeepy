# billing/webhooks.py
import json
import hmac
import hashlib
import base64
import logging

from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.utils import timezone
from django.conf import settings
from django.db import transaction

from .services import ensure_customer, maybe_send_single_invite, get_or_create_subscription

log = logging.getLogger(__name__)

# --- STRIPE ---
import stripe
stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
STRIPE_ENDPOINT_SECRET = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)

@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    if not STRIPE_ENDPOINT_SECRET:
        log.error("Stripe webhook: STRIPE_WEBHOOK_SECRET não configurado.")
        return HttpResponseForbidden("STRIPE_WEBHOOK_SECRET não configurado.")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_ENDPOINT_SECRET)
    except Exception as e:
        log.exception("Stripe webhook: assinatura inválida: %s", e)
        return HttpResponseBadRequest("Assinatura inválida.")

    type_ = event.get("type")
    log.info("Stripe webhook recebido: type=%s", type_)

    if type_ in ("checkout.session.completed", "invoice.payment_succeeded"):
        data = event.get("data", {}).get("object", {})
        email = (data.get("customer_details", {}) or {}).get("email") or data.get("customer_email")
        plan_code = None

        if type_ == "invoice.payment_succeeded":
            lines = data.get("lines", {}).get("data", [])
            if lines:
                price = (lines[0].get("price") or {})
                price_metadata = price.get("metadata") or {}
                plan_code = price_metadata.get("plan_code") or price.get("lookup_key")

        if type_ == "checkout.session.completed" and not plan_code:
            plan_code = (data.get("metadata") or {}).get("plan_code")

        if not email or not plan_code:
            log.warning("Stripe webhook ignorado: email=%s plan_code=%s", email, plan_code)
            return HttpResponse("Ignorado: faltam dados.")

        external_payment_id = data.get("id") or data.get("payment_intent") or data.get("invoice")
        name = (data.get("customer_details") or {}).get("name", "")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            applied = sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            log.info("Stripe: assinatura aplicada? %s | sub_id=%s | plan=%s | email=%s",
                     applied, sub.id, plan_code, email)
            maybe_send_single_invite(customer)

        return HttpResponse("OK")

    log.info("Stripe webhook não tratado: %s", type_)
    return HttpResponse("Unhandled")


# --- ABACATEPAY (PIX) ---

# Aceita múltiplos nomes de header comuns
POSSIBLE_ABACATE_HEADERS = [
    "HTTP_X_ABACATEPAY_SIGNATURE",  # X-ABACATEPAY-SIGNATURE
    "HTTP_X_WEBHOOK_SIGNATURE",     # X-Webhook-Signature
    "HTTP_X_SIGNATURE",             # X-Signature
]

def _get_abacate_signature(meta) -> str:
    for h in POSSIBLE_ABACATE_HEADERS:
        if h in meta:
            return meta[h]
    return ""

def _valid_abacatepay_signature(raw_body: bytes, signature: str) -> bool:
    """
    Valida HMAC-SHA256 usando o segredo ABACATEPAY_WEBHOOK_SECRET.
    Aceita assinatura em HEX ou BASE64.
    Tolerante a formatos 't=...,v1=assinatura' ou 'v1=assinatura'.
    """
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
def abacatepay_webhook_view(request):
    body = request.body or b""
    sig = _get_abacate_signature(request.META)

    if not _valid_abacatepay_signature(body, sig):
        # Loga quais headers HTTP_* chegaram pra ajudar debug
        received = [k for k in request.META.keys() if k.startswith("HTTP_")]
        log.warning("AbacatePay webhook: assinatura inválida. Headers recebidos: %s", received)
        return HttpResponseForbidden("Assinatura inválida.")

    try:
        payload = json.loads(body.decode("utf-8") or "{}")
    except Exception as e:
        log.exception("AbacatePay webhook: JSON inválido: %s", e)
        return HttpResponseBadRequest("JSON inválido.")

    event_type = payload.get("event")  # ex: "charge.paid"
    data = payload.get("data", {}) or {}
    log.info("AbacatePay webhook: event=%s", event_type)

    if event_type in ("charge.paid", "payment.succeeded"):
        email = (data.get("customer") or {}).get("email") or data.get("email")
        plan_code = (data.get("metadata") or {}).get("plan_code") or data.get("plan_code")
        external_payment_id = data.get("id") or data.get("charge_id")
        name = (data.get("customer") or {}).get("name", "")

        if not email or not plan_code or not external_payment_id:
            log.warning("AbacatePay ignorado: faltam dados. email=%s plan_code=%s external_id=%s",
                        email, plan_code, external_payment_id)
            return HttpResponse("Ignorado: faltam dados.")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            applied = sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            log.info("AbacatePay: assinatura aplicada? %s | sub_id=%s | plan=%s | email=%s",
                     applied, sub.id, plan_code, email)
            maybe_send_single_invite(customer)

        return HttpResponse("OK")

    log.info("AbacatePay webhook não tratado: %s", event_type)
    return HttpResponse("Unhandled")
