from tools.flag_helpers import has_flag

def test_flag():
    assert has_flag(0b1010, 0b0010)
    assert not has_flag(0b1000, 0b0010)
