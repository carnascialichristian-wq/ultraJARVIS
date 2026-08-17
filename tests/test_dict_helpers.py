from tools.dict_helpers import safe_get, merge, invert

def test_safe_get():
    assert safe_get({"a": 1}, "a") == 1
    assert safe_get({}, "x", 0) == 0

def test_merge():
    assert merge({"a": 1}, {"b": 2}) == {"a": 1, "b": 2}

def test_invert():
    assert invert({"a": 1}) == {1: "a"}
