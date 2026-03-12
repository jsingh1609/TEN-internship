import { useState, useRef } from "react";

const LANG_CONFIG = {
  python:     { label: "Python",     icon: "🐍", ext: "py",   color: "#3b82f6" },
  javascript: { label: "JavaScript", icon: "⚡", ext: "js",   color: "#f59e0b" },
  typescript: { label: "TypeScript", icon: "🔷", ext: "ts",   color: "#6366f1" },
  java:       { label: "Java",       icon: "☕", ext: "java", color: "#ef4444" },
  cpp:        { label: "C++",        icon: "⚙️", ext: "cpp",  color: "#8b5cf6" },
  rust:       { label: "Rust",       icon: "🦀", ext: "rs",   color: "#f97316" },
  go:         { label: "Go",         icon: "🐹", ext: "go",   color: "#06b6d4" },
  swift:      { label: "Swift",      icon: "🐦", ext: "swift",color: "#f43f5e" },
  kotlin:     { label: "Kotlin",     icon: "🎯", ext: "kt",   color: "#a855f7" },
  ruby:       { label: "Ruby",       icon: "💎", ext: "rb",   color: "#dc2626" },
};

const SAMPLE_CODES = {
  python: {
    "Bubble Sort · O(n²)": `def bubble_sort(arr):
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,
    "Binary Search · O(log n)": `def binary_search(arr, target):
    left, right = 0, len(arr) - 1
    while left <= right:
        mid = (left + right) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            left = mid + 1
        else:
            right = mid - 1
    return -1`,
    "Fibonacci Recursive · O(2ⁿ)": `def fibonacci(n):
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,
  },
  javascript: {
    "Array Sum · O(n)": `function arraySum(arr) {
  return arr.reduce((sum, val) => sum + val, 0);
}`,
    "Matrix Multiply · O(n³)": `function matrixMultiply(A, B, n) {
  const C = Array.from({length: n}, () => new Array(n).fill(0));
  for (let i = 0; i < n; i++)
    for (let j = 0; j < n; j++)
      for (let k = 0; k < n; k++)
        C[i][j] += A[i][k] * B[k][j];
  return C;
}`,
    "Binary Search · O(log n)": `function binarySearch(arr, target) {
  let lo = 0, hi = arr.length - 1;
  while (lo <= hi) {
    const mid = (lo + hi) >> 1;
    if (arr[mid] === target) return mid;
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1;
  }
  return -1;
}`,
  },
  typescript: {
    "Quick Sort · O(n log n)": `function quickSort<T>(arr: T[]): T[] {
  if (arr.length <= 1) return arr;
  const pivot = arr[Math.floor(arr.length / 2)];
  const left  = arr.filter(x => x < pivot);
  const mid   = arr.filter(x => x === pivot);
  const right = arr.filter(x => x > pivot);
  return [...quickSort(left), ...mid, ...quickSort(right)];
}`,
    "HashMap Lookup · O(n)": `function twoSum(nums: number[], target: number): number[] {
  const map = new Map<number, number>();
  for (let i = 0; i < nums.length; i++) {
    const comp = target - nums[i];
    if (map.has(comp)) return [map.get(comp)!, i];
    map.set(nums[i], i);
  }
  return [];
}`,
  },
  java: {
    "Merge Sort · O(n log n)": `void mergeSort(int[] arr, int l, int r) {
    if (l < r) {
        int m = (l + r) / 2;
        mergeSort(arr, l, m);
        mergeSort(arr, m + 1, r);
        merge(arr, l, m, r);
    }
}`,
    "Selection Sort · O(n²)": `void selectionSort(int[] arr) {
    int n = arr.length;
    for (int i = 0; i < n - 1; i++) {
        int minIdx = i;
        for (int j = i + 1; j < n; j++)
            if (arr[j] < arr[minIdx]) minIdx = j;
        int temp = arr[minIdx];
        arr[minIdx] = arr[i];
        arr[i] = temp;
    }
}`,
  },
  cpp: {
    "Constant Access · O(1)": `int getFirst(const std::vector<int>& arr) {
    return arr.front();
}`,
    "DFS Graph · O(V+E)": `void dfs(int v, vector<vector<int>>& adj, vector<bool>& visited) {
    visited[v] = true;
    for (int u : adj[v])
        if (!visited[u])
            dfs(u, adj, visited);
}`,
  },
  rust: {
    "Linear Search · O(n)": `fn linear_search<T: PartialEq>(arr: &[T], target: &T) -> Option<usize> {
    for (i, item) in arr.iter().enumerate() {
        if item == target {
            return Some(i);
        }
    }
    None
}`,
    "Merge Sort · O(n log n)": `fn merge_sort(mut arr: Vec<i32>) -> Vec<i32> {
    let len = arr.len();
    if len <= 1 { return arr; }
    let mid = len / 2;
    let right = arr.split_off(mid);
    let left = merge_sort(arr);
    let right = merge_sort(right);
    merge(left, right)
}`,
  },
  go: {
    "Binary Search · O(log n)": `func binarySearch(arr []int, target int) int {
    lo, hi := 0, len(arr)-1
    for lo <= hi {
        mid := (lo + hi) / 2
        if arr[mid] == target {
            return mid
        } else if arr[mid] < target {
            lo = mid + 1
        } else {
            hi = mid - 1
        }
    }
    return -1
}`,
    "Bubble Sort · O(n²)": `func bubbleSort(arr []int) []int {
    n := len(arr)
    for i := 0; i < n; i++ {
        for j := 0; j < n-i-1; j++ {
            if arr[j] > arr[j+1] {
                arr[j], arr[j+1] = arr[j+1], arr[j]
            }
        }
    }
    return arr
}`,
  },
  swift: {
    "QuickSort · O(n log n)": `func quickSort(_ arr: [Int]) -> [Int] {
    guard arr.count > 1 else { return arr }
    let pivot = arr[arr.count / 2]
    let less    = arr.filter { $0 < pivot }
    let equal   = arr.filter { $0 == pivot }
    let greater = arr.filter { $0 > pivot }
    return quickSort(less) + equal + quickSort(greater)
}`,
    "Factorial · O(n)": `func factorial(_ n: Int) -> Int {
    if n <= 1 { return 1 }
    return n * factorial(n - 1)
}`,
  },
  kotlin: {
    "Insertion Sort · O(n²)": `fun insertionSort(arr: IntArray): IntArray {
    for (i in 1 until arr.size) {
        val key = arr[i]
        var j = i - 1
        while (j >= 0 && arr[j] > key) {
            arr[j + 1] = arr[j]
            j--
        }
        arr[j + 1] = key
    }
    return arr
}`,
    "HashMap Check · O(n)": `fun containsDuplicate(nums: IntArray): Boolean {
    val seen = HashSet<Int>()
    for (num in nums) {
        if (!seen.add(num)) return true
    }
    return false
}`,
  },
  ruby: {
    "Bubble Sort · O(n²)": `def bubble_sort(arr)
  n = arr.length
  n.times do |i|
    (n - i - 1).times do |j|
      arr[j], arr[j+1] = arr[j+1], arr[j] if arr[j] > arr[j+1]
    end
  end
  arr
end`,
    "Binary Search · O(log n)": `def binary_search(arr, target)
  lo, hi = 0, arr.length - 1
  while lo <= hi
    mid = (lo + hi) / 2
    return mid if arr[mid] == target
    arr[mid] < target ? lo = mid + 1 : hi = mid - 1
  end
  -1
end`,
  },
};

const COMPLEXITY_META = {
  "O(1)":       { color: "#10b981", glow: "#10b98130", label: "Constant",     perf: 100, emoji: "🚀" },
  "O(log n)":   { color: "#06b6d4", glow: "#06b6d430", label: "Logarithmic",  perf: 85,  emoji: "✨" },
  "O(n)":       { color: "#f59e0b", glow: "#f59e0b30", label: "Linear",       perf: 65,  emoji: "⚡" },
  "O(n log n)": { color: "#f97316", glow: "#f9731630", label: "Linearithmic", perf: 50,  emoji: "⚠️" },
  "O(n²)":      { color: "#ef4444", glow: "#ef444430", label: "Quadratic",    perf: 30,  emoji: "🔥" },
  "O(n³)":      { color: "#dc2626", glow: "#dc262630", label: "Cubic",        perf: 15,  emoji: "💀" },
  "O(2ⁿ)":      { color: "#9333ea", glow: "#9333ea30", label: "Exponential",  perf: 5,   emoji: "☠️" },
};

export default function App() {
  const [code, setCode] = useState("");
  const [language, setLanguage] = useState("python");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [history, setHistory] = useState([]);
  const [activeTab, setActiveTab] = useState("editor");
  const [showSamples, setShowSamples] = useState(false);
  const textareaRef = useRef(null);

  const analyzeCode = async () => {
    if (!code.trim()) return;
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const response = await fetch("https://api.anthropic.com/v1/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          model: "claude-sonnet-4-20250514",
          max_tokens: 1000,
          messages: [{
            role: "user",
            content: `You are an expert algorithm complexity analyzer. Analyze this ${LANG_CONFIG[language].label} code and determine its time complexity.

Return ONLY a valid JSON object (no markdown, no extra text):
{
  "complexity": "O(n)",
  "label": "Linear",
  "confidence": "High",
  "patterns": ["single loop", "linear scan"],
  "explanation": "2-3 sentence explanation",
  "breakdown": ["outer loop runs n times", "inner operation is O(1)"],
  "tips": "one short optimization suggestion or empty string"
}

complexity must be exactly one of: O(1), O(log n), O(n), O(n log n), O(n²), O(n³), O(2ⁿ)

Code:
\`\`\`${language}
${code}
\`\`\``,
          }],
        }),
      });
      const data = await response.json();
      const text = data.content?.[0]?.text || "";
      const parsed = JSON.parse(text.replace(/```json|```/g, "").trim());
      setResult(parsed);
      setHistory(prev => [
        { snippet: code.slice(0, 70) + (code.length > 70 ? "…" : ""), language, result: parsed, time: new Date().toLocaleTimeString() },
        ...prev.slice(0, 9),
      ]);
    } catch {
      setError("Analysis failed — check your code and try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleTab = (e) => {
    if (e.key !== "Tab") return;
    e.preventDefault();
    const s = e.target.selectionStart, en = e.target.selectionEnd;
    const next = code.substring(0, s) + "  " + code.substring(en);
    setCode(next);
    setTimeout(() => { e.target.selectionStart = e.target.selectionEnd = s + 2; }, 0);
  };

  const cm = result ? (COMPLEXITY_META[result.complexity] || COMPLEXITY_META["O(n)"]) : null;
  const lc = LANG_CONFIG[language];
  const samples = SAMPLE_CODES[language] || {};

  return (
    <div style={{ minHeight: "100vh", background: "#0f0f13", color: "#e2e8f0", fontFamily: "'IBM Plex Mono', 'Fira Code', monospace", display: "flex", flexDirection: "column" }}>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;700&family=Inter:wght@400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        ::-webkit-scrollbar { width: 5px; height: 5px; }
        ::-webkit-scrollbar-track { background: #1a1a22; }
        ::-webkit-scrollbar-thumb { background: #2d2d3d; border-radius: 4px; }
        textarea { scrollbar-width: thin; scrollbar-color: #2d2d3d #1a1a22; }
        textarea::placeholder { color: #2a2a3a; }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeUp { from { opacity:0; transform:translateY(14px); } to { opacity:1; transform:translateY(0); } }
        .lang-btn { transition: all 0.15s !important; }
        .lang-btn:hover { background: #ffffff10 !important; }
        .sample-item:hover { background: #ffffff08 !important; color: #e2e8f0 !important; }
        .analyze-btn { transition: all 0.2s !important; }
        .analyze-btn:hover:not(:disabled) { transform: translateY(-2px); box-shadow: 0 10px 32px #6366f155 !important; }
        .analyze-btn:active:not(:disabled) { transform: translateY(0) !important; }
        .hist-item { transition: all 0.15s !important; }
        .hist-item:hover { border-color: #2d2d4a !important; background: #13131a !important; }
        .nav-tab { transition: all 0.15s !important; }
        .nav-tab:hover { color: #94a3b8 !important; }
        .clear-btn:hover { background: #1e1e2e !important; color: #94a3b8 !important; }
        .sample-btn:hover { background: #1e1e2e !important; color: #94a3b8 !important; }
      `}</style>

      {/* Nav */}
      <nav style={{ padding: "0 24px", height: 56, display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #1a1a25", background: "#0c0c10", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ width: 32, height: 32, borderRadius: 8, background: "linear-gradient(135deg, #1e1b4b, #2e1065)", border: "1px solid #6366f140", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M12 3C9.5 3 7.5 4.5 7 6.5C5.5 7 4 8.5 4 10.5C4 12 4.8 13.3 6 14C6 16.2 7.8 18 10 18H14C16.2 18 18 16.2 18 14C19.2 13.3 20 12 20 10.5C20 8.5 18.5 7 17 6.5C16.5 4.5 14.5 3 12 3Z" stroke="#818cf8" strokeWidth="1.4" strokeLinejoin="round"/>
                <path d="M9 12h1.5M13.5 12H15M12 10v4" stroke="#a5b4fc" strokeWidth="1.4" strokeLinecap="round"/>
                <path d="M10 18v2M14 18v2" stroke="#6366f1" strokeWidth="1.4" strokeLinecap="round"/>
                <circle cx="8" cy="10.5" r="1" fill="#818cf8"/>
                <circle cx="16" cy="10.5" r="1" fill="#818cf8"/>
              </svg>
            </div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, fontFamily: "Inter, sans-serif", color: "#f1f5f9", letterSpacing: "0.04em" }}>
              complexity<span style={{ color: "#818cf8" }}>.</span>dev
            </div>
            <div style={{ fontSize: 8.5, color: "#2d2d4a", letterSpacing: "0.16em", fontFamily: "Inter, sans-serif" }}>AI-POWERED ANALYSIS</div>
          </div>
        </div>
        <div style={{ display: "flex", gap: 4 }}>
          {[{ id: "editor", label: "Editor" }, { id: "history", label: history.length > 0 ? `History (${history.length})` : "History" }].map(t => (
            <button key={t.id} className="nav-tab" onClick={() => setActiveTab(t.id)}
              style={{ padding: "5px 14px", borderRadius: 6, border: "1px solid", borderColor: activeTab === t.id ? "#6366f1" : "transparent", background: activeTab === t.id ? "#6366f115" : "transparent", color: activeTab === t.id ? "#818cf8" : "#3d3d5a", fontSize: 11, cursor: "pointer", fontFamily: "Inter, sans-serif", fontWeight: 500 }}>
              {t.label}
            </button>
          ))}
        </div>
      </nav>

      <div style={{ flex: 1, display: "flex", overflow: "hidden" }}>

        {/* Language Sidebar */}
        <aside style={{ width: 82, background: "#0c0c10", borderRight: "1px solid #1a1a25", display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 12, paddingBottom: 12, gap: 1, flexShrink: 0, overflowY: "auto" }}>
          {Object.entries(LANG_CONFIG).map(([key, cfg]) => (
            <button key={key} className="lang-btn" onClick={() => { setLanguage(key); setResult(null); setShowSamples(false); }}
              style={{ width: 66, borderRadius: 10, border: "1px solid", borderColor: language === key ? cfg.color + "70" : "transparent", background: language === key ? cfg.color + "15" : "transparent", cursor: "pointer", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "7px 4px 5px", gap: 3, position: "relative" }}>
              <span role="img" style={{ fontSize: 20, lineHeight: 1 }}>{cfg.icon}</span>
              <span style={{ fontSize: 8.5, fontFamily: "Inter, sans-serif", fontWeight: language === key ? 600 : 400, color: language === key ? cfg.color : "#3a3a55", letterSpacing: "0.04em", lineHeight: 1 }}>{cfg.label}</span>
              {language === key && <div style={{ position: "absolute", right: -1, top: "50%", transform: "translateY(-50%)", width: 2.5, height: 20, borderRadius: "2px 0 0 2px", background: cfg.color }} />}
            </button>
          ))}
        </aside>

        {/* Content */}
        <main style={{ flex: 1, overflow: "auto", padding: "18px 22px" }}>
          {activeTab === "editor" ? (
            <div style={{ display: "grid", gridTemplateColumns: result ? "1fr 370px" : "1fr", gap: 18, maxWidth: 1160, margin: "0 auto" }}>

              {/* Editor column */}
              <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>

                {/* Toolbar */}
                <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span style={{ fontSize: 17 }}>{lc.icon}</span>
                  <span style={{ fontSize: 12, fontFamily: "Inter, sans-serif", fontWeight: 600, color: "#64748b" }}>{lc.label}</span>
                  <span style={{ fontSize: 10, color: "#2d2d3d" }}>· main.{lc.ext}</span>
                  <div style={{ flex: 1 }} />
                  <div style={{ position: "relative" }}>
                    <button className="sample-btn" onClick={() => setShowSamples(!showSamples)}
                      style={{ padding: "5px 12px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 7, color: "#4a4a6a", fontSize: 11, cursor: "pointer", fontFamily: "Inter, sans-serif", display: "flex", alignItems: "center", gap: 5, transition: "all 0.15s" }}>
                      📂 Samples ▾
                    </button>
                    {showSamples && (
                      <div style={{ position: "absolute", top: "calc(100% + 6px)", right: 0, background: "#111118", border: "1px solid #1e1e2e", borderRadius: 10, zIndex: 200, minWidth: 210, overflow: "hidden", boxShadow: "0 16px 48px #00000090" }}>
                        {Object.keys(samples).length === 0
                          ? <div style={{ padding: "12px 16px", color: "#2d2d4a", fontSize: 11 }}>No samples for this language</div>
                          : Object.entries(samples).map(([name, sc]) => (
                            <button key={name} className="sample-item" onClick={() => { setCode(sc); setShowSamples(false); setResult(null); }}
                              style={{ display: "block", width: "100%", padding: "10px 16px", background: "transparent", border: "none", borderBottom: "1px solid #1a1a22", color: "#4a4a6a", fontSize: 11, cursor: "pointer", textAlign: "left", fontFamily: "inherit", transition: "all 0.1s" }}>
                              {name}
                            </button>
                          ))}
                      </div>
                    )}
                  </div>
                  <button className="clear-btn" onClick={() => { setCode(""); setResult(null); }}
                    style={{ padding: "5px 12px", background: "#111118", border: "1px solid #1e1e2e", borderRadius: 7, color: "#4a4a6a", fontSize: 11, cursor: "pointer", fontFamily: "Inter, sans-serif", transition: "all 0.15s" }}>
                    ✕ Clear
                  </button>
                </div>

                {/* Editor box */}
                <div style={{ borderRadius: 12, overflow: "hidden", border: "1px solid #1a1a25", background: "#09090e" }}>
                  <div style={{ padding: "9px 14px", background: "#0f0f15", borderBottom: "1px solid #1a1a25", display: "flex", alignItems: "center", gap: 6 }}>
                    <div style={{ flex: 1 }} />
                    <div style={{ fontSize: 9, color: "#2a2a38", letterSpacing: "0.12em" }}>{code.split("\n").length} LINES · {code.length} CHARS</div>
                  </div>
                  <div style={{ display: "flex", minHeight: 360 }}>
                    <div style={{ padding: "13px 10px 13px 14px", background: "#0b0b12", borderRight: "1px solid #16161f", color: "#252535", fontSize: 12, lineHeight: "22px", userSelect: "none", textAlign: "right", minWidth: 40 }}>
                      {(code || " ").split("\n").map((_, i) => <div key={i}>{i + 1}</div>)}
                    </div>
                    <textarea ref={textareaRef} value={code}
                      onChange={e => { setCode(e.target.value); setResult(null); }}
                      onKeyDown={handleTab}
                      placeholder={`# Paste your ${lc.label} code here…`}
                      style={{ flex: 1, background: "transparent", border: "none", outline: "none", color: "#b8c4d0", fontSize: 13, lineHeight: "22px", padding: "13px 16px", resize: "none", fontFamily: "inherit", caretColor: lc.color, minHeight: 360 }}
                      spellCheck={false}
                    />
                  </div>
                </div>

                {/* Analyze button */}
                <button className="analyze-btn" onClick={analyzeCode} disabled={loading || !code.trim()}
                  style={{ padding: "13px", borderRadius: 10, border: "none", background: loading || !code.trim() ? "#111118" : "linear-gradient(135deg, #6366f1, #8b5cf6)", color: loading || !code.trim() ? "#2d2d4a" : "#fff", fontSize: 13, fontWeight: 700, letterSpacing: "0.06em", cursor: loading || !code.trim() ? "not-allowed" : "pointer", fontFamily: "Inter, sans-serif", boxShadow: loading || !code.trim() ? "none" : "0 4px 20px #6366f135", border: loading || !code.trim() ? "1px solid #1e1e2e" : "none" }}>
                  {loading
                    ? <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ width: 13, height: 13, border: "2px solid #2d2d4a", borderTopColor: "#818cf8", borderRadius: "50%", display: "inline-block", animation: "spin 0.7s linear infinite" }} />
                        Analyzing…
                      </span>
                    : <span style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
                        <span style={{ fontSize: 18, lineHeight: 1 }}>{lc.icon}</span>
                        Analyze Complexity
                      </span>
                  }
                </button>

                {error && (
                  <div style={{ padding: 12, background: "#ef444412", border: "1px solid #ef444428", borderRadius: 8, color: "#f87171", fontSize: 12, fontFamily: "Inter, sans-serif" }}>
                    ⚠ {error}
                  </div>
                )}
              </div>

              {/* Results column */}
              {result && cm && (
                <div style={{ display: "flex", flexDirection: "column", gap: 10, animation: "fadeUp 0.35s ease" }}>

                  {/* Hero */}
                  <div style={{ borderRadius: 14, border: `1px solid ${cm.color}28`, background: `linear-gradient(160deg, ${cm.glow} 0%, #0f0f1300 55%)`, padding: "24px 20px", textAlign: "center", position: "relative", overflow: "hidden" }}>
                    <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 1, background: `linear-gradient(90deg, transparent, ${cm.color}60, transparent)` }} />
                    <div style={{ fontSize: 9, letterSpacing: "0.2em", color: "#3a3a55", fontFamily: "Inter, sans-serif", marginBottom: 8 }}>TIME COMPLEXITY</div>
                    <div style={{ fontSize: 54, fontWeight: 800, color: cm.color, lineHeight: 1, marginBottom: 4, textShadow: `0 0 50px ${cm.glow}`, fontFamily: "Inter, sans-serif" }}>{result.complexity}</div>
                    <div style={{ fontSize: 12, color: cm.color, opacity: 0.65, letterSpacing: "0.14em", fontFamily: "Inter, sans-serif", marginBottom: 16 }}>{cm.label}</div>

                    {/* Perf bar */}
                    <div style={{ background: "#ffffff07", borderRadius: 6, height: 5, overflow: "hidden", marginBottom: 5 }}>
                      <div style={{ height: "100%", width: `${cm.perf}%`, background: `linear-gradient(90deg, ${cm.color}70, ${cm.color})`, borderRadius: 6, transition: "width 1s cubic-bezier(0.34,1.4,0.64,1)" }} />
                    </div>
                    <div style={{ display: "flex", justifyContent: "space-between", fontSize: 8.5, color: "#2d2d4a", fontFamily: "Inter, sans-serif", letterSpacing: "0.1em", marginBottom: 14 }}>
                      <span>WORST</span><span>BEST</span>
                    </div>
                    <span style={{ display: "inline-flex", alignItems: "center", gap: 6, padding: "5px 12px", background: "#ffffff07", borderRadius: 20, fontSize: 11, color: "#4a4a6a", fontFamily: "Inter, sans-serif" }}>
                      {cm.emoji} Confidence: <strong style={{ color: "#64748b" }}>{result.confidence}</strong>
                    </span>
                  </div>

                  {/* Patterns */}
                  {result.patterns?.length > 0 && (
                    <div style={{ background: "#0f0f15", border: "1px solid #1a1a25", borderRadius: 11, padding: 14 }}>
                      <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#2d2d4a", fontFamily: "Inter, sans-serif", marginBottom: 9 }}>DETECTED PATTERNS</div>
                      <div style={{ display: "flex", flexWrap: "wrap", gap: 5 }}>
                        {result.patterns.map((p, i) => (
                          <span key={i} style={{ padding: "3px 9px", background: "#1a1a25", border: "1px solid #25253a", borderRadius: 20, fontSize: 11, color: "#64748b", fontFamily: "Inter, sans-serif" }}>{p}</span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Explanation */}
                  <div style={{ background: "#0f0f15", border: "1px solid #1a1a25", borderRadius: 11, padding: 14 }}>
                    <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#2d2d4a", fontFamily: "Inter, sans-serif", marginBottom: 7 }}>EXPLANATION</div>
                    <p style={{ fontSize: 12, color: "#7a8a9a", lineHeight: 1.75, fontFamily: "Inter, sans-serif" }}>{result.explanation}</p>
                  </div>

                  {/* Breakdown */}
                  {result.breakdown?.length > 0 && (
                    <div style={{ background: "#0f0f15", border: "1px solid #1a1a25", borderRadius: 11, padding: 14 }}>
                      <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#2d2d4a", fontFamily: "Inter, sans-serif", marginBottom: 10 }}>BREAKDOWN</div>
                      {result.breakdown.map((step, i) => (
                        <div key={i} style={{ display: "flex", gap: 9, marginBottom: 8, alignItems: "flex-start" }}>
                          <span style={{ minWidth: 18, height: 18, borderRadius: "50%", background: `${cm.color}18`, border: `1px solid ${cm.color}35`, color: cm.color, fontSize: 9, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "Inter, sans-serif", flexShrink: 0, marginTop: 2 }}>{i + 1}</span>
                          <span style={{ fontSize: 11.5, color: "#5a6a7a", lineHeight: 1.65, fontFamily: "Inter, sans-serif" }}>{step}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Tip */}
                  {result.tips && (
                    <div style={{ background: "#0f0f15", border: `1px solid ${cm.color}20`, borderLeft: `3px solid ${cm.color}80`, borderRadius: 11, padding: 14 }}>
                      <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: cm.color + "70", fontFamily: "Inter, sans-serif", marginBottom: 6 }}>💡 OPTIMIZATION TIP</div>
                      <p style={{ fontSize: 11.5, color: "#5a6a7a", lineHeight: 1.65, fontFamily: "Inter, sans-serif" }}>{result.tips}</p>
                    </div>
                  )}

                  {/* Scale */}
                  <div style={{ background: "#0f0f15", border: "1px solid #1a1a25", borderRadius: 11, padding: 14 }}>
                    <div style={{ fontSize: 8.5, letterSpacing: "0.18em", color: "#2d2d4a", fontFamily: "Inter, sans-serif", marginBottom: 11 }}>COMPLEXITY SCALE</div>
                    <div style={{ display: "flex", gap: 3 }}>
                      {Object.entries(COMPLEXITY_META).map(([c, m]) => (
                        <div key={c} style={{ flex: 1, textAlign: "center" }}>
                          <div style={{ height: c === result.complexity ? 5 : 3, borderRadius: 3, background: m.color, opacity: c === result.complexity ? 1 : 0.15, marginBottom: 5, transition: "all 0.3s", boxShadow: c === result.complexity ? `0 0 8px ${m.color}90` : "none" }} />
                          <div style={{ fontSize: 7, color: c === result.complexity ? m.color : "#252535", fontFamily: "Inter, sans-serif", fontWeight: c === result.complexity ? 700 : 400 }}>{c}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : (
            /* History tab */
            <div style={{ maxWidth: 720, margin: "0 auto" }}>
              <div style={{ fontSize: 9, letterSpacing: "0.18em", color: "#2d2d4a", fontFamily: "Inter, sans-serif", marginBottom: 14 }}>ANALYSIS HISTORY</div>
              {history.length === 0
                ? <div style={{ textAlign: "center", padding: "80px 0", color: "#252535" }}>
                    <div style={{ fontSize: 36, marginBottom: 10 }}>📭</div>
                    <div style={{ fontSize: 13, fontFamily: "Inter, sans-serif" }}>No analyses yet — go analyze some code!</div>
                  </div>
                : <div style={{ display: "flex", flexDirection: "column", gap: 7 }}>
                    {history.map((item, i) => {
                      const m = COMPLEXITY_META[item.result.complexity] || COMPLEXITY_META["O(n)"];
                      const lconf = LANG_CONFIG[item.language];
                      return (
                        <div key={i} className="hist-item" onClick={() => { setCode(item.snippet); setLanguage(item.language); setResult(item.result); setActiveTab("editor"); }}
                          style={{ padding: "13px 16px", background: "#0f0f13", border: "1px solid #1a1a25", borderRadius: 10, display: "flex", alignItems: "center", gap: 12, cursor: "pointer" }}>
                          <div style={{ padding: "4px 10px", background: m.glow, border: `1px solid ${m.color}35`, borderRadius: 6, color: m.color, fontSize: 12, fontWeight: 700, fontFamily: "Inter, sans-serif", flexShrink: 0, minWidth: 72, textAlign: "center" }}>{item.result.complexity}</div>
                          <div style={{ flex: 1, overflow: "hidden" }}>
                            <div style={{ fontSize: 11.5, color: "#3d3d5a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", marginBottom: 3 }}>{item.snippet}</div>
                            <div style={{ fontSize: 10, color: "#252535", fontFamily: "Inter, sans-serif" }}>{lconf?.icon} {lconf?.label} · {item.time}</div>
                          </div>
                          <div style={{ fontSize: 14, color: "#252535" }}>›</div>
                        </div>
                      );
                    })}
                  </div>
              }
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
