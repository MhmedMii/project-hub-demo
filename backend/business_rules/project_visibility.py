from backend.business_rules.account import Account
from backend.business_rules.business_errors import BusinessError
from backend.business_rules.project import Project
from backend.business_rules.project_status import ProjectStatus, STATUS_ORDER
from backend.business_rules.role import Role


def is_project_visible(project: Project, actor: Account) -> bool:
    return actor.role == Role.ADMIN or project.status != ProjectStatus.ARCHIVED


def visible_projects(projects: list[Project], actor: Account) -> list[Project]:
    visible = [project for project in projects if is_project_visible(project, actor)]
    return sorted(visible, key=lambda project: (STATUS_ORDER[project.status], project.title.en.casefold()))


def require_visible_project(project: Project | None, actor: Account) -> Project:
    if project is None or not is_project_visible(project, actor):
        raise BusinessError("PROJECT_NOT_FOUND")
    return project
