from tools.rindex_helpers import rindex_of

def test_rindex():
    assert rindex_of("ababa", "ab") == 2
