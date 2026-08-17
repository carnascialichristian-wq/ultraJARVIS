"""Guarded file I/O for UltraJarvis."""

from __future__ import annotations

from pathlib import Path
from typing import List, Union

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

PROJECT_ROOT = Path(__file__).resolve().parent.parent


def _resolve(path: Union[str, Path], root: Path = PROJECT_ROOT) -> Path:
    p = Path(path)
    if not p.is_absolute():
        p = (root / p).resolve()
    else:
        p = p.resolve()
    return p


def _is_protected(path: Path, root: Path = PROJECT_ROOT) -> bool:
    try:
        rel = path.relative_to(root)
    except ValueError:
        return True
    rel_str = rel.as_posix()
    for prot in PROTECTED:
        if rel_str == prot or rel_str.startswith(prot + "/"):
            return True
    return False


def safe_read(path: Union[str, Path], *, encoding: str = "utf-8", root: Path = PROJECT_ROOT) -> str:
    target = _resolve(path, root)
    if not target.exists():
        raise FileNotFoundError(f"File not found: {target}")
    if not target.is_file():
        raise ValueError(f"Not a file: {target}")
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
    target = _resolve(path, root)
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
    directory: Union[str, Path] = ".",
    *,
    root: Path = PROJECT_ROOT,
    pattern: str = "**/*",
) -> List[str]:
    target = _resolve(directory, root)
    if not target.exists() or not target.is_dir():
        return []
    results: List[str] = []
    for p in sorted(target.glob(pattern)):
        if p.is_file():
            try:
                results.append(p.relative_to(root).as_posix())
            except ValueError:
                continue
    return results


def is_protected(path: Union[str, Path], root: Path = PROJECT_ROOT) -> bool:
    return _is_protected(_resolve(path, root), root)
