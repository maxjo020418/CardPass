from __future__ import annotations

from datetime import datetime
from typing import Dict, List, Optional

from pydantic import BaseModel, Field


class SolanaWebhookEvent(BaseModel):
    signature: str
    slot: int
    programId: str = Field(alias="programId")
    type: str
    accounts: Dict[str, str] | None = None
    logs: List[str] | None = None
    blockTime: Optional[int] = Field(default=None, alias="blockTime")

    class Config:
        populate_by_name = True


class WebhookResponse(BaseModel):
    ok: bool = True
