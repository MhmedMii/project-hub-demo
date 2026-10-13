from concurrent.futures import ThreadPoolExecutor

import pytest

from backend.actions.edit_account import edit_account
from backend.actions.edit_project import edit_project
from backend.actions.remove_account import remove_account
from backend.actions.remove_project import remove_project
from backend.business_rules.account_changes import AccountChanges
from backend.business_rules.business_errors import BusinessError
from backend.business_rules.project_changes import ProjectChanges
from backend.tests.concurrency.pausing_storage import PausingStorage


@pytest.mark.parametrize("changes, field, expected", [
    (AccountChanges(role="counselor"), "role", "counselor"),
    (AccountChanges(is_active=False), "is_active", False),
])
def test_pending_name_edit_preserves_access_change(admin, application, changes, field, expected):
    data = application.state.data
    actor = data.accounts.get("demo-admin")
    paused = PausingStorage(data.accounts)
    with ThreadPoolExecutor(max_workers=1) as pool:
        pending = pool.submit(edit_account, actor, "sample-admin", AccountChanges(name="Renamed Sample"), paused)
        try:
            assert paused.waiting.wait(timeout=5)
            edit_account(actor, "sample-admin", changes, data.accounts)
        finally:
            paused.proceed.set()
        pending.result(timeout=5)
    final = data.accounts.get("sample-admin")
    assert getattr(final, field) == expected
    assert final.name == "Renamed Sample"


def test_pending_project_note_preserves_status_change(admin, application):
    data = application.state.data
    actor = data.accounts.get("demo-admin")
    paused = PausingStorage(data.projects)
    with ThreadPoolExecutor(max_workers=1) as pool:
        pending = pool.submit(edit_project, actor, "counselor-planner", ProjectChanges(private_notes="Sample note"), paused)
        try:
            assert paused.waiting.wait(timeout=5)
            edit_project(actor, "counselor-planner", ProjectChanges(status="maintenance"), data.projects)
        finally:
            paused.proceed.set()
        pending.result(timeout=5)
    final = data.projects.get("counselor-planner")
    assert final.status == "maintenance"
    assert final.private_notes == "Sample note"


@pytest.mark.parametrize("kind", ["account", "project"])
def test_pending_edit_cannot_restore_deleted_record(admin, application, kind):
    data = application.state.data
    actor = data.accounts.get("demo-admin")
    if kind == "account":
        storage, identifier = data.accounts, "sample-admin"
        edit, remove, changes = edit_account, remove_account, AccountChanges(name="Renamed Sample")
    else:
        storage, identifier = data.projects, "counselor-planner"
        edit, remove, changes = edit_project, remove_project, ProjectChanges(status="maintenance")
    paused = PausingStorage(storage)
    with ThreadPoolExecutor(max_workers=1) as pool:
        pending = pool.submit(edit, actor, identifier, changes, paused)
        try:
            assert paused.waiting.wait(timeout=5)
            remove(actor, identifier, storage)
        finally:
            paused.proceed.set()
        with pytest.raises(BusinessError, match="NOT_FOUND"):
            pending.result(timeout=5)
    assert storage.get(identifier) is None
