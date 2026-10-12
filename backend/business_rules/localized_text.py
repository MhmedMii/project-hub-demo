from dataclasses import dataclass


@dataclass(frozen=True)
class LocalizedText:
    en: str
    ar: str
