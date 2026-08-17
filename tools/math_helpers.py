"""Small math helpers promoted from job pipeline experiments."""

from __future__ import annotations


def is_even(n: int) -> bool:
    """Return True if n is even."""
    return n % 2 == 0


def factorial(n: int) -> int:
    """Return n! for n >= 0."""
    if n < 0:
        raise ValueError("n must be >= 0")
    result = 1
    for i in range(2, n + 1):
        result *= i
    return result


def fib(n: int) -> int:
    """Return the n-th Fibonacci number (n >= 0)."""
    if n < 0:
        raise ValueError("n must be >= 0")
    a, b = 0, 1
    for _ in range(n):
        a, b = b, a + b
    return a


def is_palindrome(s: str) -> bool:
    """Return True if s is a palindrome (case-insensitive, alphanumeric only)."""
    t = "".join(ch.lower() for ch in s if ch.isalnum())
    return t == t[::-1]


def clamp(x: float, lo: float, hi: float) -> float:
    """Clamp x into [lo, hi]."""
    return max(lo, min(hi, x))


def gcd(a: int, b: int) -> int:
    """Greatest common divisor."""
    a, b = abs(a), abs(b)
    while b:
        a, b = b, a % b
    return a


def lcm(a: int, b: int) -> int:
    """Least common multiple. Returns 0 if either argument is 0."""
    a, b = abs(a), abs(b)
    if a == 0 or b == 0:
        return 0
    return a // gcd(a, b) * b


def is_prime(n: int) -> bool:
    """Return True if n is a prime number (n > 1)."""
    if n <= 1:
        return False
    if n <= 3:
        return True
    if n % 2 == 0 or n % 3 == 0:
        return False
    i = 5
    while i * i <= n:
        if n % i == 0 or n % (i + 2) == 0:
            return False
        i += 6
    return True
