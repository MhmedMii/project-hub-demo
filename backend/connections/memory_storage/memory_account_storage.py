from threading import RLock
from typing import Callable

from backend.business_rules.account import Account
from backend.business_rules.account_validation import ensure_email_available
from backend.business_rules.access_rules import require_account
from backend.connections.memory_storage.storage_limits import ACCOUNT_CAPACITY, require_available_capacity


class MemoryAccountStorage:
    def __init__(self, accounts: list[Account]):
        self._accounts = {account.id: account for account in accounts}
        self._lock = RLock()

    def list(self) -> list[Account]:
        with self._lock:
            return list(self._accounts.values())

    def get(self, identifier: str) -> Account | None:
        with self._lock:
            return self._accounts.get(identifier)

    def find_email(self, email: str) -> Account | None:
        with self._lock:
            return next((account for account in self._accounts.values() if account.email == email), None)

    def save(self, account: Account) -> Account:
        with self._lock:
            if account.id not in self._accounts:
                require_available_capacity(len(self._accounts), ACCOUNT_CAPACITY)
            ensure_email_available(self.find_email(account.email), account.id)
            self._accounts[account.id] = account
            return account

    def update(self, identifier: str, transform: Callable[[Account], Account]) -> Account:
        with self._lock:
            current = require_account(self._accounts.get(identifier))
            changed = transform(current)
            ensure_email_available(self.find_email(changed.email), identifier)
            self._accounts[identifier] = changed
            return changed

    def remove(self, identifier: str) -> None:
        with self._lock:
            self._accounts.pop(identifier, None)
