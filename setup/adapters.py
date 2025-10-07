from allauth.account.adapter import DefaultAccountAdapter
from django.core import signing

SALT = "invite-signup"
MAX_AGE = 60 * 60 * 24  # 24h, ajuste se quiser

class InviteOnlyAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        token = request.GET.get("invite")
        if not token:
            return False
        try:
            # valida assinatura e expiração
            data = signing.loads(token, salt=SALT, max_age=MAX_AGE)
            # opcional: você pode checar algo em data, ex: email permitido
            return True
        except signing.BadSignature:
            return False
        except signing.SignatureExpired:
            return False
