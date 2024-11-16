FROM python:3.13-slim-bookworm AS builder

WORKDIR /app

ENV \
  PYTHONUNBUFFERED=true \
  PATH=/root/.cargo/bin:$PATH

RUN : \
  && apt-get update \
  && apt-get install -y --no-install-recommends \
  curl \
  ca-certificates \
  && apt-get clean \
  && rm -rf /var/lib/apt/lists/*

ADD https://astral.sh/uv/install.sh /uv-installer.sh

RUN sh /uv-installer.sh && rm /uv-installer.sh

ENV PATH="/root/.local/bin/:$PATH"

COPY . /app

RUN : \
  && uv venv $VIRTUAL_ENV \
  && uv sync --frozen --no-cache --no-dev --no-install-project

FROM python:3.13-slim-bookworm

WORKDIR /app

ENV PYTHONBUFFERED=true

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/app /app/app
COPY ./scripts/entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

ENV \
  PATH="/app/.venv/bin:$PATH" \
  WORKERS="1" \
  PORT="8000"


EXPOSE 8000

ENTRYPOINT ["./entrypoint.sh"]
