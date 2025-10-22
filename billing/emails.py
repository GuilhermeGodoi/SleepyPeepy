# billing/emails.py
from django.core.mail import send_mail
from django.conf import settings

def send_invite_email(to_email: str, name: str, invite_url: str):
    subject = "Seu acesso à SleepyPeepy"
    body = (
        f"Olá {name or to_email},\n\n"
        f"Pagamento confirmado! Crie sua conta pelo link abaixo (uso único):\n{invite_url}\n\n"
        f"Se você já criou a conta, ignore este e-mail.\n\n"
        f"— Equipe SleepyPeepy"
    )
    send_mail(
        subject,
        body,
        getattr(settings, "DEFAULT_FROM_EMAIL", "contato@sleepypeepy.site"),
        [to_email],
        fail_silently=False,
    )
