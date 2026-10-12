from dataclasses import dataclass


@dataclass(frozen=True)
class Settings:
    allowed_origins: tuple[str, ...] = ("http://localhost:5173", "http://127.0.0.1:5173")
    secure_cookies: bool = False


SESSION_COOKIE = "project_hub_session"
