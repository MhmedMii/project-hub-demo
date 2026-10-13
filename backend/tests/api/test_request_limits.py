import pytest


def test_repeated_login_replaces_old_browser_session(visitor):
    visitor.post("/api/session/demo-login", json={"role": "admin"})
    old_cookie = visitor.cookies.get("project_hub_session")
    visitor.post("/api/session/demo-login", json={"role": "counselor"})
    response = visitor.get("/api/session", headers={"Cookie": f"project_hub_session={old_cookie}"})
    assert response.status_code == 401


def test_login_flood_is_limited(visitor):
    responses = [visitor.post("/api/session/demo-login", json={"role": "admin"}) for _ in range(21)]
    assert responses[-1].status_code == 429
    assert responses[-1].json() == {"error": {"code": "RATE_LIMITED"}}


@pytest.mark.parametrize("streamed", [False, True])
def test_oversized_request_is_rejected_before_json_parsing(admin, streamed):
    body = b'{"private_notes":"' + b' ' * 40000 + b'"}'
    content = iter([body[:20000], body[20000:]]) if streamed else body
    response = admin.patch("/api/projects/counselor-planner", content=content, headers={"Content-Type": "application/json"})
    assert response.status_code == 413
    assert response.json() == {"error": {"code": "REQUEST_TOO_LARGE"}}
