from __future__ import annotations

from fastapi import APIRouter, Depends, Request
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.db.session import get_session
from cardpass.schemas.webhook import SolanaWebhookEvent, WebhookResponse
from cardpass.services.webhooks import handle_solana_event, verify_webhook_secret

router = APIRouter(prefix="/webhooks", tags=["webhooks"])


@router.post("/solana", response_model=WebhookResponse)
async def solana_webhook(
    event: SolanaWebhookEvent,
    request: Request,
    session: AsyncSession = Depends(get_session),
) -> WebhookResponse:
    verify_webhook_secret(request)
    await handle_solana_event(session, event)
    return WebhookResponse()
