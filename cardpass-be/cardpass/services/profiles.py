from __future__ import annotations

from fastapi import HTTPException, status
from sqlalchemy import select
from sqlalchemy.ext.asyncio import AsyncSession

from cardpass.models.user import Profile, User
from cardpass.schemas.user import ProfileUpdateRequest


async def get_profile_by_user(session: AsyncSession, user: User) -> Profile:
    if user.profile is not None:
        return user.profile
    stmt = select(Profile).where(Profile.user_id == user.id)
    result = await session.execute(stmt)
    profile = result.scalar_one_or_none()
    if profile is None:
        profile = Profile(user_id=user.id)
        session.add(profile)
        await session.commit()
        await session.refresh(profile)
    return profile


async def update_profile(session: AsyncSession, user: User, data: ProfileUpdateRequest) -> Profile:
    profile = await get_profile_by_user(session, user)
    for field, value in data.model_dump(exclude_unset=True).items():
        setattr(profile, field, value)
    await session.commit()
    await session.refresh(profile)
    return profile
