# setup/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView
from django.http import HttpResponse

from .views import whoami, manage_invites, create_stripe_checkout_session, create_abacate_billing, create_payment_intent
from billing import views as billing_views  # <-- Importa a view do AbacatePay corretamente

def health(request):
    return HttpResponse("ok", content_type="text/plain")

urlpatterns = [
    # Painel admin
    path("admin/", admin.site.urls),
    path("admin", RedirectView.as_view(url="/admin/", permanent=False)),

    # Autenticação
    path("accounts/", include("allauth.urls")),
    path("accounts/invites/", manage_invites, name="manage_invites"),

    # Health check
    path("health/", health),

    # API base
    path("api/whoami/", whoami),

    # === AbacatePay ===
    path("api/abacatepay/create-billing", create_abacate_billing),  # legado
    path("api/abacatepay/create-charge", billing_views.create_abacatepay_charge, name="create_abacatepay_charge"),
    path("api/abacatepay/create-charge/", billing_views.create_abacatepay_charge),

    # === Stripe ===
    path("api/stripe/create-payment-intent", create_payment_intent),  # Stripe Elements
    path("api/stripe/create-checkout-session", create_stripe_checkout_session),  # Checkout legado

    # === Billing ===
    path("billing/", include("billing.urls")),

    # === Outros ===
    path("robots.txt", RedirectView.as_view(url="/static/robots.txt", permanent=True)),
    path("sitemap.xml", RedirectView.as_view(url="/static/sitemap.xml", permanent=True)),
]

# SPA fallback (React/Vite)
urlpatterns += [
    re_path(
        r"^(?!admin/|accounts/|api/|billing/|static/|media/|robots\.txt$|sitemap\.xml$|favicon\.ico$|\.well-known/).*$",
        TemplateView.as_view(template_name="index.html"),
        name="spa_fallback",
    ),
]
