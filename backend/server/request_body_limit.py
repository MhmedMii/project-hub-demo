from asyncio import timeout

from starlette.requests import ClientDisconnect
from starlette.types import ASGIApp, Receive, Scope, Send

from backend.server.handle_errors import error_response
from backend.server.limited_request_body import RequestBodyTooLarge, read_limited_body
from backend.server.request_limits import RequestLimits


class RequestBodyLimit:
    def __init__(self, app: ASGIApp, limits: RequestLimits):
        self._application = app
        self._maximum = limits.body_bytes
        self._seconds = limits.body_seconds

    async def __call__(self, scope: Scope, receive: Receive, send: Send) -> None:
        if scope["type"] != "http":
            await self._application(scope, receive, send)
            return
        try:
            async with timeout(self._seconds):
                body = await read_limited_body(receive, self._maximum)
        except TimeoutError:
            await error_response("REQUEST_TIMEOUT", 408)(scope, receive, send)
            return
        except RequestBodyTooLarge:
            await error_response("REQUEST_TOO_LARGE", 413)(scope, receive, send)
            return
        except ClientDisconnect:
            return
        sent = False

        async def replay():
            nonlocal sent
            if sent:
                return await receive()
            sent = True
            return {"type": "http.request", "body": body, "more_body": False}

        await self._application(scope, replay, send)
