from tools.splitlines_helpers import splitlines

def test_splitlines():
    assert splitlines("a\nb\nc") == ["a", "b", "c"]
