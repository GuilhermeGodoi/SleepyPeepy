# setup/urls.py
from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView
from .views import whoami, manage_invites

urlpatterns = [
    path("admin/", admin.site.urls),
    path("accounts/", include("allauth.urls")),
    path("api/whoami/", whoami),
    path("accounts/invites/", manage_invites, name="manage_invites"),

    # (opcional) atalho público de WhatsApp:
    # path("whatsapp/", RedirectView.as_view(
    #     url="https://wa.me/5519993315875?text=Oi%20vim%20do%20an%C3%BAncio",
    #     permanent=False
    # )),

    # Catch-all: tudo que não for admin/accounts/static/media/api cai no SPA
    re_path(r"^(?!admin/|accounts/|static/|media/|api/).*$",
            TemplateView.as_view(template_name="index.html")),
]
