from tools.strip_helpers import strip

def test_strip():
    assert strip("  hi  ") == "hi"
