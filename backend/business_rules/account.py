from dataclasses import dataclass

from backend.business_rules.role import Role


@dataclass(frozen=True)
class Account:
    id: str
    name: str
    email: str
    role: Role
    is_active: bool
    is_fixed: bool
