from dataclasses import asdict

from backend.business_rules.account import Account


def account_response(account: Account) -> dict:
    return asdict(account)
