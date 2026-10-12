from datetime import datetime, timedelta, timezone
from secrets import token_urlsafe

from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.actions.storage_interfaces.session_storage import SessionStorage
from backend.business_rules.access_rules import require_active_account
from backend.business_rules.account import Account
from backend.business_rules.account_validation import valid_role
from backend.business_rules.role import Role
from backend.business_rules.session import Session


SESSION_SECONDS = 8 * 60 * 60
DEMO_ACCOUNTS = {Role.ADMIN: "demo-admin", Role.COUNSELOR: "demo-counselor"}


def demo_sign_in(role: str, accounts: AccountStorage, sessions: SessionStorage) -> tuple[Session, Account]:
    account = require_active_account(accounts.get(DEMO_ACCOUNTS[valid_role(role)]))
    expires_at = datetime.now(timezone.utc) + timedelta(seconds=SESSION_SECONDS)
    session = sessions.save(Session(token_urlsafe(32), account.id, expires_at))
    return session, account
