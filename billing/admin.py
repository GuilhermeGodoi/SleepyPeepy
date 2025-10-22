# billing/admin.py
from django.contrib import admin
from .models import Customer, InviteToken, Plan, Subscription

@admin.register(Customer)
class CustomerAdmin(admin.ModelAdmin):
    list_display = ("email", "name", "user", "invite_sent_at")
    search_fields = ("email", "name")

@admin.register(InviteToken)
class InviteTokenAdmin(admin.ModelAdmin):
    list_display = ("customer", "token", "created_at", "used_at", "expires_at")
    search_fields = ("token", "customer__email")

@admin.register(Plan)
class PlanAdmin(admin.ModelAdmin):
    list_display = ("code", "name", "interval", "interval_count", "price_cents_brl", "active")
    list_filter = ("active", "interval")
    search_fields = ("code", "name")

@admin.register(Subscription)
class SubscriptionAdmin(admin.ModelAdmin):
    list_display = ("customer", "plan", "is_active", "current_period_start", "current_period_end", "last_payment_external_id")
    list_filter = ("is_active", "plan")
    search_fields = ("customer__email", "last_payment_external_id")
