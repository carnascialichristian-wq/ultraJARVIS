from tools.find_helpers import find

def test_find():
    assert find("hello", "ll") == 2
    assert find("hello", "x") == -1
