from fastapi import Request

from backend.actions.get_session import get_session
from backend.business_rules.account import Account
from backend.business_rules.session import Session
from backend.server.settings import SESSION_COOKIE


def current_session(request: Request) -> tuple[Session, Account]:
    data = request.app.state.data
    return get_session(request.cookies.get(SESSION_COOKIE), data.sessions, data.accounts)


def current_user(request: Request) -> Account:
    return current_session(request)[1]
