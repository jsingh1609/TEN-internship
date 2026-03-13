from analyzer import analyze_code

def test_recursion():
    # 1. Naive Fibonacci (Exponential O(2^n))
    fib_code = """
def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)
"""
    result = analyze_code(fib_code, "python")
    print(f"Fibonacci (Python): {result.complexity}")
    assert result.complexity == "O(2ⁿ)", f"Expected O(2ⁿ), got {result.complexity}"

    # 2. Factorial (Linear O(n))
    fact_code = """
def factorial(n):
    if n == 0:
        return 1
    return n * factorial(n - 1)
"""
    result = analyze_code(fact_code, "python")
    print(f"Factorial (Python): {result.complexity}")
    assert result.complexity == "O(n)", f"Expected O(n), got {result.complexity}"

    # 3. Binary Search (Logarithmic O(log n))
    bs_code = """
def binary_search(arr, low, high, x):
    if high >= low:
        mid = (high + low) // 2
        if arr[mid] == x:
            return mid
        elif arr[mid] > x:
            return binary_search(arr, low, mid - 1, x)
        else:
            return binary_search(arr, mid + 1, high, x)
    else:
        return -1
"""
    result = analyze_code(bs_code, "python")
    print(f"Binary Search (Python): {result.complexity}")
    assert result.complexity == "O(log n)", f"Expected O(log n), got {result.complexity}"

    # 4. Java Fibonacci (Regex-based)
    java_fib = """
public class Fib {
    public static int fib(int n) {
        if (n <= 1) return n;
        return fib(n-1) + fib(n-2);
    }
}
"""
    result = analyze_code(java_fib, "java")
    print(f"Fibonacci (Java): {result.complexity}")
    assert result.complexity == "O(2ⁿ)", f"Expected O(2ⁿ), got {result.complexity}"

    print("\nAll recursion tests passed!")

if __name__ == "__main__":
    test_recursion()
