"""
Smart Code Complexity Analyzer Engine
Analyzes source code and estimates time complexity using AST parsing (Python)
and regex-based pattern matching (Java, C++).
"""

import ast
import re
import math


class ComplexityResult:
    """Holds the result of a complexity analysis."""

    def __init__(self, complexity, explanation, details):
        self.complexity = complexity
        self.explanation = explanation
        self.details = details

    def to_dict(self):
        return {
            "complexity": self.complexity,
            "explanation": self.explanation,
            "details": self.details,
        }


# ─── Python AST-based Analyzer ───────────────────────────────────────────────


class PythonAnalyzer(ast.NodeVisitor):
    """Walks a Python AST to detect loops, recursion, and nesting."""

    def __init__(self, source_code):
        self.source = source_code
        self.loops = []
        self.recursions = []
        self.max_loop_depth = 0
        self.current_loop_depth = 0
        self.function_names = set()
        self.current_function = None
        self.has_log_pattern = False
        self.has_divide_conquer = False
        self.has_sorting_call = False
        self.loop_details = []

    def analyze(self):
        try:
            tree = ast.parse(self.source)
        except SyntaxError as e:
            return ComplexityResult(
                "Error",
                f"Could not parse Python code: {e}",
                {"error": str(e)},
            )

        # First pass: collect function names
        for node in ast.walk(tree):
            if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
                self.function_names.add(node.name)

        # Second pass: full analysis
        self.visit(tree)

        return self._determine_complexity()

    def visit_FunctionDef(self, node):
        prev_function = self.current_function
        self.current_function = node.name
        self.generic_visit(node)
        self.current_function = prev_function

    visit_AsyncFunctionDef = visit_FunctionDef

    def visit_For(self, node):
        self.current_loop_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.current_loop_depth)
        line = getattr(node, "lineno", "?")
        self.loops.append(
            {
                "type": "for",
                "depth": self.current_loop_depth,
                "line": line,
            }
        )
        self.loop_details.append(f"for loop at line {line} (depth {self.current_loop_depth})")
        self.generic_visit(node)
        self.current_loop_depth -= 1

    def visit_While(self, node):
        self.current_loop_depth += 1
        self.max_loop_depth = max(self.max_loop_depth, self.current_loop_depth)
        line = getattr(node, "lineno", "?")

        # Check for logarithmic patterns: i //= 2, i *= 2, i /= 2, i >>= 1
        loop_body_src = ast.dump(node)
        if any(
            pattern in loop_body_src
            for pattern in ["FloorDiv", "LShift", "RShift", "Mult"]
        ):
            self.has_log_pattern = True

        self.loops.append(
            {
                "type": "while",
                "depth": self.current_loop_depth,
                "line": line,
                "log_pattern": self.has_log_pattern,
            }
        )
        self.loop_details.append(f"while loop at line {line} (depth {self.current_loop_depth})")
        self.generic_visit(node)
        self.current_loop_depth -= 1

    def visit_Call(self, node):
        # Check for recursion
        func_name = None
        if isinstance(node.func, ast.Name):
            func_name = node.func.id
        elif isinstance(node.func, ast.Attribute):
            func_name = node.func.attr

        if func_name and func_name == self.current_function:
            line = getattr(node, "lineno", "?")
            self.recursions.append(
                {
                    "function": func_name,
                    "line": line,
                }
            )

        # Check for built-in sorting calls
        if func_name in ("sorted", "sort"):
            self.has_sorting_call = True

        self.generic_visit(node)

    def _check_divide_and_conquer(self):
        """Check if recursion splits the input (e.g., merge sort, quicksort)."""
        source_lower = self.source.lower()
        divide_patterns = [
            "mid", "// 2", "len(", "left", "right",
            "[:mid]", "[mid:]", "lo", "hi", "low", "high",
        ]
        if self.recursions and sum(1 for _ in self.recursions) >= 2:
            if any(p in source_lower for p in divide_patterns):
                return True
        # Also check for single recursion with halving
        if self.recursions:
            if any(p in source_lower for p in ["// 2", ">> 1", "/ 2"]):
                return True
        return False

    def _determine_complexity(self):
        details = {
            "loops_found": len(self.loops),
            "max_nesting_depth": self.max_loop_depth,
            "recursions_found": len(self.recursions),
            "has_log_pattern": self.has_log_pattern,
            "has_sorting_call": self.has_sorting_call,
            "loop_details": self.loop_details,
            "recursion_details": [
                f"Function '{r['function']}' calls itself at line {r['line']}"
                for r in self.recursions
            ],
        }

        has_divide_conquer = self._check_divide_and_conquer()
        details["has_divide_and_conquer"] = has_divide_conquer

        # --- Determine complexity ---

        # Case 1: Sorting calls
        if self.has_sorting_call and not self.loops:
            return ComplexityResult(
                "O(n log n)",
                "The code uses a built-in sorting function (e.g., sorted() or .sort()), "
                "which operates in O(n log n) average time complexity.",
                details,
            )

        # Case 2: Divide and conquer recursion → O(n log n)
        if has_divide_conquer and len(self.recursions) >= 2:
            return ComplexityResult(
                "O(n log n)",
                "The code uses a divide-and-conquer recursive pattern with two recursive calls "
                "that split the input in half (similar to merge sort). "
                "This results in O(n log n) time complexity.",
                details,
            )

        # Case 3: Logarithmic recursion (single recursive call halving input)
        if self.recursions and has_divide_conquer and len(self.recursions) == 1:
            if self.max_loop_depth == 0:
                return ComplexityResult(
                    "O(log n)",
                    "The code contains a single recursive call that halves the input each time "
                    "(e.g., binary search), resulting in O(log n) time complexity.",
                    details,
                )

        # Case 4: Linear recursion (single recursive call, no halving)
        if self.recursions and not has_divide_conquer:
            if self.max_loop_depth == 0:
                return ComplexityResult(
                    "O(n)",
                    "The code contains a recursive function that calls itself once per step "
                    "without halving the input, resulting in O(n) linear time complexity.",
                    details,
                )
            elif self.max_loop_depth == 1:
                return ComplexityResult(
                    "O(n²)",
                    "The code combines a loop with linear recursion, "
                    "resulting in O(n²) quadratic time complexity.",
                    details,
                )

        # Case 5: Exponential recursion (≥2 recursive calls without divide-and-conquer)
        if len(self.recursions) >= 2 and not has_divide_conquer:
            return ComplexityResult(
                "O(2ⁿ)",
                "The code has multiple recursive calls without dividing the input "
                "(e.g., naive Fibonacci), resulting in O(2ⁿ) exponential time complexity.",
                details,
            )

        # Case 6: Logarithmic loop (while loop with halving/doubling)
        if self.has_log_pattern and self.max_loop_depth == 1:
            return ComplexityResult(
                "O(log n)",
                "The code contains a loop that halves or doubles a variable each iteration "
                "(e.g., binary search loop), resulting in O(log n) logarithmic time complexity.",
                details,
            )

        # Case 7: Log-linear loop combination (log loop nested inside linear loop or vice versa)
        if self.has_log_pattern and self.max_loop_depth == 2:
            return ComplexityResult(
                "O(n log n)",
                "The code contains a combination of a linear loop and a logarithmic loop "
                "(one nested inside the other), resulting in O(n log n) time complexity.",
                details,
            )

        # Case 8: Nested loops
        if self.max_loop_depth >= 3:
            return ComplexityResult(
                f"O(n{'³' if self.max_loop_depth == 3 else '⁴' if self.max_loop_depth == 4 else '^' + str(self.max_loop_depth)})",
                f"The code contains {self.max_loop_depth} levels of nested loops. "
                f"Each nested loop multiplies the time by n, resulting in "
                f"O(n^{self.max_loop_depth}) polynomial time complexity.",
                details,
            )

        if self.max_loop_depth == 2:
            return ComplexityResult(
                "O(n²)",
                "The code contains two levels of nested loops. The outer loop runs n times "
                "and for each iteration, the inner loop also runs up to n times, "
                "resulting in O(n²) quadratic time complexity.",
                details,
            )

        if self.max_loop_depth == 1:
            return ComplexityResult(
                "O(n)",
                "The code contains a single loop that iterates through the input, "
                "resulting in O(n) linear time complexity.",
                details,
            )

        # Case 9: No loops, no recursion
        return ComplexityResult(
            "O(1)",
            "The code contains no loops or recursion. It executes a fixed number of "
            "operations regardless of input size, resulting in O(1) constant time complexity.",
            details,
        )


# ─── Multi-Language Regex-based Analyzer ──────────────────────────────────────


class RegexAnalyzer:
    """Analyzes Java, C++, JavaScript, Go, Ruby, and Rust code using regex."""

    def __init__(self, source_code, language):
        self.source = source_code
        self.language = language

    def analyze(self):
        code = self.source

        # Remove comments based on language
        if self.language == "ruby":
            code_clean = re.sub(r"#.*", "", code)
            code_clean = re.sub(r"=begin.*?=end", "", code_clean, flags=re.DOTALL)
        else:
            # C-style comments (Java, C++, JS, Go, Rust)
            code_clean = re.sub(r"//.*", "", code)
            code_clean = re.sub(r"/\*.*?\*/", "", code_clean, flags=re.DOTALL)

        loops = self._find_loops(code_clean)
        recursions = self._find_recursion(code_clean)
        max_depth = self._estimate_nesting(code_clean)
        has_log_pattern = self._check_log_patterns(code_clean)
        has_sort = self._check_sorting(code_clean)
        has_divide_conquer = self._check_divide_conquer(code_clean, recursions)

        details = {
            "loops_found": len(loops),
            "max_nesting_depth": max_depth,
            "recursions_found": len(recursions),
            "has_log_pattern": has_log_pattern,
            "has_sorting_call": has_sort,
            "has_divide_and_conquer": has_divide_conquer,
            "loop_details": loops,
            "recursion_details": recursions,
        }

        return self._determine_complexity(details)

    def _find_loops(self, code):
        loops = []
        # for/while with parens (Java, C++, JS, Go, Rust)
        for m in re.finditer(r"\b(for)\s*[\(\{]", code):
            loops.append(f"for loop found near position {m.start()}")
        for m in re.finditer(r"\b(while)\s*[\(\{]", code):
            loops.append(f"while loop found near position {m.start()}")
        for m in re.finditer(r"\b(loop)\s*\{", code):
            loops.append(f"loop found near position {m.start()}")

        # Ruby-specific loops
        if self.language == "ruby":
            for m in re.finditer(r"\.(each|map|select|times|upto|downto)\b", code):
                loops.append(f"{m.group(1)} iterator found near position {m.start()}")
            for m in re.finditer(r"\b(until)\s", code):
                loops.append(f"until loop found near position {m.start()}")

        # Go range loop
        if self.language == "go":
            for m in re.finditer(r"\bfor\s+.*\brange\b", code):
                loops.append(f"range loop found near position {m.start()}")

        return loops

    def _find_recursion(self, code):
        recursions = []
        func_patterns = {
            "java": r"(?:public|private|protected|static|\s)+[\w<>\[\]]+\s+(\w+)\s*\(",
            "cpp": r"(?:[\w:]+\s+)+(\w+)\s*\([^)]*\)\s*\{",
            "javascript": r"(?:function\s+(\w+)\s*\(|(?:const|let|var)\s+(\w+)\s*=\s*(?:function|\([^)]*\)\s*=>|\w+\s*=>))",
            "go": r"func\s+(\w+)\s*\(",
            "ruby": r"def\s+(\w+)",
            "rust": r"fn\s+(\w+)\s*\(",
        }

        pattern = func_patterns.get(self.language, func_patterns["cpp"])
        func_matches = re.finditer(pattern, code)

        for m in func_matches:
            # Get the first non-None group (handles JS with multiple groups)
            func_name = next((g for g in m.groups() if g is not None), None)
            if not func_name:
                continue

            # Find the body of this function
            body_start = m.end()
            if self.language == "ruby":
                # Ruby uses end keyword
                end_match = re.search(r"\bend\b", code[body_start:])
                body = code[body_start:body_start + end_match.end()] if end_match else code[body_start:]
            else:
                # Brace-based languages
                brace_count = 0
                i = body_start
                # Find opening brace
                while i < len(code) and code[i] != "{":
                    i += 1
                if i < len(code):
                    brace_count = 1
                    i += 1
                while i < len(code) and brace_count > 0:
                    if code[i] == "{":
                        brace_count += 1
                    elif code[i] == "}":
                        brace_count -= 1
                    i += 1
                body = code[body_start:i]

            # Check if function calls itself
            if re.search(rf"\b{re.escape(func_name)}\s*\(", body):
                recursions.append(f"Function '{func_name}' appears to call itself (recursion)")

        return recursions

    def _estimate_nesting(self, code):
        """Estimate max loop nesting depth."""
        max_depth = 0
        current_depth = 0
        lines = code.split("\n")

        if self.language == "ruby":
            for line in lines:
                stripped = line.strip()
                if re.match(r"(\.(each|map|select|times|upto|downto)\b|\b(for|while|until|loop)\b)", stripped):
                    current_depth += 1
                    max_depth = max(max_depth, current_depth)
                elif stripped == "end" and current_depth > 0:
                    current_depth -= 1
        else:
            for line in lines:
                stripped = line.strip()
                if re.match(r"\b(for|while|loop)\b", stripped):
                    current_depth += 1
                    max_depth = max(max_depth, current_depth)
                elif stripped == "}" and current_depth > 0:
                    current_depth -= 1
        return max_depth

    def _check_log_patterns(self, code):
        log_patterns = [
            r"/=\s*2", r"\*=\s*2", r">>=\s*1", r"<<=\s*1",
            r"/\s*2", r"\*\s*2",
        ]
        return any(re.search(p, code) for p in log_patterns)

    def _check_sorting(self, code):
        sort_patterns = [
            # Java
            r"Arrays\.sort", r"Collections\.sort",
            # C++
            r"std::sort", r"sort\s*\(",
            # JavaScript
            r"\.sort\s*\(", r"\.toSorted\s*\(",
            # Go
            r"sort\.Slice", r"sort\.Ints", r"sort\.Strings", r"sort\.Float64s",
            # Ruby
            r"\.sort\b", r"\.sort_by\b",
            # Rust
            r"\.sort\(\)", r"\.sort_unstable\(\)", r"\.sort_by\(",
        ]
        return any(re.search(p, code) for p in sort_patterns)

    def _check_divide_conquer(self, code, recursions):
        if not recursions:
            return False
        dc_patterns = ["mid", "low", "high", "left", "right", "lo", "hi", "/ 2"]
        code_lower = code.lower()
        return any(p in code_lower for p in dc_patterns)

    def _determine_complexity(self, details):
        loops = details["loops_found"]
        depth = details["max_nesting_depth"]
        recursions = details["recursions_found"]
        has_log = details["has_log_pattern"]
        has_sort = details["has_sorting_call"]
        has_dc = details["has_divide_and_conquer"]

        if has_sort and loops == 0:
            return ComplexityResult(
                "O(n log n)",
                "The code uses a sorting function, which typically runs in O(n log n).",
                details,
            )

        if has_dc and recursions >= 2:
            return ComplexityResult(
                "O(n log n)",
                "Divide-and-conquer recursion pattern detected with multiple recursive calls "
                "splitting the input, resulting in O(n log n) complexity.",
                details,
            )

        if recursions >= 1 and has_dc and recursions == 1:
            if depth == 0:
                return ComplexityResult(
                    "O(log n)",
                    "Single recursive call that halves the input each time → O(log n).",
                    details,
                )

        if recursions >= 1 and not has_dc:
            if depth == 0:
                return ComplexityResult(
                    "O(n)",
                    "Linear recursion detected (one recursive call per step without halving).",
                    details,
                )

        if recursions >= 2 and not has_dc:
            return ComplexityResult(
                "O(2ⁿ)",
                "Multiple recursive calls without divide-and-conquer pattern → exponential.",
                details,
            )

        if has_log and depth == 1:
            return ComplexityResult(
                "O(log n)",
                "A loop with a halving/doubling pattern detected → O(log n).",
                details,
            )

        if has_log and depth == 2:
            return ComplexityResult(
                "O(n log n)",
                "Combination of linear and logarithmic loops → O(n log n).",
                details,
            )

        if depth >= 3:
            return ComplexityResult(
                f"O(n^{depth})",
                f"{depth} levels of nested loops detected → O(n^{depth}).",
                details,
            )
        if depth == 2:
            return ComplexityResult(
                "O(n²)",
                "Two levels of nested loops detected → O(n²) quadratic complexity.",
                details,
            )
        if depth == 1:
            return ComplexityResult(
                "O(n)",
                "A single loop iterating over the input → O(n) linear complexity.",
                details,
            )

        return ComplexityResult(
            "O(1)",
            "No loops or recursion detected → O(1) constant time complexity.",
            details,
        )


# ─── Main API Function ───────────────────────────────────────────────────────

# All supported languages
SUPPORTED_LANGUAGES = {"python", "java", "cpp", "c++", "c", "javascript", "go", "ruby", "rust"}


def analyze_code(source_code, language="python"):
    """
    Analyze source code and return complexity estimation.
    Supported languages: python, java, cpp, javascript, go, ruby, rust
    """
    language = language.lower().strip()

    if not source_code or not source_code.strip():
        return ComplexityResult(
            "N/A",
            "No code provided. Please paste some code to analyze.",
            {},
        )

    if language == "python":
        analyzer = PythonAnalyzer(source_code)
    elif language in SUPPORTED_LANGUAGES:
        analyzer = RegexAnalyzer(source_code, language)
    else:
        return ComplexityResult(
            "N/A",
            f"Unsupported language: {language}. Supported: python, java, cpp, javascript, go, ruby, rust.",
            {},
        )

    return analyzer.analyze()


def compare_code(code1, lang1, code2, lang2):
    """Analyze two code snippets and return side-by-side comparison."""
    result1 = analyze_code(code1, lang1)
    result2 = analyze_code(code2, lang2)
    return {
        "snippet1": result1.to_dict(),
        "snippet2": result2.to_dict(),
    }
