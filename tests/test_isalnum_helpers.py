from tools.isalnum_helpers import is_alnum

def test_alnum():
    assert is_alnum("A1")
    assert not is_alnum("A-1")
