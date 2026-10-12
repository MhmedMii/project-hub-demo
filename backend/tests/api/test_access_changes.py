from fastapi.testclient import TestClient


def counselor_client(application):
    client = TestClient(application)
    client.headers["Origin"] = "http://testserver"
    assert client.post("/api/session/demo-login", json={"role": "counselor"}).status_code == 200
    return client


def test_disabling_account_revokes_existing_session(application, admin):
    peer = counselor_client(application)
    try:
        assert admin.patch("/api/accounts/demo-counselor", json={"is_active": False}).status_code == 200
        assert peer.get("/api/projects").status_code == 401
    finally:
        peer.close()


def test_role_changes_apply_on_next_request(application, admin):
    peer = counselor_client(application)
    try:
        assert peer.get("/api/accounts").status_code == 403
        admin.patch("/api/accounts/demo-counselor", json={"role": "admin"})
        assert peer.get("/api/accounts").status_code == 200
        admin.patch("/api/accounts/demo-counselor", json={"role": "counselor"})
        assert peer.get("/api/accounts").status_code == 403
    finally:
        peer.close()


def test_nonfixed_admin_cannot_remove_own_access(application, admin):
    peer = counselor_client(application)
    try:
        admin.patch("/api/accounts/demo-counselor", json={"role": "admin"})
        response = peer.delete("/api/accounts/demo-counselor")
        assert response.json()["error"]["code"] == "SELF_REMOVAL"
        response = peer.patch("/api/accounts/demo-counselor", json={"is_active": False})
        assert response.json()["error"]["code"] == "SELF_REMOVAL"
    finally:
        peer.close()
