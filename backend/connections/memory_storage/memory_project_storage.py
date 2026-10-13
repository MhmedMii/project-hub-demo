from threading import RLock
from typing import Callable

from backend.business_rules.project import Project
from backend.business_rules.business_errors import BusinessError
from backend.connections.memory_storage.storage_limits import PROJECT_CAPACITY, require_available_capacity


class MemoryProjectStorage:
    def __init__(self, projects: list[Project]):
        self._projects = {project.id: project for project in projects}
        self._lock = RLock()

    def list(self) -> list[Project]:
        with self._lock:
            return list(self._projects.values())

    def get(self, identifier: str) -> Project | None:
        with self._lock:
            return self._projects.get(identifier)

    def save(self, project: Project) -> Project:
        with self._lock:
            if project.id not in self._projects:
                require_available_capacity(len(self._projects), PROJECT_CAPACITY)
            self._projects[project.id] = project
            return project

    def update(self, identifier: str, transform: Callable[[Project], Project]) -> Project:
        with self._lock:
            current = self._projects.get(identifier)
            if current is None:
                raise BusinessError("PROJECT_NOT_FOUND")
            changed = transform(current)
            self._projects[identifier] = changed
            return changed

    def remove(self, identifier: str) -> None:
        with self._lock:
            self._projects.pop(identifier, None)
