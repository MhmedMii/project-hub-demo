from dataclasses import dataclass

from backend.business_rules.localized_text import LocalizedText


@dataclass(frozen=True)
class ProjectChanges:
    title: LocalizedText | None = None
    description: LocalizedText | None = None
    category: LocalizedText | None = None
    status: str | None = None
    private_notes: str | None = None
    expected_revision: int | None = None
