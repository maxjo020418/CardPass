# CardPass Backend

## Requirements

- Python 3.11+
- PostgreSQL 14+
- `uv` (optional) or your preferred virtual environment tooling

## Installation

```bash
python -m venv .venv
source .venv/bin/activate
pip install --upgrade pip
pip install -e .
```

The project uses [uv](https://docs.astral.sh/uv/) lockfiles. If you have `uv` installed:

```bash
uv sync
```

## Configuration

Environment variables (prefixed with `CARDPASS_`) drive runtime behaviour. The most important ones are:

| Variable | Description | Default |
| --- | --- | --- |
| `CARDPASS_DATABASE_URL` | Async SQLAlchemy URL | `postgresql+asyncpg://postgres:postgres@localhost:5432/cardpass` |
| `CARDPASS_JWT_SECRET` | Symmetric signing key for access tokens | `super-secret-change-me` |
| `CARDPASS_ACCESS_TTL_MIN` | Access token lifetime in minutes | `15` |
| `CARDPASS_REFRESH_TTL_DAYS` | Refresh token lifetime in days | `14` |
| `CARDPASS_DOMAIN` | Domain baked into Phantom challenge messages | `localhost` |
| `CARDPASS_WEBHOOK_SECRET` | Shared secret for `/webhooks/solana` | `change-me` |
| `CARDPASS_CORS_ORIGINS` | JSON list of allowed origins | `[]` |
| `CARDPASS_RATE_LIMIT_PER_MINUTE` | Requests/minute per scope for the in-memory limiter | `30` |

Yank these defaults in production and generate fresh credentials.

## Database

Create the schema with Alembic:

```bash
alembic upgrade head
```

Generate new migrations as models evolve:

```bash
alembic revision --autogenerate -m "describe change"
```

## Running the API

```bash
uvicorn cardpass.main:app --reload
```

Key routes:

- `POST /auth/challenge` – issue Phantom login message
- `POST /auth/verify` – verify signature, mint tokens
- `GET /me` / `PUT /profiles/me` – manage profile data
- `POST /jobs`, `PUT /jobs/{id}` – recruiter job management
- `POST /jobs/{id}/apply` – applicant submissions
- `POST /bounties/{job_id}/create` – off-chain bounty record
- `POST /webhooks/solana` – ingest program events (expects `X-Webhook-Secret` header)
