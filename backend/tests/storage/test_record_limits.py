from dataclasses import replace

import pytest

from backend.business_rules.business_errors import BusinessError
from backend.server.connect_parts import connect_parts


def test_project_capacity_rejects_growth_and_existing_project_remains_editable():
    storage = connect_parts().projects
    source = storage.get("counselor-planner")
    for number in range(988):
        storage.save(replace(source, id=f"sample-{number}"))
    with pytest.raises(BusinessError, match="DEMO_CAPACITY_REACHED"):
        storage.save(replace(source, id="overflow"))
    changed = storage.update(source.id, lambda current: replace(current, status="maintenance"))
    assert changed.status == "maintenance"


def test_account_capacity_rejects_growth_without_removing_existing_account():
    storage = connect_parts().accounts
    source = storage.get("sample-admin")
    for number in range(494):
        storage.save(replace(source, id=f"sample-{number}", email=f"sample-{number}@demo.example"))
    with pytest.raises(BusinessError, match="DEMO_CAPACITY_REACHED"):
        storage.save(replace(source, id="overflow", email="overflow@demo.example"))
    assert storage.get(source.id) is not None
