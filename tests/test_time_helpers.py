from tools.time_helpers import utc_now_iso, epoch

def test_utc():
    s = utc_now_iso()
    assert "T" in s

def test_epoch():
    assert epoch() > 1_700_000_000
