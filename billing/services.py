# billing/services.py
from django.urls import reverse
from django.conf import settings
from django.utils import timezone
from .models import Customer, InviteToken, Subscription, Plan
from .emails import send_invite_email

INVITE_TTL_DAYS = 7  # opcional

def ensure_customer(email: str, name: str = "") -> Customer:
    customer, _ = Customer.objects.get_or_create(email=email, defaults={"name": name})
    if name and not customer.name:
        customer.name = name
        customer.save(update_fields=["name"])
    return customer

def maybe_send_single_invite(customer: Customer) -> InviteToken | None:
    """
    Regra: se já foi enviado convite uma vez (invite_sent_at), NÃO reenviar.
    Se ALLOW_RESEND_INVITE=True no settings/.env, permite reenvio (útil p/ testes).
    Se já tem user vinculado, não envia.
    """
    allow_resend = getattr(settings, "ALLOW_RESEND_INVITE", False)
    if customer.user:
        return None
    if customer.invite_sent_at and not allow_resend:
        return None

    token = InviteToken.objects.create(
        customer=customer,
        token=InviteToken.generate_token(),
        expires_at=timezone.now() + timezone.timedelta(days=INVITE_TTL_DAYS)
    )
    customer.invite_sent_at = timezone.now()
    customer.invite_token_last_id = token.token
    customer.save(update_fields=["invite_sent_at", "invite_token_last_id"])

    invite_url = settings.SITE_URL + reverse("accept_invite") + f"?t={token.token}"
    send_invite_email(to_email=customer.email, name=customer.name or customer.email, invite_url=invite_url)
    return token

def get_or_create_subscription(customer: Customer, plan_code: str) -> Subscription:
    plan = Plan.objects.get(code=plan_code, active=True)
    sub, _ = Subscription.objects.get_or_create(customer=customer, plan=plan)
    return sub
