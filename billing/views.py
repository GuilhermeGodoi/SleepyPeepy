# billing/views.py
from django.shortcuts import render, redirect
from django.http import HttpResponseBadRequest, HttpResponse
from django.contrib.auth import get_user_model, login
from django.utils import timezone
from .models import InviteToken, Customer
from django.db import transaction

User = get_user_model()

@transaction.atomic
def accept_invite_view(request):
    token_value = request.GET.get("t")
    if not token_value:
        return HttpResponseBadRequest("Token ausente.")

    try:
        invite = InviteToken.objects.select_for_update().select_related("customer").get(token=token_value)
    except InviteToken.DoesNotExist:
        return HttpResponseBadRequest("Token inválido.")

    if invite.is_used or invite.is_expired:
        return HttpResponseBadRequest("Token expirado ou já utilizado.")

    customer = invite.customer
    # Cenários:
    # 1) Se já existe user vinculado, só loga (se quiser); o token é marcado usado para não reaproveitar.
    if customer.user:
        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])
        # opcional: autenticar/redirect
        return HttpResponse("Conta já existe. Faça login normalmente.")

    if request.method == "GET":
        # Renderize um form de criação de senha/usuário simples (ou use allauth template)
        return render(request, "billing/accept_invite.html", {"email": customer.email, "token": token_value})

    # POST: cria user, vincula e consome token
    if request.method == "POST":
        password = request.POST.get("password")
        if not password or len(password) < 8:
            return HttpResponseBadRequest("Senha inválida.")

        user = User.objects.create_user(username=customer.email, email=customer.email, password=password, first_name=customer.name or "")
        customer.user = user
        customer.save(update_fields=["user"])

        invite.used_at = timezone.now()
        invite.save(update_fields=["used_at"])

        login(request, user)
        return redirect("/")  # dashboard
