# mock_abacate_webhook.py
import json, hmac, hashlib, base64, requests

WEBHOOK_URL = "https://sleepypeepy.site/billing/webhooks/abacatepay"

# ATENÇÃO: use A MESMA chave que está no Railway (ABACATEPAY_WEBHOOK_SECRET)
SECRET = "COLOQUE_AQUI_O_MESMO_ABACATEPAY_WEBHOOK_SECRET_DO_SERVIDOR"

payload = {
    "event": "charge.paid",
    "data": {
        "id": "pix_test_0103",  # mude SEMPRE para um id novo
        "email": "guilhermegodoibarreiros@gmail.com",
        "plan_code": "mensal",
        "metadata": {"plan_code": "mensal"},
        "customer": {
            "email": "guilhermegodoibarreiros@gmail.com",
            "name": "Teste PIX Gmail"
        }
    }
}

body = json.dumps(payload, separators=(",", ":")).encode("utf-8")
digest = hmac.new(SECRET.encode(), body, hashlib.sha256).digest()
sig_hex = digest.hex()
sig_b64 = base64.b64encode(digest).decode()

tests = [
    ("X-ABACATEPAY-SIGNATURE", sig_hex),
    ("X-ABACATEPAY-SIGNATURE", sig_b64),
    ("X-Webhook-Signature",    sig_b64),
]

for header_name, sig in tests:
    headers = {"Content-Type": "application/json", header_name: sig}
    r = requests.post(WEBHOOK_URL, data=body, headers=headers, timeout=20)
    print(f"{header_name} => {r.status_code} {r.text}")
