FROM python:3.11.0-alpine

WORKDIR /app

COPY ./backend/requirements.txt /app/requirements.txt

RUN set -eux \
    && apk add --no-cache --virtual .build-deps build-base \
         openssl-dev libffi-dev gcc musl-dev python3-dev \
         postgresql-dev libc-dev bash \
    && pip install --upgrade pip setuptools wheel

RUN pip install -r requirements.txt \
    && rm -rf /root/.cache/pip

CMD ["python", "/app/src/main.py"]