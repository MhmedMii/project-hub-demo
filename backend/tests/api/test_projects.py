def project_input():
    return {
        "title": {"en": "Demo Project", "ar": "مشروع تجريبي"},
        "description": {"en": "A fictional tool.", "ar": "أداة وهمية."},
        "category": {"en": "Planning", "ar": "التخطيط"},
        "status": "live",
        "private_notes": "Admin-only fictional note",
    }


def test_counselor_responses_exclude_private_data(counselor):
    projects = counselor.get("/api/projects").json()["projects"]
    assert len(projects) == 10
    assert all(project["status"] != "archived" for project in projects)
    assert all("private_notes" not in project for project in projects)


def test_archived_details_are_unavailable(counselor):
    response = counselor.get("/api/projects/legacy-session-log")
    assert response.status_code == 404


def test_admin_projects_include_archive_and_notes(admin):
    projects = admin.get("/api/projects").json()["projects"]
    assert len(projects) == 12
    assert projects[-1]["status"] == "archived"
    assert all("private_notes" in project for project in projects)


def test_counselor_cannot_create_project(counselor):
    response = counselor.post("/api/projects", json=project_input())
    assert response.status_code == 403


def test_admin_can_create_edit_remove_project(admin):
    response = admin.post("/api/projects", json=project_input())
    assert response.status_code == 201
    project = response.json()["project"]
    identifier = project["id"]
    assert project["tool_path"] == f"/demo/tools/{identifier}"
    changed = admin.patch(f"/api/projects/{identifier}", json={"status": "maintenance"})
    assert changed.json()["project"]["status"] == "maintenance"
    assert admin.delete(f"/api/projects/{identifier}").status_code == 204
    assert admin.get(f"/api/projects/{identifier}").status_code == 404


def test_project_titles_require_both_languages(admin):
    data = project_input()
    data["title"]["ar"] = " "
    assert admin.post("/api/projects", json=data).status_code == 422


def test_callers_cannot_choose_ids_or_real_destinations(admin):
    data = project_input()
    data["id"] = "caller-id"
    data["tool_path"] = "https://real.example.org"
    assert admin.post("/api/projects", json=data).status_code == 422
