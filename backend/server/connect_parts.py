from backend.connections.demo_data.convert_account_data import convert_account_data
from backend.connections.demo_data.convert_project_data import convert_project_data
from backend.connections.demo_data.load_demo_data import load_demo_data
from backend.connections.memory_storage.memory_account_storage import MemoryAccountStorage
from backend.connections.memory_storage.memory_project_storage import MemoryProjectStorage
from backend.connections.memory_storage.memory_session_storage import MemorySessionStorage
from backend.server.demo_connections import DemoConnections


def connect_parts() -> DemoConnections:
    projects = [convert_project_data(data) for data in load_demo_data("projects.json")]
    accounts = [convert_account_data(data) for data in load_demo_data("accounts.json")]
    return DemoConnections(
        projects=MemoryProjectStorage(projects),
        accounts=MemoryAccountStorage(accounts),
        sessions=MemorySessionStorage(),
    )
