from backend.business_rules.access_rules import can_read_private_notes
from backend.business_rules.account import Account
from backend.business_rules.project import Project
from backend.connections.browser_responses.admin_project_response import admin_project_response
from backend.connections.browser_responses.counselor_project_response import counselor_project_response


def project_response(project: Project, actor: Account) -> dict:
    prepare_response = admin_project_response if can_read_private_notes(actor) else counselor_project_response
    return prepare_response(project)
