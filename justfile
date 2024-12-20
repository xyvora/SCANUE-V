@_default:
  just --list

@lint:
  echo mypy
  just --justfile {{justfile()}} mypy
  echo ruff-check
  just --justfile {{justfile()}} ruff-check
  echo ruff-format
  just --justfile {{justfile()}} ruff-format

@mypy:
  cd backend && \
  uv run mypy app tests

@ruff-check:
  cd backend && \
  uv run ruff check app tests

@ruff-format:
  cd backend && \
  uv run ruff format app tests

@ruff-format-ci:
  cd backend && \
  uv run ruff format app tests --check

@backend-test *args="":
  -cd backend && \
  uv run pytest {{args}}

@backend-lock:
  cd backend && \
  uv lock

@backend-lock-upgrade:
  cd backend && \
  uv lock --upgrade

@backend-install:
  cd backend && \
  uv sync --frozen --all-extras

@backend-server:
  cd backend && \
  uv run uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload

@docker-up:
  docker compose up

@docker-up-detached:
  docker compose up -d

@docker-down:
  docker compose down

@docker-down-volumes:
  docker compose down --volumes

@docker-build-backend:
  cd backend && \
  docker build -t scanue-v .
