from tools.list_helpers import chunked, unique_preserve, flatten, safe_get
import pytest

def test_chunked():
    assert chunked([1,2,3,4,5], 2) == [[1,2],[3,4],[5]]
    with pytest.raises(ValueError):
        chunked([1], 0)

def test_unique():
    assert unique_preserve([1,1,2,3,2]) == [1,2,3]

def test_flatten():
    assert flatten([[1, 2], [3], [4, 5]]) == [1, 2, 3, 4, 5]
    assert flatten([]) == []

def test_safe_get():
    assert safe_get([10, 20, 30], 1) == 20
    assert safe_get([10, 20], 5) is None
    assert safe_get([10], 0) == 10
    assert safe_get([], 0, default=99) == 99
