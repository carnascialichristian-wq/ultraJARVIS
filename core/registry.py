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
    ToolSpec("files.safe_write", "Write a text file under the project root", "tools.files", "safe_write", safe=False, tags=["io", "write"]),
    ToolSpec("files.safe_list", "List files under a directory", "tools.files", "safe_list", tags=["io", "list"]),
    ToolSpec("websearch.search", "Search the web (stub)", "tools.websearch", "search", tags=["search"]),
    ToolSpec("browser.open_url", "Open a URL if allow-listed", "tools.browser", "open_url", safe=False, tags=["browser"]),
    ToolSpec("os.set_volume", "Set system volume (stub)", "tools.os_control", "set_volume", safe=False, tags=["os"]),
    ToolSpec("os.open_app", "Open a safe application (stub)", "tools.os_control", "open_app", safe=False, tags=["os"]),
    ToolSpec("email.draft", "Create an email draft (never sends)", "tools.email", "draft", tags=["email"]),
    ToolSpec("email.send", "Send email (SAFE_MODE)", "tools.email", "send", safe=False, tags=["email"]),
    ToolSpec("automation.paste_text", "Paste text (dry-run)", "tools.automation", "paste_text", safe=False, tags=["automation"]),
    ToolSpec("automation.type_text", "Type text (dry-run)", "tools.automation", "type_text", safe=False, tags=["automation"]),
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
    ToolSpec("dict.merge", "Shallow merge dicts", "tools.dict_helpers", "merge", tags=["dict"]),
    ToolSpec("dict.invert", "Invert key/value", "tools.dict_helpers", "invert", tags=["dict"]),
    ToolSpec("path.join", "Join POSIX path parts", "tools.path_helpers", "join_posix", tags=["path"]),
    ToolSpec("path.extension", "File extension lowercased", "tools.path_helpers", "extension", tags=["path"]),
    ToolSpec("hash.sha256", "SHA-256 hex of text", "tools.hash_helpers", "sha256_text", tags=["hash"]),
    ToolSpec("hash.md5", "MD5 hex of text", "tools.hash_helpers", "md5_text", tags=["hash"]),
    ToolSpec("validate.email", "Basic email format check", "tools.validate_helpers", "is_email", tags=["validate"]),
    ToolSpec("validate.nonempty", "Non-empty string check", "tools.validate_helpers", "is_nonempty", tags=["validate"]),
    ToolSpec("retry.retryable", "Decorator factory for simple retries", "tools.retry_helpers", "retryable", tags=["retry"]),
    ToolSpec("text.word_count", "Count words", "tools.text_stats", "word_count", tags=["text"]),
    ToolSpec("text.char_count", "Count characters", "tools.text_stats", "char_count", tags=["text"]),
    ToolSpec("bool.xor", "Boolean XOR", "tools.bool_helpers", "xor", tags=["bool"]),
    ToolSpec("bool.all_true", "True if all values are true", "tools.bool_helpers", "all_true", tags=["bool"]),
    ToolSpec("range.inclusive", "Inclusive integer range list", "tools.range_helpers", "inclusive_range", tags=["range"]),
    ToolSpec("unit.c_to_f", "Celsius to Fahrenheit", "tools.unit_helpers", "c_to_f", tags=["unit"]),
    ToolSpec("unit.f_to_c", "Fahrenheit to Celsius", "tools.unit_helpers", "f_to_c", tags=["unit"]),
    ToolSpec("id.uuid4", "Generate UUID4 string", "tools.id_helpers", "new_uuid4", tags=["id"]),
    ToolSpec("id.is_uuid", "Check UUID-like string", "tools.id_helpers", "is_uuid_like", tags=["id"]),
    ToolSpec("url.host", "Hostname from URL", "tools.url_helpers", "host_of", tags=["url"]),
    ToolSpec("url.is_https", "True if URL uses https", "tools.url_helpers", "is_https", tags=["url"]),
    ToolSpec("sort.unique", "Sorted unique items", "tools.sort_helpers", "sorted_unique", tags=["sort"]),
    ToolSpec("case.to_snake", "CamelCase to snake_case", "tools.case_helpers", "to_snake", tags=["case"]),
    ToolSpec("env.get", "Read env var with default", "tools.env_helpers", "get_env", tags=["env"]),
    ToolSpec("bytes.human", "Human-readable byte size", "tools.bytes_helpers", "human_bytes", tags=["bytes"]),
    ToolSpec("version.parse", "Parse semver to (major,minor,patch)", "tools.version_helpers", "parse_semver", tags=["version"]),
    ToolSpec("flag.has", "Check if bit flag is set", "tools.flag_helpers", "has_flag", tags=["flag"]),
    ToolSpec("pct.percent", "part/whole as percent", "tools.pct_helpers", "percent", tags=["pct"]),
    ToolSpec("minmax.min", "Min with empty default", "tools.minmax_helpers", "safe_min", tags=["minmax"]),
    ToolSpec("minmax.max", "Max with empty default", "tools.minmax_helpers", "safe_max", tags=["minmax"]),
    ToolSpec("avg.mean", "Arithmetic mean", "tools.avg_helpers", "mean", tags=["avg"]),
    ToolSpec("round.to", "Round to n decimal places", "tools.round_helpers", "round_to", tags=["round"]),
    ToolSpec("abs.int", "Absolute value of int", "tools.abs_helpers", "abs_int", tags=["abs"]),
    ToolSpec("sign.sign", "Sign of a number (-1,0,1)", "tools.sign_helpers", "sign", tags=["sign"]),
    ToolSpec("pow.power", "base ** exp", "tools.pow_helpers", "power", tags=["pow"]),
    ToolSpec("math.sqrt", "Square root", "tools.sqrt_helpers", "sqrt", tags=["math"]),
    ToolSpec("math.floor", "Floor", "tools.floor_helpers", "floor", tags=["math"]),
    ToolSpec("math.ceil", "Ceil", "tools.floor_helpers", "ceil", tags=["math"]),
    ToolSpec("math.mod", "Integer modulo", "tools.mod_helpers", "mod", tags=["math"]),
    ToolSpec("math.safe_div", "Division with default on zero", "tools.div_helpers", "safe_div", tags=["math"]),
    ToolSpec("math.total", "Sum of values", "tools.sum_helpers", "total", tags=["math"]),
    ToolSpec("list.count_of", "Count occurrences of value", "tools.count_helpers", "count_of", tags=["list"]),
    ToolSpec("list.first", "First item or default", "tools.first_helpers", "first", tags=["list"]),
    ToolSpec("list.last", "Last item or default", "tools.first_helpers", "last", tags=["list"]),
    ToolSpec("fn.identity", "Return argument unchanged", "tools.identity_helpers", "identity", tags=["fn"]),
    ToolSpec("const.pi", "Pi constant", "tools.const_helpers", "pi", tags=["const"]),
    ToolSpec("const.e", "Euler constant", "tools.const_helpers", "e", tags=["const"]),
    ToolSpec("math.neg", "Negate a number", "tools.neg_helpers", "neg", tags=["math"]),
    ToolSpec("math.inc", "Increment", "tools.inc_helpers", "inc", tags=["math"]),
    ToolSpec("math.dec", "Decrement", "tools.inc_helpers", "dec", tags=["math"]),
    ToolSpec("bool.not", "Boolean NOT", "tools.bool_not_helpers", "not_", tags=["bool"]),
    ToolSpec("util.is_empty", "True if value is empty", "tools.empty_helpers", "is_empty", tags=["util"]),
    ToolSpec("util.length", "Length of sized value", "tools.len_helpers", "length", tags=["util"]),
    ToolSpec("util.truthy", "Truthy check", "tools.truthy_helpers", "is_truthy", tags=["util"]),
    ToolSpec("string.repeat", "Repeat string n times", "tools.repeat_helpers", "repeat", tags=["string"]),
    ToolSpec("string.strip", "Strip whitespace", "tools.strip_helpers", "strip", tags=["string"]),
    ToolSpec("string.upper", "Uppercase", "tools.upper_helpers", "upper", tags=["string"]),
    ToolSpec("string.lower", "Lowercase", "tools.upper_helpers", "lower", tags=["string"]),
    ToolSpec("string.title", "Title case", "tools.title_helpers", "title", tags=["string"]),
    ToolSpec("string.starts_with", "Prefix check", "tools.startswith_helpers", "starts_with", tags=["string"]),
    ToolSpec("string.ends_with", "Suffix check", "tools.startswith_helpers", "ends_with", tags=["string"]),
    ToolSpec("string.contains", "Substring check", "tools.contains_helpers", "contains", tags=["string"]),
    ToolSpec("string.replace", "Replace substring", "tools.replace_helpers", "replace", tags=["string"]),
    ToolSpec("string.split", "Split string", "tools.split_helpers", "split", tags=["string"]),
    ToolSpec("string.join", "Join strings with separator", "tools.join_helpers", "join", tags=["string"]),
    ToolSpec("string.trim", "Trim whitespace", "tools.trim_helpers", "trim", tags=["string"]),
    ToolSpec("string.pad_left", "Left-pad string", "tools.pad_helpers", "pad_left", tags=["string"]),
    ToolSpec("string.mid", "Substring by start/length", "tools.mid_helpers", "mid", tags=["string"]),
    ToolSpec("string.is_digit", "All digits?", "tools.isdigit_helpers", "is_digit", tags=["string"]),
    ToolSpec("string.is_alpha", "All letters?", "tools.isalpha_helpers", "is_alpha", tags=["string"]),
    ToolSpec("string.is_alnum", "Alphanumeric?", "tools.isalnum_helpers", "is_alnum", tags=["string"]),
    ToolSpec("string.zfill", "Zero-pad string", "tools.zfill_helpers", "zfill", tags=["string"]),
    ToolSpec("string.center", "Center text", "tools.center_helpers", "center", tags=["string"]),
    ToolSpec("string.lstrip", "Left strip", "tools.lstrip_helpers", "lstrip", tags=["string"]),
    ToolSpec("string.rstrip", "Right strip", "tools.lstrip_helpers", "rstrip", tags=["string"]),
    ToolSpec("string.capitalize", "Capitalize first letter", "tools.capitalize_helpers", "capitalize", tags=["string"]),
    ToolSpec("string.swapcase", "Swap case", "tools.swapcase_helpers", "swapcase", tags=["string"]),
    ToolSpec("string.find", "Find substring index", "tools.find_helpers", "find", tags=["string"]),
    ToolSpec("string.count", "Count substring occurrences", "tools.count_str_helpers", "count_substr", tags=["string"]),
    ToolSpec("string.partition", "Partition by separator", "tools.partition_helpers", "partition", tags=["string"]),
    ToolSpec("string.rfind", "Find last substring index", "tools.rfind_helpers", "rfind", tags=["string"]),
    ToolSpec("string.to_bytes", "Encode to bytes", "tools.encode_helpers", "to_bytes", tags=["string"]),
    ToolSpec("string.from_bytes", "Decode bytes", "tools.encode_helpers", "from_bytes", tags=["string"]),
    ToolSpec("string.ord", "Unicode code point", "tools.ord_helpers", "char_ord", tags=["string"]),
    ToolSpec("string.chr", "Char from code point", "tools.ord_helpers", "char_chr", tags=["string"]),
    ToolSpec("string.format", "Format template with kwargs", "tools.format_helpers", "format_map", tags=["string"]),
    ToolSpec("string.is_space", "Whitespace only?", "tools.isspace_helpers", "is_space", tags=["string"]),
    ToolSpec("string.is_upper", "All uppercase?", "tools.isupper_helpers", "is_upper", tags=["string"]),
    ToolSpec("string.is_lower", "All lowercase?", "tools.isupper_helpers", "is_lower", tags=["string"]),
    ToolSpec("string.is_title", "Title-cased?", "tools.isupper_helpers", "is_title", tags=["string"]),
    ToolSpec("string.expandtabs", "Expand tabs to spaces", "tools.expandtabs_helpers", "expandtabs", tags=["string"]),
    ToolSpec("string.remove_prefix", "Remove prefix if present", "tools.removeprefix_helpers", "remove_prefix", tags=["string"]),
    ToolSpec("string.remove_suffix", "Remove suffix if present", "tools.removeprefix_helpers", "remove_suffix", tags=["string"]),
    ToolSpec("string.casefold", "Casefold for caseless matching", "tools.casefold_helpers", "casefold", tags=["string"]),
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
]


class Registry:
    def __init__(self, catalog: Optional[List[ToolSpec]] = None) -> None:
        self._tools: Dict[str, ToolSpec] = {}
        specs = _CATALOG if catalog is None else catalog
        for spec in specs:
            self._tools[spec.name] = spec

    def list_tools(self, *, tag: Optional[str] = None) -> List[ToolSpec]:
        tools = list(self._tools.values())
        if tag:
            tools = [t for t in tools if tag in t.tags]
        return sorted(tools, key=lambda t: t.name)

    def get(self, name: str) -> Optional[ToolSpec]:
        return self._tools.get(name)

    def add(self, spec: ToolSpec) -> None:
        """Register or overwrite a tool at runtime (e.g. after promote)."""
        self._tools[spec.name] = spec

    def call(self, name: str, *args: Any, **kwargs: Any) -> Any:
        spec = self.get(name)
        if spec is None:
            raise KeyError(f"Unknown tool: {name}")
        # FIX-4: never forward privileged kwargs that bypass path/protection gates
        PRIVILEGED_KWARGS = {"force", "root"}
        blocked = PRIVILEGED_KWARGS & set(kwargs)
        if blocked:
            raise PermissionError(
                f"Refusing to forward privileged kwargs {sorted(blocked)} to {name}"
            )
        # FIX-7: honour ToolSpec.safe flag
        if not getattr(spec, "safe", True):
            raise PermissionError(f"Tool {name} is not marked safe")
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
