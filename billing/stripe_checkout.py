# billing/stripe_checkout.py
import stripe
from django.conf import settings
from django.http import JsonResponse, HttpResponseBadRequest
from .models import Plan

stripe.api_key = settings.STRIPE_SECRET_KEY

def create_checkout_session(request):
    plan_code = request.GET.get("plan") or request.POST.get("plan") or "mensal"
    email = request.GET.get("email") or request.POST.get("email")
    if not email:
        return HttpResponseBadRequest("email requerido")
    try:
        plan = Plan.objects.get(code=plan_code, active=True)
    except Plan.DoesNotExist:
        return HttpResponseBadRequest("plano inválido")
    if not plan.stripe_price_id:
        return HttpResponseBadRequest("stripe_price_id ausente para este plano")

    session = stripe.checkout.Session.create(
        mode="subscription",
        success_url=settings.SITE_URL + "/sucesso",
        cancel_url=settings.SITE_URL + "/cancelado",
        customer_email=email,
        line_items=[{"price": plan.stripe_price_id, "quantity": 1}],
        metadata={"plan_code": plan_code},
    )
    return JsonResponse({"url": session.url})
