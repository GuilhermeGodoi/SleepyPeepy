# billing/management/commands/resend_invite.py
from django.core.management.base import BaseCommand
from billing.services import ensure_customer, maybe_send_single_invite

class Command(BaseCommand):
    help = "Envia ou reenvia convite de cadastro para um e-mail. Cria o Customer se não existir."

    def add_arguments(self, parser):
        parser.add_argument("email", type=str)
        parser.add_argument("--name", type=str, default="")

    def handle(self, *args, **opts):
        email = opts["email"].strip().lower()
        name = (opts.get("name") or "").strip()
        customer = ensure_customer(email=email, name=name)
        token = maybe_send_single_invite(customer)
        if token:
            self.stdout.write(self.style.SUCCESS(f"Invite enviado para {email}. Token={token.token}"))
        else:
            self.stdout.write(self.style.WARNING(
                f"Nenhum invite enviado para {email}. (Possível: já tem user vinculado ou invite bloqueado pela regra.)"
            ))
