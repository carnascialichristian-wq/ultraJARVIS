from tools.contains_helpers import contains

def test_contains():
    assert contains("hello", "ell") is True
    assert contains("hello", "xyz") is False
