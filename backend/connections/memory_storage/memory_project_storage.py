from threading import RLock

from backend.business_rules.project import Project


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
            self._projects[project.id] = project
            return project

    def remove(self, identifier: str) -> None:
        with self._lock:
            self._projects.pop(identifier, None)
