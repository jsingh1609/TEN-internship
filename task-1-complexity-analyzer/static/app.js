/* ═══════════════════════════════════════════════════════════════════════════
   Smart Code Complexity Analyzer – Frontend Application
   SPA router, CodeMirror setup, API integration, complexity visualization
   ═══════════════════════════════════════════════════════════════════════════ */

// ─── Globals ─────────────────────────────────────────────────────────────────

const COMPLEXITY_RANK = {
  'O(1)': 0,
  'O(log n)': 1,
  'O(n)': 2,
  'O(n log n)': 3,
  'O(n²)': 4,
  'O(n³)': 5,
  'O(2ⁿ)': 6,
  'N/A': 100
};

let editor = null;
let compareEditor1 = null;
let compareEditor2 = null;

const API_BASE = '';

// Language → CodeMirror mode mapping
const LANG_MODES = {
  python: 'python',
  java: 'text/x-java',
  cpp: 'text/x-c++src',
  javascript: 'javascript',
  go: 'text/x-go',
  ruby: 'text/x-ruby',
  rust: 'text/x-rustsrc',
  kotlin: 'text/x-kotlin',
  xml: 'xml'
};

// Language → file extension
const LANG_EXT = {
  python: '.py', java: '.java', cpp: '.cpp',
  javascript: '.js', go: '.go', ruby: '.rb', rust: '.rs',
  kotlin: '.kt', xml: '.xml'
};

// Complexity scale data
const SCALE_DATA = [
  { key: 'o1', label: 'O(1)', height: 20, color: '#34d399' },
  { key: 'ologn', label: 'O(log n)', height: 40, color: '#06b6d4' },
  { key: 'on', label: 'O(n)', height: 75, color: '#a855f7' },
  { key: 'onlogn', label: 'O(n log n)', height: 110, color: '#fbbf24' },
  { key: 'on2', label: 'O(n²)', height: 160, color: '#fb923c' },
  { key: 'on3', label: 'O(n³)', height: 210, color: '#f43f5e' },
  { key: 'o2n', label: 'O(2ⁿ)', height: 270, color: '#ef4444' },
];

// ─── Sample Code Snippets ────────────────────────────────────────────────────

const SAMPLES = {
  o1: `def get_first(arr):
    """Return the first element - constant time."""
    if len(arr) > 0:
        return arr[0]
    return None`,

  ologn: `def binary_search(arr, target):
    """Binary search - logarithmic time."""
    low, high = 0, len(arr) - 1
    while low <= high:
        mid = (low + high) // 2
        if arr[mid] == target:
            return mid
        elif arr[mid] < target:
            low = mid + 1
        else:
            high = mid - 1
    return -1`,

  on: `def find_max(arr):
    """Find maximum element - linear time."""
    max_val = arr[0]
    for num in arr:
        if num > max_val:
            max_val = num
    return max_val`,

  onlogn: `def merge_sort(arr):
    """Merge sort - O(n log n) time."""
    if len(arr) <= 1:
        return arr
    mid = len(arr) // 2
    left = merge_sort(arr[:mid])
    right = merge_sort(arr[mid:])
    return merge(left, right)

def merge(left, right):
    result = []
    i = j = 0
    while i < len(left) and j < len(right):
        if left[i] <= right[j]:
            result.append(left[i])
            i += 1
        else:
            result.append(right[j])
            j += 1
    result.extend(left[i:])
    result.extend(right[j:])
    return result`,

  on2: `def bubble_sort(arr):
    """Bubble sort - quadratic time."""
    n = len(arr)
    for i in range(n):
        for j in range(0, n - i - 1):
            if arr[j] > arr[j + 1]:
                arr[j], arr[j + 1] = arr[j + 1], arr[j]
    return arr`,

  on3: `def matrix_multiply(A, B):
    """Matrix multiplication - cubic time."""
    n = len(A)
    C = [[0] * n for _ in range(n)]
    for i in range(n):
        for j in range(n):
            for k in range(n):
                C[i][j] += A[i][k] * B[k][j]
    return C`,

  o2n: `def fibonacci(n):
    """Naive Fibonacci - exponential time."""
    if n <= 1:
        return n
    return fibonacci(n - 1) + fibonacci(n - 2)`,

  'kotlin-linear':
    `// Kotlin Linear\nfun main() {\n    val n = 10\n    for (i in 0 until n) {\n        println(i)\n    }\n}`,
  'xml-constant':
    `<!-- XML O(1) -->\n<config>\n    <setting id="1">Value</setting>\n    <setting id="2">Value</setting>\n</config>`
};

// ─── Initialization ──────────────────────────────────────────────────────────

document.addEventListener('DOMContentLoaded', () => {
  initEditors();
  initNavigation();
  renderComplexityScale();

  // Handle initial hash
  const hash = window.location.hash.replace('#', '') || 'home';
  navigateTo(hash);
});

function initEditors() {
  const editorConfig = {
    theme: 'material-darker',
    lineNumbers: true,
    matchBrackets: true,
    autoCloseBrackets: true,
    indentUnit: 4,
    tabSize: 4,
    lineWrapping: false,
    styleActiveLine: true,
  };

  // Main editor
  editor = CodeMirror(document.getElementById('code-editor'), {
    ...editorConfig,
    mode: 'python',
    value: '# Paste your code here or try a sample below\n\ndef example(arr):\n    for item in arr:\n        print(item)\n',
  });

  // Compare editors
  compareEditor1 = CodeMirror(document.getElementById('compare-editor-1'), {
    ...editorConfig,
    mode: 'python',
    value: '# Snippet 1\ndef linear_search(arr, target):\n    for i in range(len(arr)):\n        if arr[i] == target:\n            return i\n    return -1\n',
  });

  compareEditor2 = CodeMirror(document.getElementById('compare-editor-2'), {
    ...editorConfig,
    mode: 'python',
    value: '# Snippet 2\ndef binary_search(arr, target):\n    lo, hi = 0, len(arr) - 1\n    while lo <= hi:\n        mid = (lo + hi) // 2\n        if arr[mid] == target:\n            return mid\n        elif arr[mid] < target:\n            lo = mid + 1\n        else:\n            hi = mid - 1\n    return -1\n',
  });

  // Language change handlers
  document.getElementById('language-select').addEventListener('change', (e) => {
    const lang = e.target.value;
    editor.setOption('mode', LANG_MODES[lang] || 'python');
    document.getElementById('editor-filename').textContent = 'main' + (LANG_EXT[lang] || '.py');
  });

  document.getElementById('compare-lang-1').addEventListener('change', (e) => {
    compareEditor1.setOption('mode', LANG_MODES[e.target.value] || 'python');
  });

  document.getElementById('compare-lang-2').addEventListener('change', (e) => {
    compareEditor2.setOption('mode', LANG_MODES[e.target.value] || 'python');
  });

  // Init custom selects
  initCustomSelects('language-select-wrapper', 'language-select', (lang) => {
    editor.setOption('mode', LANG_MODES[lang] || 'python');
    document.getElementById('editor-filename').textContent = 'main' + (LANG_EXT[lang] || '.py');
    updateAnalyzeButton(lang);
  });

  initCustomSelects('compare-lang-1-wrapper', 'compare-lang-1', (lang) => {
    compareEditor1.setOption('mode', LANG_MODES[lang] || 'python');
  });

  initCustomSelects('compare-lang-2-wrapper', 'compare-lang-2', (lang) => {
    compareEditor2.setOption('mode', LANG_MODES[lang] || 'python');
  });
}

// Language → Devicon class mapping
const DEVICON_CLASSES = {
  'python': 'devicon-python-plain',
  'java': 'devicon-java-plain',
  'cpp': 'devicon-cplusplus-plain',
  'javascript': 'devicon-javascript-plain',
  'go': 'devicon-go-original-wordmark',
  'ruby': 'devicon-ruby-plain',
  'rust': 'devicon-rust-plain',
  'kotlin': 'devicon-kotlin-plain',
  'xml': 'devicon-xml-plain'
};

function initCustomSelects(wrapperId, hiddenSelectId, onChange) {
  const wrapper = document.getElementById(wrapperId);
  if (!wrapper) return;

  const btn = wrapper.querySelector('.custom-select-btn');
  const dropdown = wrapper.querySelector('.custom-select-dropdown');
  const options = wrapper.querySelectorAll('.custom-option');
  const hiddenSelect = document.getElementById(hiddenSelectId);

  // Toggle dropdown
  btn.addEventListener('click', (e) => {
    e.stopPropagation();
    const isOpen = wrapper.classList.contains('open');
    closeAllCustomSelects();
    if (!isOpen) wrapper.classList.add('open');
  });

  // Handle option selection
  options.forEach(opt => {
    opt.addEventListener('click', () => {
      const val = opt.dataset.value;
      const text = opt.textContent.trim();

      // Update hidden select
      hiddenSelect.value = val;

      // Update UI
      const nameEl = btn.querySelector('.lang-name');
      const iconEl = btn.querySelector('.lang-icon');
      if (nameEl) nameEl.textContent = text;
      if (iconEl) {
        iconEl.className = 'lang-icon ' + (DEVICON_CLASSES[val] || '');
      }

      // Update selected state
      options.forEach(o => o.classList.remove('selected'));
      opt.classList.add('selected');

      wrapper.classList.remove('open');

      if (onChange) onChange(val);
    });
  });

  // Set initial state
  const initialOpt = wrapper.querySelector('.custom-option.selected') || options[0];
  if (initialOpt) {
    const val = initialOpt.dataset.value;
    const iconEl = btn.querySelector('.lang-icon');
    if (iconEl) iconEl.className = 'lang-icon ' + (DEVICON_CLASSES[val] || '');
  }
}

function closeAllCustomSelects() {
  document.querySelectorAll('.custom-select').forEach(s => s.classList.remove('open'));
}

// Close when clicking outside
document.addEventListener('click', closeAllCustomSelects);

function updateAnalyzeButton(lang) {
  const icon = document.getElementById('analyze-lang-icon');
  if (icon) {
    icon.className = 'btn-lang-icon ' + (DEVICON_CLASSES[lang] || '');
  }
}

// ─── Navigation (SPA Router) ────────────────────────────────────────────────

function initNavigation() {
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const page = link.dataset.page;
      navigateTo(page);
    });
  });

  document.getElementById('nav-brand').addEventListener('click', (e) => {
    e.preventDefault();
    navigateTo('home');
  });

  window.addEventListener('hashchange', () => {
    const hash = window.location.hash.replace('#', '') || 'home';
    navigateTo(hash, null, false);
  });
}

function navigateTo(page, subPage, pushHash = true) {
  // Update pages
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  const targetPage = document.getElementById(`page-${page}`);
  if (targetPage) {
    targetPage.classList.add('active');
  }

  // Update nav
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
  const activeLink = document.querySelector(`.nav-link[data-page="${page}"]`);
  if (activeLink) activeLink.classList.add('active');

  // Push hash
  if (pushHash) {
    window.location.hash = page;
  }

  // Refresh CodeMirror when switching to editor/compare page
  if (page === 'editor' || page === 'compare') {
    setTimeout(() => {
      if (page === 'editor' && editor) editor.refresh();
      if (page === 'compare') {
        compareEditor1 && compareEditor1.refresh();
        compareEditor2 && compareEditor2.refresh();
      }
    }, 100);
  }

  // Load history when switching to history page
  if (page === 'history') {
    loadHistory();
  }
}


// ─── Load Sample Code ────────────────────────────────────────────────────────

function loadSample(key) {
  if (SAMPLES[key]) {
    const isComparePage = document.getElementById('page-compare').classList.contains('active');
    const targetEditor = isComparePage ? compareEditor1 : editor;
    const langSelectId = isComparePage ? 'compare-lang-1' : 'language-select';
    const wrapperId = isComparePage ? 'compare-lang-1-wrapper' : 'language-select-wrapper';
    
    targetEditor.setValue(SAMPLES[key]);
    const lang = 'python';
    document.getElementById(langSelectId).value = lang;
    targetEditor.setOption('mode', 'python');
    
    if (!isComparePage) {
      document.getElementById('editor-filename').textContent = 'main.py';
    }

    // Update custom select UI
    const wrapper = document.getElementById(wrapperId);
    const opts = wrapper.querySelectorAll('.custom-option');
    opts.forEach(o => {
      o.classList.remove('selected');
      if (o.dataset.value === lang) o.classList.add('selected');
    });
    const btn = wrapper.querySelector('.custom-select-btn');
    const nameEl = btn.querySelector('.lang-name');
    if (nameEl) nameEl.textContent = 'Python';
    const iconEl = btn.querySelector('.lang-icon');
    if (iconEl) iconEl.className = 'lang-icon ' + DEVICON_CLASSES[lang];
    
    if (!isComparePage) {
      updateAnalyzeButton(lang);
    }
  }
}

// ─── Analyze Code ────────────────────────────────────────────────────────────

async function analyzeCode() {
  const code = editor.getValue();
  const language = document.getElementById('language-select').value;
  const btn = document.getElementById('btn-analyze');

  if (!code.trim()) return;

  // Show loading
  btn.innerHTML = '<span class="spinner"></span> Analyzing...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, language }),
    });

    const result = await response.json();
    displayResult(result);
  } catch (error) {
    console.error('Analysis error:', error);
    displayResult({
      complexity: 'Error',
      explanation: 'Could not connect to the analysis server. Make sure the backend is running.',
      details: {},
    });
  } finally {
    btn.innerHTML = '⚡ Analyze Complexity';
    btn.disabled = false;
  }
}

// ─── Display Result ──────────────────────────────────────────────────────────

function displayResult(result) {
  const panel = document.getElementById('result-panel');
  panel.classList.add('visible');

  // Badge
  const badge = document.getElementById('result-complexity-badge');
  badge.textContent = result.complexity;
  badge.className = 'complexity-badge ' + getComplexityClass(result.complexity);

  // Explanation
  document.getElementById('result-explanation-text').textContent = result.explanation;

  // Scale
  highlightScale(result.complexity);

  // Details
  renderDetails(result.details);

  // Smooth scroll to result
  panel.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

function getComplexityClass(complexity) {
  const c = complexity.toLowerCase().replace(/[\s()^]/g, '');
  if (c.includes('2ⁿ') || c.includes('2^n') || c.includes('2n')) return 'o2n';
  if (c.includes('n³') || c.includes('n^3') || c.includes('n3')) return 'on3';
  if (c.includes('n²') || c.includes('n^2') || c.includes('n2')) return 'on2';
  if (c.includes('nlogn') || c.includes('n log n')) return 'onlogn';
  if (c.includes('logn') || c.includes('log n') || c.includes('log')) return 'ologn';
  if (c.includes('n') && !c.includes('log')) return 'on';
  if (c.includes('1')) return 'o1';
  return '';
}

function renderComplexityScale() {
  const container = document.getElementById('complexity-scale');
  container.innerHTML = SCALE_DATA.map(item => `
    <div class="scale-bar-wrapper">
      <div class="scale-bar" data-key="${item.key}"
           style="height:${item.height}px; background:${item.color};">
      </div>
      <div class="scale-bar-label">${item.label}</div>
    </div>
  `).join('');
}

function highlightScale(complexity) {
  const cls = getComplexityClass(complexity);
  document.querySelectorAll('.scale-bar').forEach(bar => {
    bar.classList.remove('active');
    if (bar.dataset.key === cls) {
      bar.classList.add('active');
    }
  });
}

function renderDetails(details) {
  if (!details || Object.keys(details).length === 0) {
    document.getElementById('result-details').innerHTML = '';
    return;
  }

  const rows = [];

  if (details.loops_found !== undefined) {
    rows.push({ label: 'Loops Detected', value: details.loops_found });
  }
  if (details.max_nesting_depth !== undefined) {
    rows.push({ label: 'Max Nesting Depth', value: details.max_nesting_depth });
  }
  if (details.recursions_found !== undefined) {
    rows.push({ label: 'Recursive Calls', value: details.recursions_found });
  }
  if (details.has_log_pattern) {
    rows.push({ label: 'Logarithmic Pattern', value: '✓ Detected' });
  }
  if (details.has_sorting_call) {
    rows.push({ label: 'Sorting Call', value: '✓ Detected' });
  }
  if (details.has_divide_and_conquer) {
    rows.push({ label: 'Divide & Conquer', value: '✓ Detected' });
  }

  document.getElementById('result-details').innerHTML = `
    <h3 style="font-size:0.9rem; margin-bottom:var(--space-md); color:var(--accent-3);">📋 Analysis Details</h3>
    ${rows.map(r => `
      <div class="detail-row">
        <span class="label">${r.label}</span>
        <span class="value">${r.value}</span>
      </div>
    `).join('')}
    ${details.loop_details && details.loop_details.length ? `
      <div style="margin-top:var(--space-md);">
        <span class="text-sm text-muted">Loop Details:</span>
        <ul style="list-style:none; margin-top:var(--space-xs);">
          ${details.loop_details.map(d => `<li class="text-sm font-mono" style="color:var(--text-secondary); padding:2px 0;">• ${d}</li>`).join('')}
        </ul>
      </div>
    ` : ''}
    ${details.recursion_details && details.recursion_details.length ? `
      <div style="margin-top:var(--space-md);">
        <span class="text-sm text-muted">Recursion Details:</span>
        <ul style="list-style:none; margin-top:var(--space-xs);">
          ${details.recursion_details.map(d => `<li class="text-sm font-mono" style="color:var(--text-secondary); padding:2px 0;">• ${d}</li>`).join('')}
        </ul>
      </div>
    ` : ''}

    <!-- Deep Analysis Section -->
    ${details.deep_verdict ? `
      <div style="margin-top:var(--space-lg); padding-top:var(--space-md); border-top:1px solid var(--border-color);">
        <h3 style="font-size:0.9rem; margin-bottom:var(--space-md); color:var(--accent-2);">🔍 Deep Analysis</h3>
        
        <div class="detail-row" style="flex-direction:column; align-items:flex-start; gap:4px;">
          <span class="label" style="color:var(--text-secondary);">Final Verdict</span>
          <p class="text-sm" style="color:var(--text-primary);">${details.deep_verdict}</p>
        </div>

        <div class="detail-row" style="flex-direction:column; align-items:flex-start; gap:4px; margin-top:var(--space-sm);">
          <span class="label" style="color:var(--text-secondary);">Scaling Behavior</span>
          <p class="text-sm" style="color:var(--text-primary);">${details.scaling_info}</p>
        </div>

        <div class="detail-row" style="flex-direction:column; align-items:flex-start; gap:4px; margin-top:var(--space-sm);">
          <span class="label" style="color:var(--accent-1);">🚀 Optimization Tip</span>
          <p class="text-sm" style="color:var(--text-primary); font-style:italic;">${details.optimization_tips}</p>
        </div>
      </div>
    ` : ''}
  `;
}

// ─── Compare Code ────────────────────────────────────────────────────────────

async function compareCode() {
  const code1 = compareEditor1.getValue();
  const lang1 = document.getElementById('compare-lang-1').value;
  const code2 = compareEditor2.getValue();
  const lang2 = document.getElementById('compare-lang-2').value;
  const btn = document.getElementById('btn-compare');

  if (!code1.trim() || !code2.trim()) return;

  btn.innerHTML = '<span class="spinner"></span> Comparing...';
  btn.disabled = true;

  try {
    const response = await fetch(`${API_BASE}/api/compare`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code1, language1: lang1, code2, language2: lang2 }),
    });

    const result = await response.json();
    displayCompareResult(result);
  } catch (error) {
    console.error('Compare error:', error);
  } finally {
    btn.innerHTML = '⇄ Compare Complexity';
    btn.disabled = false;
  }
}

function displayCompareResult(result) {
  const card1 = document.getElementById('compare-result-1');
  const card2 = document.getElementById('compare-result-2');

  card1.style.display = 'block';
  card2.style.display = 'block';

  const c1 = result.snippet1;
  const c2 = result.snippet2;

  document.getElementById('compare-complexity-1').textContent = c1.complexity;
  document.getElementById('compare-complexity-1').className = 'complexity-value ' + getComplexityClass(c1.complexity);
  document.getElementById('compare-explanation-1').textContent = c1.explanation;

  document.getElementById('compare-complexity-2').textContent = c2.complexity;
  document.getElementById('compare-complexity-2').className = 'complexity-value ' + getComplexityClass(c2.complexity);
  document.getElementById('compare-explanation-2').textContent = c2.explanation;

  // Color-code the complexity values
  const cls1 = getComplexityClass(c1.complexity);
  const cls2 = getComplexityClass(c2.complexity);
  const color1 = SCALE_DATA.find(s => s.key === cls1)?.color || 'var(--text-primary)';
  const color2 = SCALE_DATA.find(s => s.key === cls2)?.color || 'var(--text-primary)';

  document.getElementById('compare-complexity-1').style.color = color1;
  document.getElementById('compare-complexity-2').style.color = color2;

  // Render Deep Insights for both snippets
  renderCompareDetails('compare-details-1', c1);
  renderCompareDetails('compare-details-2', c2);

  // Generate Master Verdict
  const lang1 = document.getElementById('compare-lang-1').value;
  const lang2 = document.getElementById('compare-lang-2').value;
  displayMasterVerdict(c1, lang1, c2, lang2);
}

function displayMasterVerdict(res1, lang1, res2, lang2) {
  const verdictBox = document.getElementById('compare-master-verdict');
  verdictBox.style.display = 'block';

  const rank1 = COMPLEXITY_RANK[res1.complexity] ?? 99;
  const rank2 = COMPLEXITY_RANK[res2.complexity] ?? 99;

  let title = '';
  let advice = '';
  let badgeClass = '';

  if (rank1 < rank2) {
    title = '🏆 Snippet 1 is more efficient!';
    advice = `With ${res1.complexity} complexity, Snippet 1 will scale significantly better than Snippet 2 (${res2.complexity}) as input sizes grow.`;
    badgeClass = 'winner-1';
  } else if (rank2 < rank1) {
    title = '🏆 Snippet 2 is more efficient!';
    advice = `Snippet 2 wins with ${res2.complexity} complexity compared to Snippet 1's ${res1.complexity}. Use Snippet 2 for production workloads.`;
    badgeClass = 'winner-2';
  } else {
    // Both same complexity
    title = "🤝 It's an Efficiency Tie!";
    if (lang1 === lang2) {
      advice = `Both implementations share O(${res1.complexity}) complexity. Choose the code that is more readable or maintainable.`;
    } else {
      // Different languages
      advice = getLanguageAdvice(lang1, lang2);
    }
    badgeClass = 'tie';
  }

  verdictBox.innerHTML = `
    <div class="verdict-content ${badgeClass}">
      <h3>${title}</h3>
      <p>${advice}</p>
    </div>
  `;
}

function getLanguageAdvice(l1, l2) {
  const tips = {
    'python': 'great for rapid prototyping and AI/Data Science.',
    'cpp': 'highly optimized for performance and large-scale systems.',
    'java': 'excellent for enterprise-level, secure, and cross-platform apps.',
    'javascript': 'the standard for web and real-time interactive apps.',
    'go': 'built for concurrency and scalable cloud services.',
    'rust': 'guarantees memory safety and high performance.',
    'ruby': 'optimized for developer happiness and web productivity.',
    'kotlin': 'modern, expressive, and the first choice for Android development.',
    'xml': 'ideal for structured data exchange and configuration.'
  };

  const name1 = l1.charAt(0).toUpperCase() + l1.slice(1);
  const name2 = l2.charAt(0).toUpperCase() + l2.slice(1);
  
  return `Both have the same complexity, but use **${name1}** if you need it for ${tips[l1] || 'general use'} whereas **${name2}** is ${tips[l2] || 'also a great choice'}.`;
}

function renderCompareDetails(containerId, data) {
  const container = document.getElementById(containerId);
  const details = data.details || {};
  
  if (!details.deep_verdict) {
    container.innerHTML = '';
    return;
  }

  container.innerHTML = `
    <div class="deep-analysis-mini">
      <div class="mini-row">
        <span class="mini-label">Verdict</span>
        <p class="mini-text">${details.deep_verdict}</p>
      </div>
      <div class="mini-row">
        <span class="mini-label">Scaling</span>
        <p class="mini-text">${details.scaling_info}</p>
      </div>
      <div class="mini-row">
        <span class="mini-label" style="color:var(--accent-1);">Tip</span>
        <p class="mini-text" style="font-style:italic;">${details.optimization_tips}</p>
      </div>
    </div>
  `;
}

// ─── History ─────────────────────────────────────────────────────────────────

async function loadHistory() {
  try {
    const response = await fetch(`${API_BASE}/api/history`);
    const history = await response.json();
    renderHistory(history);
  } catch (error) {
    console.error('History load error:', error);
  }
}

function renderHistory(history) {
  const list = document.getElementById('history-list');
  const empty = document.getElementById('history-empty');

  if (!history || history.length === 0) {
    list.innerHTML = '';
    list.appendChild(empty);
    empty.style.display = 'block';
    return;
  }

  list.innerHTML = history.map(item => {
    const cls = getComplexityClass(item.complexity);
    const color = SCALE_DATA.find(s => s.key === cls)?.color || 'var(--text-primary)';
    const time = new Date(item.timestamp).toLocaleString();

    return `
      <div class="history-item">
        <div class="history-item-header">
          <span class="history-complexity" style="color:${color}">${item.complexity}</span>
          <span class="history-lang">${item.language}</span>
        </div>
        <div class="history-code">${escapeHtml(item.code)}</div>
        <div class="history-meta">${time} · ${item.explanation.substring(0, 100)}...</div>
      </div>
    `;
  }).join('');
}

async function clearHistory() {
  try {
    await fetch(`${API_BASE}/api/history/clear`, { method: 'POST' });
    loadHistory();
  } catch (error) {
    console.error('Clear history error:', error);
  }
}

// ─── Utilities ───────────────────────────────────────────────────────────────

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}
