SHELL := /bin/bash

VENV_DIR := .venv
VENV_BIN := $(VENV_DIR)/bin
ENV_FILE := .env.local

.PHONY: help venv deps db-up db-down db-logs migrate run dev compose-up compose-down

help:
	@echo "Targets:"
	@echo "  venv         - create Python venv"
	@echo "  deps         - install Python deps into venv"
	@echo "  db-up        - start local Postgres (docker)"
	@echo "  db-down      - stop and remove Postgres container"
	@echo "  db-logs      - follow Postgres logs"
	@echo "  migrate      - run Alembic migrations"
	@echo "  run          - run FastAPI with uvicorn (uses .env.local if present)"
	@echo "  dev          - venv + deps + db-up + migrate + run"
	@echo "  compose-up   - start test-deploy docker-compose (backend+db+s3)"
	@echo "  compose-down - stop test-deploy docker-compose"

venv:
	python3 -m venv $(VENV_DIR)

deps: venv
	$(VENV_BIN)/pip install --upgrade pip
	$(VENV_BIN)/pip install -r requirements.txt

# Start Postgres for local dev
db-up:
	@docker start cardpass-pg >/dev/null 2>&1 || \
		docker run --name cardpass-pg -e POSTGRES_DB=app -e POSTGRES_USER=app -e POSTGRES_PASSWORD=app \
		-p 5432:5432 -d postgres:16
	@echo "Postgres running on localhost:5432 (db=app user=app pass=app)"

db-down:
	-@docker stop cardpass-pg >/dev/null 2>&1 || true
	-@docker rm cardpass-pg >/dev/null 2>&1 || true

db-logs:
	@docker logs -f cardpass-pg

migrate:
	$(VENV_BIN)/alembic upgrade head

# Source .env.local if present, then run uvicorn
run:
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	PORT="$${PORT:-8000}"; \
	$(VENV_BIN)/uvicorn app.main:app --reload --host 0.0.0.0 --port $$PORT

# Full local dev workflow
dev: deps db-up
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	: $${DATABASE_URL:=postgresql+asyncpg://app:app@localhost:5432/app}; \
	: $${JWT_COOKIE_SECURE:=false}; \
	: $${JWT_COOKIE_SAMESITE:=lax}; \
	$(VENV_BIN)/alembic upgrade head
	@$(MAKE) run

# Optional: use provided docker-compose to run everything in containers
compose-up:
	docker compose -f environments/test-deploy-container/docker-compose.yaml up -d

compose-down:
	docker compose -f environments/test-deploy-container/docker-compose.yaml down -v

