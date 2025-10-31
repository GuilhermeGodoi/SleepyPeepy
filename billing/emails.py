# billing/emails.py
from django.core.mail import EmailMultiAlternatives
from django.conf import settings

def send_invite_email(to_email: str, name: str, invite_url: str):
    subject = "Seu acesso à SleepyPeepy 🌙"
    remetente = getattr(settings, "DEFAULT_FROM_EMAIL", "contato@sleepypeepy.site")

    # Texto alternativo (caso o cliente de e-mail bloqueie HTML)
    text_body = (
        f"Olá {name or to_email},\n\n"
        f"Pagamento confirmado! Crie sua conta pelo link abaixo (uso único):\n{invite_url}\n\n"
        f"Se você já criou a conta, ignore este e-mail.\n\n"
        f"— Equipe SleepyPeepy"
    )

    # HTML estilizado (padrão visual SleepyPeepy)
    html_body = f"""\
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Convite SleepyPeepy</title>
      <style>
        body {{
          background-color: #f8f9fb;
          font-family: 'Helvetica Neue', Arial, sans-serif;
          color: #333;
          margin: 0;
          padding: 0;
        }}
        .email-container {{
          max-width: 600px;
          margin: 40px auto;
          background-color: #ffffff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
        }}
        .header {{
          background: linear-gradient(135deg, #7b5cff, #9f8bff);
          color: #fff;
          text-align: center;
          padding: 28px 20px;
        }}
        .header h1 {{
          margin: 0;
          font-size: 26px;
          font-weight: 700;
          letter-spacing: 0.5px;
        }}
        .content {{
          padding: 30px 28px;
          text-align: left;
        }}
        .content h2 {{
          color: #7b5cff;
          font-size: 20px;
          margin-bottom: 16px;
        }}
        .content p {{
          line-height: 1.6;
          font-size: 15px;
          color: #444;
          margin-bottom: 18px;
        }}
        .cta {{
          display: block;
          width: fit-content;
          background: linear-gradient(135deg, #7b5cff, #a27cff);
          color: #ffffff !important;
          text-decoration: none;
          padding: 14px 28px;
          border-radius: 10px;
          margin: 30px auto 10px;
          text-align: center;
          font-weight: 600;
          letter-spacing: 0.3px;
          transition: background 0.2s ease-in-out;
        }}
        .cta:hover {{
          background: linear-gradient(135deg, #8a70ff, #b89aff);
        }}
        .footer {{
          font-size: 13px;
          color: #888;
          text-align: center;
          padding: 20px;
          border-top: 1px solid #eee;
        }}
      </style>
    </head>
    <body>
      <div class="email-container">
        <div class="header">
          <h1>SleepyPeepy</h1>
        </div>
        <div class="content">
          <h2>Olá {name or "amigo(a)"} 👋</h2>
          <p>Seu pagamento foi confirmado! Agora você pode ativar seu acesso exclusivo à plataforma SleepyPeepy.</p>
          <p>Basta clicar no botão abaixo para criar sua conta. O link é <strong>único e válido por tempo limitado</strong>:</p>

          <a href="{invite_url}" class="cta" target="_blank">Criar minha conta</a>

          <p>Se você já criou sua conta, pode ignorar este e-mail.</p>
          <p>Boa jornada de descanso 💜<br>— Equipe SleepyPeepy</p>
        </div>
        <div class="footer">
          Este e-mail foi enviado automaticamente por SleepyPeepy.<br>
          Caso não tenha realizado essa ação, basta ignorar.
        </div>
      </div>
    </body>
    </html>
    """

    # Envia e-mail (HTML + texto)
    email = EmailMultiAlternatives(
        subject=subject,
        body=text_body,
        from_email=remetente,
        to=[to_email],
        bcc=[remetente],
    )
    email.attach_alternative(html_body, "text/html")
    email.send(fail_silently=False)
