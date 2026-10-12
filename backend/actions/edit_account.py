from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.access_rules import require_admin, require_account, ensure_account_edit_allowed
from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.account_validation import ensure_email_available
from backend.business_rules.prepare_account import prepare_account_edit


def edit_account(actor: Account, identifier: str, changes: AccountChanges, storage: AccountStorage) -> Account:
    require_admin(actor)
    target = require_account(storage.get(identifier))
    account = prepare_account_edit(target, changes)
    ensure_account_edit_allowed(actor, target, changes)
    ensure_email_available(storage.find_email(account.email), identifier)
    return storage.save(account)
