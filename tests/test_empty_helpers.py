from tools.empty_helpers import is_empty

def test_empty():
    assert is_empty("")
    assert is_empty([])
    assert not is_empty("a")
