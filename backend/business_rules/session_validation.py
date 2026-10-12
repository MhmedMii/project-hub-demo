from datetime import datetime

from backend.business_rules.business_errors import BusinessError
from backend.business_rules.session import Session


def require_session(session: Session | None, now: datetime) -> Session:
    if session is None or session.expires_at <= now:
        raise BusinessError("SESSION_REQUIRED")
    return session
