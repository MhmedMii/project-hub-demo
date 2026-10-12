from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.business_errors import BusinessError
from backend.business_rules.role import Role


def require_admin(account: Account) -> None:
    if account.role != Role.ADMIN:
        raise BusinessError("ADMIN_REQUIRED")


def require_active_account(account: Account | None) -> Account:
    if account is None or not account.is_active:
        raise BusinessError("ACCOUNT_INACTIVE")
    return account


def require_account(account: Account | None) -> Account:
    if account is None:
        raise BusinessError("ACCOUNT_NOT_FOUND")
    return account


def ensure_account_edit_allowed(actor: Account, target: Account, changes: AccountChanges) -> None:
    if target.is_fixed and (changes.role == Role.COUNSELOR or changes.is_active is False):
        raise BusinessError("FIXED_ADMIN")
    if actor.id == target.id and changes.is_active is False:
        raise BusinessError("SELF_REMOVAL")


def ensure_account_removal_allowed(actor: Account, target: Account) -> None:
    if target.is_fixed:
        raise BusinessError("FIXED_ADMIN")
    if actor.id == target.id:
        raise BusinessError("SELF_REMOVAL")


def can_read_private_notes(actor: Account) -> bool:
    return actor.role == Role.ADMIN
