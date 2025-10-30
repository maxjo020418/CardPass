from __future__ import annotations

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from cardpass.api.routers import applications, auth, bounties, health, jobs, me, webhooks
from cardpass.config.settings import settings


def create_app() -> FastAPI:
    app = FastAPI(title=settings.project_name, root_path=settings.root_path)

    if settings.cors_origins:
        app.add_middleware(
            CORSMiddleware,
            allow_origins=[str(origin) for origin in settings.cors_origins],
            allow_credentials=True,
            allow_methods=["*"],
            allow_headers=["*"],
        )

    app.include_router(health.router)
    app.include_router(auth.router)
    app.include_router(me.router)
    app.include_router(jobs.router)
    app.include_router(applications.router)
    app.include_router(bounties.router)
    app.include_router(webhooks.router)

    return app


app = create_app()
