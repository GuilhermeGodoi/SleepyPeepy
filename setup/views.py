# setup/views.py
from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

@login_required
def whoami(request):
    u = request.user
    return JsonResponse({"id": u.id, "username": u.username, "email": u.email})

from django.contrib.auth.decorators import login_required
from django.http import HttpResponseForbidden
from django.shortcuts import render
from django.core.signing import TimestampSigner, dumps as s_dumps
from django.urls import reverse

@login_required
def manage_invites(request):
    if not request.user.is_staff:
        return HttpResponseForbidden("Somente staff.")

    # >>> mova a verificação para a view:
    has_verified_email = request.user.emailaddress_set.filter(verified=True).exists()

    invites = []
    if request.method == "POST":
        try:
            qty = max(1, min(20, int(request.POST.get("qty", "1"))))
        except ValueError:
            qty = 1
        try:
            days = max(1, min(90, int(request.POST.get("days", "7"))))
        except ValueError:
            days = 7

        signer = TimestampSigner()
        base_signup = request.build_absolute_uri(reverse("account_signup"))

        for _ in range(qty):
            payload = {"created_by": request.user.id, "days": days}
            token = s_dumps(payload)
            url = f"{base_signup}?invite={token}"
            invites.append({"url": url, "days": days})

    return render(
        request,
        "account/verified_email_required.html",
        {"invites": invites, "has_verified_email": has_verified_email},
    )

from django.http import HttpResponse
def health(request):  # rota simples
    return HttpResponse("ok", content_type="text/plain")