"""Tool and skill registry for UltraJarvis."""

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
    ToolSpec("files.safe_read", "Read a text file under the project root", "tools.files", "safe_read", tags=["io", "read"]),
    ToolSpec("files.safe_write", "Write a text file under the project root", "tools.files", "safe_write", tags=["io", "write"]),
    ToolSpec("files.safe_list", "List files under a directory", "tools.files", "safe_list", tags=["io", "list"]),
    ToolSpec("websearch.search", "Search the web (stub)", "tools.websearch", "search", tags=["search"]),
    ToolSpec("browser.open_url", "Open a URL if allow-listed", "tools.browser", "open_url", tags=["browser"]),
    ToolSpec("os.set_volume", "Set system volume (stub)", "tools.os_control", "set_volume", tags=["os"]),
    ToolSpec("os.open_app", "Open a safe application (stub)", "tools.os_control", "open_app", tags=["os"]),
    ToolSpec("email.draft", "Create an email draft (never sends)", "tools.email", "draft", tags=["email"]),
    ToolSpec("email.send", "Send email (SAFE_MODE)", "tools.email", "send", tags=["email"]),
    ToolSpec("automation.paste_text", "Paste text (dry-run)", "tools.automation", "paste_text", tags=["automation"]),
    ToolSpec("automation.type_text", "Type text (dry-run)", "tools.automation", "type_text", tags=["automation"]),
    ToolSpec("memory.remember", "Store a short fact", "core.memory", "remember", tags=["memory"]),
    ToolSpec("memory.recall", "Recall facts by query or tag", "core.memory", "recall", tags=["memory"]),
    ToolSpec("memory.list_tags", "Count facts per tag", "core.memory", "list_tags", tags=["memory"]),
    ToolSpec("math.is_even", "Return True if n is even", "tools.math_helpers", "is_even", tags=["math"]),
    ToolSpec("math.factorial", "Return n!", "tools.math_helpers", "factorial", tags=["math"]),
    ToolSpec("math.fib", "n-th Fibonacci number", "tools.math_helpers", "fib", tags=["math"]),
    ToolSpec("math.gcd", "Greatest common divisor", "tools.math_helpers", "gcd", tags=["math"]),
    ToolSpec("math.clamp", "Clamp x into [lo, hi]", "tools.math_helpers", "clamp", tags=["math"]),
    ToolSpec("math.lcm", "Least common multiple", "tools.math_helpers", "lcm", tags=["math"]),
    ToolSpec("math.is_prime", "Prime check", "tools.math_helpers", "is_prime", tags=["math"]),
    ToolSpec("list.chunked", "Split list into chunks", "tools.list_helpers", "chunked", tags=["list"]),
    ToolSpec("list.unique", "Unique items preserving order", "tools.list_helpers", "unique_preserve", tags=["list"]),
    ToolSpec("list.flatten", "Flatten one level", "tools.list_helpers", "flatten", tags=["list"]),
    ToolSpec("list.safe_get", "Index with default", "tools.list_helpers", "safe_get", tags=["list"]),
    ToolSpec("dict.safe_get", "Dict get with default", "tools.dict_helpers", "safe_get", tags=["dict"]),
    ToolSpec("dict.merge", "Merge two dicts", "tools.dict_helpers", "merge", tags=["dict"]),
    ToolSpec("dict.invert", "Invert keys/values", "tools.dict_helpers", "invert", tags=["dict"]),
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
