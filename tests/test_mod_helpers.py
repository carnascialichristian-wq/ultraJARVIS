from tools.mod_helpers import mod
import pytest

def test_mod():
    assert mod(10, 3) == 1
    with pytest.raises(ValueError):
        mod(1, 0)
