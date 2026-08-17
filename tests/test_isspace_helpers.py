from tools.isspace_helpers import is_space

def test_space():
    assert is_space("  \t")
    assert not is_space(" a")
