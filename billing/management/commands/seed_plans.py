# billing/management/commands/seed_plans.py
from django.core.management.base import BaseCommand
from billing.models import Plan

class Command(BaseCommand):
    help = "Cria/atualiza planos padrão"

    def handle(self, *args, **options):
        data = [
            dict(code="mensal", name="Mensal", interval="month", interval_count=1, price_cents_brl=4700, stripe_price_id="price_..."),
            dict(code="semestral", name="Semestral", interval="six_months", interval_count=1, price_cents_brl=22200, stripe_price_id="price_..."),
            dict(code="anual", name="Anual", interval="year", interval_count=1, price_cents_brl=38400, stripe_price_id="price_..."),
        ]
        for d in data:
            obj, created = Plan.objects.update_or_create(code=d["code"], defaults=d)
            self.stdout.write(self.style.SUCCESS(f"{'Criado' if created else 'Atualizado'}: {obj}"))
