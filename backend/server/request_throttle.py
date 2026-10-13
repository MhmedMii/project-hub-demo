from collections import deque
from threading import RLock
from time import monotonic

from backend.server.request_limits import RequestLimits


class RequestThrottle:
    def __init__(self, limits: RequestLimits):
        self._limits = limits
        self._buckets: dict[tuple[str, str], deque[float]] = {}
        self._global: deque[float] = deque()
        self._lock = RLock()

    def allow(self, client: str, path: str) -> bool:
        with self._lock:
            now = monotonic()
            self._prune(now)
            requested = [((client, "requests"), self._limits.client_requests)]
            if path.rstrip("/") == "/api/session/demo-login":
                requested.append(((client, "login"), self._limits.client_logins))
            missing = sum(key not in self._buckets for key, _ in requested)
            if len(self._buckets) + missing > self._limits.tracked_buckets:
                return False
            if len(self._global) >= self._limits.global_requests:
                return False
            if any(len(self._buckets.get(key, ())) >= maximum for key, maximum in requested):
                return False
            for key, _ in requested:
                self._buckets.setdefault(key, deque()).append(now)
            self._global.append(now)
            return True

    def _prune(self, now: float) -> None:
        cutoff = now - self._limits.window_seconds
        for bucket in [self._global, *self._buckets.values()]:
            while bucket and bucket[0] <= cutoff:
                bucket.popleft()
        self._buckets = {key: bucket for key, bucket in self._buckets.items() if bucket}
