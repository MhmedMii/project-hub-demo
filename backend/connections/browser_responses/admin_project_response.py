from dataclasses import asdict

from backend.business_rules.project import Project


def admin_project_response(project: Project) -> dict:
    return asdict(project)
