from django.contrib import admin
from django.urls import path, re_path, include
from django.views.generic import TemplateView, RedirectView
from .views import whoami, manage_invites

# rota de saúde
from django.http import HttpResponse
def health(request): return HttpResponse("ok", content_type="text/plain")

urlpatterns = [
    path("admin/", admin.site.urls),
    path("admin", RedirectView.as_view(url="/admin/", permanent=False)), 
    path("accounts/", include("allauth.urls")),
    path("api/whoami/", whoami),
    path("accounts/invites/", manage_invites, name="manage_invites"),
    path("health/", health),

    # tudo que não for admin/accounts/static/media/api cai no index.html do build
    re_path(r"^(?!admin/|accounts/|static/|media/|api/).*$",
            TemplateView.as_view(template_name="index.html")),
]
