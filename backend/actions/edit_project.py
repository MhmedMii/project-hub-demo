from datetime import datetime, timezone

from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.business_rules.access_rules import require_admin
from backend.business_rules.account import Account
from backend.business_rules.prepare_project import prepare_project_edit
from backend.business_rules.project import Project
from backend.business_rules.project_changes import ProjectChanges
from backend.business_rules.project_visibility import require_visible_project
from backend.business_rules.revision_validation import require_current_revision


def edit_project(actor: Account, identifier: str, changes: ProjectChanges, storage: ProjectStorage) -> Project:
    require_admin(actor)
    timestamp = datetime.now(timezone.utc).isoformat()

    def transform(current: Project) -> Project:
        require_visible_project(current, actor)
        require_current_revision(changes.expected_revision, current.revision)
        return prepare_project_edit(current, changes, timestamp)

    return storage.update(identifier, transform)
