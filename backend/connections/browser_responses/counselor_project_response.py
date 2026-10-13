from dataclasses import asdict

from backend.business_rules.project import Project


PUBLIC_FIELDS = ("id", "title", "description", "category", "status", "tool_path", "created_at", "updated_at", "revision")


def counselor_project_response(project: Project) -> dict:
    data = asdict(project)
    return {field: data[field] for field in PUBLIC_FIELDS}
