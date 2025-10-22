# billing/stripe_checkout.py
import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(request):
    plan_code = request.GET.get("plan") or "mensal"
    price_id = "price_..."  # ou busque de Plan.stripe_price_id
    email = request.GET.get("email")
    if not email:
        return HttpResponseBadRequest("email requerido")

    session = stripe.checkout.Session.create(
        mode="subscription",
        success_url=settings.SITE_URL + "/sucesso",
        cancel_url=settings.SITE_URL + "/cancelado",
        customer_email=email,
        line_items=[{"price": price_id, "quantity": 1}],
        metadata={"plan_code": plan_code},
    )
    return JsonResponse({"url": session.url})
