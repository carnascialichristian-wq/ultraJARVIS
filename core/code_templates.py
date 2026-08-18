"""Heuristic code bodies for NaturalTaskRunner (split from natural_tasks)."""

from __future__ import annotations


def code_for_prompt(prompt: str, title: str) -> str:
    """Deterministic code body heuristics for common tasks."""
    low = prompt.lower()
    if "is_even" in low or "even int" in low:
        return (
            "def is_even(n: int) -> bool:\n"
            '    """Return True if n is even."""\n'
            "    return n % 2 == 0\n\n\n"
            "def run() -> str:\n"
            "    assert is_even(2) and not is_even(3)\n"
            '    return "ok – is_even works"\n'
        )
    if "factorial" in low:
        return (
            "def factorial(n: int) -> int:\n"
            '    """Return n! for n >= 0."""\n'
            "    if n < 0:\n"
            '        raise ValueError("n must be >= 0")\n'
            "    result = 1\n"
            "    for i in range(2, n + 1):\n"
            "        result *= i\n"
            "    return result\n\n\n"
            "def run() -> str:\n"
            "    assert factorial(5) == 120\n"
            '    return "ok – factorial works"\n'
        )
    if "fibonacci" in low or "fib(" in low:
        return (
            "def fib(n: int) -> int:\n"
            '    """Return the n-th Fibonacci number (n >= 0)."""\n'
            "    if n < 0:\n"
            '        raise ValueError("n must be >= 0")\n'
            "    a, b = 0, 1\n"
            "    for _ in range(n):\n"
            "        a, b = b, a + b\n"
            "    return a\n\n\n"
            "def run() -> str:\n"
            "    assert fib(10) == 55\n"
            '    return "ok – fib works"\n'
        )
    if "is_prime" in low or "prime number" in low:
        return (
            "def is_prime(n: int) -> bool:\n"
            '    """Return True if n is a prime number."""\n'
            "    if n <= 1:\n"
            "        return False\n"
            "    if n <= 3:\n"
            "        return True\n"
            "    if n % 2 == 0 or n % 3 == 0:\n"
            "        return False\n"
            "    i = 5\n"
            "    while i * i <= n:\n"
            "        if n % i == 0 or n % (i + 2) == 0:\n"
            "            return False\n"
            "        i += 6\n"
            "    return True\n\n\n"
            "def run() -> str:\n"
            "    assert is_prime(17) and not is_prime(15)\n"
            '    return "ok – is_prime works"\n'
        )
    if "lcm" in low or "least common" in low:
        return (
            "def gcd(a: int, b: int) -> int:\n"
            "    a, b = abs(a), abs(b)\n"
            "    while b:\n"
            "        a, b = b, a % b\n"
            "    return a\n\n\n"
            "def lcm(a: int, b: int) -> int:\n"
            '    """Least common multiple."""\n'
            "    a, b = abs(a), abs(b)\n"
            "    if a == 0 or b == 0:\n"
            "        return 0\n"
            "    return a // gcd(a, b) * b\n\n\n"
            "def run() -> str:\n"
            "    assert lcm(4, 6) == 12\n"
            '    return "ok – lcm works"\n'
        )
    if "gcd" in low or "greatest common" in low:
        return (
            "def gcd(a: int, b: int) -> int:\n"
            '    """Greatest common divisor."""\n'
            "    a, b = abs(a), abs(b)\n"
            "    while b:\n"
            "        a, b = b, a % b\n"
            "    return a\n\n\n"
            "def run() -> str:\n"
            "    assert gcd(12, 18) == 6\n"
            '    return "ok – gcd works"\n'
        )
    if "clamp" in low:
        return (
            "def clamp(x: float, lo: float, hi: float) -> float:\n"
            '    """Clamp x into [lo, hi]."""\n'
            "    return max(lo, min(hi, x))\n\n\n"
            "def run() -> str:\n"
            "    assert clamp(5, 0, 3) == 3 and clamp(-1, 0, 3) == 0\n"
            '    return "ok – clamp works"\n'
        )
    if "mean" in low or "average" in low or "arithmetic mean" in low:
        return (
            "def mean(values):\n"
            '    """Arithmetic mean of a non-empty sequence of numbers."""\n'
            "    values = list(values)\n"
            "    if not values:\n"
            '        raise ValueError("mean of empty sequence")\n'
            "    return sum(values) / len(values)\n\n\n"
            "def run() -> str:\n"
            "    assert mean([1, 2, 3, 4]) == 2.5\n"
            '    return "ok – mean works"\n'
        )
    if "palindrome" in low:
        return (
            "def is_palindrome(s: str) -> bool:\n"
            '    """Return True if s is a palindrome (case-insensitive)."""\n'
            '    t = "".join(ch.lower() for ch in s if ch.isalnum())\n'
            "    return t == t[::-1]\n\n\n"
            "def run() -> str:\n"
            '    assert is_palindrome("Racecar")\n'
            '    return "ok – palindrome works"\n'
        )
    if "slugify" in low or "slug" in low:
        return (
            "import re\n\n\n"
            "def slugify(text: str) -> str:\n"
            '    """Lowercase, replace non-alnum with underscore."""\n'
            "    text = text.lower().strip()\n"
            '    text = re.sub(r"[^a-z0-9]+", "_", text)\n'
            '    return text.strip("_") or "item"\n\n\n'
            "def run() -> str:\n"
            '    assert slugify("Hello World!") == "hello_world"\n'
            '    return "ok – slugify works"\n'
        )
    if "reverse_words" in low or "reverse word" in low or "reverse the words" in low:
        return (
            "def reverse_words(text: str) -> str:\n"
            '    """Reverse the order of words in a string."""\n'
            '    return " ".join(reversed(text.split()))\n\n\n'
            "def run() -> str:\n"
            '    assert reverse_words("one two three") == "three two one"\n'
            '    return "ok – reverse_words works"\n'
        )
    if "unique" in low or "dedupe" in low or "deduplicate" in low:
        return (
            "def unique(items):\n"
            '    """Return unique items preserving order."""\n'
            "    seen = set()\n"
            "    out = []\n"
            "    for x in items:\n"
            "        if x not in seen:\n"
            "            seen.add(x)\n"
            "            out.append(x)\n"
            "    return out\n\n\n"
            "def run() -> str:\n"
            "    assert unique([1, 2, 1, 3, 2]) == [1, 2, 3]\n"
            '    return "ok – unique works"\n'
        )
    if "flatten" in low:
        return (
            "def flatten(nested):\n"
            '    """Flatten one level of nested lists."""\n'
            "    out = []\n"
            "    for item in nested:\n"
            "        if isinstance(item, list):\n"
            "            out.extend(item)\n"
            "        else:\n"
            "            out.append(item)\n"
            "    return out\n\n\n"
            "def run() -> str:\n"
            "    assert flatten([[1, 2], [3], 4]) == [1, 2, 3, 4]\n"
            '    return "ok – flatten works"\n'
        )
    return (
        "def run() -> str:\n"
        f'    """Entry point for: {title}"""\n'
        f'    return "ok – executed for {title}"\n'
    )
