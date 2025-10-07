web: bash -lc "/app/.venv/bin/python manage.py collectstatic --noinput && /app/.venv/bin/python manage.py migrate && /app/.venv/bin/gunicorn setup.wsgi:application --bind 0.0.0.0:$PORT"
