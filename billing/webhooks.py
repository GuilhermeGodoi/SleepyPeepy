# billing/webhooks.py
import json
from django.views.decorators.csrf import csrf_exempt
from django.http import HttpResponse, HttpResponseBadRequest, HttpResponseForbidden
from django.utils import timezone
from django.conf import settings
from django.db import transaction
from .services import ensure_customer, maybe_send_single_invite, get_or_create_subscription
from .models import Customer
import hmac, hashlib

# --- STRIPE ---
# pip install stripe
import stripe
stripe.api_key = getattr(settings, "STRIPE_SECRET_KEY", None)
STRIPE_ENDPOINT_SECRET = getattr(settings, "STRIPE_WEBHOOK_SECRET", None)

@csrf_exempt
def stripe_webhook_view(request):
    payload = request.body
    sig_header = request.META.get("HTTP_STRIPE_SIGNATURE")
    if not STRIPE_ENDPOINT_SECRET:
        return HttpResponseForbidden("STRIPE_WEBHOOK_SECRET não configurado.")

    try:
        event = stripe.Webhook.construct_event(payload, sig_header, STRIPE_ENDPOINT_SECRET)
    except Exception:
        return HttpResponseBadRequest("Assinatura inválida.")

    # Eventos relevantes: checkout.session.completed, invoice.payment_succeeded, customer.subscription.updated
    type_ = event["type"]

    if type_ in ("checkout.session.completed", "invoice.payment_succeeded"):
        data = event["data"]["object"]
        # Obter email e metadados do plano
        email = (data.get("customer_details", {}) or {}).get("email") or data.get("customer_email")
        plan_code = None

        # invoice.payment_succeeded -> price->lookup_key/metadata
        if type_ == "invoice.payment_succeeded":
            lines = data.get("lines", {}).get("data", [])
            if lines:
                price = (lines[0].get("price") or {})
                plan_code = (price.get("metadata") or {}).get("plan_code") or price.get("lookup_key")

        # checkout.session.completed -> metadata definida na Session
        if type_ == "checkout.session.completed" and not plan_code:
            plan_code = (data.get("metadata") or {}).get("plan_code")

        if not email or not plan_code:
            return HttpResponse("Ignorado: faltam dados.")

        external_payment_id = data.get("id") or data.get("payment_intent") or data.get("invoice")
        name = (data.get("customer_details") or {}).get("name", "")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            applied = sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())

            # Se ainda não tem conta (user=None), envia convite UMA única vez
            maybe_send_single_invite(customer)

        return HttpResponse("OK")

    # Outros eventos podem ser tratados conforme necessidade
    return HttpResponse("Unhandled")


# --- ABACATEPAY (PIX) ---
# Webhook genérico com HMAC: configure um segredo e valide o header.
ABACATEPAY_WEBHOOK_SECRET = getattr(settings, "ABACATEPAY_WEBHOOK_SECRET", None)
ABACATEPAY_HEADER = "HTTP_X_ABACATEPAY_SIGNATURE"  # ajuste para o header real fornecido

def _valid_abacatepay_signature(raw_body: bytes, signature: str) -> bool:
    if not ABACATEPAY_WEBHOOK_SECRET or not signature:
        return False
    mac = hmac.new(ABACATEPAY_WEBHOOK_SECRET.encode(), raw_body, hashlib.sha256).hexdigest()
    # Compare em tempo constante
    return hmac.compare_digest(mac, signature)

@csrf_exempt
def abacatepay_webhook_view(request):
    sig = request.META.get(ABACATEPAY_HEADER, "")
    body = request.body
    if not _valid_abacatepay_signature(body, sig):
        return HttpResponseForbidden("Assinatura inválida.")

    try:
        data = json.loads(body.decode("utf-8"))
    except Exception:
        return HttpResponseBadRequest("JSON inválido.")

    # Normalizar payload (ajuste conforme seu painel)
    # Esperado: status == "paid", email, plan_code, payment_id
    event_type = data.get("event")  # p.ex. "charge.paid"
    payload = data.get("data", {})

    if event_type in ("charge.paid", "payment.succeeded"):
        email = payload.get("customer", {}).get("email") or payload.get("email")
        plan_code = payload.get("metadata", {}).get("plan_code") or payload.get("plan_code")
        external_payment_id = payload.get("id") or payload.get("charge_id")

        if not email or not plan_code or not external_payment_id:
            return HttpResponse("Ignorado: faltam dados.")

        name = payload.get("customer", {}).get("name", "")

        with transaction.atomic():
            customer = ensure_customer(email=email, name=name)
            sub = get_or_create_subscription(customer, plan_code)
            sub.apply_successful_payment(external_payment_id, paid_at=timezone.now())
            maybe_send_single_invite(customer)

        return HttpResponse("OK")

    return HttpResponse("Unhandled")
