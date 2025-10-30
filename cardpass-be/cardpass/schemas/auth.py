from __future__ import annotations

from pydantic import BaseModel, Field


class AuthChallengeRequest(BaseModel):
    wallet_pubkey: str = Field(max_length=128)


class AuthChallengeResponse(BaseModel):
    message: str


class AuthVerifyRequest(BaseModel):
    wallet_pubkey: str = Field(max_length=128)
    signed_message: str
    signature: str


class TokenResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"


class LogoutResponse(BaseModel):
    detail: str
