from fastapi.testclient import TestClient


def test_unexpected_failure_is_counted(admin, application, monkeypatch):
    def fail():
        raise RuntimeError("Fictional test failure")

    monkeypatch.setattr(application.state.data.projects, "list", fail)
    before = dict(application.state.request_counters)
    client = TestClient(application, raise_server_exceptions=False)
    client.cookies.update(dict(admin.cookies))
    try:
        response = client.get("/api/projects")
    finally:
        client.close()
    assert response.status_code == 500
    assert response.json() == {"error": {"code": "SERVER_ERROR"}}
    assert response.headers["cache-control"] == "private, no-store"
    counters = application.state.request_counters
    assert counters["completed"] == before["completed"] + 1
    assert counters["errors"] == before["errors"] + 1
    assert counters["in_flight"] == 0
