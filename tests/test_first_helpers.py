from tools.first_helpers import first, last

def test_first_last():
    assert first([1,2,3]) == 1
    assert last([1,2,3]) == 3
    assert first([]) is None
