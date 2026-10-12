from enum import StrEnum


class ProjectStatus(StrEnum):
    LIVE = "live"
    MAINTENANCE = "maintenance"
    DEVELOPMENT = "development"
    ARCHIVED = "archived"


STATUS_ORDER = {status: position for position, status in enumerate(ProjectStatus)}
