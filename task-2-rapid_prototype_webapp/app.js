/* ============================================================
   TASKFLOW — app.js
   Features: Add · Edit · Delete · Complete · Search · Sort
             Filter · Priority · LocalStorage · Toast · Keyboard
============================================================ */

/* ============================
   STATE
============================ */
let tasks = JSON.parse(localStorage.getItem('tf_v2') || '[]');
let filter = 'all';
let editId = null;

/* ============================
   INIT
============================ */
document.addEventListener('DOMContentLoaded', () => {
    setSbDate();
    setupNav();
    setupPills('.pri-group .pri-chip', 'pri');
    setupPills('.modal-pri .pri-chip', 'epri');
    renderTasks();

    // Enter to add task
    document.getElementById('task-input').addEventListener('keydown', e => {
        if (e.key === 'Enter') addTask();
    });

    // Modal textarea shortcuts
    document.getElementById('edit-input').addEventListener('keydown', e => {
        if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); saveEdit(); }
        if (e.key === 'Escape') closeModal();
    });

    // Global keyboard shortcuts
    document.addEventListener('keydown', e => {
        const inField = ['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement.tagName);

        // ⌘K — focus add input
        if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
            e.preventDefault();
            document.getElementById('app-sec').scrollIntoView({ behavior: 'smooth' });
            setTimeout(() => document.getElementById('task-input').focus(), 350);
        }

        // ⌘1/2/3 — switch filters
        if ((e.metaKey || e.ctrlKey) && !inField) {
            if (e.key === '1') { e.preventDefault(); setFilter('all'); }
            if (e.key === '2') { e.preventDefault(); setFilter('active'); }
            if (e.key === '3') { e.preventDefault(); setFilter('completed'); }
        }

        // Esc — close modal
        if (e.key === 'Escape') closeModal();
    });

    // Navbar shadow on scroll
    window.addEventListener('scroll', () => {
        document.getElementById('navbar').classList.toggle('scrolled', window.scrollY > 8);
    });
});

/* ============================
   DATE IN SIDEBAR
============================ */
function setSbDate() {
    const d = new Date();
    document.getElementById('sb-date').textContent =
        d.toLocaleDateString('en-IN', { weekday: 'short', month: 'short', day: 'numeric' });
}

/* ============================
   SIDEBAR NAVIGATION
============================ */
function setupNav() {
    document.querySelectorAll('.sb-btn[data-filter]').forEach(btn => {
        btn.addEventListener('click', () => setFilter(btn.dataset.filter));
    });
}

function setFilter(f) {
    filter = f;

    // Update active state
    document.querySelectorAll('.sb-btn').forEach(b => b.classList.remove('active'));
    const active = document.querySelector(`.sb-btn[data-filter="${f}"]`);
    if (active) active.classList.add('active');

    // Update title
    const labels = {
        all: 'All Tasks', active: 'Active Tasks', completed: 'Completed',
        high: 'High Priority', medium: 'Medium Priority', low: 'Low Priority'
    };
    document.getElementById('view-title').textContent = labels[f] || 'Tasks';

    renderTasks();
}

/* ============================
   PRIORITY PILLS
============================ */
function setupPills(selector, radioName) {
    document.querySelectorAll(selector).forEach(chip => {
        chip.addEventListener('click', () => {
            document.querySelectorAll(selector).forEach(c => c.classList.remove('sel'));
            chip.classList.add('sel');
            const radio = chip.querySelector(`input[name="${radioName}"]`);
            if (radio) radio.checked = true;
        });
    });
}

function getPri(name) {
    const radio = document.querySelector(`input[name="${name}"]:checked`);
    return radio ? radio.value : 'medium';
}

/* ============================
   LOCAL STORAGE
============================ */
function save() {
    localStorage.setItem('tf_v2', JSON.stringify(tasks));
}

/* ============================
   ADD TASK
============================ */
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();

    if (!text) {
        input.style.outline = '2px solid #c0392b';
        input.focus();
        setTimeout(() => input.style.outline = '', 1000);
        return;
    }

    tasks.unshift({
        id: Date.now(),
        text,
        priority: getPri('pri'),
        done: false,
        createdAt: new Date().toISOString()
    });

    save();
    input.value = '';
    renderTasks();
    toast('✦ Task added!');
}

/* ============================
   TOGGLE COMPLETE
============================ */
function toggleDone(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;
    task.done = !task.done;
    save();
    renderTasks();
    if (task.done) toast('✓ Task completed!');
}

/* ============================
   DELETE TASK
============================ */
function deleteTask(id) {
    const el = document.getElementById('t-' + id);
    if (el) {
        // Animate out
        el.style.transition = 'all 0.22s ease';
        el.style.opacity = '0';
        el.style.transform = 'translateX(14px)';
        setTimeout(() => {
            tasks = tasks.filter(t => t.id !== id);
            save();
            renderTasks();
        }, 230);
    }
    toast('🗑 Task removed');
}

/* ============================
   EDIT TASK
============================ */
function openEdit(id) {
    const task = tasks.find(t => t.id === id);
    if (!task) return;

    editId = id;
    document.getElementById('edit-input').value = task.text;

    // Sync radio buttons
    document.querySelectorAll('input[name="epri"]').forEach(r => {
        r.checked = r.value === task.priority;
    });

    // Sync pill active class
    document.querySelectorAll('.modal-pri .pri-chip').forEach(chip => {
        chip.classList.remove('sel');
        const radio = chip.querySelector('input[type="radio"]');
        if (radio && radio.value === task.priority) chip.classList.add('sel');
    });

    document.getElementById('modal-overlay').classList.remove('hidden');
    setTimeout(() => document.getElementById('edit-input').focus(), 120);
}

function saveEdit() {
    const text = document.getElementById('edit-input').value.trim();
    if (!text) return;

    const task = tasks.find(t => t.id === editId);
    if (task) {
        task.text = text;
        task.priority = getPri('epri');
        save();
        renderTasks();
    }

    closeModal();
    toast('✎ Task updated!');
}

/* ============================
   MODAL
============================ */
function handleModalBg(e) {
    if (e.target === document.getElementById('modal-overlay')) closeModal();
}

function closeModal() {
    document.getElementById('modal-overlay').classList.add('hidden');
    editId = null;
}

/* ============================
   CLEAR COMPLETED
============================ */
function clearCompleted() {
    const count = tasks.filter(t => t.done).length;
    if (!count) { toast('No completed tasks.'); return; }
    tasks = tasks.filter(t => !t.done);
    save();
    renderTasks();
    toast(`🗑 ${count} task${count > 1 ? 's' : ''} cleared`);
}

/* ============================
   FILTER + SEARCH + SORT
============================ */
function getFiltered() {
    const query = (document.getElementById('search-input')?.value || '').toLowerCase().trim();
    const sort = document.getElementById('sort-sel')?.value || 'newest';

    let list = [...tasks];

    // Filter by view
    if (['high', 'medium', 'low'].includes(filter)) {
        list = list.filter(t => t.priority === filter);
    } else if (filter === 'active') {
        list = list.filter(t => !t.done);
    } else if (filter === 'completed') {
        list = list.filter(t => t.done);
    }

    // Search
    if (query) list = list.filter(t => t.text.toLowerCase().includes(query));

    // Sort
    const priOrder = { high: 0, medium: 1, low: 2 };
    if (sort === 'oldest') list.sort((a, b) => a.createdAt.localeCompare(b.createdAt));
    if (sort === 'priority') list.sort((a, b) => priOrder[a.priority] - priOrder[b.priority]);
    if (sort === 'alpha') list.sort((a, b) => a.text.localeCompare(b.text));

    return list;
}

/* ============================
   HELPERS
============================ */
function fmtTime(iso) {
    return new Date(iso).toLocaleTimeString('en-IN', {
        hour: 'numeric', minute: '2-digit', hour12: true
    });
}

function esc(str) {
    const div = document.createElement('div');
    div.appendChild(document.createTextNode(str));
    return div.innerHTML;
}

/* ============================
   RENDER
============================ */
function renderTasks() {
    const list = document.getElementById('task-list');
    const empty = document.getElementById('empty-state');
    const filtered = getFiltered();

    const total = tasks.length;
    const done = tasks.filter(t => t.done).length;
    const active = tasks.filter(t => !t.done).length;
    const pct = total > 0 ? Math.round((done / total) * 100) : 0;

    // Hero floating cards
    const hcT = document.getElementById('hc-total');
    const hcD = document.getElementById('hc-done');
    const hcP = document.getElementById('hc-pct');
    if (hcT) hcT.textContent = total;
    if (hcD) hcD.textContent = done;
    if (hcP) hcP.textContent = pct + '%';

    // Sidebar badges
    document.getElementById('cnt-all').textContent = total;
    document.getElementById('cnt-active').textContent = active;
    document.getElementById('cnt-completed').textContent = done;
    document.getElementById('cnt-high').textContent = tasks.filter(t => t.priority === 'high').length;
    document.getElementById('cnt-medium').textContent = tasks.filter(t => t.priority === 'medium').length;
    document.getElementById('cnt-low').textContent = tasks.filter(t => t.priority === 'low').length;

    // Progress bar
    document.getElementById('prog-bar').style.width = pct + '%';
    document.getElementById('prog-pct').textContent = pct + '%';
    document.getElementById('prog-lbl').textContent = `${done} of ${total} done`;

    // View count label
    document.getElementById('view-count').textContent =
        filtered.length > 0 ? `${filtered.length} task${filtered.length !== 1 ? 's' : ''}` : '';

    // Empty state
    if (filtered.length === 0) {
        list.innerHTML = '';
        empty.classList.remove('hidden');
        return;
    }

    empty.classList.add('hidden');

    // Render task items
    list.innerHTML = filtered.map(t => `
    <li class="task-item p-${t.priority} ${t.done ? 'done' : ''}" id="t-${t.id}">
      <div class="chk" onclick="toggleDone(${t.id})">${t.done ? '✓' : ''}</div>
      <div class="task-body">
        <div class="task-txt">${esc(t.text)}</div>
        <div class="task-meta">
          <span class="pri-tag p-${t.priority}">${t.priority}</span>
          <span class="task-time">${fmtTime(t.createdAt)}</span>
        </div>
      </div>
      <div class="task-acts">
        <button class="act-btn edit" onclick="openEdit(${t.id})" title="Edit">✎</button>
        <button class="act-btn del"  onclick="deleteTask(${t.id})" title="Delete">✕</button>
      </div>
    </li>
  `).join('');
}

/* ============================
   TOAST NOTIFICATIONS
============================ */
function toast(msg) {
    const wrap = document.getElementById('toast-wrap');
    const el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    wrap.appendChild(el);
    setTimeout(() => {
        el.classList.add('out');
        setTimeout(() => el.remove(), 280);
    }, 2500);
}

/* ============================
   QUOTE CAROUSEL
============================ */
let currentQuote = 0;
const TOTAL_QUOTES = 5;
let quoteTimer = null;

function goQuote(index) {
    currentQuote = index;
    const track = document.getElementById('qb-track');
    if (!track) return;

    // Slide the track — left-to-right transition handled by CSS
    track.style.transform = `translateX(-${currentQuote * 20}%)`;

    // Update dot indicators
    document.querySelectorAll('.qb-dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === currentQuote);
    });

    // Reset auto-play
    resetQuoteTimer();
}

function moveQuote(dir) {
    let next = currentQuote + dir;
    if (next < 0) next = TOTAL_QUOTES - 1;
    if (next >= TOTAL_QUOTES) next = 0;
    goQuote(next);
}

function resetQuoteTimer() {
    clearInterval(quoteTimer);
    quoteTimer = setInterval(() => moveQuote(1), 4500);
}

// Kick off auto-play
document.addEventListener('DOMContentLoaded', () => {
    resetQuoteTimer();
});