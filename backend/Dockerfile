FROM ubuntu:24.04 AS builder

WORKDIR /app

ENV \
  PYTHONUNBUFFERED=true \
  PATH=/root/.cargo/bin:$PATH \
  UV_PYTHON_INSTALL_DIR=/opt/uv/python

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
  && uv venv -p 3.13\
  && uv sync --frozen --no-cache --no-dev --no-install-project

FROM ubuntu:24.04

RUN useradd --create-home appuser

RUN mkdir -p /app && chown appuser:appuser /app

WORKDIR /app

ENV \
  PYTHONUNBUFFERED=true \
  PATH="/app/.venv/bin:$PATH" \
  WORKERS="1" \
  PORT="8000"

COPY --from=builder /app/.venv /app/.venv
COPY --from=builder /app/app /app/app
COPY --from=builder /opt/uv/python /opt/uv/python
COPY ./scripts/entrypoint.sh /app

RUN chmod +x /app/entrypoint.sh

EXPOSE 8000

USER appuser

ENTRYPOINT ["./entrypoint.sh"]
