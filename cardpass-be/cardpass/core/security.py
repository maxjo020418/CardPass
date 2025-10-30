from __future__ import annotations

import uuid
from datetime import datetime, timezone

from fastapi import Depends, HTTPException, status
from fastapi.security import HTTPAuthorizationCredentials, HTTPBearer
from jose import JWTError, jwt
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.config.settings import settings
from cardpass.db.session import get_session
from cardpass.models.user import RoleType, User

bearer_scheme = HTTPBearer(auto_error=False)


async def _resolve_user(
    credentials: HTTPAuthorizationCredentials | None,
    session: AsyncSession,
    optional: bool = False,
) -> User | None:
    if credentials is None or credentials.scheme.lower() != "bearer":
        if optional:
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Missing credentials")

    token = credentials.credentials
    try:
        payload = jwt.decode(token, settings.jwt_secret, algorithms=["HS256"])
    except JWTError as exc:
        if optional:
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token") from exc

    user_id = payload.get("sub")
    if user_id is None:
        if optional:
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token subject")

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError as exc:
        if optional:
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid user identifier") from exc

    user = await session.get(User, user_uuid)
    if user is None:
        if optional:
            return None
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="User not found")

    await session.refresh(user, attribute_names=["roles", "profile"])
    return user


async def get_current_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User:
    user = await _resolve_user(credentials, session, optional=False)
    assert user is not None
    return user


def require_roles(*roles: RoleType):
    async def dependency(user: User = Depends(get_current_user)) -> User:
        user_roles = {role.role for role in user.roles}
        if not user_roles.intersection(set(roles)):
            raise HTTPException(status_code=status.HTTP_403_FORBIDDEN, detail="Insufficient role")
        return user

    return dependency


async def get_optional_user(
    credentials: HTTPAuthorizationCredentials | None = Depends(bearer_scheme),
    session: AsyncSession = Depends(get_session),
) -> User | None:
    return await _resolve_user(credentials, session, optional=True)
