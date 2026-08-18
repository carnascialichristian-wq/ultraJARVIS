"""Tests for core.graph_exec."""

from __future__ import annotations

import json
from pathlib import Path

import pytest

from core.graph_exec import execute_graph, topological_order, GraphError


def test_topo_order():
    mods = ["a.py", "b.py", "tool.py"]
    edges = [{"from": "a.py", "to": "tool.py"}, {"from": "b.py", "to": "tool.py"}]
    order = topological_order(mods, edges)
    assert order.index("a.py") < order.index("tool.py")
    assert order.index("b.py") < order.index("tool.py")


def test_cycle_raises():
    with pytest.raises(GraphError):
        topological_order(["a.py", "b.py"], [{"from": "a.py", "to": "b.py"}, {"from": "b.py", "to": "a.py"}])


def test_execute_multi(tmp_path: Path):
    (tmp_path / "a_mod.py").write_text("def run():\n    return 'ok-a'\n", encoding="utf-8")
    (tmp_path / "tool.py").write_text(
        "from a_mod import run as ra\n\ndef run():\n    return 'ok-multi ' + ra()\n", encoding="utf-8"
    )
    deps = {"modules": ["a_mod.py", "tool.py"], "edges": [{"from": "a_mod.py", "to": "tool.py"}]}
    (tmp_path / "deps.json").write_text(json.dumps(deps), encoding="utf-8")
    out = execute_graph(tmp_path)
    assert out["ok"] is True
    assert "ok-multi" in str(out["result"])
