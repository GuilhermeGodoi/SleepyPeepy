# billing/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest, HttpResponse, JsonResponse
from django.contrib.auth import get_user_model, login
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.db import transaction
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import logging

from .models import InviteToken, Customer
from .services import ensure_customer, maybe_send_single_invite

log = logging.getLogger(__name__)
User = get_user_model()

def _render_invite_status(request, *, status: str, email: str | None = None, token: str | None = None, msg: str | None = None):
    """
    status:
      - ok_form            -> mostra formulário de criação de senha
      - already_has_user   -> cliente já tem conta
      - invalid            -> token inexistente
      - expired            -> token expirado
      - used               -> token já utilizado
      - error              -> erro genérico
    """
    ctx = {"status": status, "email": email, "token": token, "message": msg}
    return render(request, "billing/invite_status.html", ctx, status=200)

@transaction.atomic
def accept_invite_view(request):
    token_value = request.GET.get("t")
    if not token_value:
        return _render_invite_status(request, status="invalid", msg="Token ausente.")

    try:
        invite = InviteToken.objects.select_for_update().select_related("customer").get(token=token_value)
    except InviteToken.DoesNotExist:
        return _render_invite_status(request, status="invalid", msg="Este link não é válido.")

    # estados bloqueadores
    if invite.is_expired:
        return _render_invite_status(request, status="expired", email=invite.customer.email, token=token_value,
                                     msg="Seu link expirou. Você pode solicitar um novo convite.")
    if invite.is_used:
        # Se já tem user, oriente login
        if invite.customer.user:
            return _render_invite_status(request, status="already_has_user", email=invite.customer.email,
                                         msg="Este link já foi usado e a conta está criada.")
        return _render_invite_status(request, status="used", email=invite.customer.email,
                                     msg="Este link já foi usado. Solicite um novo convite.")

    customer = invite.customer

    # Se já existe user vinculado, consome o token e orienta login
    if customer.user:
        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])
        return _render_invite_status(request, status="already_has_user", email=customer.email,
                                     msg="Conta já existe. Faça login para continuar.")

    if request.method == "GET":
        # Mostra form de criação de senha
        return _render_invite_status(request, status="ok_form", email=customer.email, token=token_value)

    if request.method == "POST":
        password = request.POST.get("password", "")
        if not password or len(password) < 8:
            return _render_invite_status(request, status="ok_form", email=customer.email, token=token_value,
                                         msg="Senha inválida. Use pelo menos 8 caracteres.")

        # cria user, vincula e consome token
        user = User.objects.create_user(
            username=customer.email,
            email=customer.email,
            password=password,
            first_name=customer.name or "",
        )
        customer.user = user
        customer.save(update_fields=["user"])
        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])

        login(request, user)
        # Redireciona à raiz do site
        return redirect("/")

    return HttpResponseBadRequest("Método não suportado.")


# === Página pós-pagamento confirmado ===
# Use esta rota como success_url na Stripe/AbacatePay:
#   success_url = settings.SITE_URL + "/billing/sucesso"
def payment_success_view(request):
    """
    Página informativa: pagamento confirmado (ou retornado do provedor).
    Explica que o acesso chega por e-mail com link único e oferece reenvio.
    Querystring pode ter ?email=... (opcional).
    """
    email_hint = request.GET.get("email") or ""
    return render(request, "billing/success.html", {"email_hint": email_hint})


# === Reenvio de convite (POST) ===
@require_http_methods(["POST"])
@transaction.atomic
def resend_invite_view(request):
    """
    Reenvia convite para um e-mail. Em produção, respeita a regra:
      - se já foi enviado, só reenvia se ALLOW_RESEND_INVITE=True
    Retorna JSON para facilitar uso via fetch/AJAX.
    """
    email = (request.POST.get("email") or "").strip().lower()
    try:
        validate_email(email)
    except ValidationError:
        return JsonResponse({"ok": False, "error": "E-mail inválido."}, status=400)

    customer = ensure_customer(email=email, name="")
    token = maybe_send_single_invite(customer)
    if token:
        return JsonResponse({"ok": True, "message": "Convite enviado. Verifique sua caixa de entrada (e o spam)."})
    # Sem token: regra bloqueou reenvio ou já existe user
    if customer.user:
        return JsonResponse({"ok": False, "error": "Este e-mail já possui conta criada. Faça login."}, status=200)
    return JsonResponse({"ok": False, "error": "Já enviamos um convite recentemente. Aguarde alguns minutos ou peça suporte."}, status=200)
