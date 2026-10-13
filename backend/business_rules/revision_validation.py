from backend.business_rules.business_errors import BusinessError


def require_current_revision(expected: int | None, current: int) -> None:
    if expected is not None and expected != current:
        raise BusinessError("CONCURRENT_CHANGE")
