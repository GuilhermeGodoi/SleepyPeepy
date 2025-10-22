# billing/urls.py
from django.urls import path
from . import views, webhooks, stripe_checkout

urlpatterns = [
    path("accept-invite", views.accept_invite_view, name="accept_invite"),
    path("webhooks/abacatepay", webhooks.abacatepay_webhook_view, name="abacatepay_webhook"),
    path("webhooks/stripe", webhooks.stripe_webhook_view, name="stripe_webhook"),

    # versões com barra no fim (opcional)
    path("accept-invite/", views.accept_invite_view),
    path("webhooks/abacatepay/", webhooks.abacatepay_webhook_view),
    path("webhooks/stripe/", webhooks.stripe_webhook_view),

    # endpoint de criação de sessão do Stripe (útil pro frontend)
    path("stripe/create-checkout-session", stripe_checkout.create_checkout_session, name="stripe_create_checkout_session"),
]
