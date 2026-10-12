import ast
import sys
from pathlib import Path


BACKEND = Path(__file__).parents[2]
ALLOWED_LAYERS = {
    "business_rules": {"business_rules"},
    "actions": {"business_rules", "actions"},
    "connections": {"business_rules", "actions", "connections"},
    "server": {"business_rules", "actions", "connections", "server"},
}


def source_files():
    return [path for layer in ALLOWED_LAYERS for path in (BACKEND / layer).rglob("*.py")]


def imported_modules(tree):
    names = []
    for node in ast.walk(tree):
        if isinstance(node, ast.Import):
            names.extend(alias.name for alias in node.names)
        elif isinstance(node, ast.ImportFrom) and node.module:
            names.append(node.module)
    return names


def test_imports_follow_inward_dependencies():
    for path in source_files():
        layer = path.relative_to(BACKEND).parts[0]
        for name in imported_modules(ast.parse(path.read_text())):
            if name.startswith("backend."):
                assert name.split(".")[1] in ALLOWED_LAYERS[layer], f"{path}: {name}"
            elif layer != "server":
                assert name.split(".")[0] in sys.stdlib_module_names, f"{path}: {name}"
            assert not name.startswith("frontend"), f"{path}: cross-application import"


def test_functions_remain_small_and_focused():
    for path in source_files():
        for node in ast.walk(ast.parse(path.read_text())):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                assert node.end_lineno - node.lineno + 1 <= 30, f"{path}: {node.name} exceeds 30 lines"
                parameters = node.args.posonlyargs + node.args.args + node.args.kwonlyargs
                assert len(parameters) <= 4, f"{path}: {node.name} exceeds four parameters"
