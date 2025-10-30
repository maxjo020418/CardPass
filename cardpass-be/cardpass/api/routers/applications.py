from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, Query
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.core.security import get_current_user, require_roles
from cardpass.db.session import get_session
from cardpass.models.user import ApplicationStatus, RoleType, User
from cardpass.schemas.application import (
    ApplicationCreateRequest,
    ApplicationSummary,
    ApplicationUpdateRequest,
)
from cardpass.schemas.common import PaginatedResponse, Pagination
from cardpass.services.applications import (
    create_application,
    get_application_or_404,
    list_job_applications,
    list_my_applications,
    update_application,
)
from cardpass.services.jobs import get_job_or_404

router = APIRouter(tags=["applications"])
ApplicationListResponse = PaginatedResponse[ApplicationSummary]


@router.post("/jobs/{job_id}/apply", response_model=ApplicationSummary)
async def apply_to_job(
    job_id: uuid.UUID,
    payload: ApplicationCreateRequest,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> ApplicationSummary:
    job = await get_job_or_404(session, job_id)
    application = await create_application(session, job, user, payload)
    return ApplicationSummary.model_validate(application, from_attributes=True)


@router.get("/applications/my", response_model=ApplicationListResponse)
async def my_applications(
    status_filter: ApplicationStatus | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> ApplicationListResponse:
    records, total = await list_my_applications(session, user, status_filter, page, page_size)
    items = [ApplicationSummary.model_validate(record, from_attributes=True) for record in records]
    pagination = Pagination(page=page, page_size=page_size, total=total)
    return ApplicationListResponse(items=items, pagination=pagination)


@router.get("/jobs/{job_id}/applications", response_model=ApplicationListResponse)
async def job_applications(
    job_id: uuid.UUID,
    status_filter: ApplicationStatus | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    recruiter: User = Depends(require_roles(RoleType.recruiter)),
    session: AsyncSession = Depends(get_session),
) -> ApplicationListResponse:
    job = await get_job_or_404(session, job_id)
    records, total = await list_job_applications(session, job, recruiter, status_filter, page, page_size)
    items = [ApplicationSummary.model_validate(record, from_attributes=True) for record in records]
    pagination = Pagination(page=page, page_size=page_size, total=total)
    return ApplicationListResponse(items=items, pagination=pagination)


@router.put("/applications/{application_id}", response_model=ApplicationSummary)
async def update_application_status(
    application_id: uuid.UUID,
    payload: ApplicationUpdateRequest,
    recruiter: User = Depends(require_roles(RoleType.recruiter)),
    session: AsyncSession = Depends(get_session),
) -> ApplicationSummary:
    application = await get_application_or_404(session, application_id)
    application = await update_application(session, application, recruiter, payload)
    return ApplicationSummary.model_validate(application, from_attributes=True)
