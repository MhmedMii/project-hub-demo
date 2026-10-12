from backend.business_rules.account_changes import AccountChanges


def read_account_changes(data: dict) -> AccountChanges:
    return AccountChanges(**data)
