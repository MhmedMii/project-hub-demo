from backend.business_rules.business_errors import BusinessError


ACCOUNT_CAPACITY = 500
PROJECT_CAPACITY = 1000
SESSION_CAPACITY = 512


def require_available_capacity(count: int, maximum: int) -> None:
    if count >= maximum:
        raise BusinessError("DEMO_CAPACITY_REACHED")
