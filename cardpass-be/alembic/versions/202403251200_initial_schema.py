"""Initial schema

Revision ID: 202403251200
Revises: 
Create Date: 2024-03-25 12:00:00.000000
"""
from __future__ import annotations

from alembic import op
import sqlalchemy as sa
from sqlalchemy.dialects import postgresql

# revision identifiers, used by Alembic.
revision = "202403251200"
down_revision = None
branch_labels = None
depends_on = None


def upgrade() -> None:
    role_enum = postgresql.ENUM("recruiter", "applicant", name="role_enum")
    job_status_enum = postgresql.ENUM("draft", "open", "closed", "archived", name="job_status_enum")
    job_visibility_enum = postgresql.ENUM("public", "unlisted", name="job_visibility_enum")
    application_status_enum = postgresql.ENUM(
        "received",
        "reviewing",
        "interviewed",
        "offered",
        "rejected",
        "hired",
        name="application_status_enum",
    )
    bounty_status_enum = postgresql.ENUM(
        "pending_funding",
        "funded",
        "in_escrow",
        "released",
        "refunded",
        "failed",
        name="bounty_status_enum",
    )

    role_enum.create(op.get_bind(), checkfirst=True)
    job_status_enum.create(op.get_bind(), checkfirst=True)
    job_visibility_enum.create(op.get_bind(), checkfirst=True)
    application_status_enum.create(op.get_bind(), checkfirst=True)
    bounty_status_enum.create(op.get_bind(), checkfirst=True)

    op.create_table(
        "users",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("wallet_pubkey", sa.String(length=128), nullable=False, unique=True),
        sa.Column("last_login_at", sa.DateTime(timezone=True), nullable=True),
    )
    op.create_index(op.f("ix_users_wallet_pubkey"), "users", ["wallet_pubkey"], unique=True)

    op.create_table(
        "nonces",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("wallet_pubkey", sa.String(length=128), nullable=False),
        sa.Column("nonce_b64u", sa.String(length=128), nullable=False),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("used", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.create_index(op.f("ix_nonces_wallet_pubkey"), "nonces", ["wallet_pubkey"], unique=False)
    op.create_index(op.f("ix_nonces_nonce_b64u"), "nonces", ["nonce_b64u"], unique=True)
    op.create_index(op.f("ix_nonces_expires_at"), "nonces", ["expires_at"], unique=False)

    op.create_table(
        "profiles",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True),
        sa.Column("display_name", sa.String(length=120), nullable=True),
        sa.Column("links", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("skills", postgresql.ARRAY(sa.String(length=64))),
        sa.Column("resume_url", sa.String(length=512), nullable=True),
    )

    op.create_table(
        "roles",
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("role", role_enum, nullable=False),
        sa.PrimaryKeyConstraint("user_id", "role"),
    )
    op.create_index("ix_roles_user_role", "roles", ["user_id", "role"], unique=True)

    op.create_table(
        "jobs",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("title", sa.String(length=255), nullable=False),
        sa.Column("description", sa.Text(), nullable=False),
        sa.Column("tags", postgresql.ARRAY(sa.String(length=64))),
        sa.Column("status", job_status_enum, server_default="draft", nullable=False),
        sa.Column("visibility", job_visibility_enum, server_default="public", nullable=False),
    )
    op.create_index(op.f("ix_jobs_user_id"), "jobs", ["user_id"], unique=False)
    op.create_index("ix_jobs_status_visibility", "jobs", ["status", "visibility"], unique=False)
    op.create_index("ix_jobs_tags", "jobs", ["tags"], postgresql_using="gin")

    op.create_table(
        "applications",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("applicant_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("status", application_status_enum, server_default="received", nullable=False),
        sa.Column("notes", sa.Text(), nullable=True),
        sa.Column("cover_letter", sa.Text(), nullable=True),
        sa.Column("attachments", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
        sa.Column("onchain_ref", postgresql.JSONB(astext_type=sa.Text()), nullable=True),
    )
    op.create_index("ix_applications_job_applicant", "applications", ["job_id", "applicant_id"], unique=True)
    op.create_index(op.f("ix_applications_job_id"), "applications", ["job_id"], unique=False)
    op.create_index(op.f("ix_applications_applicant_id"), "applications", ["applicant_id"], unique=False)
    op.create_index(op.f("ix_applications_status"), "applications", ["status"], unique=False)

    op.create_table(
        "bounties",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("job_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("jobs.id", ondelete="CASCADE"), nullable=False),
        sa.Column("amount_lamports", sa.BigInteger(), nullable=False),
        sa.Column("vault_address", sa.String(length=255), nullable=True),
        sa.Column("status", bounty_status_enum, server_default="pending_funding", nullable=False),
        sa.Column("last_tx_sig", sa.String(length=255), nullable=True),
    )
    op.create_index(op.f("ix_bounties_job_id"), "bounties", ["job_id"], unique=False)
    op.create_index(op.f("ix_bounties_status"), "bounties", ["status"], unique=False)

    op.create_table(
        "onchain_events",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("signature", sa.String(length=255), nullable=False),
        sa.Column("program_id", sa.String(length=255), nullable=False),
        sa.Column("type", sa.String(length=120), nullable=False),
        sa.Column("payload", postgresql.JSONB(astext_type=sa.Text()), nullable=False),
        sa.Column("seen_at", sa.DateTime(timezone=True), nullable=False),
    )
    op.create_index(op.f("ix_onchain_events_signature"), "onchain_events", ["signature"], unique=True)
    op.create_index(op.f("ix_onchain_events_program_id"), "onchain_events", ["program_id"], unique=False)

    op.create_table(
        "refresh_tokens",
        sa.Column("id", postgresql.UUID(as_uuid=True), primary_key=True, nullable=False),
        sa.Column("created_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("updated_at", sa.DateTime(timezone=True), server_default=sa.func.now(), nullable=False),
        sa.Column("user_id", postgresql.UUID(as_uuid=True), sa.ForeignKey("users.id", ondelete="CASCADE"), nullable=False),
        sa.Column("token_hash", sa.LargeBinary(length=64), nullable=False, unique=True),
        sa.Column("expires_at", sa.DateTime(timezone=True), nullable=False),
        sa.Column("revoked", sa.Boolean(), nullable=False, server_default=sa.text("false")),
    )
    op.create_index(op.f("ix_refresh_tokens_user_id"), "refresh_tokens", ["user_id"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_expires_at"), "refresh_tokens", ["expires_at"], unique=False)
    op.create_index(op.f("ix_refresh_tokens_revoked"), "refresh_tokens", ["revoked"], unique=False)
    op.create_index("ix_refresh_tokens_user", "refresh_tokens", ["user_id", "revoked"], unique=False)


def downgrade() -> None:
    op.drop_index("ix_refresh_tokens_user", table_name="refresh_tokens")
    op.drop_index(op.f("ix_refresh_tokens_revoked"), table_name="refresh_tokens")
    op.drop_index(op.f("ix_refresh_tokens_expires_at"), table_name="refresh_tokens")
    op.drop_index(op.f("ix_refresh_tokens_user_id"), table_name="refresh_tokens")
    op.drop_table("refresh_tokens")

    op.drop_index(op.f("ix_onchain_events_program_id"), table_name="onchain_events")
    op.drop_index(op.f("ix_onchain_events_signature"), table_name="onchain_events")
    op.drop_table("onchain_events")

    op.drop_index(op.f("ix_bounties_status"), table_name="bounties")
    op.drop_index(op.f("ix_bounties_job_id"), table_name="bounties")
    op.drop_table("bounties")

    op.drop_index(op.f("ix_applications_status"), table_name="applications")
    op.drop_index(op.f("ix_applications_applicant_id"), table_name="applications")
    op.drop_index(op.f("ix_applications_job_id"), table_name="applications")
    op.drop_index("ix_applications_job_applicant", table_name="applications")
    op.drop_table("applications")

    op.drop_index("ix_jobs_tags", table_name="jobs")
    op.drop_index("ix_jobs_status_visibility", table_name="jobs")
    op.drop_index(op.f("ix_jobs_user_id"), table_name="jobs")
    op.drop_table("jobs")

    op.drop_index("ix_roles_user_role", table_name="roles")
    op.drop_table("roles")

    op.drop_table("profiles")

    op.drop_index(op.f("ix_nonces_expires_at"), table_name="nonces")
    op.drop_index(op.f("ix_nonces_nonce_b64u"), table_name="nonces")
    op.drop_index(op.f("ix_nonces_wallet_pubkey"), table_name="nonces")
    op.drop_table("nonces")

    op.drop_index(op.f("ix_users_wallet_pubkey"), table_name="users")
    op.drop_table("users")

    op.execute("DROP TYPE IF EXISTS bounty_status_enum")
    op.execute("DROP TYPE IF EXISTS application_status_enum")
    op.execute("DROP TYPE IF EXISTS job_visibility_enum")
    op.execute("DROP TYPE IF EXISTS job_status_enum")
    op.execute("DROP TYPE IF EXISTS role_enum")
