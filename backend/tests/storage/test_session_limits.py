from datetime import datetime, timedelta, timezone

import pytest

from backend.business_rules.business_errors import BusinessError
from backend.business_rules.session import Session
from backend.connections.memory_storage.memory_session_storage import MemorySessionStorage


def test_expired_session_is_removed_from_storage():
    storage = MemorySessionStorage()
    storage.save(Session("expired-sample", "demo-admin", datetime.now(timezone.utc) - timedelta(seconds=1)))
    assert storage.get("expired-sample") is None


def test_session_capacity_rejects_growth_without_invalidating_existing_session():
    storage = MemorySessionStorage()
    expiry = datetime.now(timezone.utc) + timedelta(hours=1)
    for number in range(512):
        storage.save(Session(f"sample-{number}", "demo-admin", expiry))
    with pytest.raises(BusinessError, match="DEMO_CAPACITY_REACHED"):
        storage.save(Session("overflow", "demo-admin", expiry))
    assert storage.get("sample-0") is not None
