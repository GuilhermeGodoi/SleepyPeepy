from django.urls import path
from . import views, webhooks

urlpatterns = [
    path("accept-invite", views.accept_invite_view, name="accept_invite"),
    path("webhooks/abacatepay", webhooks.abacatepay_webhook_view, name="abacatepay_webhook"),
    path("webhooks/stripe", webhooks.stripe_webhook_view, name="stripe_webhook"),
    # Se preferir, adicione versões com "/" também:
    path("accept-invite/", views.accept_invite_view),
    path("webhooks/abacatepay/", webhooks.abacatepay_webhook_view),
    path("webhooks/stripe/", webhooks.stripe_webhook_view),
]
