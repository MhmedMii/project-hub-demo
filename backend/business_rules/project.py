from dataclasses import dataclass

from backend.business_rules.localized_text import LocalizedText
from backend.business_rules.project_status import ProjectStatus


@dataclass(frozen=True)
class Project:
    id: str
    title: LocalizedText
    description: LocalizedText
    category: LocalizedText
    status: ProjectStatus
    tool_path: str
    private_notes: str
    created_at: str
    updated_at: str
