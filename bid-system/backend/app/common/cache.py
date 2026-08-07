"""
캐시 헬퍼.

- local_cache_get / local_cache_set / local_cache_delete : 프로세스 내 메모리 캐시 (주 사용)
- get_redis / cache_get / cache_set : Redis 캐시 (redis 패키지 미설치 시 자동 비활성화)
"""
import json
import logging
from typing import Any

from ..config import get_settings

logger = logging.getLogger(__name__)
_redis_client: "Any | None" = None
_redis_init_done = False
_redis_last_attempt: "float" = 0.0
_REDIS_RETRY_SEC = 120  # 실패 후 2분마다 재시도


def get_redis() -> "Any | None":
    """Redis 클라이언트 반환. redis 패키지 미설치 또는 연결 불가 시 None."""
    global _redis_client, _redis_init_done, _redis_last_attempt
    import time as _t
    if _redis_init_done and _redis_client is not None:
        return _redis_client
    now = _t.monotonic()
    if _redis_init_done and (now - _redis_last_attempt) < _REDIS_RETRY_SEC:
        return None
    _redis_init_done = True
    _redis_last_attempt = now
    try:
        import redis as _redis  # lazy import — redis 패키지 없어도 모듈 로드 가능
        settings = get_settings()
        rc = _redis.from_url(
            settings.redis_url,
            socket_connect_timeout=5,
            socket_timeout=5,
            ssl_cert_reqs=None,
        )
        rc.ping()
        _redis_client = rc
        logger.info("Redis 연결 완료")
    except ImportError:
        logger.info("redis 패키지 미설치 — Redis 캐시 비활성화 (local_cache 사용 중)")
        _redis_client = None
    except Exception as e:
        logger.warning("Redis 연결 실패 — 캐시 비활성화: %s", e)
        _redis_client = None
    return _redis_client


def cache_get(rc: "_redis.Redis | None", key: str) -> "Any | None":
    if rc is None:
        return None
    try:
        raw = rc.get(key)
        return json.loads(raw) if raw else None
    except Exception:
        return None


def cache_set(rc: "_redis.Redis | None", key: str, value: Any, ttl: int = 60) -> None:
    if rc is None:
        return
    try:
        rc.setex(key, ttl, json.dumps(value, default=str))
    except Exception:
        pass


def cache_delete_pattern(rc: "_redis.Redis | None", pattern: str) -> None:
    if rc is None:
        return
    try:
        keys = rc.keys(pattern)
        if keys:
            rc.delete(*keys)
    except Exception:
        pass


import time as _time

_local_store: "dict[str, tuple[Any, float]]" = {}

def local_cache_get(key: str) -> "Any | None":
    entry = _local_store.get(key)
    if not entry:
        return None
    value, expires_at = entry
    if _time.monotonic() > expires_at:
        _local_store.pop(key, None)
        return None
    return value

def local_cache_set(key: str, value: Any, ttl: int = 300) -> None:
    _local_store[key] = (value, _time.monotonic() + ttl)

def local_cache_delete(key: str) -> None:
    _local_store.pop(key, None)
