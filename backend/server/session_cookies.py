from fastapi import Response

from backend.actions.demo_sign_in import SESSION_SECONDS
from backend.business_rules.session import Session
from backend.server.settings import SESSION_COOKIE, Settings


def set_session_cookie(response: Response, session: Session, settings: Settings) -> None:
    response.set_cookie(
        SESSION_COOKIE,
        session.id,
        max_age=SESSION_SECONDS,
        httponly=True,
        secure=settings.secure_cookies,
        samesite="lax",
        path="/",
    )


def clear_session_cookie(response: Response) -> None:
    response.delete_cookie(SESSION_COOKIE, path="/", httponly=True, samesite="lax")
