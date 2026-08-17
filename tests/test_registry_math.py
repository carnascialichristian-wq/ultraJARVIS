from core.registry import get_registry
import core.registry as reg

def test_math_tools_callable():
    reg._default = None
    r = get_registry()
    assert r.call("math.is_even", 4) is True
    assert r.call("math.clamp", 10, 0, 5) == 5

def test_string_and_json_tools():
    import core.registry as reg
    reg._default = None
    r = reg.get_registry()
    assert "hello" in r.call("string.slugify", "Hello World")
    assert r.call("json.loads_safe", "not-json", default=0) == 0
