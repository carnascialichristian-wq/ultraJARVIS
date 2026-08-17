from tools.count_helpers import count_of

def test_count():
    assert count_of([1,1,2], 1) == 2
