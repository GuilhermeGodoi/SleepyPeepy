# setup/middleware.py
import re
from django.conf import settings
from django.shortcuts import redirect

class LoginRequiredMiddleware:
    """
    Redireciona para LOGIN_URL se não autenticado,
    exceto se o caminho casar com LOGIN_EXEMPT_URLS.
    """
    def __init__(self, get_response):
        self.get_response = get_response
        patterns = getattr(settings, "LOGIN_EXEMPT_URLS", [])
        self.exempt_regexes = [re.compile(p) for p in patterns]

    def __call__(self, request):
        path = request.path.lstrip("/")  # sem a "/"

        # Se o path casar com qualquer regex isenta -> libera
        for regex in self.exempt_regexes:
            if regex.match(path):
                return self.get_response(request)

        # Autenticado? segue
        if request.user.is_authenticated:
            return self.get_response(request)

        # Redireciona p/ login com ?next=
        login_url = getattr(settings, "LOGIN_URL", "/accounts/login/")
        return redirect(f"{login_url}?next=/{path}")
