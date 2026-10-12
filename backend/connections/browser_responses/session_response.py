from backend.business_rules.account import Account
from backend.business_rules.session import Session
from backend.connections.browser_responses.account_response import account_response


def session_response(session: Session, account: Account) -> dict:
    return {"account": account_response(account), "expires_at": session.expires_at.isoformat()}
