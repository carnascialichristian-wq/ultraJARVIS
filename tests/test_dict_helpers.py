from tools.dict_helpers import safe_get, merge, invert

def test_dict():
    assert safe_get({"a":1}, "a") == 1
    assert merge({"a":1}, {"b":2})["b"] == 2
