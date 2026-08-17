from tools.split_helpers import split

def test_split():
    assert split("a b c") == ["a", "b", "c"]
