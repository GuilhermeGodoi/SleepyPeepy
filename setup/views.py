# setup/views.py
import os
import json
import hmac
import base64
import hashlib
import requests

from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.core.signing import TimestampSigner, dumps as s_dumps
from django.urls import reverse


# =======================
# Views já existentes
# =======================
@login_required
def whoami(request):
    u = request.user
    return JsonResponse({"id": u.id, "username": u.username, "email": u.email})


@login_required
def manage_invites(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Somente staff.")

    has_verified_email = request.user.emailaddress_set.filter(verified=True).exists()

    invites = []
    if request.method == "POST":
        try:
            qty = max(1, min(20, int(request.POST.get("qty", "1"))))
        except ValueError:
            qty = 1
        try:
            days = max(1, min(90, int(request.POST.get("days", "7"))))
        except ValueError:
            days = 7

        signer = TimestampSigner()
        base_signup = request.build_absolute_uri(reverse("account_signup"))

        for _ in range(qty):
            payload = {"created_by": request.user.id, "days": days}
            token = s_dumps(payload)
            url = f"{base_signup}?invite={token}"
            invites.append({"url": url, "days": days})

    return render(
        request,
        "account/verified_email_required.html",
        {"invites": invites, "has_verified_email": has_verified_email},
    )


def health(request):
    return HttpResponse("ok", content_type="text/plain")


# =======================
# AbacatePay – Integração
# =======================

# Planos em CENTAVOS (R$ 47,00 / 222,00 / 384,00)
PLANS = {
    "mensal":    {"name": "SleepyPeepy Mensal",    "price": 4700},
    "semestral": {"name": "SleepyPeepy Semestral", "price": 22200},
    "anual":     {"name": "SleepyPeepy Anual",     "price": 38400},
}

ABACATEPAY_API_KEY = os.getenv("ABACATEPAY_API_KEY", "")
ABACATEPAY_WEBHOOK_SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET", "")    # token passado na query
ABACATEPAY_PUBLIC_HMAC_KEY = os.getenv("ABACATEPAY_PUBLIC_HMAC_KEY", "")  # chave para X-Webhook-Signature
SITE_URL = os.getenv("SITE_URL", "https://sleepypeepy.site")
ABACATEPAY_API_BASE = os.getenv("ABACATEPAY_API_BASE", "https://api.abacatepay.com")  # permite trocar por sandbox se existir


@csrf_exempt
def create_abacate_billing(request):
    """
    POST /api/abacatepay/create-billing
    Body:
      {
        "plan": "mensal"|"semestral"|"anual",
        "customer": {"name": "...", "email": "...", "taxId"?: "...", "cellphone"?: "..."},
        "orderId"?: "..."
      }
    Resp: { "checkoutUrl": "...", "billingId": "..." }
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    if not ABACATEPAY_API_KEY:
        return JsonResponse({"error": "ABACATEPAY_API_KEY não configurada"}, status=500)

    # Parse body
    try:
        body = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    plan = (body.get("plan") or "mensal").lower()
    product = PLANS.get(plan)
    if not product:
        return JsonResponse({"error": "Plano inválido"}, status=400)

    # Monta cliente enviando somente campos presentes (evita Invalid taxId)
    customer_in = body.get("customer") or {}
    cust = {}
    if customer_in.get("name"):
        cust["name"] = customer_in["name"]
    if customer_in.get("email"):
        cust["email"] = customer_in["email"]
    if customer_in.get("taxId"):
        cust["taxId"] = customer_in["taxId"]           # CPF/CNPJ numérico
    if customer_in.get("cellphone"):
        cust["cellphone"] = customer_in["cellphone"]   # ideal em E.164 (+55...)

    payload = {
        "frequency": "ONE_TIME",
        "methods": ["PIX"],
        "products": [{
            "externalId": f"sleepy-{plan}",
            "name": product["name"],
            "description": "Assinatura SleepyPeepy",
            "quantity": 1,
            "price": product["price"],  # em centavos (BRL)
        }],
        "returnUrl": f"{SITE_URL}/checkout",
        "completionUrl": f"{SITE_URL}/checkout?ok=1",
        "allowCoupons": True,
        "customer": cust,
        "externalId": body.get("orderId"),
    }

    # Chamada à API da AbacatePay
    try:
        r = requests.post(
            f"{ABACATEPAY_API_BASE}/v1/billing/create",
            headers={
                "Authorization": f"Bearer {ABACATEPAY_API_KEY}",
                "Content-Type": "application/json",
            },
            data=json.dumps(payload),
            timeout=20,
        )
    except requests.RequestException as exc:
        return JsonResponse({"error": "Falha na requisição à AbacatePay", "detail": str(exc)}, status=502)

    # Trata resposta
    try:
        data = r.json()
    except Exception:
        return JsonResponse({"error": "Erro na resposta da AbacatePay", "detail": r.text}, status=502)

    url = data.get("data", {}).get("url")
    billing_id = data.get("data", {}).get("id")
    if r.status_code != 200 or not url:
        return JsonResponse({"error": "Falha na criação da cobrança", "resp": data}, status=400)

    # TODO (opcional): persistir externalId -> billing_id para conciliação
    return JsonResponse({"checkoutUrl": url, "billingId": billing_id})


@csrf_exempt
def abacatepay_webhook(request):
    """
    POST /webhooks/abacatepay?webhookSecret=...
    Headers:
      X-Webhook-Signature: base64( HMAC-SHA256( raw_body, ABACATEPAY_PUBLIC_HMAC_KEY ) )
    Body:
      { "id": "...", "event": "billing.paid" | "...", "data": {...} }
    """
    # 1) Segredo na query (se configurado)
    if ABACATEPAY_WEBHOOK_SECRET:
        if request.GET.get("webhookSecret") != ABACATEPAY_WEBHOOK_SECRET:
            return JsonResponse({"error": "Invalid webhook secret"}, status=401)

    raw = request.body or b""

    # 2) Assinatura HMAC (se configurada)
    if ABACATEPAY_PUBLIC_HMAC_KEY:
        signature = request.headers.get("X-Webhook-Signature", "")
        expected = hmac.new(ABACATEPAY_PUBLIC_HMAC_KEY.encode("utf-8"), raw, hashlib.sha256).digest()
        expected_b64 = base64.b64encode(expected).decode("utf-8")
        if len(signature) != len(expected_b64) or not hmac.compare_digest(signature, expected_b64):
            return JsonResponse({"error": "Invalid signature"}, status=401)

    # 3) Parse do JSON
    try:
        evt = json.loads(raw.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    event = evt.get("event")
    data = evt.get("data", {}) or {}
    event_id = evt.get("id")  # use para idempotência

    # TODO (recomendado): Idempotência
    # if WebhookEvent.objects.filter(event_id=event_id).exists(): return HttpResponse(status=200)
    # WebhookEvent.objects.create(event_id=event_id, payload=evt)

    if event == "billing.paid":
        # Referências úteis para conciliação
        external_id = data.get("externalId") or data.get("billing", {}).get("externalId")
        billing_id = data.get("id") or data.get("billing", {}).get("id")

        # TODO:
        # - localizar pedido/assinatura por external_id
        # - marcar como "pago/ativo", salvar billing_id, valor e data
        # Exemplo:
        # order = Order.objects.filter(external_id=external_id).first()
        # if order and not order.paid:
        #     order.paid = True
        #     order.billing_id = billing_id
        #     order.save()
        pass

    # Responda 200 para evitar reentrega contínua
    return HttpResponse(status=200)
