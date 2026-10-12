def account_input():
    return {"name": "Sample Person", "email": "sample@demo.example", "role": "counselor", "is_active": True}


def test_account_list_requires_admin(counselor):
    assert counselor.get("/api/accounts").status_code == 403


def test_fixed_admin_cannot_be_removed_or_demoted(admin):
    assert admin.delete("/api/accounts/demo-admin").status_code == 403
    assert admin.patch("/api/accounts/demo-admin", json={"role": "counselor"}).status_code == 403
    assert admin.patch("/api/accounts/demo-admin", json={"is_active": False}).status_code == 403


def test_admin_can_add_edit_remove_accounts(admin):
    added = admin.post("/api/accounts", json=account_input())
    assert added.status_code == 201
    identifier = added.json()["account"]["id"]
    changed = admin.patch(f"/api/accounts/{identifier}", json={"role": "admin"})
    assert changed.json()["account"]["role"] == "admin"
    assert admin.delete(f"/api/accounts/{identifier}").status_code == 204


def test_duplicate_emails_are_rejected_case_insensitively(admin):
    data = account_input()
    assert admin.post("/api/accounts", json=data).status_code == 201
    data["email"] = "SAMPLE@DEMO.EXAMPLE"
    assert admin.post("/api/accounts", json=data).status_code == 409


def test_real_email_domains_are_rejected(admin):
    data = account_input()
    data["email"] = "someone@gmail.com"
    assert admin.post("/api/accounts", json=data).status_code == 422


def test_fixed_admin_flag_cannot_be_supplied(admin):
    data = account_input()
    data["is_fixed"] = True
    assert admin.post("/api/accounts", json=data).status_code == 422
