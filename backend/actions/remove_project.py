from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account
from backend.business_rules.project_visibility import require_visible_project


def remove_project(actor: Account, identifier: str, storage: ProjectStorage) -> None:
    require_admin(actor)
    require_visible_project(storage.get(identifier), actor)
    storage.remove(identifier)
