from tools.index_helpers import index_of
import pytest

def test_index():
    assert index_of("hello", "ll") == 2
    with pytest.raises(ValueError):
        index_of("hello", "x")
