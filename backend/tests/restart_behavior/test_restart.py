from pathlib import Path

from fastapi.testclient import TestClient

from backend.server.create_server import create_server
from backend.server.settings import Settings


def test_restart_restores_seed_and_invalidates_sessions():
    application = create_server(Settings(allowed_origins=("http://testserver",)))
    with TestClient(application, headers={"Origin": "http://testserver"}) as first:
        first.post("/api/session/demo-login", json={"role": "admin"})
        before = first.get("/api/projects").json()
        first.patch("/api/projects/counselor-planner", json={"status": "archived"})
        first.delete("/api/accounts/sample-admin")
        cookies = dict(first.cookies)
    with TestClient(application, headers={"Origin": "http://testserver"}) as second:
        second.cookies.update(cookies)
        assert second.get("/api/session").status_code == 401
        second.post("/api/session/demo-login", json={"role": "admin"})
        assert second.get("/api/projects").json() == before
        assert len(second.get("/api/accounts").json()["accounts"]) == 6


def test_mutations_do_not_write_fixture_files(admin):
    folder = Path(__file__).parents[2] / "connections" / "demo_data"
    before = {path.name: path.read_bytes() for path in folder.glob("*.json")}
    admin.patch("/api/projects/counselor-planner", json={"private_notes": "Changed sample note"})
    admin.delete("/api/accounts/sample-admin")
    assert before == {path.name: path.read_bytes() for path in folder.glob("*.json")}
