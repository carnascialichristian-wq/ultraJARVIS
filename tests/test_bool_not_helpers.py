from tools.bool_not_helpers import bool_not

def test_bool_not():
    assert bool_not(True) is False
    assert bool_not(False) is True
