from typing import Annotated

from fastapi import APIRouter, Depends

from backend.actions.add_project import add_project
from backend.actions.edit_project import edit_project
from backend.actions.get_project import get_project
from backend.actions.list_projects import list_projects
from backend.actions.remove_project import remove_project
from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.account import Account
from backend.connections.browser_responses.project_response import project_response
from backend.connections.request_data.project_changes import read_project_changes
from backend.server.current_user import current_user
from backend.server.request_data.project_input import ProjectInput
from backend.server.storage_dependencies import project_storage


router = APIRouter(prefix="/api/projects")
CurrentUser = Annotated[Account, Depends(current_user)]
Projects = Annotated[ProjectStorage, Depends(project_storage)]


@router.get("")
def list_projects_route(actor: CurrentUser, storage: Projects) -> dict:
    return {"projects": [project_response(project, actor) for project in list_projects(actor, storage)]}


@router.get("/{identifier}")
def project_detail_route(identifier: str, actor: CurrentUser, storage: Projects) -> dict:
    return {"project": project_response(get_project(actor, identifier, storage), actor)}


@router.post("", status_code=201)
def add_project_route(body: ProjectInput, actor: CurrentUser, storage: Projects) -> dict:
    changes = read_project_changes(body.model_dump(exclude_none=True))
    return {"project": project_response(add_project(actor, changes, storage), actor)}


@router.patch("/{identifier}")
def edit_project_route(identifier: str, body: ProjectInput, actor: CurrentUser, storage: Projects) -> dict:
    changes = read_project_changes(body.model_dump(exclude_none=True))
    return {"project": project_response(edit_project(actor, identifier, changes, storage), actor)}


@router.delete("/{identifier}", status_code=204)
def remove_project_route(identifier: str, actor: CurrentUser, storage: Projects) -> None:
    remove_project(actor, identifier, storage)
