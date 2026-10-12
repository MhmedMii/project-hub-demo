from datetime import datetime, timezone

from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account
from backend.business_rules.prepare_project import prepare_project_edit
from backend.business_rules.project import Project
from backend.business_rules.project_changes import ProjectChanges
from backend.business_rules.project_visibility import require_visible_project


def edit_project(actor: Account, identifier: str, changes: ProjectChanges, storage: ProjectStorage) -> Project:
    require_admin(actor)
    current = require_visible_project(storage.get(identifier), actor)
    project = prepare_project_edit(current, changes, datetime.now(timezone.utc).isoformat())
    return storage.save(project)
