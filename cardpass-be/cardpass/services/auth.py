from __future__ import annotations

import base64
import hashlib
import secrets
import uuid
from datetime import datetime, timedelta, timezone
from typing import Tuple

from fastapi import HTTPException, status
from jose import jwt
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.config.settings import settings
from cardpass.models.user import Nonce, RefreshToken, RoleType, User, UserRole
from cardpass.schemas.auth import AuthVerifyRequest
from cardpass.utils.solana import SignatureVerificationError, verify_signature

ACCESS_ALGORITHM = "HS256"


def _generate_nonce() -> str:
    return secrets.token_urlsafe(32)


def _challenge_message(wallet_pubkey: str, nonce: str, issued_at: datetime, expires_at: datetime) -> str:
    parts = [
        settings.challenge_message_prefix,
        "",
        f"Domain: {settings.domain}",
        f"Wallet: {wallet_pubkey}",
        f"Nonce: {nonce}",
        f"Issued At: {issued_at.isoformat()}",
        f"Expiration Time: {expires_at.isoformat()}",
    ]
    return "\n".join(parts)


def _hash_token(value: str) -> bytes:
    return hashlib.sha256(value.encode("utf-8")).digest()


def _decode_signed_message(message_b64: str) -> str:
    try:
        decoded = base64.b64decode(message_b64)
    except Exception as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid signed message encoding") from exc
    try:
        return decoded.decode("utf-8")
    except UnicodeDecodeError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Signed message must be utf-8") from exc


def _parse_message(message: str) -> Tuple[str, str, datetime, datetime]:
    lines = [line.strip() for line in message.splitlines() if line.strip()]
    expected_prefix = settings.challenge_message_prefix.strip()
    if not lines or lines[0] != expected_prefix:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid challenge message prefix")

    attrs = {}
    for line in lines[1:]:
        if ":" not in line:
            continue
        key, value = line.split(":", 1)
        attrs[key.strip().lower()] = value.strip()

    domain = attrs.get("domain")
    wallet = attrs.get("wallet")
    nonce = attrs.get("nonce")
    issued_at_raw = attrs.get("issued at")
    expires_at_raw = attrs.get("expiration time")

    if not all([domain, wallet, nonce, issued_at_raw, expires_at_raw]):
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge message missing fields")

    if domain != settings.domain:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Domain mismatch")

    try:
        issued_at = datetime.fromisoformat(issued_at_raw)
        expires_at = datetime.fromisoformat(expires_at_raw)
    except ValueError as exc:
        raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid challenge timestamps") from exc

    return wallet, nonce, issued_at, expires_at


def _create_access_token(user: User) -> str:
    now = datetime.now(timezone.utc)
    payload = {
        "sub": str(user.id),
        "wallet": user.wallet_pubkey,
        "roles": [role.role.value for role in user.roles],
        "iat": int(now.timestamp()),
        "exp": int((now + timedelta(minutes=settings.access_ttl_minutes)).timestamp()),
    }
    return jwt.encode(payload, settings.jwt_secret, algorithm=ACCESS_ALGORITHM)


def _create_refresh_token(user: User) -> Tuple[str, datetime]:
    token_value = secrets.token_urlsafe(48)
    expires_at = datetime.now(timezone.utc) + timedelta(days=settings.refresh_ttl_days)
    return token_value, expires_at


class AuthService:
    def __init__(self, session: AsyncSession):
        self.session = session

    async def create_challenge(self, wallet_pubkey: str) -> str:
        issued_at = datetime.now(timezone.utc)
        expires_at = issued_at + timedelta(seconds=settings.challenge_ttl_seconds)
        nonce = _generate_nonce()
        message = _challenge_message(wallet_pubkey, nonce, issued_at, expires_at)

        challenge = Nonce(
            wallet_pubkey=wallet_pubkey,
            nonce_b64u=nonce,
            expires_at=expires_at,
        )
        self.session.add(challenge)
        try:
            await self.session.commit()
        except IntegrityError:
            await self.session.rollback()
            # retry with new nonce in the unlikely event of collision
            return await self.create_challenge(wallet_pubkey)

        return message

    async def verify_login(self, payload: AuthVerifyRequest) -> Tuple[str, str, datetime, User]:
        message = _decode_signed_message(payload.signed_message)
        wallet_in_message, nonce, issued_at, expires_at = _parse_message(message)

        if wallet_in_message != payload.wallet_pubkey:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Wallet mismatch in message")

        if expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Challenge expired")

        stmt = select(Nonce).where(Nonce.nonce_b64u == nonce)
        result = await self.session.execute(stmt)
        nonce_row = result.scalar_one_or_none()
        if not nonce_row or nonce_row.used or nonce_row.expires_at < datetime.now(timezone.utc):
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail="Invalid or expired nonce")

        try:
            verify_signature(message.encode("utf-8"), payload.signature, payload.wallet_pubkey)
        except SignatureVerificationError as exc:
            raise HTTPException(status_code=status.HTTP_400_BAD_REQUEST, detail=str(exc)) from exc

        nonce_row.used = True
        await self.session.flush()

        user_stmt = select(User).where(User.wallet_pubkey == payload.wallet_pubkey)
        user = (await self.session.execute(user_stmt)).scalar_one_or_none()
        if user is None:
            user = User(wallet_pubkey=payload.wallet_pubkey)
            self.session.add(user)
            await self.session.flush()
            # Bootstrap applicant role by default
            role = UserRole(user_id=user.id, role=RoleType.applicant)
            self.session.add(role)
        else:
            user.last_login_at = datetime.now(timezone.utc)

        await self._ensure_profile(user)
        await self.session.flush()
        await self.session.refresh(user, attribute_names=["roles", "profile"])

        access_token = _create_access_token(user)
        refresh_token_value, refresh_expires = _create_refresh_token(user)
        hashed = _hash_token(refresh_token_value)
        refresh = RefreshToken(user_id=user.id, token_hash=hashed, expires_at=refresh_expires)
        self.session.add(refresh)
        user.last_login_at = datetime.now(timezone.utc)
        await self.session.commit()
        await self.session.refresh(user, attribute_names=["roles", "profile"])

        return access_token, refresh_token_value, refresh_expires, user

    async def rotate_refresh_token(self, token_value: str, user: User, refresh_record: RefreshToken) -> Tuple[str, str, datetime]:
        refresh_record.revoked = True

        new_token_value, expires_at = _create_refresh_token(user)
        new_refresh = RefreshToken(
            user_id=user.id,
            token_hash=_hash_token(new_token_value),
            expires_at=expires_at,
        )
        self.session.add(new_refresh)
        await self.session.commit()
        return _create_access_token(user), new_token_value, expires_at

    async def revoke_refresh_token(self, refresh_record: RefreshToken) -> None:
        if refresh_record.revoked:
            return
        refresh_record.revoked = True
        await self.session.commit()

    async def _ensure_profile(self, user: User) -> None:
        if user.profile is not None:
            return
        from cardpass.models.user import Profile  # Local import to avoid circular

        profile = Profile(user_id=user.id)
        self.session.add(profile)
        await self.session.flush()


async def get_refresh_token(session: AsyncSession, token_value: str) -> RefreshToken | None:
    hashed = _hash_token(token_value)
    stmt = select(RefreshToken).where(RefreshToken.token_hash == hashed)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()


import uuid
...
async def get_user_by_id(session: AsyncSession, user_id: uuid.UUID) -> User | None:
    stmt = select(User).where(User.id == user_id)
    result = await session.execute(stmt)
    return result.scalar_one_or_none()
