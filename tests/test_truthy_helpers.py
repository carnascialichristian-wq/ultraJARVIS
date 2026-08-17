from tools.truthy_helpers import is_truthy

def test_truthy():
    assert is_truthy(1)
    assert not is_truthy(0)
