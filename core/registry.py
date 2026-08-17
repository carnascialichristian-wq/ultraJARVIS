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
    ToolSpec("math.is_prime", "True if n is prime", "tools.math_helpers", "is_prime", tags=["math"]),
    ToolSpec("string.slugify", "Basic slugify", "tools.string_helpers", "slugify_basic", tags=["string"]),
    ToolSpec("string.reverse_words", "Reverse word order", "tools.string_helpers", "reverse_words", tags=["string"]),
    ToolSpec("time.utc_now", "Current UTC ISO timestamp", "tools.time_helpers", "utc_now_iso", tags=["time"]),
    ToolSpec("time.epoch", "Current UTC epoch seconds", "tools.time_helpers", "epoch", tags=["time"]),
    ToolSpec("json.dumps_pretty", "Pretty-print JSON", "tools.json_helpers", "dumps_pretty", tags=["json"]),
    ToolSpec("json.loads_safe", "Parse JSON with default on error", "tools.json_helpers", "loads_safe", tags=["json"]),
    ToolSpec("list.chunked", "Split list into chunks", "tools.list_helpers", "chunked", tags=["list"]),
    ToolSpec("list.unique", "Unique items preserving order", "tools.list_helpers", "unique_preserve", tags=["list"]),
    ToolSpec("list.flatten", "Flatten one level of nested lists", "tools.list_helpers", "flatten", tags=["list"]),
    ToolSpec("list.safe_get", "Get index or default", "tools.list_helpers", "safe_get", tags=["list"]),
    ToolSpec("dict.safe_get", "Dict get with default", "tools.dict_helpers", "safe_get", tags=["dict"]),
    ToolSpec("dict.merge", "Merge two dicts", "tools.dict_helpers", "merge", tags=["dict"]),
    ToolSpec("dict.invert", "Invert keys/values", "tools.dict_helpers", "invert", tags=["dict"]),
    ToolSpec("hash.sha256", "SHA-256 hex of text", "tools.hash_helpers", "sha256_text", tags=["hash"]),
    ToolSpec("hash.md5", "MD5 hex of text", "tools.hash_helpers", "md5_text", tags=["hash"]),
    ToolSpec("validate.email", "Basic email format check", "tools.validate_helpers", "is_email", tags=["validate"]),
    ToolSpec("validate.nonempty", "Non-empty string check", "tools.validate_helpers", "is_nonempty", tags=["validate"]),
    ToolSpec("path.join", "Join POSIX path parts", "tools.path_helpers", "join_posix", tags=["path"]),
    ToolSpec("path.extension", "File extension lowercased", "tools.path_helpers", "extension", tags=["path"]),
    ToolSpec("bool.xor", "Boolean XOR", "tools.bool_helpers", "xor", tags=["bool"]),
    ToolSpec("bool.all_true", "True if all values are true", "tools.bool_helpers", "all_true", tags=["bool"]),
    ToolSpec("text.word_count", "Word count", "tools.text_stats", "word_count", tags=["text"]),
    ToolSpec("text.char_count", "Character count", "tools.text_stats", "char_count", tags=["text"]),
    ToolSpec("math.abs", "Absolute value", "tools.abs_helpers", "abs_val", tags=["math"]),
    ToolSpec("math.neg", "Negate number", "tools.neg_helpers", "negate", tags=["math"]),
    ToolSpec("math.inc", "Increment by 1 or step", "tools.inc_helpers", "inc", tags=["math"]),
    ToolSpec("math.mod", "Modulo", "tools.mod_helpers", "mod", tags=["math"]),
    ToolSpec("math.floor", "Floor", "tools.floor_helpers", "floor_val", tags=["math"]),
    ToolSpec("math.ceil", "Ceil", "tools.floor_helpers", "ceil_val", tags=["math"]),
    ToolSpec("math.sqrt", "Square root", "tools.sqrt_helpers", "sqrt_val", tags=["math"]),
    ToolSpec("math.round", "Round to n digits", "tools.round_helpers", "round_val", tags=["math"]),
    ToolSpec("math.sum", "Sum of numbers", "tools.sum_helpers", "sum_vals", tags=["math"]),
    ToolSpec("math.avg", "Average", "tools.avg_helpers", "avg_vals", tags=["math"]),
    ToolSpec("math.pow", "Power", "tools.pow_helpers", "pow_val", tags=["math"]),
    ToolSpec("math.sign", "Sign of number", "tools.sign_helpers", "sign", tags=["math"]),
    ToolSpec("math.pct", "Percentage", "tools.pct_helpers", "pct", tags=["math"]),
    ToolSpec("math.div", "Safe division", "tools.div_helpers", "div_safe", tags=["math"]),
    ToolSpec("math.minmax", "Min and max", "tools.minmax_helpers", "minmax", tags=["math"]),
    ToolSpec("math.range", "Range list", "tools.range_helpers", "range_list", tags=["math"]),
    ToolSpec("list.first", "First element or default", "tools.first_helpers", "first", tags=["list"]),
    ToolSpec("list.count", "Count occurrences", "tools.count_helpers", "count_of", tags=["list"]),
    ToolSpec("list.sort", "Sorted copy", "tools.sort_helpers", "sorted_copy", tags=["list"]),
    ToolSpec("string.strip", "Strip whitespace", "tools.strip_helpers", "strip", tags=["string"]),
    ToolSpec("string.title", "Title case", "tools.title_helpers", "title", tags=["string"]),
    ToolSpec("string.upper", "Uppercase", "tools.upper_helpers", "upper", tags=["string"]),
    ToolSpec("string.lower", "Lowercase", "tools.upper_helpers", "lower", tags=["string"]),
    ToolSpec("string.capitalize", "Capitalize", "tools.capitalize_helpers", "capitalize", tags=["string"]),
    ToolSpec("string.casefold", "Casefold", "tools.casefold_helpers", "casefold", tags=["string"]),
    ToolSpec("string.swapcase", "Swap case", "tools.swapcase_helpers", "swapcase", tags=["string"]),
    ToolSpec("string.rev", "Reverse string", "tools.rev_helpers", "rev", tags=["string"]),
    ToolSpec("string.startswith", "Starts with", "tools.startswith_helpers", "startswith", tags=["string"]),
    ToolSpec("string.endswith", "Ends with", "tools.startswith_helpers", "endswith", tags=["string"]),
    ToolSpec("string.replace", "Replace", "tools.replace_helpers", "replace", tags=["string"]),
    ToolSpec("string.join", "Join with separator", "tools.join_helpers", "join", tags=["string"]),
    ToolSpec("string.split", "Split", "tools.split_helpers", "split", tags=["string"]),
    ToolSpec("string.find", "Find index", "tools.find_helpers", "find", tags=["string"]),
    ToolSpec("string.rfind", "Rfind index", "tools.rfind_helpers", "rfind", tags=["string"]),
    ToolSpec("string.contains", "Contains substring", "tools.contains_helpers", "contains", tags=["string"]),
    ToolSpec("string.trim", "Trim", "tools.trim_helpers", "trim", tags=["string"]),
    ToolSpec("string.zfill", "Zfill", "tools.zfill_helpers", "zfill", tags=["string"]),
    ToolSpec("string.center", "Center", "tools.center_helpers", "center", tags=["string"]),
    ToolSpec("string.lstrip", "Lstrip", "tools.lstrip_helpers", "lstrip", tags=["string"]),
    ToolSpec("string.rstrip", "Rstrip", "tools.lstrip_helpers", "rstrip", tags=["string"]),
    ToolSpec("string.isdigit", "Is digit", "tools.isdigit_helpers", "is_digit", tags=["string"]),
    ToolSpec("string.isalpha", "Is alpha", "tools.isalpha_helpers", "is_alpha", tags=["string"]),
    ToolSpec("string.isspace", "Is space", "tools.isspace_helpers", "is_space", tags=["string"]),
    ToolSpec("string.isalnum", "Is alnum", "tools.isalnum_helpers", "is_alnum", tags=["string"]),
    ToolSpec("string.isupper", "Is upper", "tools.isupper_helpers", "is_upper", tags=["string"]),
    ToolSpec("string.islower", "Is lower", "tools.isupper_helpers", "is_lower", tags=["string"]),
    ToolSpec("string.is_identifier", "Valid Python identifier?", "tools.isidentifier_helpers", "is_identifier", tags=["string"]),
    ToolSpec("string.is_printable", "All printable?", "tools.isprintable_helpers", "is_printable", tags=["string"]),
    ToolSpec("string.is_decimal", "Decimal digits only?", "tools.isdecimal_helpers", "is_decimal", tags=["string"]),
    ToolSpec("string.is_numeric", "Numeric chars?", "tools.isnumeric_helpers", "is_numeric", tags=["string"]),
    ToolSpec("string.translate", "Translate chars", "tools.maketrans_helpers", "translate_chars", tags=["string"]),
    ToolSpec("string.splitlines", "Split into lines", "tools.splitlines_helpers", "splitlines", tags=["string"]),
    ToolSpec("string.rsplit", "Split from right", "tools.rsplit_helpers", "rsplit", tags=["string"]),
    ToolSpec("string.rpartition", "Partition from right", "tools.rpartition_helpers", "rpartition", tags=["string"]),
    ToolSpec("string.index", "Index of substring (raises)", "tools.index_helpers", "index_of", tags=["string"]),
    ToolSpec("string.rindex", "Right index of substring", "tools.rindex_helpers", "rindex_of", tags=["string"]),
    ToolSpec("string.count_str", "Count substring", "tools.count_str_helpers", "count_str", tags=["string"]),
    ToolSpec("string.pad", "Pad string", "tools.pad_helpers", "pad", tags=["string"]),
    ToolSpec("string.ord", "Ord of char", "tools.ord_helpers", "ord_char", tags=["string"]),
    ToolSpec("string.mid", "Mid substring", "tools.mid_helpers", "mid", tags=["string"]),
    ToolSpec("string.encode", "Encode to bytes", "tools.encode_helpers", "encode", tags=["string"]),
    ToolSpec("string.case", "Case conversion helpers", "tools.case_helpers", "to_case", tags=["string"]),
    ToolSpec("string.removeprefix", "Remove prefix", "tools.removeprefix_helpers", "removeprefix", tags=["string"]),
    ToolSpec("string.repeat", "Repeat string", "tools.repeat_helpers", "repeat", tags=["string"]),
    ToolSpec("string.partition", "Partition", "tools.partition_helpers", "partition", tags=["string"]),
    ToolSpec("string.expandtabs", "Expand tabs", "tools.expandtabs_helpers", "expandtabs", tags=["string"]),
    ToolSpec("string.format", "Format string", "tools.format_helpers", "format_str", tags=["string"]),
    ToolSpec("bool.not", "Boolean not", "tools.bool_not_helpers", "bool_not", tags=["bool"]),
    ToolSpec("bool.truthy", "Truthy check", "tools.truthy_helpers", "truthy", tags=["bool"]),
    ToolSpec("list.len", "Length", "tools.len_helpers", "length", tags=["list"]),
    ToolSpec("list.identity", "Identity", "tools.identity_helpers", "identity", tags=["list"]),
    ToolSpec("list.empty", "Is empty", "tools.empty_helpers", "is_empty", tags=["list"]),
    ToolSpec("bytes.helpers", "Bytes helpers", "tools.bytes_helpers", "to_bytes", tags=["bytes"]),
    ToolSpec("id.gen", "Simple id", "tools.id_helpers", "gen_id", tags=["id"]),
    ToolSpec("url.helpers", "URL helpers", "tools.url_helpers", "is_url", tags=["url"]),
    ToolSpec("version.parse", "Parse version", "tools.version_helpers", "parse_version", tags=["version"]),
    ToolSpec("retry.call", "Retry helper", "tools.retry_helpers", "retry_call", tags=["retry"]),
    ToolSpec("const.pi", "Constants", "tools.const_helpers", "pi", tags=["const"]),
    ToolSpec("env.get", "Env get", "tools.env_helpers", "get_env", tags=["env"]),
    ToolSpec("flag.parse", "Flag parse", "tools.flag_helpers", "parse_flag", tags=["flag"]),
    ToolSpec("unit.convert", "Unit helpers", "tools.unit_helpers", "convert", tags=["unit"]),
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
