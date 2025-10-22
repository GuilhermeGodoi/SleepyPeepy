# billing/models.py
from django.conf import settings
from django.db import models, transaction
from django.utils import timezone
import secrets
from django.core.validators import MinValueValidator

User = settings.AUTH_USER_MODEL

class Customer(models.Model):
    email = models.EmailField(unique=True, db_index=True)
    name = models.CharField(max_length=255, blank=True)
    # Providers IDs
    stripe_customer_id = models.CharField(max_length=128, blank=True, unique=False)
    abacatepay_customer_id = models.CharField(max_length=128, blank=True, unique=False)

    # Controle de convite
    invite_sent_at = models.DateTimeField(null=True, blank=True)
    invite_token_last_id = models.CharField(max_length=64, blank=True)  # referência de última InviteToken (opcional)

    # Vinculação a User (criado após aceitar convite)
    user = models.OneToOneField(User, null=True, blank=True, on_delete=models.SET_NULL, related_name="customer_profile")

    def __str__(self):
        return self.email


class InviteToken(models.Model):
    """
    Token single-use. Expira IMEDIATAMENTE quando usado para criar/associar uma conta.
    Opcionalmente pode ter expiração por tempo (ex: 7 dias), se quiser.
    """
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="invites")
    token = models.CharField(max_length=64, unique=True, db_index=True)
    created_at = models.DateTimeField(auto_now_add=True)
    used_at = models.DateTimeField(null=True, blank=True)
    expires_at = models.DateTimeField(null=True, blank=True)

    @staticmethod
    def generate_token():
        # curta e segura (URL-safe)
        return secrets.token_urlsafe(32)

    @property
    def is_used(self):
        return self.used_at is not None

    @property
    def is_expired(self):
        return self.expires_at and timezone.now() > self.expires_at


class Plan(models.Model):
    """
    Planos de assinatura (mensal, semestral, anual).
    """
    code = models.SlugField(unique=True)  # ex: "mensal", "semestral", "anual"
    name = models.CharField(max_length=100)
    interval = models.CharField(max_length=20, choices=[("month", "month"), ("six_months", "six_months"), ("year", "year")])
    interval_count = models.PositiveIntegerField(default=1, validators=[MinValueValidator(1)])
    price_cents_brl = models.PositiveIntegerField()  # preço base BRL em centavos
    stripe_price_id = models.CharField(max_length=128, blank=True)  # se usar Stripe Subscriptions
    active = models.BooleanField(default=True)

    def __str__(self):
        return f"{self.name} ({self.code})"


class Subscription(models.Model):
    """
    Status da assinatura lógica do sistema (independente do provider).
    Renovada automaticamente ao receber "payment_succeeded" de qualquer provedor.
    """
    customer = models.ForeignKey(Customer, on_delete=models.CASCADE, related_name="subscriptions")
    plan = models.ForeignKey(Plan, on_delete=models.PROTECT)
    is_active = models.BooleanField(default=False)

    # Janelas de acesso
    current_period_start = models.DateTimeField(null=True, blank=True)
    current_period_end = models.DateTimeField(null=True, blank=True)

    # IDs de provedor
    stripe_subscription_id = models.CharField(max_length=128, blank=True)
    abacatepay_subscription_id = models.CharField(max_length=128, blank=True)  # se houver conceito semelhante

    # Segurança contra duplicidade
    last_payment_external_id = models.CharField(max_length=191, blank=True)  # invoice/charge id já processado

    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    @transaction.atomic
    def apply_successful_payment(self, external_payment_id, paid_at=None):
        """
        Idempotente: ignora se já processou esse payment id.
        Estende 'current_period_end' conforme o plano.
        """
        if external_payment_id and self.last_payment_external_id == external_payment_id:
            return False  # já aplicou

        now = paid_at or timezone.now()
        start = self.current_period_end if (self.is_active and self.current_period_end and self.current_period_end > now) else now

        if self.plan.interval == "month":
            delta = timezone.timedelta(days=30 * self.plan.interval_count)
        elif self.plan.interval == "six_months":
            delta = timezone.timedelta(days=30 * 6 * self.plan.interval_count)
        elif self.plan.interval == "year":
            delta = timezone.timedelta(days=365 * self.plan.interval_count)
        else:
            delta = timezone.timedelta(days=30)

        self.current_period_start = start
        self.current_period_end = start + delta
        self.is_active = True
        if external_payment_id:
            self.last_payment_external_id = external_payment_id
        self.save()
        return True
