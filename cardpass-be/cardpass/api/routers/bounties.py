from __future__ import annotations

import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.core.security import get_current_user, require_roles
from cardpass.db.session import get_session
from cardpass.models.user import RoleType, User
from cardpass.schemas.bounty import BountyCreateRequest, BountySummary
from cardpass.services.bounties import create_bounty, get_bounty_or_404
from cardpass.services.jobs import get_job_or_404

router = APIRouter(prefix="/bounties", tags=["bounties"])


@router.post("/{job_id}/create", response_model=BountySummary)
async def create_bounty_endpoint(
    job_id: uuid.UUID,
    payload: BountyCreateRequest,
    recruiter: User = Depends(require_roles(RoleType.recruiter)),
    session: AsyncSession = Depends(get_session),
) -> BountySummary:
    job = await get_job_or_404(session, job_id)
    bounty = await create_bounty(session, job, recruiter, payload)
    return BountySummary.model_validate(bounty, from_attributes=True)


@router.get("/{bounty_id}", response_model=BountySummary)
async def get_bounty_endpoint(
    bounty_id: uuid.UUID,
    user: User = Depends(get_current_user),
    session: AsyncSession = Depends(get_session),
) -> BountySummary:
    bounty = await get_bounty_or_404(session, bounty_id)
    job = await get_job_or_404(session, bounty.job_id)
    if job.user_id != user.id and not any(role.role == RoleType.recruiter for role in user.roles):
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Forbidden")
    return BountySummary.model_validate(bounty, from_attributes=True)
