# setup/account_adapter.py
from allauth.account.adapter import DefaultAccountAdapter

class MyAccountAdapter(DefaultAccountAdapter):
    def is_open_for_signup(self, request):
        # habilita signup sempre
        return True
