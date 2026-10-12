from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.access_rules import require_admin, require_account, ensure_account_removal_allowed
from backend.business_rules.account import Account


def remove_account(actor: Account, identifier: str, storage: AccountStorage) -> None:
    require_admin(actor)
    target = require_account(storage.get(identifier))
    ensure_account_removal_allowed(actor, target)
    storage.remove(identifier)
