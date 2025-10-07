web: bash -lc "npm ci && npm run build && python manage.py collectstatic --noinput && python manage.py migrate && gunicorn setup.wsgi:application --bind 0.0.0.0:$PORT"
