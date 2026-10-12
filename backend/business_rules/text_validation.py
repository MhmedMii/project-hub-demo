from backend.business_rules.business_errors import BusinessError
from backend.business_rules.localized_text import LocalizedText


def clean_text(value: str, maximum: int, required: bool = True) -> str:
    cleaned = value.strip()
    if len(cleaned) > maximum or (required and not cleaned):
        raise BusinessError("INVALID_INPUT")
    return cleaned


def clean_localized_text(value: LocalizedText, maximum: int) -> LocalizedText:
    return LocalizedText(clean_text(value.en, maximum), clean_text(value.ar, maximum))
