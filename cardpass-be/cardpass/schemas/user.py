from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from cardpass.models.user import RoleType


class UserSummary(BaseModel):
    id: str
    wallet_pubkey: str
    roles: List[RoleType]

    class Config:
        from_attributes = True


class MeResponse(UserSummary):
    created_at: datetime
    last_login_at: Optional[datetime] = None
    profile_summary: Optional["ProfileDetail"] = None


class ProfileUpdateRequest(BaseModel):
    display_name: Optional[str] = Field(default=None, max_length=120)
    links: Optional[dict] = Field(default=None)
    skills: Optional[List[str]] = Field(default=None)
    resume_url: Optional[str] = Field(default=None, max_length=512)


class ProfileDetail(ProfileUpdateRequest):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


MeResponse.model_rebuild()
