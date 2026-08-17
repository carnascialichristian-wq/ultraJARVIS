"""Tool and skill registry for UltraJarvis.

Central place to list available tools and dispatch simple calls.
"""

from __future__ import annotations

from dataclasses import dataclass, field
from typing import Any, Callable, Dict, List, Optional


@dataclass
class ToolSpec:
    name: str
    description: str
    module: str
    callable_name: str
    safe: bool = True
    tags: List[str] = field(default_factory=list)


_CATALOG: List[ToolSpec] = [
    ToolSpec(
        name="files.safe_read",
        description="Read a text file under the project root",
        module="tools.files",
        callable_name="safe_read",
        tags=["io", "read"],
    ),
    ToolSpec(
        name="files.safe_write",
        description="Write a text file under the project root (protected paths blocked)",
        module="tools.files",
        callable_name="safe_write",
        tags=["io", "write"],
    ),
    ToolSpec(
        name="files.safe_list",
        description="List files under a directory",
        module="tools.files",
        callable_name="safe_list",
        tags=["io", "list"],
    ),
    ToolSpec(
        name="websearch.search",
        description="Search the web (stub)",
        module="tools.websearch",
        callable_name="search",
        tags=["search"],
    ),
    ToolSpec(
        name="browser.open_url",
        description="Open a URL if it is in the allow-list",
        module="tools.browser",
        callable_name="open_url",
        tags=["browser"],
    ),
    ToolSpec(
        name="os.set_volume",
        description="Set system volume (stub, no real change)",
        module="tools.os_control",
        callable_name="set_volume",
        tags=["os"],
    ),
    ToolSpec(
        name="os.open_app",
        description="Open a safe application (stub)",
        module="tools.os_control",
        callable_name="open_app",
        tags=["os"],
    ),
]


class Registry:
    def __init__(self, catalog: Optional[List[ToolSpec]] = None) -> None:
        self._tools: Dict[str, ToolSpec] = {}
        for spec in catalog or _CATALOG:
            self._tools[spec.name] = spec

    def list_tools(self, *, tag: Optional[str] = None) -> List[ToolSpec]:
        tools = list(self._tools.values())
        if tag:
            tools = [t for t in tools if tag in t.tags]
        return sorted(tools, key=lambda t: t.name)

    def get(self, name: str) -> Optional[ToolSpec]:
        return self._tools.get(name)

    def call(self, name: str, *args: Any, **kwargs: Any) -> Any:
        """Dynamically import and call a registered tool."""
        spec = self.get(name)
        if spec is None:
            raise KeyError(f"Unknown tool: {name}")
        import importlib

        mod = importlib.import_module(spec.module)
        fn: Callable = getattr(mod, spec.callable_name)
        return fn(*args, **kwargs)


_default: Optional[Registry] = None


def get_registry() -> Registry:
    global _default
    if _default is None:
        _default = Registry()
    return _default
