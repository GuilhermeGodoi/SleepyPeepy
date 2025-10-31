# setup/views.py
import os
import json
import requests

from django.http import JsonResponse, HttpResponse, HttpResponseForbidden
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_POST
from django.contrib.auth.decorators import login_required
from django.shortcuts import render
from django.core.signing import TimestampSigner, dumps as s_dumps
from django.urls import reverse

# ===== Config =====
SITE_URL = os.getenv("SITE_URL", "https://sleepypeepy.site")

# (opcional) criar cobrança AbacatePay via API
ABACATEPAY_API_KEY = os.getenv("ABACATEPAY_API_KEY", "")
ABACATEPAY_API_BASE = os.getenv("ABACATEPAY_API_BASE", "https://api.abacatepay.com")

# Stripe apenas se você quiser manter um criador de sessão aqui
import stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY", "")
stripe.api_key = STRIPE_SECRET_KEY

# Tabela local dos planos (só para rotas de criação de cobrança)
PLANS = {
    "mensal":    {"name": "SleepyPeepy Mensal",    "price": 4700},
    "semestral": {"name": "SleepyPeepy Semestral", "price": 22200},
    "anual":     {"name": "SleepyPeepy Anual",     "price": 38400},
}

# =======================
# Utilidades
# =======================
@login_required
def whoami(request):
    u = request.user
    return JsonResponse({"id": u.id, "username": u.username, "email": u.email})

@login_required
def manage_invites(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Somente staff.")

    has_verified_email = getattr(request.user, "emailaddress_set", None)
    has_verified_email = bool(has_verified_email and request.user.emailaddress_set.filter(verified=True).exists())

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
# Criação de cobrança AbacatePay (opcional)
# =======================
@csrf_exempt
@require_POST
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

    IMPORTANTE: o webhook que ativa acesso e dispara e-mail é o do app billing:
      /billing/webhooks/abacatepay
    O retorno visual do usuário deve ir para /billing/sucesso
    """
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

    customer_in = body.get("customer") or {}
    cust = {}
    if customer_in.get("name"):      cust["name"] = customer_in["name"]
    if customer_in.get("email"):     cust["email"] = customer_in["email"]
    if customer_in.get("taxId"):     cust["taxId"] = customer_in["taxId"]
    if customer_in.get("cellphone"): cust["cellphone"] = customer_in["cellphone"]

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
        # Depois do pagamento, leve o usuário para a página de sucesso do billing:
        "returnUrl": f"{SITE_URL}/billing/sucesso",
        "completionUrl": f"{SITE_URL}/billing/sucesso",
        "allowCoupons": True,
        "customer": cust,
        "externalId": body.get("orderId"),
        # Se a AbacatePay suportar metadata, inclua o plan_code para o webhook do billing:
        "metadata": {"plan_code": plan, "provider": "abacatepay"}
    }

    try:
        r = requests.post(
            f"{ABACATEPAY_API_BASE}/v1/billing/create",
            headers={"Authorization": f"Bearer {ABACATEPAY_API_KEY}", "Content-Type": "application/json"},
            data=json.dumps(payload),
            timeout=20,
        )
    except requests.RequestException as exc:
        return JsonResponse({"error": "Falha na requisição à AbacatePay", "detail": str(exc)}, status=502)

    try:
        data = r.json()
    except Exception:
        return JsonResponse({"error": "Erro na resposta da AbacatePay", "detail": r.text}, status=502)

    url = data.get("data", {}).get("url")
    billing_id = data.get("data", {}).get("id")
    if r.status_code != 200 or not url:
        return JsonResponse({"error": "Falha na criação da cobrança", "resp": data}, status=400)

    return JsonResponse({"checkoutUrl": url, "billingId": billing_id})

# =======================
# Criação de sessão Stripe (opcional)
# =======================
@csrf_exempt
@require_POST
def create_stripe_checkout_session(request):
    """
    POST /api/stripe/create-checkout-session
    Body: {
      "plan": "mensal"|"semestral"|"anual",
      "customer": {"name": "...", "email": "..."},
      "orderId"?: "..."
    }
    Resp: { "url": "https://checkout.stripe.com/..." }

    IMPORTANTE: o webhook que ativa acesso e dispara e-mail é o do app billing:
      /billing/webhooks/stripe
    O retorno visual do usuário deve ir para /billing/sucesso
    """
    if not STRIPE_SECRET_KEY:
        return JsonResponse({"error": "STRIPE_SECRET_KEY não configurada"}, status=500)

    try:
        body = json.loads(request.body or "{}")
    except Exception:
        return JsonResponse({"error": "JSON inválido"}, status=400)

    plan = (body.get("plan") or "mensal").lower()
    product = PLANS.get(plan)
    if not product:
        return JsonResponse({"error": "Plano inválido"}, status=400)

    customer = body.get("customer") or {}
    email = customer.get("email") or None

    metadata = {"provider": "stripe", "plan_code": plan}
    if body.get("orderId"):
        metadata["externalId"] = body["orderId"]

    line_items = [{
        "price_data": {
            "currency": "brl",
            "unit_amount": product["price"],  # centavos
            "product_data": {
                "name": product["name"],
                "description": "Assinatura SleepyPeepy",
            },
        },
        "quantity": 1,
    }]

    try:
        session = stripe.checkout.Session.create(
            # se você estiver usando billing/stripe_checkout.py com subscriptions,
            # prefira chamá-lo do frontend; aqui deixei modo pagamento único:
            mode="payment",
            payment_method_types=["card"],
            line_items=line_items,
            customer_email=email,
            metadata=metadata,
            success_url=f"{SITE_URL}/billing/sucesso",
            cancel_url=f"{SITE_URL}/checkout?canceled=1&provider=stripe",
            allow_promotion_codes=True,
            automatic_tax={"enabled": False},
        )
    except Exception as exc:
        return JsonResponse({"error": "Falha ao criar sessão do Stripe", "detail": str(exc)}, status=400)

    return JsonResponse({"url": session.url})

# =======================
# Stripe Elements - PaymentIntent
# =======================
@csrf_exempt
@require_POST
def create_payment_intent(request):
    """
    POST /api/stripe/create-payment-intent
    Cria um PaymentIntent do Stripe para o plano escolhido (mensal/semestral/anual).
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        plan = data.get("plan")

        plans = {
            "mensal": 4700,      # R$47,00
            "semestral": 22200,  # R$222,00
            "anual": 38400,      # R$384,00
        }

        amount = plans.get(plan)
        if not amount:
            return JsonResponse({"error": "Plano inválido"}, status=400)

        # Adicione metadados úteis para o webhook
        metadata = {
            "plan_code": plan,
            "customer_email": (data.get("customer") or {}).get("email", ""),
            "customer_name": (data.get("customer") or {}).get("name", ""),
        }

        intent = stripe.PaymentIntent.create(
            amount=amount,
            currency="brl",
            metadata=metadata,
            automatic_payment_methods={"enabled": True},
        )

        return JsonResponse({"clientSecret": intent.client_secret})

    except Exception as e:
        return JsonResponse({"error": str(e)}, status=500)
