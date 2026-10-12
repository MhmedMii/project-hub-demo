from backend.server.request_data.input_model import InputModel
from backend.server.request_data.localized_input import LocalizedInput


class ProjectInput(InputModel):
    title: LocalizedInput | None = None
    description: LocalizedInput | None = None
    category: LocalizedInput | None = None
    status: str | None = None
    private_notes: str | None = None
