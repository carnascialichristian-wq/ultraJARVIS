from tools.avg_helpers import avg

def test_avg():
    assert avg([1, 2, 3]) == 2.0
    assert avg([10]) == 10.0
