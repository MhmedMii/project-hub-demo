import logging

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from starlette.exceptions import HTTPException

from backend.business_rules.business_errors import BusinessError


ERROR_STATUS = {
    "SESSION_REQUIRED": 401, "ACCOUNT_INACTIVE": 401,
    "ADMIN_REQUIRED": 403, "ORIGIN_NOT_ALLOWED": 403, "FIXED_ADMIN": 403, "SELF_REMOVAL": 403,
    "PROJECT_NOT_FOUND": 404, "ACCOUNT_NOT_FOUND": 404,
    "EMAIL_IN_USE": 409, "INVALID_INPUT": 422,
}
logger = logging.getLogger("project_hub.errors")


def error_response(code: str, status: int) -> JSONResponse:
    return JSONResponse({"error": {"code": code}}, status_code=status, headers={"Cache-Control": "private, no-store"})


async def business_error_response(request: Request, error: BusinessError) -> JSONResponse:
    return error_response(error.code, ERROR_STATUS.get(error.code, 400))


async def invalid_input_response(request: Request, error: RequestValidationError) -> JSONResponse:
    return error_response("INVALID_INPUT", 422)


async def missing_route_response(request: Request, error: HTTPException) -> JSONResponse:
    return error_response("PROJECT_NOT_FOUND" if error.status_code == 404 else "INVALID_INPUT", error.status_code)


async def unexpected_error_response(request: Request, error: Exception) -> JSONResponse:
    logger.exception("Unexpected request failure", exc_info=error)
    return error_response("SERVER_ERROR", 500)


def register_error_handlers(application: FastAPI) -> None:
    application.add_exception_handler(BusinessError, business_error_response)
    application.add_exception_handler(RequestValidationError, invalid_input_response)
    application.add_exception_handler(HTTPException, missing_route_response)
    application.add_exception_handler(Exception, unexpected_error_response)
