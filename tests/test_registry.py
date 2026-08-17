"""Tests for core.registry."""

from __future__ import annotations

import pytest

from core.registry import Registry, get_registry, ToolSpec


def test_list_tools():
    reg = get_registry()
    tools = reg.list_tools()
    assert len(tools) >= 5
    names = {t.name for t in tools}
    assert "files.safe_read" in names
    assert "websearch.search" in names


def test_filter_by_tag():
    reg = get_registry()
    io_tools = reg.list_tools(tag="io")
    assert all("io" in t.tags for t in io_tools)
    assert len(io_tools) >= 2


def test_call_websearch():
    reg = get_registry()
    results = reg.call("websearch.search", "ultra jarvis")
    assert isinstance(results, list)
    assert len(results) >= 1


def test_unknown_tool():
    reg = get_registry()
    with pytest.raises(KeyError):
        reg.call("does.not.exist")


def test_add_tool():
    from core.registry import Registry, ToolSpec
    reg = Registry(catalog=[])
    assert len(reg.list_tools()) == 0
    reg.add(ToolSpec("demo.echo", "Echo", "tools.identity_helpers", "identity", tags=["demo"]))
    assert reg.get("demo.echo") is not None
    assert reg.call("demo.echo", 42) == 42
