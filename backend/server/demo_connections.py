from dataclasses import dataclass

from backend.actions.storage_interfaces.account_storage import AccountStorage
from backend.actions.storage_interfaces.project_storage import ProjectStorage
from backend.actions.storage_interfaces.session_storage import SessionStorage


@dataclass(frozen=True)
class DemoConnections:
    projects: ProjectStorage
    accounts: AccountStorage
    sessions: SessionStorage
