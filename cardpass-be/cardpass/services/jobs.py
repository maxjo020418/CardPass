from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import Select, and_, func, or_, select
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.orm import joinedload

from cardpass.models.user import Job, JobStatus, RoleType, User
from cardpass.schemas.job import JobCreateRequest, JobListParams, JobUpdateRequest


async def ensure_recruiter(user: User) -> None:
    if not any(role.role == RoleType.recruiter for role in user.roles):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter role required")


async def create_job(session: AsyncSession, owner: User, payload: JobCreateRequest) -> Job:
    await ensure_recruiter(owner)
    job = Job(
        user_id=owner.id,
        title=payload.title,
        description=payload.description,
        tags=payload.tags,
        status=payload.status,
        visibility=payload.visibility,
    )
    session.add(job)
    await session.commit()
    await session.refresh(job)
    return job


async def get_job_or_404(session: AsyncSession, job_id: uuid.UUID) -> Job:
    stmt = select(Job).options(joinedload(Job.owner)).where(Job.id == job_id)
    result = await session.execute(stmt)
    job = result.scalar_one_or_none()
    if job is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Job not found")
    return job


def _apply_job_filters(stmt: Select, params: JobListParams) -> Select:
    conditions = []
    if params.status:
        conditions.append(Job.status == params.status)
    if params.owner:
        try:
            owner_uuid = uuid.UUID(params.owner)
            conditions.append(Job.user_id == owner_uuid)
        except ValueError:
            conditions.append(Job.owner.has(func.lower(User.wallet_pubkey) == params.owner.lower()))
    if params.tags:
        conditions.append(Job.tags.contains(params.tags))
    if params.q:
        like = f"%{params.q.lower()}%"
        conditions.append(or_(func.lower(Job.title).like(like), func.lower(Job.description).like(like)))

    if conditions:
        stmt = stmt.where(and_(*conditions))
    return stmt


def _apply_sort(stmt: Select, sort: str | None) -> Select:
    if not sort:
        return stmt.order_by(Job.created_at.desc())
    orderings = []
    for key in sort.split(","):
        key = key.strip()
        if not key:
            continue
        desc = key.startswith("-")
        field = key[1:] if desc else key
        column = getattr(Job, field, None)
        if column is None:
            continue
        orderings.append(column.desc() if desc else column.asc())
    if not orderings:
        orderings.append(Job.created_at.desc())
    return stmt.order_by(*orderings)


async def list_jobs(session: AsyncSession, params: JobListParams):
    base_stmt = select(Job)
    filtered_stmt = _apply_job_filters(base_stmt, params)
    total_stmt = select(func.count()).select_from(filtered_stmt.subquery())

    list_stmt = _apply_sort(filtered_stmt, params.sort)
    list_stmt = list_stmt.offset((params.page - 1) * params.page_size).limit(params.page_size)

    result = await session.execute(list_stmt)
    jobs = result.scalars().all()

    total = await session.scalar(total_stmt) or 0
    return jobs, total


async def update_job(session: AsyncSession, owner: User, job: Job, payload: JobUpdateRequest) -> Job:
    if job.user_id != owner.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Only the owner may update the job")
    await ensure_recruiter(owner)

    for field, value in payload.model_dump(exclude_unset=True).items():
        setattr(job, field, value)
    await session.commit()
    await session.refresh(job)
    return job
