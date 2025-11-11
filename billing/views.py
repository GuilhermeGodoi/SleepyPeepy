# billing/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest, JsonResponse
from django.contrib.auth import get_user_model
from django.contrib.auth import login as auth_login
from django.utils import timezone
from django.views.decorators.http import require_http_methods
from django.conf import settings
from django.db import transaction, IntegrityError
from django.core.validators import validate_email
from django.core.exceptions import ValidationError
import logging

import stripe, json
from django.views.decorators.csrf import csrf_exempt

from .models import InviteToken, Customer
from .services import ensure_customer, maybe_send_single_invite

log = logging.getLogger(__name__)
User = get_user_model()


# ============================================================
# ======== SISTEMA DE CONVITE / CRIAÇÃO DE CONTA =============
# ============================================================

def _render_invite_status(request, *, status: str, email: str | None = None, token: str | None = None, msg: str | None = None):
    ctx = {"status": status, "email": email, "token": token, "message": msg}
    return render(request, "billing/invite_status.html", ctx, status=200)


def _pick_auth_backend() -> str:
    """Escolhe um backend válido para auth_login; prefere ModelBackend."""
    backends = getattr(settings, "AUTHENTICATION_BACKENDS", [])
    model_backend = "django.contrib.auth.backends.ModelBackend"
    if model_backend in backends:
        return model_backend
    return backends[0] if backends else model_backend


@transaction.atomic
def accept_invite_view(request):
    token_value = request.GET.get("t")
    if not token_value:
        return _render_invite_status(request, status="invalid", msg="Token ausente.")

    try:
        invite = InviteToken.objects.select_for_update().select_related("customer").get(token=token_value)
    except InviteToken.DoesNotExist:
        return _render_invite_status(request, status="invalid", msg="Este link não é válido.")

    if invite.is_expired:
        return _render_invite_status(
            request,
            status="expired",
            email=invite.customer.email,
            token=token_value,
            msg="Seu link expirou. Você pode solicitar um novo convite."
        )

    if invite.is_used:
        if invite.customer.user:
            return _render_invite_status(
                request,
                status="already_has_user",
                email=invite.customer.email,
                msg="Este link já foi usado e a conta está criada."
            )
        return _render_invite_status(
            request,
            status="used",
            email=invite.customer.email,
            msg="Este link já foi usado. Solicite um novo convite."
        )

    customer = invite.customer

    if customer.user:
        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])
        return _render_invite_status(
            request,
            status="already_has_user",
            email=customer.email,
            msg="Conta já existe. Faça login para continuar."
        )

    if request.method == "GET":
        return _render_invite_status(request, status="ok_form", email=customer.email, token=token_value)

    if request.method == "POST":
        password = (request.POST.get("password") or "").strip()
        if not password or len(password) < 8:
            return _render_invite_status(
                request,
                status="ok_form",
                email=customer.email,
                token=token_value,
                msg="Senha inválida. Use pelo menos 8 caracteres."
            )

        try:
            # Reutiliza usuário se já existir
            try:
                user = User.objects.get(username=customer.email)
            except User.DoesNotExist:
                try:
                    user = User.objects.get(email=customer.email)
                except User.DoesNotExist:
                    user = None

            if user:
                if (not user.first_name) and customer.name:
                    user.first_name = customer.name
                    user.save(update_fields=["first_name"])
                user.set_password(password)
                user.save(update_fields=["password"])
            else:
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

            backend_path = _pick_auth_backend()
            auth_login(request, user, backend=backend_path)

            return render(request, "billing/account_created.html", {
                "email": customer.email,
                "redirect_url": "/",
            }, status=200)

        except IntegrityError as ie:
            log.exception("Erro de integridade ao criar/associar user: %s", ie)
            return _render_invite_status(
                request,
                status="already_has_user",
                email=customer.email,
                msg="Já existe uma conta com este e-mail. Faça login."
            )

        except Exception as e:
            log.exception("Falha inesperada no aceite de convite: %s", e)
            return _render_invite_status(
                request,
                status="error",
                email=customer.email,
                msg="Ocorreu um erro ao criar sua conta. Tente novamente ou solicite um novo convite."
            )

    return HttpResponseBadRequest("Método não suportado.")


def payment_success_view(request):
    email_hint = request.GET.get("email") or ""
    return render(request, "billing/success.html", {"email_hint": email_hint})


# === Reenvio de convite (opcional, compatível com services.py) ===
@csrf_exempt
@require_http_methods(["POST"])
def resend_invite_view(request):
    """
    Permite reenviar o link de convite para um cliente já cadastrado.
    Requer que o e-mail exista no banco (Customer).
    """
    try:
        data = json.loads(request.body.decode("utf-8"))
        email = (data.get("email") or "").strip().lower()
        if not email:
            return JsonResponse({"error": "E-mail é obrigatório."}, status=400)

        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            return JsonResponse({"error": "Cliente não encontrado."}, status=404)

        maybe_send_single_invite(customer)
        return JsonResponse({"ok": True, "message": f"Convite reenviado para {email}."})
    except Exception as e:
        log.exception("Erro ao reenviar convite: %s", e)
        return JsonResponse({"error": "Falha ao reenviar convite."}, status=500)


# === AbacatePay (Pix) ===
import requests
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods

@transaction.atomic
@csrf_exempt
@require_http_methods(["POST"])
def create_abacatepay_charge(request):
    try:
        data = json.loads(request.body.decode("utf-8"))
        plan = data.get("plan")
        customer = data.get("customer") or {}

        if not plan or not customer.get("email"):
            return JsonResponse({"error": "Dados inválidos: plano ou e-mail ausente."}, status=400)

        plans = {
            "mensal": {"price": 47, "label": "Mensal"},
            "semestral": {"price": 222, "label": "Semestral"},
            "anual": {"price": 384, "label": "Anual"},
        }
        plan_info = plans.get(plan)
        if not plan_info:
            return JsonResponse({"error": "Plano inválido."}, status=400)

        amount_cents = int(plan_info["price"] * 100)

        tax_id = (customer.get("cpf") or customer.get("taxId") or "").replace(".", "").replace("-", "").replace("/", "").strip()
        if not tax_id or not tax_id.isdigit():
            return JsonResponse({"error": "CPF/CNPJ inválido ou ausente."}, status=400)
        tax_id_type = "CNPJ" if len(tax_id) == 14 else "CPF"

        cellphone = (customer.get("cellphone") or "").replace("(", "").replace(")", "").replace("-", "").replace(" ", "").strip()
        # opcional: se o telefone for obrigatório, verificar se len(cellphone)>=10

        payload = {
            "amount": amount_cents,
            "description": f"Assinatura {plan_info['label']} SleepyPeepy",
            "customer": {
                "name": customer.get("name") or "",
                "cellphone": cellphone,
                "email": customer.get("email"),
                "taxId": tax_id,
                "taxIdType": tax_id_type,
            },
            "metadata": {
                "plan_code": plan,
                "origin": "sleepypeepy.site"
            },
            # adicionado o expiresIn: 3600 segundos (1 hora) — ajuste conforme sua necessidade
            "expiresIn": 3600,
            "returnUrl": f"{settings.SITE_URL}/billing/sucesso/",
            "notificationUrl": f"{settings.SITE_URL}/billing/webhooks/abacatepay/"
        }

        headers = {
            "Authorization": f"Bearer {settings.ABACATEPAY_API_KEY}",
            "Accept": "application/json",
            "Content-Type": "application/json",
        }

        endpoint = f"{settings.ABACATEPAY_BASE_URL}/v1/pixQrCode/create"
        response = requests.post(endpoint, headers=headers, json=payload, timeout=30)

        if not response.ok:
            try:
                err = response.json()
            except Exception:
                err = {"message": response.text}
            return JsonResponse({"error": f"Erro AbacatePay: {err}"}, status=response.status_code)

        result = response.json()
        # dependendo da API, pode estar em result['data']
        data_field = result.get("data", result)

        payment_url = data_field.get("paymentUrl") or data_field.get("url")
        qr_code = data_field.get("brCode") or data_field.get("qrCode") or data_field.get("brCode64")
        qr_image = data_field.get("brCodeBase64") or data_field.get("qrCodeBase64")

        return JsonResponse({
            "ok": True,
            "payment_url": payment_url,
            "qr_code": qr_code,
            "qr_image": qr_image,
            "status": data_field.get("status"),
            "id": data_field.get("id"),
        })
    except Exception as e:
        log.exception("Erro ao criar cobrança Pix AbacatePay: %s", e)
        return JsonResponse({"error": "Falha ao gerar Pix."}, status=500)
