# billing/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest, JsonResponse
from django.contrib.auth import get_user_model, login
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.db import transaction, IntegrityError
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
      - already_has_user   -> cliente já tem conta (link para login)
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

    # bloqueios
    if invite.is_expired:
        return _render_invite_status(
            request, status="expired", email=invite.customer.email, token=token_value,
            msg="Seu link expirou. Você pode solicitar um novo convite."
        )
    if invite.is_used:
        # Se o cliente já tem user, apenas oriente login
        if invite.customer.user:
            return _render_invite_status(
                request, status="already_has_user", email=invite.customer.email,
                msg="Este link já foi usado e a conta está criada."
            )
        return _render_invite_status(
            request, status="used", email=invite.customer.email,
            msg="Este link já foi usado. Solicite um novo convite."
        )

    customer = invite.customer

    # Se já existe user vinculado, consome token e orienta login
    if customer.user:
        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])
        return _render_invite_status(
            request, status="already_has_user", email=customer.email,
            msg="Conta já existe. Faça login para continuar."
        )

    if request.method == "GET":
        # Mostra form de criação de senha
        return _render_invite_status(request, status="ok_form", email=customer.email, token=token_value)

    if request.method == "POST":
        password = (request.POST.get("password") or "").strip()
        if not password or len(password) < 8:
            return _render_invite_status(
                request, status="ok_form", email=customer.email, token=token_value,
                msg="Senha inválida. Use pelo menos 8 caracteres."
            )

        try:
            # Se já existe usuário com este e-mail/username, reaproveita
            # (muitos projetos usam 'username' == email)
            existing = None
            try:
                existing = User.objects.get(username=customer.email)
            except User.DoesNotExist:
                try:
                    existing = User.objects.get(email=customer.email)
                except User.DoesNotExist:
                    existing = None

            if existing:
                user = existing
                # opcional: atualizar first_name vazio
                if (not user.first_name) and customer.name:
                    user.first_name = customer.name
                    user.save(update_fields=["first_name"])
            else:
                user = User.objects.create_user(
                    username=customer.email,
                    email=customer.email,
                    password=password,
                    first_name=customer.name or "",
                )

            # vincula e consome token
            customer.user = user
            customer.save(update_fields=["user"])
            invite.used_at = timezone.now()
            invite.save(update_fields=["used_at"])

            # autentica e mostra tela de sucesso (com redirecionamento automático)
            login(request, user)
            return render(request, "billing/account_created.html", {
                "email": customer.email,
                "redirect_url": "/",
            }, status=200)

        except IntegrityError as ie:
            log.exception("Erro de integridade ao criar/associar user: %s", ie)
            # Já existe usuário duplicado? Orienta login e não 500.
            return _render_invite_status(
                request, status="already_has_user", email=customer.email,
                msg="Já existe uma conta com este e-mail. Faça login."
            )
        except Exception as e:
            log.exception("Falha inesperada no aceite de convite: %s", e)
            return _render_invite_status(
                request, status="error", email=customer.email,
                msg="Ocorreu um erro ao criar sua conta. Tente novamente ou solicite um novo convite."
            )

    return HttpResponseBadRequest("Método não suportado.")


# === Página pós-pagamento confirmado ===
def payment_success_view(request):
    """
    Página informativa: pagamento confirmado (ou retornado do provedor).
    Explica que o acesso chega por e-mail com link único e oferece reenvio.
    """
    email_hint = request.GET.get("email") or ""
    return render(request, "billing/success.html", {"email_hint": email_hint})


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
    if customer.user:
        return JsonResponse({"ok": False, "error": "Este e-mail já possui conta criada. Faça login."}, status=200)
    return JsonResponse({"ok": False, "error": "Já enviamos um convite recentemente. Aguarde alguns minutos ou peça suporte."}, status=200)
