from tools.isalpha_helpers import is_alpha

def test_alpha():
    assert is_alpha("AbC")
    assert not is_alpha("A1")
