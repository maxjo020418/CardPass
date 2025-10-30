from __future__ import annotations

from fastapi import APIRouter, Depends

from cardpass.core.security import get_current_user
from cardpass.db.session import get_session
from cardpass.models.user import User
from cardpass.schemas.user import MeResponse, ProfileDetail, ProfileUpdateRequest
from cardpass.services.profiles import update_profile

router = APIRouter(tags=["me"])


@router.get("/me", response_model=MeResponse)
async def read_me(user: User = Depends(get_current_user)) -> MeResponse:
    profile_summary = ProfileDetail.model_validate(user.profile) if user.profile else None
    return MeResponse(
        id=str(user.id),
        wallet_pubkey=user.wallet_pubkey,
        roles=[role.role for role in user.roles],
        created_at=user.created_at,
        last_login_at=user.last_login_at,
        profile_summary=profile_summary,
    )


@router.put("/profiles/me", response_model=ProfileDetail)
async def update_my_profile(
    payload: ProfileUpdateRequest,
    user: User = Depends(get_current_user),
    session=Depends(get_session),
) -> ProfileDetail:
    profile = await update_profile(session, user, payload)
    return ProfileDetail.model_validate(profile)
