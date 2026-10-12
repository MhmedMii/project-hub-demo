from threading import RLock

from backend.business_rules.session import Session


class MemorySessionStorage:
    def __init__(self):
        self._sessions: dict[str, Session] = {}
        self._lock = RLock()

    def get(self, identifier: str | None) -> Session | None:
        with self._lock:
            return self._sessions.get(identifier)

    def save(self, session: Session) -> Session:
        with self._lock:
            self._sessions[session.id] = session
            return session

    def remove(self, identifier: str) -> None:
        with self._lock:
            self._sessions.pop(identifier, None)
