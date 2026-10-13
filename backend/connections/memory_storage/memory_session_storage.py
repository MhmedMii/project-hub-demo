from datetime import datetime, timezone
from threading import RLock

from backend.business_rules.session import Session
from backend.connections.memory_storage.storage_limits import SESSION_CAPACITY, require_available_capacity


class MemorySessionStorage:
    def __init__(self):
        self._sessions: dict[str, Session] = {}
        self._lock = RLock()

    def get(self, identifier: str | None) -> Session | None:
        with self._lock:
            self._remove_expired()
            return self._sessions.get(identifier)

    def save(self, session: Session, replaced_identifier: str | None = None) -> Session:
        with self._lock:
            self._remove_expired()
            if session.id not in self._sessions and replaced_identifier not in self._sessions:
                require_available_capacity(len(self._sessions), SESSION_CAPACITY)
            self._sessions.pop(replaced_identifier, None)
            self._sessions[session.id] = session
            return session

    def _remove_expired(self) -> None:
        now = datetime.now(timezone.utc)
        expired = [identifier for identifier, session in self._sessions.items() if session.expires_at <= now]
        for identifier in expired:
            self._sessions.pop(identifier, None)

    def remove(self, identifier: str) -> None:
        with self._lock:
            self._sessions.pop(identifier, None)
