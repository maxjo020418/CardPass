from __future__ import annotations

import enum
import uuid
from datetime import datetime
from typing import List, Optional

from sqlalchemy import Boolean, DateTime, Enum, ForeignKey, Index, LargeBinary, String, Text
from sqlalchemy.dialects.postgresql import ARRAY, JSONB, UUID, BIGINT
from sqlalchemy.orm import Mapped, mapped_column, relationship

from cardpass.db.session import Base
from cardpass.models.base import TimestampMixin, UUIDPrimaryKeyMixin


class RoleType(str, enum.Enum):
    recruiter = "recruiter"
    applicant = "applicant"


class JobStatus(str, enum.Enum):
    draft = "draft"
    open = "open"
    closed = "closed"
    archived = "archived"


class JobVisibility(str, enum.Enum):
    public = "public"
    unlisted = "unlisted"


class ApplicationStatus(str, enum.Enum):
    received = "received"
    reviewing = "reviewing"
    interviewed = "interviewed"
    offered = "offered"
    rejected = "rejected"
    hired = "hired"


class BountyStatus(str, enum.Enum):
    pending_funding = "pending_funding"
    funded = "funded"
    in_escrow = "in_escrow"
    released = "released"
    refunded = "refunded"
    failed = "failed"


class User(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "users"

    wallet_pubkey: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    last_login_at: Mapped[Optional[datetime]] = mapped_column(DateTime(timezone=True))

    roles: Mapped[List["UserRole"]] = relationship(back_populates="user", cascade="all, delete-orphan")
    profile: Mapped[Optional["Profile"]] = relationship(back_populates="user", uselist=False, cascade="all, delete-orphan")
    jobs: Mapped[List["Job"]] = relationship(back_populates="owner")
    applications: Mapped[List["Application"]] = relationship(back_populates="applicant")
    refresh_tokens: Mapped[List["RefreshToken"]] = relationship(back_populates="user", cascade="all, delete-orphan")


class UserRole(TimestampMixin, Base):
    __tablename__ = "roles"
    __table_args__ = (Index("ix_roles_user_role", "user_id", "role", unique=True),)

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), primary_key=True)
    role: Mapped[RoleType] = mapped_column(Enum(RoleType, name="role_enum"), primary_key=True)

    user: Mapped[User] = relationship(back_populates="roles")


class Nonce(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "nonces"

    wallet_pubkey: Mapped[str] = mapped_column(String(128), nullable=False, index=True)
    nonce_b64u: Mapped[str] = mapped_column(String(128), unique=True, nullable=False, index=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    used: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False)


class Profile(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "profiles"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), unique=True, nullable=False)
    display_name: Mapped[Optional[str]] = mapped_column(String(120))
    links: Mapped[Optional[dict]] = mapped_column(JSONB)
    skills: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String(64)))
    resume_url: Mapped[Optional[str]] = mapped_column(String(512))

    user: Mapped[User] = relationship(back_populates="profile")


class Job(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "jobs"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    title: Mapped[str] = mapped_column(String(255), nullable=False)
    description: Mapped[str] = mapped_column(Text, nullable=False)
    tags: Mapped[Optional[list[str]]] = mapped_column(ARRAY(String(64)))
    status: Mapped[JobStatus] = mapped_column(Enum(JobStatus, name="job_status_enum"), default=JobStatus.draft, nullable=False, index=True)
    visibility: Mapped[JobVisibility] = mapped_column(Enum(JobVisibility, name="job_visibility_enum"), default=JobVisibility.public, nullable=False)

    owner: Mapped[User] = relationship(back_populates="jobs")
    applications: Mapped[List["Application"]] = relationship(back_populates="job")
    bounties: Mapped[List["Bounty"]] = relationship(back_populates="job")

    __table_args__ = (
        Index("ix_jobs_status_visibility", "status", "visibility"),
        Index("ix_jobs_tags", "tags", postgresql_using="gin"),
    )


class Application(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "applications"

    job_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    applicant_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    status: Mapped[ApplicationStatus] = mapped_column(Enum(ApplicationStatus, name="application_status_enum"), default=ApplicationStatus.received, index=True)
    notes: Mapped[Optional[str]] = mapped_column(Text)
    cover_letter: Mapped[Optional[str]] = mapped_column(Text)
    attachments: Mapped[Optional[dict]] = mapped_column(JSONB)
    onchain_ref: Mapped[Optional[dict]] = mapped_column(JSONB)

    job: Mapped[Job] = relationship(back_populates="applications")
    applicant: Mapped[User] = relationship(back_populates="applications")

    __table_args__ = (
        Index("ix_applications_job_applicant", "job_id", "applicant_id", unique=True),
    )


class Bounty(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "bounties"

    job_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("jobs.id", ondelete="CASCADE"), index=True)
    amount_lamports: Mapped[int] = mapped_column(BIGINT, nullable=False)
    vault_address: Mapped[Optional[str]] = mapped_column(String(255))
    status: Mapped[BountyStatus] = mapped_column(Enum(BountyStatus, name="bounty_status_enum"), default=BountyStatus.pending_funding, nullable=False, index=True)
    last_tx_sig: Mapped[Optional[str]] = mapped_column(String(255))

    job: Mapped[Job] = relationship(back_populates="bounties")


class OnChainEvent(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "onchain_events"

    signature: Mapped[str] = mapped_column(String(255), unique=True, nullable=False, index=True)
    program_id: Mapped[str] = mapped_column(String(255), nullable=False, index=True)
    type: Mapped[str] = mapped_column(String(120), nullable=False)
    payload: Mapped[dict] = mapped_column(JSONB, nullable=False)
    seen_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False)


class RefreshToken(UUIDPrimaryKeyMixin, TimestampMixin, Base):
    __tablename__ = "refresh_tokens"

    user_id: Mapped[uuid.UUID] = mapped_column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), index=True)
    token_hash: Mapped[bytes] = mapped_column(LargeBinary(64), nullable=False, unique=True)
    expires_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), nullable=False, index=True)
    revoked: Mapped[bool] = mapped_column(Boolean, default=False, nullable=False, index=True)

    user: Mapped[User] = relationship(back_populates="refresh_tokens")

    __table_args__ = (
        Index("ix_refresh_tokens_user", "user_id", "revoked"),
    )
