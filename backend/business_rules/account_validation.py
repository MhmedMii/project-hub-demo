import re
from dataclasses import replace

from backend.business_rules.account import Account
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.business_errors import BusinessError
from backend.business_rules.role import Role
from backend.business_rules.text_validation import clean_text


def clean_account_changes(changes: AccountChanges) -> AccountChanges:
    cleaned = {}
    if changes.name is not None:
        cleaned["name"] = clean_text(changes.name, 120)
    if changes.email is not None:
        cleaned["email"] = valid_demo_email(changes.email)
    if changes.role is not None:
        cleaned["role"] = valid_role(changes.role)
    return replace(changes, **cleaned)


def valid_demo_email(value: str) -> str:
    cleaned = value.strip().lower()
    pattern = r"[^\s@]+@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+example"
    if len(cleaned) > 254 or re.fullmatch(pattern, cleaned) is None:
        raise BusinessError("INVALID_INPUT")
    return cleaned


def valid_role(value: str) -> Role:
    try:
        return Role(value)
    except ValueError:
        raise BusinessError("INVALID_INPUT") from None


def require_account_fields(changes: AccountChanges) -> None:
    if changes.name is None or changes.email is None:
        raise BusinessError("INVALID_INPUT")


def ensure_email_available(existing: Account | None, intended_id: str | None = None) -> None:
    if existing is not None and existing.id != intended_id:
        raise BusinessError("EMAIL_IN_USE")
