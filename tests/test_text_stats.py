from tools.text_stats import word_count, char_count

def test_words():
    assert word_count("a b c") == 3

def test_chars():
    assert char_count("a b") == 3
    assert char_count("a b", include_spaces=False) == 2
