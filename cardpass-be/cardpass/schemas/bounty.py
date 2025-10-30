from __future__ import annotations

from datetime import datetime
from typing import Optional

from pydantic import BaseModel, Field

from cardpass.models.user import BountyStatus


class BountyCreateRequest(BaseModel):
    amount_lamports: int = Field(ge=1)
    vault_address: Optional[str] = Field(default=None, max_length=255)
    program_ids: Optional[list[str]] = Field(default=None)


class BountySummary(BaseModel):
    id: str
    job_id: str
    amount_lamports: int
    vault_address: Optional[str]
    status: BountyStatus
    last_tx_sig: Optional[str]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
