def test_projects_require_login(visitor):
    assert visitor.get("/api/projects").status_code == 401


def test_demo_login_sets_private_cookie(visitor):
    response = visitor.post("/api/session/demo-login", json={"role": "admin"})
    assert response.json()["account"]["role"] == "admin"
    cookie = response.headers["set-cookie"].lower()
    assert "httponly" in cookie
    assert "samesite=lax" in cookie
    assert "max-age=28800" in cookie
    assert "session_id" not in response.text


def test_writes_reject_other_origins(visitor):
    visitor.headers["Origin"] = "https://other.example"
    response = visitor.post("/api/session/demo-login", json={"role": "admin"})
    assert response.status_code == 403


def test_writes_require_origin(visitor):
    del visitor.headers["Origin"]
    response = visitor.post("/api/session/demo-login", json={"role": "admin"})
    assert response.status_code == 403


def test_logout_ends_access(admin):
    assert admin.post("/api/session/logout").status_code == 204
    assert admin.get("/api/projects").status_code == 401


def test_errors_are_private_and_generic(visitor):
    response = visitor.get("/api/projects")
    assert response.headers["cache-control"] == "private, no-store"
    assert response.json() == {"error": {"code": "SESSION_REQUIRED"}}
