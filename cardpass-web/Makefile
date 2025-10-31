SHELL := /bin/bash

ENV_FILE := .env.local

.PHONY: help install dev build start

help:
	@echo "Targets:"
	@echo "  install - pnpm install"
	@echo "  dev     - start dev server (uses .env.local if present)"
	@echo "  build   - production build"
	@echo "  start   - start production server"

install:
	pnpm install

dev: install
	@set -a; [ -f $(ENV_FILE) ] && . ./$(ENV_FILE); set +a; \
	VITE_API_URL="$${VITE_API_URL:-http://localhost:8000}" pnpm dev

build: install
	pnpm build

start:
	pnpm start

