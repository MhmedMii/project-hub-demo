from typing import Annotated

from fastapi import APIRouter, Depends, Request, Response

from backend.actions.demo_sign_in import demo_sign_in
from backend.actions.sign_out import sign_out
from backend.business_rules.account import Account
from backend.business_rules.session import Session
from backend.connections.browser_responses.session_response import session_response
from backend.server.current_user import current_session
from backend.server.request_data.sign_in_input import SignInInput
from backend.server.session_cookies import clear_session_cookie, set_session_cookie
from backend.server.settings import SESSION_COOKIE


router = APIRouter(prefix="/api/session")
ResolvedSession = Annotated[tuple[Session, Account], Depends(current_session)]


@router.post("/demo-login")
def sign_in_route(body: SignInInput, request: Request, response: Response) -> dict:
    data = request.app.state.data
    session, account = demo_sign_in(body.role, data.accounts, data.sessions, request.cookies.get(SESSION_COOKIE))
    set_session_cookie(response, session, request.app.state.settings)
    return session_response(session, account)


@router.get("")
def session_route(resolved: ResolvedSession) -> dict:
    return session_response(*resolved)


@router.post("/logout", status_code=204)
def sign_out_route(request: Request, response: Response, resolved: ResolvedSession) -> None:
    sign_out(resolved[0].id, request.app.state.data.sessions)
    clear_session_cookie(response)
