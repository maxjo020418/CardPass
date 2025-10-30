from __future__ import annotations

from datetime import datetime
from typing import Generic, Iterable, List, Optional, Sequence, TypeVar

from pydantic import BaseModel, Field

T = TypeVar("T")


class Pagination(BaseModel):
    page: int = Field(ge=1)
    page_size: int = Field(ge=1)
    total: int = Field(ge=0)


class PaginatedResponse(BaseModel, Generic[T]):
    items: Sequence[T]
    pagination: Pagination


class TimestampedModel(BaseModel):
    id: str
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True


class MessageResponse(BaseModel):
    message: str


class HealthResponse(BaseModel):
    status: str
    timestamp: datetime
