from backend.business_rules.account import Account
from backend.business_rules.role import Role


def convert_account_data(data: dict) -> Account:
    return Account(**{**data, "role": Role(data["role"])})
