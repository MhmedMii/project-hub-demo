from starlette.types import ASGIApp, Receive, Scope, Send

from backend.server.handle_errors import error_response
from backend.server.request_limits import RequestLimits
from backend.server.request_throttle import RequestThrottle


class RequestRateLimit:
    def __init__(self, app: ASGIApp, limits: RequestLimits):
        self._application = app
        self._limits = limits
        self._throttle = RequestThrottle(limits)

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] == "http":
            client = scope.get("client") or ("unknown", 0)
            # ما نثق بهيدرات عنوان العميل؛ الوكيل الموثوق يضبط عنوان الاتصال
            if not self._throttle.allow(client[0], scope["path"]):
                response = error_response("RATE_LIMITED", 429)
                response.headers["Retry-After"] = str(self._limits.window_seconds)
                await response(scope, receive, send)
                return
        await self._application(scope, receive, send)
