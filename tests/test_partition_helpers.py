from tools.partition_helpers import partition

def test_partition():
    assert partition("a-b-c", "-") == ("a", "-", "b-c")
