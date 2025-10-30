from __future__ import annotations

import uuid
from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.models.user import Bounty, BountyStatus, Job, RoleType, User
from cardpass.schemas.bounty import BountyCreateRequest
from cardpass.services.jobs import ensure_recruiter


async def create_bounty(session: AsyncSession, job: Job, recruiter: User, payload: BountyCreateRequest) -> Bounty:
    if job.user_id != recruiter.id:
        raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Not job owner")
    await ensure_recruiter(recruiter)

    bounty = Bounty(
        job_id=job.id,
        amount_lamports=payload.amount_lamports,
        vault_address=payload.vault_address,
        status=BountyStatus.pending_funding,
    )
    session.add(bounty)
    await session.commit()
    await session.refresh(bounty)
    return bounty


async def get_bounty_or_404(session: AsyncSession, bounty_id: uuid.UUID) -> Bounty:
    stmt = select(Bounty).where(Bounty.id == bounty_id)
    record = (await session.execute(stmt)).scalar_one_or_none()
    if record is None:
        raise HTTPException(status_code=status.HTTP_404_NOT_FOUND, detail="Bounty not found")
    return record


async def list_job_bounties(session: AsyncSession, job: Job) -> list[Bounty]:
    stmt = select(Bounty).where(Bounty.job_id == job.id).order_by(Bounty.created_at.desc())
    return (await session.execute(stmt)).scalars().all()


async def update_bounty_state(session: AsyncSession, bounty: Bounty, status_value: BountyStatus, tx_sig: str | None) -> Bounty:
    bounty.status = status_value
    if tx_sig:
        bounty.last_tx_sig = tx_sig
    await session.commit()
    await session.refresh(bounty)
    return bounty
