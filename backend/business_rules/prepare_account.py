from dataclasses import asdict, replace

from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.account_validation import clean_account_changes, require_account_fields
from backend.business_rules.role import Role


def prepare_new_account(identifier: str, changes: AccountChanges) -> Account:
    cleaned = clean_account_changes(changes)
    require_account_fields(cleaned)
    return Account(
        id=identifier,
        name=cleaned.name,
        email=cleaned.email,
        role=Role(cleaned.role or "counselor"),
        is_active=True if cleaned.is_active is None else cleaned.is_active,
        is_fixed=False,
    )


def prepare_account_edit(account: Account, changes: AccountChanges) -> Account:
    cleaned = clean_account_changes(changes)
    updates = {
        field: getattr(cleaned, field)
        for field in asdict(cleaned)
        if getattr(cleaned, field) is not None
    }
    return replace(account, **updates)
