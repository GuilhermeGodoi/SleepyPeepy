# setup/middleware.py
import re
from django.conf import settings
from django.shortcuts import redirect
from django.urls import reverse

class LoginRequiredMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response
        patterns = getattr(settings, "LOGIN_EXEMPT_URLS", [])
        self.exempt_regexes = [re.compile(p) for p in patterns]

    def __call__(self, request):
        # 1) use path_info e remova a "/"
        path = request.path_info.lstrip("/")

        # 2) BYPASS DEFINITIVO PARA WEBHOOKS (mínimo e seguro)
        if path.startswith(("billing/webhooks/", "webhooks/")):
            return self.get_response(request)

        # DEBUG opcional:
        # print("PATH:", path)
        # for r in self.exempt_regexes:
        #     if r.match(path):
        #         print("MATCHED:", r.pattern)
        #         break

        for regex in self.exempt_regexes:
            if regex.match(path):
                return self.get_response(request)

        if request.user.is_authenticated:
            return self.get_response(request)

        login_url = getattr(settings, "LOGIN_URL", "/accounts/login/")
        return redirect(f"{login_url}?next=/{path}")
