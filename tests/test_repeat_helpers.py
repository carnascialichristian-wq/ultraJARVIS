from tools.repeat_helpers import repeat

def test_repeat():
    assert repeat("ab", 3) == "ababab"
    assert repeat("x", 0) == ""
