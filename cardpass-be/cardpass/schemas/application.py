from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from cardpass.models.user import ApplicationStatus


class Attachment(BaseModel):
    name: str = Field(max_length=255)
    url: str = Field(max_length=512)
    content_type: Optional[str] = Field(default=None, max_length=120)


class ApplicationCreateRequest(BaseModel):
    cover_letter: Optional[str] = Field(default=None, max_length=4000)
    attachments: Optional[List[Attachment]] = Field(default=None)


class ApplicationUpdateRequest(BaseModel):
    status: ApplicationStatus
    notes: Optional[str] = Field(default=None, max_length=4000)


class ApplicationSummary(BaseModel):
    id: str
    job_id: str
    applicant_id: str
    status: ApplicationStatus
    notes: Optional[str]
    cover_letter: Optional[str]
    attachments: Optional[List[Attachment]]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
