from backend.actions.storage_interfaces.session_storage import SessionStorage


def sign_out(identifier: str, sessions: SessionStorage) -> None:
    sessions.remove(identifier)
