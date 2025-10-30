from __future__ import annotations

from datetime import datetime
from typing import List, Optional

from pydantic import BaseModel, Field

from cardpass.models.user import JobStatus, JobVisibility


class JobBase(BaseModel):
    title: str = Field(max_length=255)
    description: str = Field(max_length=4000)
    tags: Optional[List[str]] = Field(default=None)
    status: JobStatus = Field(default=JobStatus.draft)
    visibility: JobVisibility = Field(default=JobVisibility.public)


class JobCreateRequest(JobBase):
    status: JobStatus = Field(default=JobStatus.draft)


class JobUpdateRequest(BaseModel):
    title: Optional[str] = Field(default=None, max_length=255)
    description: Optional[str] = Field(default=None, max_length=4000)
    tags: Optional[List[str]] = Field(default=None)
    status: Optional[JobStatus] = None
    visibility: Optional[JobVisibility] = None


class JobSummary(JobBase):
    id: str
    owner_id: str = Field(alias="user_id")
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True
        populate_by_name = True


class JobDetail(JobSummary):
    pass


class JobListParams(BaseModel):
    q: Optional[str] = None
    tags: Optional[List[str]] = None
    owner: Optional[str] = None
    status: Optional[JobStatus] = None
    page: int = Field(default=1, ge=1)
    page_size: int = Field(default=20, ge=1, le=100)
    sort: Optional[str] = Field(default=None, description="comma separated sort keys e.g. -created_at")
