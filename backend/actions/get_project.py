from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.account import Account
from backend.business_rules.project import Project
from backend.business_rules.project_visibility import require_visible_project


def get_project(actor: Account, identifier: str, storage: ProjectStorage) -> Project:
    return require_visible_project(storage.get(identifier), actor)
