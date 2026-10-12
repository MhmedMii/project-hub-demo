from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account


def list_accounts(actor: Account, storage: AccountStorage) -> list[Account]:
    require_admin(actor)
    return storage.list()
