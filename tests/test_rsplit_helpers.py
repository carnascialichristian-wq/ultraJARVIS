from tools.rsplit_helpers import rsplit

def test_rsplit():
    assert rsplit("a-b-c", "-", 1) == ["a-b", "c"]
