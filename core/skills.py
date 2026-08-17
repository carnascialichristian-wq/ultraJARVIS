"""Skills catalog for UltraJarvis.

Allows the system to store and reuse known successful patterns / snippets.
"""

from __future__ import annotations

import json
from pathlib import Path
from typing import Any, Dict, List, Optional

DEFAULT_SKILLS_PATH = Path("workspace/skills.json")


def _load(path: Path = DEFAULT_SKILLS_PATH) -> Dict[str, Any]:
    if not path.exists():
        return {"skills": []}
    try:
        return json.loads(path.read_text(encoding="utf-8"))
    except Exception:
        return {"skills": []}


def _save(data: Dict[str, Any], path: Path = DEFAULT_SKILLS_PATH) -> None:
    path.parent.mkdir(parents=True, exist_ok=True)
    path.write_text(json.dumps(data, indent=2, ensure_ascii=False), encoding="utf-8")


def add_skill(
    name: str,
    description: str,
    tags: Optional[List[str]] = None,
    content: Optional[str] = None,
    path: Path = DEFAULT_SKILLS_PATH,
) -> Dict[str, Any]:
    data = _load(path)
    skill = {
        "name": name.strip(),
        "description": description.strip(),
        "tags": tags or [],
        "content": content or "",
    }
    skills = [s for s in data.get("skills", []) if s.get("name") != name]
    skills.append(skill)
    data["skills"] = skills
    _save(data, path)
    return skill


def find_skill(query: str, path: Path = DEFAULT_SKILLS_PATH) -> List[Dict[str, Any]]:
    data = _load(path)
    q = query.lower().strip()
    if not q:
        return data.get("skills", [])
    results = []
    for s in data.get("skills", []):
        haystack = " ".join([
            s.get("name", ""),
            s.get("description", ""),
            " ".join(s.get("tags", [])),
        ]).lower()
        if q in haystack:
            results.append(s)
    return results


def list_skills(path: Path = DEFAULT_SKILLS_PATH) -> List[Dict[str, Any]]:
    return _load(path).get("skills", [])
