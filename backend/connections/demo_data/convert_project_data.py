from backend.business_rules.localized_text import LocalizedText
from backend.business_rules.project import Project
from backend.business_rules.project_status import ProjectStatus


def convert_project_data(data: dict) -> Project:
    return Project(
        id=data["id"],
        title=LocalizedText(**data["title"]),
        description=LocalizedText(**data["description"]),
        category=LocalizedText(**data["category"]),
        status=ProjectStatus(data["status"]),
        tool_path=data["tool_path"],
        private_notes=data["private_notes"],
        created_at=data["created_at"],
        updated_at=data["updated_at"],
    )
