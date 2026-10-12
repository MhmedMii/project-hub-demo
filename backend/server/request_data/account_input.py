from pydantic import StrictBool

from backend.server.request_data.input_model import InputModel


class AccountInput(InputModel):
    name: str | None = None
    email: str | None = None
    role: str | None = None
    is_active: StrictBool | None = None
