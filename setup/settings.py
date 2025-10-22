"""
Django settings for setup project.

Gerado pelo 'django-admin startproject' (Django 5.2.7).
"""

import os
from pathlib import Path

# Opcional para produção (Railway/Postgres). Mantém sqlite se não houver DATABASE_URL:
try:
    import dj_database_url  # adicionado
except Exception:
    dj_database_url = None

# === Paths ===
BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except Exception:
    pass

# === Segurança básica ===
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-insecure-key")  # troque no .env
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

# Domínios permitidos (ajuste no .env se precisar)
ALLOWED_HOSTS = [h.strip() for h in os.getenv(
    "ALLOWED_HOSTS",
    "sleepypeepy.site,sleepypeepy-production.up.railway.app,localhost,127.0.0.1"
).split(",") if h.strip()]

# === Apps ===
INSTALLED_APPS = [
    # Django core
    "django.contrib.admin",
    "django.contrib.auth",
    "django.contrib.contenttypes",
    "django.contrib.sessions",
    "django.contrib.messages",
    "django.contrib.staticfiles",

    # Terceiros
    "corsheaders",
    "django.contrib.sites",   # necessário p/ allauth

    # Allauth
    "allauth",
    "allauth.account",

    # Seus apps
    "billing",
]

SITE_ID = 1

# === Auth / Allauth ===
AUTHENTICATION_BACKENDS = [
    "django.contrib.auth.backends.ModelBackend",
    "allauth.account.auth_backends.AuthenticationBackend",
]

# Adapter do allauth (mantido)
ACCOUNT_ADAPTER = "setup.account_adapter.MyAccountAdapter"

LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

# Configurações comuns do allauth
ACCOUNT_AUTHENTICATION_METHOD = "username_email"  # ou "email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"  # sem verificação obrigatória
ACCOUNT_USERNAME_REQUIRED = True

# Login só por e-mail (mantendo sua intenção)
ACCOUNT_LOGIN_METHODS = {"email"}

# Cadastro com apenas e-mail e senha
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*"]
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False  # 1 campo de senha

# Em DEV usa console; em PROD usa SMTP Hostinger
if DEBUG:
    EMAIL_BACKEND = "django.core.mail.backends.console.EmailBackend"
else:
    EMAIL_BACKEND = "django.core.mail.backends.smtp.EmailBackend"

# ===== E-mail (Hostinger SMTP) =====
DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "contato@sleepypeepy.site")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.hostinger.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "contato@sleepypeepy.site")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "False").lower() == "true"

# ===== App config =====
SITE_URL = os.getenv("SITE_URL", "https://sleepypeepy.site")

# ===== Stripe =====
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# ===== AbacatePay (HMAC) =====
ABACATEPAY_WEBHOOK_SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET")  # defina igual no painel

# === Middlewares ===
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",         # estáticos em prod
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",       # <— ANTES
    "setup.middleware.LoginRequiredMiddleware",           # <— DEPOIS (mantido)
    "django.contrib.messages.middleware.MessageMiddleware",
    "django.middleware.clickjacking.XFrameOptionsMiddleware",
]

# === CORS/CSRF ===
CORS_ALLOWED_ORIGINS = [
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "http://localhost:5173",
    "http://127.0.0.1:5173",
    "https://sleepypeepy.site",
]
CSRF_TRUSTED_ORIGINS = [f"https://{h}" for h in ALLOWED_HOSTS if "." in h]

# === URLs liberadas de login ===
# (regex relativas à raiz, sem a "/")
LOGIN_EXEMPT_URLS = [
    # Públicas do seu site
    r"^lp/$", r"^lp/.*$",
    r"^whatsapp/$",
    r"^politica-de-privacidade/$",
    r"^termos/$",
    r"^quiz-insonia/?$",
    r"^quiz-ansiedade/?$",
    r"^quiz-misto/?$",

    # SPA públicas
    r"^vendas/?$",
    r"^vendas/.*$",
    r"^checkout/?$",
    r"^checkout/.*$",

    # allauth/admin/estáticos
    r"^accounts/.*$",
    r"^admin/.*$",
    r"^static/.*$",
    r"^media/.*$",
    r"^favicon\.ico$",
    r"^robots\.txt$",
    r"^sitemap\.xml$",
    r"^\.well-known/.*$",

    # APIs públicas (se existirem)
    r"^api/public/.*$",

    # Healthcheck
    r"^health/?$",

    # === Webhooks e rotas do billing ===
    r"^billing/accept-invite/?$",       # GET/POST criar conta por token
    r"^billing/webhooks/abacatepay/?$", # POST webhook
    r"^billing/webhooks/stripe/?$",     # POST webhook

    # Se você expõe essas rotas fora de /billing, mantenha também:
    r"^api/abacatepay/create-billing/?$",   # POST (se existir)
    r"^webhooks/abacatepay/?$",             # legado
    r"^api/stripe/create-checkout-session/?$",
    r"^webhooks/stripe/?$",                 # legado
]


CORS_ALLOW_CREDENTIALS = True  # Para cookies

# === URLConf / Templates / WSGI ===
ROOT_URLCONF = "setup.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",  # overrides (allauth etc.)
            BASE_DIR / "dist",       # index.html do Vite (SPA)
        ],
        "APP_DIRS": True,
        "OPTIONS": {
            "context_processors": [
                "django.template.context_processors.request",
                "django.contrib.auth.context_processors.auth",
                "django.contrib.messages.context_processors.messages",
            ],
        },
    },
]

WSGI_APPLICATION = "setup.wsgi.application"

# === Database ===
# Postgres (Railway). Se DATABASE_URL existir, sobrepõe com dj_database_url.
DATABASES = {
    "default": {
        "ENGINE": "django.db.backends.postgresql",
        "NAME": os.getenv("POSTGRES_DB", "railway"),
        "USER": os.getenv("POSTGRES_USER", "postgres"),
        "PASSWORD": os.getenv("POSTGRES_PASSWORD", ""),
        "HOST": os.getenv("POSTGRES_HOST", "postgres.railway.internal"),
        "PORT": os.getenv("POSTGRES_PORT", "5432"),
    }
}

if dj_database_url and os.getenv("DATABASE_URL"):
    DATABASES["default"] = dj_database_url.parse(os.getenv("DATABASE_URL"), conn_max_age=600)

# === Password validators ===
AUTH_PASSWORD_VALIDATORS = [
    {"NAME": "django.contrib.auth.password_validation.UserAttributeSimilarityValidator"},
    {"NAME": "django.contrib.auth.password_validation.MinimumLengthValidator", "OPTIONS": {"min_length": 8}},
    {"NAME": "django.contrib.auth.password_validation.CommonPasswordValidator"},
    {"NAME": "django.contrib.auth.password_validation.NumericPasswordValidator"},
]

# === I18N / TZ ===
LANGUAGE_CODE = "pt-br"
TIME_ZONE = "America/Sao_Paulo"
USE_I18N = True
USE_TZ = True

# === Static/Media ===
STATIC_URL = "/static/"
STATIC_ROOT = BASE_DIR / "staticfiles"
STATICFILES_DIRS = [
    BASE_DIR / "dist",              # build do Vite (SPA)
    BASE_DIR / "public",            # se usar
    BASE_DIR / "src" / "assets",    # assets do React (se realmente precisar)
    BASE_DIR / "setup" / "static",  # seu caminho adicional
]

# Em produção, ativa storage com manifest + compressão
if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# === Segurança em produção ===
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# === Default PK ===
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"
