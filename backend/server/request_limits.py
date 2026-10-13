from dataclasses import dataclass


@dataclass(frozen=True)
class RequestLimits:
    body_bytes: int = 32768
    body_seconds: float = 10
    window_seconds: int = 60
    client_requests: int = 240
    client_logins: int = 20
    global_requests: int = 1600
    tracked_buckets: int = 1024
