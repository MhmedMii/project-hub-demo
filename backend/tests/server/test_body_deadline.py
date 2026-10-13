import asyncio
from types import SimpleNamespace

from backend.server.request_body_limit import RequestBodyLimit


def test_stalled_body_does_not_reach_the_application():
    async def exercise():
        messages = []
        called = []

        async def receive():
            await asyncio.sleep(0.05)
            return {"type": "http.request", "body": b"", "more_body": False}

        async def send(message):
            messages.append(message)

        async def application(scope, receive, send):
            called.append(True)
            await send({"type": "http.response.start", "status": 200, "headers": []})

        limits = SimpleNamespace(body_bytes=32, body_seconds=0.01)
        await RequestBodyLimit(application, limits)({"type": "http"}, receive, send)
        assert messages[0]["status"] == 408
        assert called == []

    asyncio.run(exercise())
