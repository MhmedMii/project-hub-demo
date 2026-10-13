from dataclasses import dataclass, field

from backend.server.request_limits import RequestLimits


@dataclass(frozen=True)
class Settings:
    allowed_origins: tuple[str, ...] = ("http://localhost:5173", "http://127.0.0.1:5173")
    secure_cookies: bool = False
    request_limits: RequestLimits = field(default_factory=RequestLimits)


SESSION_COOKIE = "project_hub_session"
