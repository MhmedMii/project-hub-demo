from dataclasses import asdict, replace

from backend.business_rules.localized_text import LocalizedText
from backend.business_rules.project import Project
from backend.business_rules.project_changes import ProjectChanges
from backend.business_rules.project_status import ProjectStatus
from backend.business_rules.project_validation import clean_project_changes, require_project_fields


def prepare_new_project(identifier: str, changes: ProjectChanges, timestamp: str) -> Project:
    cleaned = clean_project_changes(changes)
    require_project_fields(cleaned)
    return Project(
        id=identifier,
        title=cleaned.title,
        description=cleaned.description,
        category=cleaned.category or LocalizedText("General", "عام"),
        status=ProjectStatus(cleaned.status or "live"),
        tool_path=f"/demo/tools/{identifier}",
        private_notes=cleaned.private_notes or "",
        created_at=timestamp,
        updated_at=timestamp,
    )


def prepare_project_edit(project: Project, changes: ProjectChanges, timestamp: str) -> Project:
    cleaned = clean_project_changes(changes)
    updates = {
        field: getattr(cleaned, field)
        for field in asdict(cleaned)
        if getattr(cleaned, field) is not None
    }
    return replace(project, **updates, updated_at=timestamp)
