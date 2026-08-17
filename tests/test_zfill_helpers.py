from tools.zfill_helpers import zfill

def test_zfill():
    assert zfill("7", 3) == "007"
