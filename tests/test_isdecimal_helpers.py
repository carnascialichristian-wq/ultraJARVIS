from tools.isdecimal_helpers import is_decimal

def test_decimal():
    assert is_decimal("123")
    assert not is_decimal("12.3")
