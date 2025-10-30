from __future__ import annotations

import asyncio
from collections import defaultdict, deque
from datetime import datetime, timedelta
from typing import Deque, Dict

from fastapi import Depends, HTTPException, Request, status

from cardpass.config.settings import settings

_window = timedelta(minutes=1)
_buckets: Dict[str, Deque[datetime]] = defaultdict(deque)
_lock = asyncio.Lock()


async def rate_limiter(request: Request, scope: str) -> None:
    identifier = f"{request.client.host if request.client else 'unknown'}:{scope}"
    limit = settings.rate_limit_per_minute
    cutoff = datetime.utcnow() - _window
    async with _lock:
        bucket = _buckets[identifier]
        while bucket and bucket[0] < cutoff:
            bucket.popleft()
        if len(bucket) >= limit:
            raise HTTPException(status_code=status.HTTP_429_TOO_MANY_REQUESTS, detail="Too many requests")
        bucket.append(datetime.utcnow())


def rate_limit_dependency(scope: str):
    async def dependency(request: Request) -> None:
        await rate_limiter(request, scope)

    return dependency
