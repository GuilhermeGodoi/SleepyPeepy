# setup/views.py
import os, json, hmac, base64, hashlib, requests
from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.core.signing import TimestampSigner, dumps as s_dumps
from django.urls import reverse

# =======================
# Já existentes
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
# AbacatePay – NOVO
# =======================

# Planos em CENTAVOS (R$ 47,00 / 222,00 / 384,00)
PLANS = {
    "mensal":    {"name": "SleepyPeepy Mensal",    "price": 4700},
    "semestral": {"name": "SleepyPeepy Semestral", "price": 22200},
    "anual":     {"name": "SleepyPeepy Anual",     "price": 38400},
}

ABACATEPAY_API_KEY = os.getenv("ABACATEPAY_API_KEY", "")
ABACATEPAY_WEBHOOK_SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET", "")   # secret na query
ABACATEPAY_PUBLIC_HMAC_KEY = os.getenv("ABACATEPAY_PUBLIC_HMAC_KEY", "") # chave p/ X-Webhook-Signature

@csrf_exempt
def create_abacate_billing(request):
    """
    POST /api/abacatepay/create-billing
    Body: { plan: "mensal"|"semestral"|"anual",
            customer: {name,email,taxId?,cellphone?},
            orderId?: string }
    Resp: { checkoutUrl, billingId? }
    """
    if request.method != "POST":
        return JsonResponse({"error": "POST only"}, status=405)
    if not ABACATEPAY_API_KEY:
        return JsonResponse({"error": "ABACATEPAY_API_KEY não configurada"}, status=500)

    try:
        body = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    plan = (body.get("plan") or "mensal").lower()
    product = PLANS.get(plan)
    if not product:
        return JsonResponse({"error": "Plano inválido"}, status=400)

    customer = body.get("customer") or {}
    payload = {
        "frequency": "ONE_TIME",
        "methods": ["PIX"],
        "products": [{
            "externalId": f"sleepy-{plan}",
            "name": product["name"],
            "description": "Assinatura SleepyPeepy",
            "quantity": 1,
            "price": product["price"],  # centavos BRL
        }],
        "returnUrl": "https://sleepypeepy.site/checkout",
        "completionUrl": "https://sleepypeepy.site/checkout?ok=1",
        "allowCoupons": True,
        "customer": {
            "name": customer.get("name", ""),
            "email": customer.get("email", ""),
            "taxId": customer.get("taxId", ""),
            "cellphone": customer.get("cellphone", ""),
        },
        "externalId": body.get("orderId"),
    }

    r = requests.post(
        "https://api.abacatepay.com/v1/billing/create",
        headers={"Authorization": f"Bearer {ABACATEPAY_API_KEY}",
                 "Content-Type": "application/json"},
        data=json.dumps(payload),
        timeout=20,
    )

    # Trata resposta
    try:
        data = r.json()
    except Exception:
        return JsonResponse({"error": "Erro na resposta da AbacatePay", "detail": r.text}, status=502)

    url = data.get("data", {}).get("url")
    billing_id = data.get("data", {}).get("id")
    if r.status_code != 200 or not url:
        return JsonResponse({"error": "Falha na criação da cobrança", "resp": data}, status=400)

    # TODO: (opcional) salvar billing_id/externalId para conciliação
    return JsonResponse({"checkoutUrl": url, "billingId": billing_id})


@csrf_exempt
def abacatepay_webhook(request):
    """
    POST /webhooks/abacatepay?webhookSecret=...
    Headers: X-Webhook-Signature (base64 HMAC-SHA256 do corpo)
    Body: { event: "billing.paid", data: {...} }
    """
    # 1) Checagem do secret na query (se configurado)
    if ABACATEPAY_WEBHOOK_SECRET:
        if request.GET.get("webhookSecret") != ABACATEPAY_WEBHOOK_SECRET:
            return JsonResponse({"error": "Invalid webhook secret"}, status=401)

    raw = request.body or b""

    # 2) Checagem da assinatura HMAC (se configurada)
    if ABACATEPAY_PUBLIC_HMAC_KEY:
        signature = request.headers.get("X-Webhook-Signature", "")
        expected = hmac.new(ABACATEPAY_PUBLIC_HMAC_KEY.encode("utf-8"), raw, hashlib.sha256).digest()
        expected_b64 = base64.b64encode(expected).decode("utf-8")
        if len(signature) != len(expected_b64) or not hmac.compare_digest(signature, expected_b64):
            return JsonResponse({"error": "Invalid signature"}, status=401)

    try:
        evt = json.loads(raw.decode("utf-8") or "{}")
    except Exception:
        return JsonResponse({"error": "Invalid JSON"}, status=400)

    event = evt.get("event")
    data = evt.get("data", {}) or {}

    # TODO (fortemente recomendado):
    # - Idempotência: verifique evt.get("id") em uma tabela de eventos processados.

    if event == "billing.paid":
        # Pegue referência para ativar o acesso
        external_id = data.get("externalId") or data.get("billing", {}).get("externalId")
        billing_id = data.get("id") or data.get("billing", {}).get("id")
        # TODO: localizar usuário/assinatura via external_id e marcar como ativa
        # ex.: activate_subscription(external_id, billing_id)
        pass

    return HttpResponse(status=200)
