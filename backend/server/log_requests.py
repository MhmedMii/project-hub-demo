import logging
from time import perf_counter

from fastapi import FastAPI, Request


logger = logging.getLogger("project_hub.requests")


def register_request_logging(application: FastAPI) -> None:
    counters = {"in_flight": 0, "completed": 0, "errors": 0, "peak_in_flight": 0}
    application.state.request_counters = counters

    @application.middleware("http")
    async def track_request(request: Request, call_next):
        started = perf_counter()
        counters["in_flight"] += 1
        counters["peak_in_flight"] = max(counters["peak_in_flight"], counters["in_flight"])
        try:
            response = await call_next(request)
        finally:
            counters["in_flight"] -= 1
        counters["completed"] += 1
        counters["errors"] += int(response.status_code >= 400)
        response.headers["Cache-Control"] = "private, no-store"
        logger.info("%s %s status=%s duration_ms=%.1f in_flight=%s", request.method,
                    request.url.path, response.status_code, (perf_counter() - started) * 1000,
                    counters["in_flight"])
        return response
