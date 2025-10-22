# setup/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView
from django.http import HttpResponse
from .views import whoami, manage_invites
from .views import create_stripe_checkout_session, stripe_webhook

# 👇 importe as novas views
from .views import create_abacate_billing, abacatepay_webhook  # <---

def health(request):
    return HttpResponse("ok", content_type="text/plain")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("admin", RedirectView.as_view(url="/admin/", permanent=False)),
    path("accounts/", include("allauth.urls")),
    path("api/whoami/", whoami),
    path("accounts/invites/", manage_invites, name="manage_invites"),
    path("health/", health),

    # === AbacatePay ===
    path("api/abacatepay/create-billing", create_abacate_billing),   # POST
    path("webhooks/abacatepay", abacatepay_webhook),                 # POST

    # === Stripe === 
    path("api/stripe/create-checkout-session", create_stripe_checkout_session),
    path("webhooks/stripe", stripe_webhook),

    # Estáticos
    path("robots.txt",  RedirectView.as_view(url="/static/robots.txt",  permanent=True)),
    path("sitemap.xml", RedirectView.as_view(url="/static/sitemap.xml", permanent=True)),

    path("billing/", include("billing.urls")),
]

# SPA fallback (mantenha por último)
urlpatterns += [
    re_path(
        r"^(?!admin/|accounts/|api/|static/|media/|robots\.txt$|sitemap\.xml$|favicon\.ico$|\.well-known/).*$",
        TemplateView.as_view(template_name="index.html"),
        name="spa_fallback",
    ),
]
