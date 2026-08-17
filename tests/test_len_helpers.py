from tools.len_helpers import length

def test_len():
    assert length("abc") == 3
    assert length([1,2]) == 2
