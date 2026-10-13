from dataclasses import dataclass


@dataclass(frozen=True)
class AccountChanges:
    name: str | None = None
    email: str | None = None
    role: str | None = None
    is_active: bool | None = None
    expected_revision: int | None = None
