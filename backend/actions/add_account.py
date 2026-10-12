from uuid import uuid4

from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.account_validation import ensure_email_available
from backend.business_rules.prepare_account import prepare_new_account


def add_account(actor: Account, changes: AccountChanges, storage: AccountStorage) -> Account:
    require_admin(actor)
    account = prepare_new_account(str(uuid4()), changes)
    ensure_email_available(storage.find_email(account.email))
    return storage.save(account)
