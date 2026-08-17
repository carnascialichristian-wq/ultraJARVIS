from tools.bool_helpers import xor, all_true

def test_xor():
    assert xor(True, False)
    assert not xor(True, True)

def test_all_true():
    assert all_true(True, True)
    assert not all_true(True, False)
