# billing/urls.py
from django.urls import path
from . import views, webhooks, stripe_checkout

urlpatterns = [
    # Convite/aceite
    path("accept-invite", views.accept_invite_view, name="accept_invite"),
    path("accept-invite/", views.accept_invite_view),

    # Pós-pagamento
    path("sucesso", views.payment_success_view, name="billing_success"),
    path("sucesso/", views.payment_success_view),

    # Reenvio de convite
    path("resend-invite", views.resend_invite_view, name="billing_resend_invite"),
    path("resend-invite/", views.resend_invite_view),

    # Webhooks
    path("webhooks/abacatepay", webhooks.abacatepay_webhook_view, name="abacatepay_webhook"),
    path("webhooks/abacatepay/", webhooks.abacatepay_webhook_view),
    path("webhooks/stripe", webhooks.stripe_webhook_view, name="stripe_webhook"),
    path("webhooks/stripe/", webhooks.stripe_webhook_view),

    # Stripe session (frontend)
    path("stripe/create-checkout-session", stripe_checkout.create_checkout_session, name="stripe_create_checkout_session"),
]
