"""
Django settings for setup project.
Gerado pelo 'django-admin startproject' (Django 5.2.7).
"""
import os
from pathlib import Path

try:
    import dj_database_url
except Exception:
    dj_database_url = None

BASE_DIR = Path(__file__).resolve().parent.parent

try:
    from dotenv import load_dotenv
    load_dotenv(BASE_DIR / ".env")
except Exception:
    pass

# === Segurança básica ===
SECRET_KEY = os.getenv("DJANGO_SECRET_KEY", "dev-insecure-key")
DEBUG = os.getenv("DEBUG", "False").lower() == "true"

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
    "django.contrib.sites",

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

ACCOUNT_ADAPTER = "setup.account_adapter.MyAccountAdapter"
LOGIN_REDIRECT_URL = "/"
LOGOUT_REDIRECT_URL = "/"

ACCOUNT_AUTHENTICATION_METHOD = "username_email"
ACCOUNT_EMAIL_REQUIRED = True
ACCOUNT_EMAIL_VERIFICATION = "none"
ACCOUNT_USERNAME_REQUIRED = True
ACCOUNT_LOGIN_METHODS = {"email"}
ACCOUNT_SIGNUP_FIELDS = ["email*", "password1*"]
ACCOUNT_SIGNUP_PASSWORD_ENTER_TWICE = False

# ===== E-mail =====
# Permite forçar SMTP mesmo com DEBUG=True via .env
EMAIL_BACKEND = os.getenv(
    "EMAIL_BACKEND",
    "django.core.mail.backends.console.EmailBackend" if DEBUG else "django.core.mail.backends.smtp.EmailBackend"
)

DEFAULT_FROM_EMAIL = os.getenv("DEFAULT_FROM_EMAIL", "contato@sleepypeepy.site")
EMAIL_HOST = os.getenv("EMAIL_HOST", "smtp.hostinger.com")
EMAIL_PORT = int(os.getenv("EMAIL_PORT", "587"))
EMAIL_HOST_USER = os.getenv("EMAIL_HOST_USER", "contato@sleepypeepy.site")
EMAIL_HOST_PASSWORD = os.getenv("EMAIL_HOST_PASSWORD", "")
EMAIL_USE_TLS = os.getenv("EMAIL_USE_TLS", "True").lower() == "true"
EMAIL_USE_SSL = os.getenv("EMAIL_USE_SSL", "False").lower() == "true"

# ===== Flags de app =====
SITE_URL = os.getenv("SITE_URL", "https://sleepypeepy.site")

# Stripe
STRIPE_SECRET_KEY = os.getenv("STRIPE_SECRET_KEY")
STRIPE_WEBHOOK_SECRET = os.getenv("STRIPE_WEBHOOK_SECRET")

# AbacatePay (HMAC)
ABACATEPAY_WEBHOOK_SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET")

# Permitir reenvio de convite (apenas para testes)
ALLOW_RESEND_INVITE = os.getenv("ALLOW_RESEND_INVITE", "False").lower() == "true"

# === Middlewares ===
MIDDLEWARE = [
    "django.middleware.security.SecurityMiddleware",
    "whitenoise.middleware.WhiteNoiseMiddleware",
    "django.contrib.sessions.middleware.SessionMiddleware",
    "corsheaders.middleware.CorsMiddleware",
    "django.middleware.common.CommonMiddleware",
    "django.middleware.csrf.CsrfViewMiddleware",
    "django.contrib.auth.middleware.AuthenticationMiddleware",
    "allauth.account.middleware.AccountMiddleware",
    "setup.middleware.LoginRequiredMiddleware",
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
CORS_ALLOW_CREDENTIALS = True

# === URLs liberadas de login ===
LOGIN_EXEMPT_URLS = [
    r"^lp/$", r"^lp/.*$",
    r"^whatsapp/$",
    r"^politica-de-privacidade/$",
    r"^termos/$",
    r"^quiz-insonia/?$",
    r"^quiz-ansiedade/?$",
    r"^quiz-misto/?$",

    r"^vendas/?$",
    r"^vendas/.*$",
    r"^checkout/?$",
    r"^checkout/.*$",

    r"^accounts/.*$",
    r"^admin/.*$",
    r"^static/.*$",
    r"^media/.*$",
    r"^favicon\.ico/?$",
    r"^robots\.txt$",
    r"^sitemap\.xml$",
    r"^\.well-known/.*$",

    r"^api/public/.*$",
    r"^health/?$",

    # Webhooks/rotas billing
    r"^billing/sucesso/?$",  
    r"^billing/accept-invite/?$",
    r"^billing/webhooks/abacatepay/?$",
    r"^billing/webhooks/stripe/?$",

    # se expôs versões "legado":
    r"^api/abacatepay/create-billing/?$",
    r"^webhooks/abacatepay/?$",
    r"^api/stripe/create-checkout-session/?$",
    r"^webhooks/stripe/?$",

    r"^api/stripe/create-payment-intent/?$",
    r"^api/stripe/create-checkout-session/?$",

    #AbacatePay PIX
    r"^billing/webhooks/abacatepay/?$",
    r"^api/abacatepay/create-charge/?$",

]

# === URLConf / Templates / WSGI ===
ROOT_URLCONF = "setup.urls"

TEMPLATES = [
    {
        "BACKEND": "django.template.backends.django.DjangoTemplates",
        "DIRS": [
            BASE_DIR / "templates",
            BASE_DIR / "dist",
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
DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.postgresql',
        'NAME': 'railway',
        'USER': 'postgres',
        'PASSWORD': 'jrPGtaPCKajpfYsMsoRVOtaWJGYpIcYK',
        'HOST': 'postgres.railway.internal',
        'PORT': '5432',
    }
}
if dj_database_url and os.getenv("DATABASE_URL"):
    DATABASES['default'] = dj_database_url.parse(os.getenv("DATABASE_URL"), conn_max_age=600)

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
    BASE_DIR / "dist",
    BASE_DIR / "public",
    BASE_DIR / "src" / "assets",
    BASE_DIR / "setup" / "static",
    BASE_DIR / "frontend/dist",
]
if not DEBUG:
    STATICFILES_STORAGE = "whitenoise.storage.CompressedManifestStaticFilesStorage"

# === Segurança em produção ===
SESSION_COOKIE_SECURE = not DEBUG
CSRF_COOKIE_SECURE = not DEBUG
SECURE_PROXY_SSL_HEADER = ("HTTP_X_FORWARDED_PROTO", "https")

# === Default PK ===
DEFAULT_AUTO_FIELD = "django.db.models.BigAutoField"

# === LOGGING (observabilidade mínima) ===
LOGGING = {
    "version": 1,
    "disable_existing_loggers": False,
    "handlers": {"console": {"class": "logging.StreamHandler"}},
    "root": {"handlers": ["console"], "level": os.getenv("LOG_LEVEL", "INFO")},
}
