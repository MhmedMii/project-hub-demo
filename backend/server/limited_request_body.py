from starlette.requests import ClientDisconnect
from starlette.types import Receive


class RequestBodyTooLarge(Exception):
    pass


async def read_limited_body(receive: Receive, maximum: int) -> bytes:
    parts = []
    size = 0
    while True:
        message = await receive()
        if message["type"] == "http.disconnect":
            raise ClientDisconnect()
        part = message.get("body", b"")
        size += len(part)
        if size > maximum:
            raise RequestBodyTooLarge()
        parts.append(part)
        if not message.get("more_body", False):
            return b"".join(parts)
