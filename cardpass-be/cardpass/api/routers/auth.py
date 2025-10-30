from __future__ import annotations

from datetime import datetime, timezone

from fastapi import APIRouter, Depends, HTTPException, Request, Response, status

from cardpass.config.settings import settings
from cardpass.core.rate_limit import rate_limit_dependency
from cardpass.db.session import get_session
from cardpass.schemas.auth import (
    AuthChallengeRequest,
    AuthChallengeResponse,
    AuthVerifyRequest,
    LogoutResponse,
    TokenResponse,
)
from cardpass.services.auth import AuthService, get_refresh_token, get_user_by_id

router = APIRouter(prefix="/auth", tags=["auth"])


REFRESH_SCOPE = "auth_refresh"
CHALLENGE_SCOPE = "auth_challenge"
VERIFY_SCOPE = "auth_verify"
LOGOUT_SCOPE = "auth_logout"


async def _set_refresh_cookie(response: Response, token_value: str, expires_at: datetime) -> None:
    max_age = int((expires_at - datetime.now(timezone.utc)).total_seconds())
    response.set_cookie(
        key=settings.refresh_cookie_name,
        value=token_value,
        httponly=True,
        secure=settings.environment not in {"local", "test"},
        samesite="lax",
        max_age=max_age,
        expires=max_age,
        path="/auth",
    )


async def _extract_refresh_cookie(request: Request) -> str:
    token = request.cookies.get(settings.refresh_cookie_name)
    if not token:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing refresh token")
    return token


@router.post(
    "/challenge",
    response_model=AuthChallengeResponse,
)
async def create_challenge(
    payload: AuthChallengeRequest,
    session=Depends(get_session),
    _: None = Depends(rate_limit_dependency(CHALLENGE_SCOPE)),
):
    service = AuthService(session)
    message = await service.create_challenge(payload.wallet_pubkey)
    return AuthChallengeResponse(message=message)


@router.post(
    "/verify",
    response_model=TokenResponse,
)
async def verify_challenge(
    payload: AuthVerifyRequest,
    response: Response,
    session=Depends(get_session),
    _: None = Depends(rate_limit_dependency(VERIFY_SCOPE)),
):
    service = AuthService(session)
    access_token, refresh_token, refresh_expires, user = await service.verify_login(payload)
    await _set_refresh_cookie(response, refresh_token, refresh_expires)
    return TokenResponse(access_token=access_token)


@router.post("/refresh", response_model=TokenResponse)
async def refresh_token(
    request: Request,
    response: Response,
    session=Depends(get_session),
    _: None = Depends(rate_limit_dependency(REFRESH_SCOPE)),
):
    token_value = await _extract_refresh_cookie(request)
    refresh_record = await get_refresh_token(session, token_value)
    if refresh_record is None or refresh_record.revoked:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid refresh token")
    if refresh_record.expires_at < datetime.now(timezone.utc):
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Refresh token expired")

    user = await get_user_by_id(session, refresh_record.user_id)
    if user is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    service = AuthService(session)
    access_token, new_refresh_value, expires_at = await service.rotate_refresh_token(token_value, user, refresh_record)
    await _set_refresh_cookie(response, new_refresh_value, expires_at)
    return TokenResponse(access_token=access_token)


@router.post("/logout", response_model=LogoutResponse)
async def logout(
    request: Request,
    response: Response,
    session=Depends(get_session),
    _: None = Depends(rate_limit_dependency(LOGOUT_SCOPE)),
):
    token_value = await _extract_refresh_cookie(request)
    refresh_record = await get_refresh_token(session, token_value)
    if refresh_record is None:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Session not found")

    service = AuthService(session)
    await service.revoke_refresh_token(refresh_record)
    response.delete_cookie(settings.refresh_cookie_name, path="/auth")
    return LogoutResponse(detail="Logged out")
