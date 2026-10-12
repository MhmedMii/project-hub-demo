from fastapi import Request

from backend.business_rules.business_errors import BusinessError


WRITE_METHODS = frozenset(("POST", "PATCH", "DELETE", "PUT"))


def check_request_origin(request: Request) -> None:
    if request.method in WRITE_METHODS:
        allowed = request.app.state.settings.allowed_origins
        if request.headers.get("origin") not in allowed:
            raise BusinessError("ORIGIN_NOT_ALLOWED")
