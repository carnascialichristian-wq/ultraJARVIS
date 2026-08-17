from tools.validate_helpers import is_email, is_nonempty

def test_email():
    assert is_email("a@b.co")
    assert not is_email("nope")

def test_nonempty():
    assert is_nonempty(" x ")
    assert not is_nonempty("  ")
