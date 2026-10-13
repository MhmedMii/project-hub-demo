from fastapi import Depends, FastAPI

from backend.server.api.account_routes import router as account_routes
from backend.server.api.project_routes import router as project_routes
from backend.server.api.session_routes import router as session_routes
from backend.server.check_request_origin import check_request_origin
from backend.server.handle_errors import register_error_handlers
from backend.server.log_requests import register_request_logging
from backend.server.settings import Settings
from backend.server.start_demo import start_demo
from backend.server.request_body_limit import RequestBodyLimit
from backend.server.request_rate_limit import RequestRateLimit


def create_server(settings: Settings | None = None) -> FastAPI:
    application = FastAPI(
        title="Project Hub Demo", lifespan=start_demo,
        dependencies=[Depends(check_request_origin)],
        docs_url=None, redoc_url=None, openapi_url=None,
    )
    application.state.settings = settings or Settings()
    register_error_handlers(application)
    application.add_middleware(RequestBodyLimit, limits=application.state.settings.request_limits)
    application.add_middleware(RequestRateLimit, limits=application.state.settings.request_limits)
    register_request_logging(application)
    application.include_router(session_routes)
    application.include_router(project_routes)
    application.include_router(account_routes)
    return application
