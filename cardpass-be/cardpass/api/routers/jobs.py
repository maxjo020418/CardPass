from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.core.security import get_optional_user, require_roles
from cardpass.db.session import get_session
from cardpass.models.user import JobStatus, JobVisibility, RoleType, User
from cardpass.schemas.bounty import BountySummary
from cardpass.schemas.common import PaginatedResponse, Pagination
from cardpass.schemas.job import JobCreateRequest, JobDetail, JobListParams, JobSummary, JobUpdateRequest
from cardpass.services.bounties import list_job_bounties
from cardpass.services.jobs import create_job, get_job_or_404, list_jobs, update_job

router = APIRouter(prefix="/jobs", tags=["jobs"])
JobListResponse = PaginatedResponse[JobSummary]


@router.post("", response_model=JobDetail, status_code=status.HTTP_201_CREATED)
async def create_job_endpoint(
    payload: JobCreateRequest,
    user: User = Depends(require_roles(RoleType.recruiter)),
    session: AsyncSession = Depends(get_session),
) -> JobDetail:
    job = await create_job(session, user, payload)
    return JobDetail.model_validate(job, from_attributes=True)


@router.get("", response_model=JobListResponse)
async def list_jobs_endpoint(
    q: str | None = Query(default=None),
    tags: list[str] | None = Query(default=None),
    owner: str | None = Query(default=None),
    status_filter: str | None = Query(default=None, alias="status"),
    page: int = Query(default=1, ge=1),
    page_size: int = Query(default=20, ge=1, le=100),
    sort: str | None = Query(default=None),
    session: AsyncSession = Depends(get_session),
) -> JobListResponse:
    try:
        status_value = JobStatus(status_filter) if status_filter else None
    except ValueError:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid status filter")
    params = JobListParams(
        q=q,
        tags=tags,
        owner=owner,
        status=status_value,
        page=page,
        page_size=page_size,
        sort=sort,
    )
    jobs, total = await list_jobs(session, params)
    items = [JobSummary.model_validate(job, from_attributes=True) for job in jobs]
    pagination = Pagination(page=page, page_size=page_size, total=total)
    return JobListResponse(items=items, pagination=pagination)


@router.get("/{job_id}", response_model=JobDetail)
async def get_job_endpoint(
    job_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
    user: User | None = Depends(get_optional_user),
) -> JobDetail:
    job = await get_job_or_404(session, job_id)
    if job.visibility == JobVisibility.unlisted:
        if user is None or job.user_id != user.id:
            raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return JobDetail.model_validate(job, from_attributes=True)


@router.put("/{job_id}", response_model=JobDetail)
async def update_job_endpoint(
    job_id: uuid.UUID,
    payload: JobUpdateRequest,
    user: User = Depends(require_roles(RoleType.recruiter)),
    session: AsyncSession = Depends(get_session),
) -> JobDetail:
    job = await get_job_or_404(session, job_id)
    job = await update_job(session, user, job, payload)
    return JobDetail.model_validate(job, from_attributes=True)


@router.get("/{job_id}/bounties", response_model=list[BountySummary])
async def list_job_bounties_endpoint(
    job_id: uuid.UUID,
    session: AsyncSession = Depends(get_session),
) -> list[BountySummary]:
    job = await get_job_or_404(session, job_id)
    bounties = await list_job_bounties(session, job)
    return [BountySummary.model_validate(item, from_attributes=True) for item in bounties]
