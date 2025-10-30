from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter

from cardpass.schemas.common import HealthResponse

router = APIRouter(tags=["health"])


@router.get("/healthz", response_model=HealthResponse)
async def healthcheck() -> HealthResponse:
    return HealthResponse(status="ok", timestamp=datetime.now(timezone.utc))
