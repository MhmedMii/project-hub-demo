from datetime import datetime, timezone
from uuid import uuid4

from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account
from backend.business_rules.prepare_project import prepare_new_project
from backend.business_rules.project import Project
from backend.business_rules.project_changes import ProjectChanges


def add_project(actor: Account, changes: ProjectChanges, storage: ProjectStorage) -> Project:
    require_admin(actor)
    project = prepare_new_project(str(uuid4()), changes, datetime.now(timezone.utc).isoformat())
    return storage.save(project)
