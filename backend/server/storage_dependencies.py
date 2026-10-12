from fastapi import Request

from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.actions.storage_interfaces.session_storage import SessionStorage


def project_storage(request: Request) -> ProjectStorage:
    return request.app.state.data.projects


def account_storage(request: Request) -> AccountStorage:
    return request.app.state.data.accounts


def session_storage(request: Request) -> SessionStorage:
    return request.app.state.data.sessions
