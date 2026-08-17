from tools.sqrt_helpers import sqrt
import pytest

def test_sqrt():
    assert sqrt(9) == 3
    with pytest.raises(ValueError):
        sqrt(-1)
