from tools.json_helpers import dumps_pretty, loads_safe

def test_dumps():
    assert '"a"' in dumps_pretty({"a": 1})

def test_loads_safe():
    assert loads_safe("not json", default={}) == {}
    assert loads_safe('{"x":1}')["x"] == 1
