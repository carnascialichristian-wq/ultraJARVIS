"""Dependency-graph executor for multi-file jobs."""

from __future__ import annotations

import importlib.util
import json
from pathlib import Path
from typing import Any, Dict, List, Set


class GraphError(Exception):
    pass


def load_deps(job_dir: Path) -> dict:
    path = Path(job_dir) / "deps.json"
    if not path.is_file():
        raise GraphError(f"no deps.json in {job_dir}")
    return json.loads(path.read_text(encoding="utf-8"))


def topological_order(modules: List[str], edges: List[dict]) -> List[str]:
    mods = list(modules)
    preds: Dict[str, Set[str]] = {m: set() for m in mods}
    succ: Dict[str, Set[str]] = {m: set() for m in mods}
    for e in edges:
        a, b = e.get("from"), e.get("to")
        if a not in preds or b not in preds:
            continue
        preds[b].add(a)
        succ[a].add(b)
    ready = [m for m in mods if not preds[m]]
    order: List[str] = []
    while ready:
        n = ready.pop(0)
        order.append(n)
        for s in list(succ[n]):
            preds[s].discard(n)
            if not preds[s]:
                ready.append(s)
    if len(order) != len(mods):
        raise GraphError("dependency cycle detected")
    return order


def _load_module(path: Path, *, extra_path: Path | None = None):
    import sys
    if extra_path is not None:
        sp = str(extra_path)
        if sp not in sys.path:
            sys.path.insert(0, sp)
    spec = importlib.util.spec_from_file_location(path.stem, path)
    if spec is None or spec.loader is None:
        raise GraphError(f"cannot load {path}")
    mod = importlib.util.module_from_spec(spec)
    sys.modules[path.stem] = mod
    try:
        spec.loader.exec_module(mod)
    except Exception as exc:
        raise GraphError(f"import failed for {path.name}: {exc}") from exc
    return mod


def execute_graph(job_dir: str | Path, *, entry: str = "tool.py") -> Dict[str, Any]:
    job_dir = Path(job_dir)
    deps = load_deps(job_dir)
    modules = deps.get("modules") or []
    edges = deps.get("edges") or []
    py_mods = [m for m in modules if m.endswith(".py") and m != "test_tool.py"]
    order = topological_order(py_mods, edges)
    loaded = {}
    for name in order:
        path = job_dir / name
        if not path.is_file():
            raise GraphError(f"missing module file: {name}")
        loaded[name] = _load_module(path, extra_path=job_dir)
    result = None
    if entry in loaded and hasattr(loaded[entry], "run"):
        result = loaded[entry].run()
    elif (job_dir / entry).is_file():
        mod = _load_module(job_dir / entry, extra_path=job_dir)
        if hasattr(mod, "run"):
            result = mod.run()
    return {"ok": True, "order": order, "result": result, "loaded": list(loaded.keys())}
