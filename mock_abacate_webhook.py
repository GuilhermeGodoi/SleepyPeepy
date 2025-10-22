# mock_abacate_webhook.py
import os, hmac, hashlib, json, requests

WEBHOOK_URL = "https://sleepypeepy.site/billing/webhooks/abacatepay"  # sem barra final (agora tanto faz)
SECRET = os.getenv("ABACATEPAY_WEBHOOK_SECRET", "U0FySJRcOYE2hXuembAN6dPeYe8dF5g-qCdQ-k-I7IU")

payload = {
    "event": "charge.paid",
    "data": {
        "id": "pix_test_0019",  # << mude para um NOVO id
        "email": "guilhermegodoibarreiros@gmail.com",   # << seu Gmail
        "plan_code": "mensal",
        "metadata": {"plan_code": "mensal"},
        "customer": {"email": "guilhermegodoibarreiros@gmail.com", "name": "Teste PIX Gmail"}
    }
}

body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
signature = hmac.new(SECRET.encode(), body, hashlib.sha256).hexdigest()

headers = {
    "Content-Type": "application/json",
    "X-ABACATEPAY-SIGNATURE": signature,
}

r = requests.post(WEBHOOK_URL, data=body, headers=headers, timeout=20)
print(r.status_code, r.text)
