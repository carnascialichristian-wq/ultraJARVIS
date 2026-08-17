from tools.pad_helpers import pad_left

def test_pad():
    assert pad_left("7", 3, "0") == "007"
