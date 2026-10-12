import pytest
from fastapi.testclient import TestClient

from backend.server.create_server import create_server
from backend.server.settings import Settings


@pytest.fixture
def application():
    return create_server(Settings(allowed_origins=("http://testserver",)))


@pytest.fixture
def visitor(application):
    with TestClient(application) as client:
        client.headers["Origin"] = "http://testserver"
        yield client


@pytest.fixture
def admin(visitor):
    response = visitor.post("/api/session/demo-login", json={"role": "admin"})
    assert response.status_code == 200
    return visitor


@pytest.fixture
def counselor(visitor):
    response = visitor.post("/api/session/demo-login", json={"role": "counselor"})
    assert response.status_code == 200
    return visitor
