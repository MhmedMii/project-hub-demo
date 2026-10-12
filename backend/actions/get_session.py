from datetime import datetime, timezone

from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.actions.storage_interfaces.session_storage import SessionStorage
from backend.business_rules.access_rules import require_active_account
from backend.business_rules.account import Account
from backend.business_rules.session import Session
from backend.business_rules.session_validation import require_session


def get_session(identifier: str | None, sessions: SessionStorage, accounts: AccountStorage) -> tuple[Session, Account]:
    session = require_session(sessions.get(identifier), datetime.now(timezone.utc))
    account = require_active_account(accounts.get(session.account_id))
    return session, account
