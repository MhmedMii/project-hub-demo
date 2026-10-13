from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.business_rules.access_rules import require_admin, ensure_account_edit_allowed
from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.prepare_account import prepare_account_edit
from backend.business_rules.revision_validation import require_current_revision


def edit_account(actor: Account, identifier: str, changes: AccountChanges, storage: AccountStorage) -> Account:
    require_admin(actor)

    def transform(target: Account) -> Account:
        require_current_revision(changes.expected_revision, target.revision)
        ensure_account_edit_allowed(actor, target, changes)
        return prepare_account_edit(target, changes)

    return storage.update(identifier, transform)
