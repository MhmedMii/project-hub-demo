from backend.business_rules.localized_text import LocalizedText
from backend.business_rules.project_changes import ProjectChanges


def read_project_changes(data: dict) -> ProjectChanges:
    converted = {
        field: LocalizedText(**value) if field in ("title", "description", "category") else value
        for field, value in data.items()
    }
    return ProjectChanges(**converted)
