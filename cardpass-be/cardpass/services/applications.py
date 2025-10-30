from __future__ import annotations

import uuid

from fastapi import HTTPException, status
from sqlalchemy import and_, func, select
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.models.user import Application, ApplicationStatus, Job, JobStatus, RoleType, User
from cardpass.schemas.application import ApplicationCreateRequest, ApplicationUpdateRequest


def _has_role(user: User, role: RoleType) -> bool:
    return any(r.role == role for r in user.roles)


async def create_application(session: AsyncSession, job: Job, applicant: User, payload: ApplicationCreateRequest) -> Application:
    if not _has_role(applicant, RoleType.applicant):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Applicant role required")
    if job.status != JobStatus.open:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Job is not open for applications")
    if job.user_id == applicant.id:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Cannot apply to your own job")

    existing_stmt = select(Application).where(Application.job_id == job.id, Application.applicant_id == applicant.id)
    existing = (await session.execute(existing_stmt)).scalar_one_or_none()
    if existing:
        raise HTTPException(status_code=status.HTTP_409_CONFLICT, detail="Application already exists")

    application = Application(
        job_id=job.id,
        applicant_id=applicant.id,
        cover_letter=payload.cover_letter,
        attachments=[attachment.model_dump() for attachment in payload.attachments] if payload.attachments else None,
    )
    session.add(application)
    await session.commit()
    await session.refresh(application)
    return application


async def list_my_applications(session: AsyncSession, user: User, status_filter: ApplicationStatus | None, page: int, page_size: int):
    stmt = select(Application).where(Application.applicant_id == user.id)
    count_stmt = select(func.count()).select_from(Application).where(Application.applicant_id == user.id)
    if status_filter:
        stmt = stmt.where(Application.status == status_filter)
        count_stmt = count_stmt.where(Application.status == status_filter)

    stmt = stmt.order_by(Application.created_at.desc()).offset((page - 1) * page_size).limit(page_size)

    records = (await session.execute(stmt)).scalars().all()
    total = await session.scalar(count_stmt) or 0
    return records, total


async def list_job_applications(session: AsyncSession, job: Job, recruiter: User, status_filter: ApplicationStatus | None, page: int, page_size: int):
    if job.user_id != recruiter.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not job owner")
    if not _has_role(recruiter, RoleType.recruiter):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter role required")

    stmt = select(Application).where(Application.job_id == job.id)
    count_stmt = select(func.count()).select_from(Application).where(Application.job_id == job.id)
    if status_filter:
        stmt = stmt.where(Application.status == status_filter)
        count_stmt = count_stmt.where(Application.status == status_filter)

    stmt = stmt.order_by(Application.created_at.desc()).offset((page - 1) * page_size).limit(page_size)

    records = (await session.execute(stmt)).scalars().all()
    total = await session.scalar(count_stmt) or 0
    return records, total


async def get_application_or_404(session: AsyncSession, application_id: uuid.UUID) -> Application:
    stmt = select(Application).where(Application.id == application_id)
    record = (await session.execute(stmt)).scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Application not found")
    return record


async def update_application(session: AsyncSession, application: Application, recruiter: User, payload: ApplicationUpdateRequest) -> Application:
    job = await session.get(Job, application.job_id)
    if job is None or job.user_id != recruiter.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not job owner")
    if not _has_role(recruiter, RoleType.recruiter):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Recruiter role required")

    application.status = payload.status
    application.notes = payload.notes
    await session.commit()
    await session.refresh(application)
    return application
