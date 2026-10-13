from typing import Protocol

from backend.business_rules.session import Session


class SessionStorage(Protocol):
    def get(self, identifier: str | None) -> Session | None: ...

    def save(self, session: Session, replaced_identifier: str | None = None) -> Session: ...

    def remove(self, identifier: str) -> None: ...
