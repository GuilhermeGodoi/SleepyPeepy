# billing/tasks.py
from django.utils import timezone
from .models import Subscription

def generate_pix_invoices_for_upcoming_periods():
    now = timezone.now()
    # Para planos PIX: se faltam X dias para expirar, gerar nova cobrança
    qs = Subscription.objects.filter(is_active=True, current_period_end__lte=now + timezone.timedelta(days=3))
    for sub in qs:
        # Chame a API do AbacatePay para criar a cobrança PIX com metadata (email, plan_code)
        # Guarde o "charge_id" se quiser.
        pass
