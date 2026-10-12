import json
from pathlib import Path


def load_demo_data(filename: str) -> list[dict]:
    path = Path(__file__).parent / filename
    return json.loads(path.read_text(encoding="utf-8"))
