from tools.abs_helpers import abs_int

def test_abs():
    assert abs_int(-5) == 5
    assert abs_int(3) == 3
    assert abs_int(0) == 0
