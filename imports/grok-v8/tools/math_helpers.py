"""Small math helpers."""

from __future__ import annotations


def is_even(n: int) -> bool:
    return n % 2 == 0


def factorial(n: int) -> int:
    if n < 0:
        raise ValueError("n must be >= 0")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def fib(n: int) -> int:
    if n < 0:
        raise ValueError("n must be >= 0")
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def is_palindrome(s: str) -> bool:
    t = "".join(ch.lower() for ch in s if ch.isalnum())
    return t == t[::-1]


def clamp(x: float, lo: float, hi: float) -> float:
    return max(lo, min(hi, x))
