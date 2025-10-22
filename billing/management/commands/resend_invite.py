# billing/management/commands/resend_invite.py
from django.core.management.base import BaseCommand, CommandError
from billing.models import Customer
from billing.services import maybe_send_single_invite

class Command(BaseCommand):
    help = "Reenvia (ou envia) convite de cadastro para um e-mail existente"

    def add_arguments(self, parser):
        parser.add_argument("email", type=str)

    def handle(self, *args, **opts):
        email = opts["email"]
        try:
            customer = Customer.objects.get(email=email)
        except Customer.DoesNotExist:
            raise CommandError("Customer não encontrado")

        token = maybe_send_single_invite(customer)
        if token:
            self.stdout.write(self.style.SUCCESS(f"Invite enviado. Token={token.token}"))
        else:
            self.stdout.write(self.style.WARNING("Nenhum invite enviado (já existe user ou bloqueado por regra)."))
