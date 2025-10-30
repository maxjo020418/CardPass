from __future__ import annotations

import hmac
import uuid
from datetime import datetime, timezone
from typing import Optional

from fastapi import HTTPException, Request, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.config.settings import settings
from cardpass.models.user import Application, ApplicationStatus, Bounty, BountyStatus, OnChainEvent
from cardpass.schemas.webhook import SolanaWebhookEvent
from cardpass.services.applications import get_application_or_404
from cardpass.services.bounties import get_bounty_or_404, update_bounty_state


def verify_webhook_secret(request: Request) -> None:
    provided = request.headers.get("x-webhook-secret") or request.headers.get("X-Webhook-Secret")
    if not provided:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing webhook secret")
    expected = settings.webhook_secret
    if not hmac.compare_digest(provided, expected):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid webhook secret")


async def _store_event(session: AsyncSession, event: SolanaWebhookEvent) -> tuple[OnChainEvent, bool]:
    existing_stmt = select(OnChainEvent).where(OnChainEvent.signature == event.signature)
    existing = (await session.execute(existing_stmt)).scalar_one_or_none()
    if existing:
        return existing, False

    seen_at = datetime.now(timezone.utc)
    block_time = datetime.fromtimestamp(event.blockTime, tz=timezone.utc) if event.blockTime else seen_at
    record = OnChainEvent(
        signature=event.signature,
        program_id=event.programId,
        type=event.type,
        payload=event.model_dump(by_alias=True),
        seen_at=block_time,
    )
    session.add(record)
    await session.commit()
    await session.refresh(record)
    return record, True


async def handle_solana_event(session: AsyncSession, event: SolanaWebhookEvent) -> None:
    record, is_new = await _store_event(session, event)
    if not is_new:
        # Already processed
        return

    bounty_id = _extract_uuid(event.accounts, "bounty_id") if event.accounts else None
    application_id = _extract_uuid(event.accounts, "application_id") if event.accounts else None

    if event.type == "VAULT_FUNDED" and bounty_id:
        bounty = await get_bounty_or_404(session, bounty_id)
        await update_bounty_state(session, bounty, BountyStatus.funded, event.signature)
    elif event.type == "VAULT_RELEASED" and bounty_id:
        bounty = await get_bounty_or_404(session, bounty_id)
        await update_bounty_state(session, bounty, BountyStatus.released, event.signature)
        if application_id:
            application = await get_application_or_404(session, application_id)
            application.status = ApplicationStatus.hired
            await session.commit()
    elif event.type == "PAYOUT" and bounty_id:
        bounty = await get_bounty_or_404(session, bounty_id)
        await update_bounty_state(session, bounty, BountyStatus.released, event.signature)
    # If we reach here without specific handling we keep the stored event for manual review


def _extract_uuid(data: Optional[dict], key: str) -> Optional[uuid.UUID]:
    if not data:
        return None
    value = data.get(key) or data.get(key.replace("_", ""))
    if not value:
        return None
    try:
        return uuid.UUID(value)
    except ValueError:
        return None
