from tools.rpartition_helpers import rpartition

def test_rpartition():
    assert rpartition("a-b-c", "-") == ("a-b", "-", "c")
