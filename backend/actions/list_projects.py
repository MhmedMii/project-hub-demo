from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.account import Account
from backend.business_rules.project import Project
from backend.business_rules.project_visibility import visible_projects


def list_projects(actor: Account, storage: ProjectStorage) -> list[Project]:
    return visible_projects(storage.list(), actor)
