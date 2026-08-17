from tools.minmax_helpers import safe_min, safe_max

def test_minmax():
    assert safe_min([3,1,2]) == 1
    assert safe_max([3,1,2]) == 3
    assert safe_min([]) is None
