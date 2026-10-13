import logging
from time import perf_counter

from fastapi import FastAPI, Request


logger = logging.getLogger("project_hub.requests")


def finish_request(request: Request, status: int, started: float) -> None:
    counters = request.app.state.request_counters
    counters["in_flight"] -= 1
    counters["completed"] += 1
    counters["errors"] += int(status >= 400)
    logger.info("%s %s status=%s duration_ms=%.1f in_flight=%s", request.method,
                request.url.path, status, (perf_counter() - started) * 1000, counters["in_flight"])


def register_request_logging(application: FastAPI) -> None:
    counters = {"in_flight": 0, "completed": 0, "errors": 0, "peak_in_flight": 0}
    application.state.request_counters = counters

    @application.middleware("http")
    async def track_request(request: Request, call_next):
        started = perf_counter()
        counters["in_flight"] += 1
        counters["peak_in_flight"] = max(counters["peak_in_flight"], counters["in_flight"])
        status = 500
        try:
            response = await call_next(request)
            status = response.status_code
            response.headers["Cache-Control"] = "private, no-store"
            return response
        finally:
            finish_request(request, status, started)
