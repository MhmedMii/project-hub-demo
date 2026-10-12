from dataclasses import replace

from backend.business_rules.business_errors import BusinessError
from backend.business_rules.project_changes import ProjectChanges
from backend.business_rules.project_status import ProjectStatus
from backend.business_rules.text_validation import clean_localized_text, clean_text


def clean_project_changes(changes: ProjectChanges) -> ProjectChanges:
    cleaned = {}
    for field, limit in (("title", 120), ("description", 1000), ("category", 80)):
        value = getattr(changes, field)
        if value is not None:
            cleaned[field] = clean_localized_text(value, limit)
    if changes.private_notes is not None:
        cleaned["private_notes"] = clean_text(changes.private_notes, 2000, False)
    if changes.status is not None:
        cleaned["status"] = valid_status(changes.status)
    return replace(changes, **cleaned)


def valid_status(value: str) -> ProjectStatus:
    try:
        return ProjectStatus(value)
    except ValueError:
        raise BusinessError("INVALID_INPUT") from None


def require_project_fields(changes: ProjectChanges) -> None:
    if changes.title is None or changes.description is None:
        raise BusinessError("INVALID_INPUT")
