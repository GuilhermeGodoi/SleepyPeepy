# mock_abacate_webhook.py
import os, hmac, hashlib, json, requests

WEBHOOK_URL = "https://sleepypeepy.site/billing/webhooks/abacatepay"
SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET", "U0FySJRcOYE2hXuembAN6dPeYe8dF5g-qCdQ-k-I7IU")

payload = {
    "event": "charge.paid",
    "data": {
        "id": "pix_test_0039",  # mude SEMPRE para um id novo p/ não bater no idempotency
        "email": "guilhermegodoibarreiros2@gmail.com",   # email "comercial"
        "plan_code": "mensal",
        "metadata": {"plan_code": "mensal"},
        "customer": {
            "email": "guilhermegodoibarreiros2@gmail.com",
            "name": "Teste PIX Gmail"
        }
    }
}

body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
signature = hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()

headers = {
    "Content-Type": "application/json",
    # o server agora aceita vários nomes; este é o que você já usava:
    "X-ABACATEPAY-SIGNATURE": signature,
}

r = requests.post(WEBHOOK_URL, data=body, headers=headers, timeout=20)
print("Status:", r.status_code)
print("Body:", r.text)
