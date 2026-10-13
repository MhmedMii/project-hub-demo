def test_stale_account_form_cannot_undo_demotion(admin):
    first = admin.patch("/api/accounts/sample-admin", json={"role": "counselor", "expected_revision": 1})
    assert first.status_code == 200
    stale = admin.patch("/api/accounts/sample-admin", json={"role": "admin", "expected_revision": 1})
    assert stale.status_code == 409
    assert stale.json() == {"error": {"code": "CONCURRENT_CHANGE"}}
    account = next(value for value in admin.get("/api/accounts").json()["accounts"] if value["id"] == "sample-admin")
    assert account["role"] == "counselor"


def test_stale_project_form_cannot_overwrite_newer_status(admin):
    first = admin.patch("/api/projects/counselor-planner", json={"status": "maintenance", "expected_revision": 1})
    assert first.status_code == 200
    stale = admin.patch("/api/projects/counselor-planner", json={"status": "live", "expected_revision": 1})
    assert stale.status_code == 409
    assert admin.get("/api/projects/counselor-planner").json()["project"]["status"] == "maintenance"
