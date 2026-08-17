from tools.isdigit_helpers import is_digit

def test_digit():
    assert is_digit("123")
    assert not is_digit("12a")
