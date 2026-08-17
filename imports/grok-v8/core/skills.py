"""Skills catalog for UltraJarvis.

Persists simple skill records in workspace/skills.json.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_PATH = Path("workspace/skills.json")


def _load(path: Path = DEFAULT_PATH) -> List[Dict[str, Any]]:
    if not path.exists():
        return []
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return []


def _save(skills: List[Dict[str, Any]], path: Path = DEFAULT_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(skills, indent=2, ensure_ascii=False), encoding="utf-8")


def add_skill(name: str, description: str, *, tags: Optional[List[str]] = None, path: Path = DEFAULT_PATH) -> Dict[str, Any]:
    skills = _load(path)
    entry = {"name": name, "description": description, "tags": tags or []}
    # replace if exists
    skills = [s for s in skills if s.get("name") != name]
    skills.append(entry)
    _save(skills, path)
    return entry


def find_skill(name: str, path: Path = DEFAULT_PATH) -> Optional[Dict[str, Any]]:
    for s in _load(path):
        if s.get("name") == name:
            return s
    return None


def list_skills(path: Path = DEFAULT_PATH) -> List[Dict[str, Any]]:
    return _load(path)
