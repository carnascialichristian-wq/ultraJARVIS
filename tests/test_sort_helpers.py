from tools.sort_helpers import sorted_unique

def test_sorted_unique():
    assert sorted_unique([3,1,2,1]) == [1,2,3]
