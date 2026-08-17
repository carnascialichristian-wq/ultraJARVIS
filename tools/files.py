"""Guarded file I/O for UltraJarvis.

Provides safe read / write / list operations with path allow-lists
and protection for critical project files.
"""

from __future__ import annotations

import os
from pathlib import Path
from typing import List, Optional, Union

# Paths that must never be overwritten by the agent
PROTECTED = {
    "grok.md",
    "taskgrok.md",
    "docs/GROK_CONTINUITY.md",
    "docs/CONSTITUTION.md",
    "docs/DEVELOPER.md",
    "docs/PHASE2.md",
    "core/reliability.py",
    "core/job_worker.py",
    "core/natural_tasks.py",
    "core/registry.py",
    "bin/uj",
    "bin/uj-health",
    ".git",
    "pyproject.toml",
    "requirements.txt",
}

# Default root of the project (can be overridden)
PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _resolve(path: Union[str, Path], root: Path = PROJECT_ROOT) -> Path:
    """Resolve a path relative to the project root and normalise it."""
    p = Path(path)
    if not p.is_absolute():
        p = (root / p).resolve()
    else:
        p = p.resolve()
    return p


def _is_protected(path: Path, root: Path = PROJECT_ROOT) -> bool:
    """Return True if the path is in the protected set."""
    try:
        rel = path.relative_to(root)
    except ValueError:
        # Outside project root → treat as protected
        return True
    rel_str = rel.as_posix()
    for prot in PROTECTED:
        if rel_str == prot or rel_str.startswith(prot + "/"):
            return True
    return False


def is_protected(path: Union[str, Path], root: Path = PROJECT_ROOT) -> bool:
    """Public wrapper used by promote and others."""
    return _is_protected(_resolve(path, root), root)


def safe_read(
    path: Union[str, Path],
    *,
    encoding: str = "utf-8",
    root: Path = PROJECT_ROOT,
) -> str:
    """
    Read a text file if it is inside the project and not binary.

    Raises:
        FileNotFoundError, PermissionError, ValueError
    """
    target = _resolve(path, root)
    # Must stay inside project root (same containment as safe_write)
    try:
        target.relative_to(root)
    except ValueError:
        raise PermissionError(f"Path escapes project root: {target}") from None
    if not target.exists():
        raise FileNotFoundError(f"File not found: {target}")
    if not target.is_file():
        raise ValueError(f"Not a file: {target}")
    # Basic binary guard
    if target.suffix.lower() in {".pyc", ".so", ".dll", ".exe", ".bin", ".db"}:
        raise ValueError(f"Refusing to read binary-like file: {target}")
    return target.read_text(encoding=encoding)


def safe_write(
    path: Union[str, Path],
    content: str,
    *,
    encoding: str = "utf-8",
    root: Path = PROJECT_ROOT,
    force: bool = False,
) -> Path:
    """
    Write content to a file under the project root.

    - Creates parent directories.
    - Refuses to write to protected paths unless force=True.
    - Uses a temporary file + rename for atomicity.

    Returns the resolved path that was written.
    """
    target = _resolve(path, root)
    # Must stay inside project root
    try:
        target.relative_to(root)
    except ValueError:
        raise PermissionError(f"Path escapes project root: {target}") from None

    if _is_protected(target, root) and not force:
        try:
            rel = target.relative_to(root).as_posix()
        except ValueError:
            rel = str(target)
        raise PermissionError(f"Refusing to write to protected path: {rel}")

    target.parent.mkdir(parents=True, exist_ok=True)
    tmp = target.with_suffix(target.suffix + ".tmp")
    tmp.write_text(content, encoding=encoding)
    tmp.replace(target)
    return target


def safe_list(
    path: Union[str, Path] = ".",
    *,
    root: Path = PROJECT_ROOT,
) -> List[str]:
    """List files under path (relative to root), returning posix relative paths."""
    target = _resolve(path, root)
    try:
        target.relative_to(root)
    except ValueError:
        raise PermissionError(f"Path escapes project root: {target}") from None
    if not target.exists():
        return []
    if not target.is_dir():
        raise ValueError(f"Not a directory: {target}")
    out: List[str] = []
    for p in sorted(target.rglob("*")):
        if p.is_file():
            try:
                out.append(p.relative_to(root).as_posix())
            except ValueError:
                continue
    return out
