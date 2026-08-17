from tools.bool_helpers import xor, all_true

def test_xor():
    assert xor(True, False) is True
    assert xor(True, True) is False

def test_all_true():
    assert all_true([True, True]) is True
    assert all_true([True, False]) is False
