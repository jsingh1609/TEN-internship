// =============================================
// SKILL_CORE — App Logic
// =============================================

const SKILLS = [
  // FRONTEND
  { id:'react',       name:'React',        category:'Frontend', tags:['javascript','ui','component','hooks','spa'],        gravity:98, description:'The most widely-used library for building dynamic user interfaces with a component model.' },
  { id:'vuejs',       name:'Vue.js',        category:'Frontend', tags:['javascript','ui','component','spa','progressive'],  gravity:82, description:'A progressive framework for building UIs, known for its gentle learning curve.' },
  { id:'svelte',      name:'Svelte',        category:'Frontend', tags:['javascript','ui','compiler','spa','performance'],   gravity:74, description:'A radical new approach to building UIs that compiles away at build time.' },
  { id:'angular',     name:'Angular',       category:'Frontend', tags:['typescript','ui','enterprise','spa','component'],   gravity:78, description:'A full-featured TypeScript framework by Google for large-scale applications.' },
  { id:'nextjs',      name:'Next.js',       category:'Frontend', tags:['react','ssr','fullstack','javascript','vercel'],    gravity:95, description:'The React framework for production — SSR, SSG, and App Router built in.' },
  { id:'nuxt',        name:'Nuxt',          category:'Frontend', tags:['vue','ssr','fullstack','javascript'],               gravity:76, description:'The intuitive Vue framework for building server-rendered and static web apps.' },
  { id:'tailwind',    name:'Tailwind CSS',  category:'Frontend', tags:['css','utility','design','responsive'],              gravity:94, description:'A utility-first CSS framework that lets you build any design directly in markup.' },
  { id:'typescript',  name:'TypeScript',    category:'Language', tags:['javascript','typed','compile','static','microsoft'],gravity:97, description:'A typed superset of JavaScript that compiles to plain JS, catching errors early.' },
  { id:'astro',       name:'Astro',         category:'Frontend', tags:['javascript','static','ssr','islands','performance'],gravity:71, description:'An all-in-one framework for building fast, content-focused websites.' },
  { id:'remix',       name:'Remix',         category:'Frontend', tags:['react','ssr','fullstack','javascript'],             gravity:68, description:'A full-stack web framework focused on web standards and modern UX.' },

  // BACKEND
  { id:'nodejs',      name:'Node.js',       category:'Backend',  tags:['javascript','runtime','server','event-loop','npm'],gravity:92, description:'JavaScript runtime built on Chrome\'s V8 engine for scalable server-side apps.' },
  { id:'python',      name:'Python',        category:'Language', tags:['scripting','data','backend','ml','versatile'],     gravity:99, description:'A versatile, readable language dominant in data science, AI, and web backends.' },
  { id:'django',      name:'Django',        category:'Backend',  tags:['python','web','orm','batteries','sql'],             gravity:82, description:'A high-level Python framework that encourages rapid development and clean design.' },
  { id:'fastapi',     name:'FastAPI',       category:'Backend',  tags:['python','api','async','openapi','pydantic'],       gravity:88, description:'A modern, fast web framework for building APIs with Python type hints.' },
  { id:'express',     name:'Express.js',    category:'Backend',  tags:['javascript','nodejs','api','middleware','rest'],   gravity:85, description:'Fast, unopinionated, minimalist web framework for Node.js.' },
  { id:'go',          name:'Go',            category:'Language', tags:['compiled','performance','concurrency','google'],   gravity:80, description:'An open-source language designed for simplicity, performance, and concurrency.' },
  { id:'rust',        name:'Rust',          category:'Language', tags:['systems','memory','safety','performance','wasm'],  gravity:77, description:'A language empowering everyone to build reliable and efficient software.' },
  { id:'java',        name:'Java',          category:'Language', tags:['oop','enterprise','jvm','backend','spring'],       gravity:81, description:'A class-based, OOP language widely used in enterprise and Android development.' },
  { id:'spring',      name:'Spring Boot',   category:'Backend',  tags:['java','microservices','enterprise','api','rest'],  gravity:79, description:'Makes it easy to create Spring-powered, production-grade applications.' },
  { id:'graphql',     name:'GraphQL',       category:'Backend',  tags:['api','query','schema','rest-alternative'],         gravity:75, description:'A query language for your API that gives clients power to request exactly what they need.' },
  { id:'trpc',        name:'tRPC',          category:'Backend',  tags:['typescript','api','fullstack','typesafe'],         gravity:70, description:'End-to-end typesafe APIs for TypeScript full-stack applications.' },

  // MOBILE
  { id:'reactnative', name:'React Native',  category:'Mobile',   tags:['react','javascript','ios','android','cross-platform'], gravity:83, description:'Build native mobile apps using React and JavaScript.' },
  { id:'flutter',     name:'Flutter',       category:'Mobile',   tags:['dart','ios','android','google','cross-platform'], gravity:85, description:'Google\'s UI toolkit for building beautiful, natively compiled apps from one codebase.' },
  { id:'swift',       name:'Swift',         category:'Mobile',   tags:['ios','apple','native','xcode'],                   gravity:74, description:'A powerful, intuitive language for all Apple platforms.' },
  { id:'kotlin',      name:'Kotlin',        category:'Mobile',   tags:['android','jvm','google','native'],                gravity:76, description:'A modern, statically typed language for Android and JVM development.' },

  // DEVOPS
  { id:'docker',      name:'Docker',        category:'DevOps',   tags:['containers','devops','deployment','isolation'],    gravity:93, description:'A platform to build, share, and run containerised applications anywhere.' },
  { id:'kubernetes',  name:'Kubernetes',    category:'DevOps',   tags:['containers','orchestration','devops','k8s'],      gravity:89, description:'An open-source system for automating container deployment and scaling.' },
  { id:'github-actions',name:'GitHub Actions',category:'DevOps', tags:['ci','cd','automation','github','devops'],        gravity:87, description:'Automate your build, test, and deployment workflows directly from GitHub.' },
  { id:'terraform',   name:'Terraform',     category:'DevOps',   tags:['iac','cloud','devops','infrastructure'],          gravity:83, description:'Infrastructure as Code tool to provision and manage cloud resources.' },
  { id:'ansible',     name:'Ansible',       category:'DevOps',   tags:['automation','devops','configuration','iac'],      gravity:72, description:'Simple, agentless IT automation platform for configuration management.' },
  { id:'nginx',       name:'Nginx',         category:'DevOps',   tags:['server','proxy','load-balancer','devops'],        gravity:80, description:'High-performance HTTP server, reverse proxy, and load balancer.' },

  // DATA
  { id:'postgresql',  name:'PostgreSQL',    category:'Database', tags:['sql','relational','database','acid','json'],      gravity:91, description:'A powerful, open-source object-relational database system.' },
  { id:'mongodb',     name:'MongoDB',       category:'Database', tags:['nosql','document','database','json','flexible'],  gravity:84, description:'A document-oriented NoSQL database for flexible, scalable data storage.' },
  { id:'redis',       name:'Redis',         category:'Database', tags:['cache','inmemory','database','pub-sub','fast'],   gravity:86, description:'An in-memory data structure store used as a database, cache, and broker.' },
  { id:'mysql',       name:'MySQL',         category:'Database', tags:['sql','relational','database','open-source'],      gravity:82, description:'The world\'s most popular open-source relational database.' },
  { id:'sqlite',      name:'SQLite',        category:'Database', tags:['sql','embedded','lightweight','database'],        gravity:75, description:'A self-contained, serverless, zero-configuration SQL database engine.' },
  { id:'prisma',      name:'Prisma',        category:'Database', tags:['orm','typescript','database','sql','node'],       gravity:82, description:'A next-generation ORM for Node.js and TypeScript with type-safe queries.' },

  // AI/ML
  { id:'tensorflow',  name:'TensorFlow',    category:'AI/ML',    tags:['ml','deeplearning','google','python','neural'],   gravity:84, description:'An end-to-end open-source machine learning platform by Google.' },
  { id:'pytorch',     name:'PyTorch',       category:'AI/ML',    tags:['ml','deeplearning','python','neural','research'], gravity:87, description:'An open-source ML framework preferred in research for its dynamic graphs.' },
  { id:'scikit',      name:'scikit-learn',  category:'AI/ML',    tags:['ml','python','classification','regression','data'],gravity:82, description:'Simple and efficient tools for predictive data analysis in Python.' },
  { id:'langchain',   name:'LangChain',     category:'AI/ML',    tags:['llm','ai','python','agents','rag'],               gravity:85, description:'A framework for building applications powered by large language models.' },
  { id:'huggingface', name:'Hugging Face',  category:'AI/ML',    tags:['llm','transformers','python','nlp','ai'],         gravity:88, description:'The AI community\'s hub for state-of-the-art models, datasets, and spaces.' },
  { id:'openai',      name:'OpenAI API',    category:'AI/ML',    tags:['llm','gpt','api','ai','generation'],              gravity:91, description:'Access GPT models, embeddings, image generation, and more via REST API.' },

  // CLOUD
  { id:'aws',         name:'AWS',           category:'Cloud',    tags:['cloud','amazon','infrastructure','serverless'],   gravity:92, description:'Amazon\'s comprehensive cloud platform with 200+ services.' },
  { id:'gcp',         name:'Google Cloud',  category:'Cloud',    tags:['cloud','google','ml','kubernetes','serverless'],  gravity:83, description:'Google\'s suite of cloud computing services on the same infrastructure as Google.' },
  { id:'azure',       name:'Azure',         category:'Cloud',    tags:['cloud','microsoft','enterprise','devops'],        gravity:85, description:'Microsoft\'s cloud platform for building, testing, and managing applications.' },
  { id:'vercel',      name:'Vercel',        category:'Cloud',    tags:['deployment','nextjs','frontend','cdn','serverless'],gravity:87, description:'The platform for frontend developers — instant deploys, edge functions, analytics.' },
  { id:'supabase',    name:'Supabase',      category:'Cloud',    tags:['backend','postgresql','auth','realtime','open-source'],gravity:84, description:'An open-source Firebase alternative built on PostgreSQL.' },
  { id:'firebase',    name:'Firebase',      category:'Cloud',    tags:['backend','google','realtime','auth','nocode'],    gravity:80, description:'Google\'s app development platform with real-time DB, auth, and hosting.' },

  // TOOLS
  { id:'git',         name:'Git',           category:'Tools',    tags:['version-control','vcs','collaboration','branching'],gravity:97, description:'The distributed version control system that powers modern software development.' },
  { id:'vscode',      name:'VS Code',       category:'Tools',    tags:['editor','ide','microsoft','extensions','debug'],  gravity:94, description:'A lightweight, extensible code editor built by Microsoft with massive ecosystem.' },
  { id:'figma',       name:'Figma',         category:'Tools',    tags:['design','ui','collaboration','prototype','ux'],   gravity:86, description:'A collaborative design tool for building beautiful, user-focused products.' },
  { id:'jest',        name:'Jest',          category:'Tools',    tags:['testing','javascript','unit','react','mock'],     gravity:80, description:'A delightful JavaScript testing framework with a focus on simplicity.' },
  { id:'vitest',      name:'Vitest',        category:'Tools',    tags:['testing','javascript','vite','unit','fast'],      gravity:76, description:'A blazing fast unit test framework powered by Vite.' },
  { id:'webpack',     name:'Webpack',       category:'Tools',    tags:['bundler','javascript','build','module'],          gravity:75, description:'A static module bundler for modern JavaScript applications.' },
  { id:'vite',        name:'Vite',          category:'Tools',    tags:['bundler','javascript','build','fast','esm'],      gravity:90, description:'Next generation frontend tooling — instant server start, lightning HMR.' },
];

// =============================================
// STATE
// =============================================
let selectedIds = new Set(JSON.parse(localStorage.getItem('skillcore_stack') || '[]'));
let activeFilter = 'All';
let searchQuery = '';

const CATEGORIES = ['All', 'Frontend', 'Backend', 'Mobile', 'DevOps', 'Data', 'AI/ML', 'Cloud', 'Database', 'Language', 'Tools'];

// =============================================
// RECOMMENDATION ENGINE
// =============================================
function getRecommendations() {
  if (selectedIds.size === 0) return [];

  const selectedSkills = SKILLS.filter(s => selectedIds.has(s.id));
  const allTags = selectedSkills.flatMap(s => s.tags);
  const tagFreq = {};
  allTags.forEach(t => tagFreq[t] = (tagFreq[t] || 0) + 1);

  return SKILLS
    .filter(s => !selectedIds.has(s.id))
    .map(s => {
      const matchingTags = s.tags.filter(t => tagFreq[t]);
      const score = matchingTags.reduce((acc, t) => acc + tagFreq[t], 0);
      const pct = Math.min(100, Math.round((matchingTags.length / Math.max(s.tags.length, 1)) * 100));
      return { ...s, score, pct, matchingTags };
    })
    .filter(s => s.score > 0)
    .sort((a, b) => b.score - a.score || b.gravity - a.gravity)
    .slice(0, 12);
}

// =============================================
// RENDER HELPERS
// =============================================
function saveStack() {
  localStorage.setItem('skillcore_stack', JSON.stringify([...selectedIds]));
}

function getFilteredSkills() {
  return SKILLS.filter(s => {
    const catMatch = activeFilter === 'All' || s.category === activeFilter ||
      (activeFilter === 'Data' && s.category === 'Database');
    const q = searchQuery.toLowerCase();
    const searchMatch = !q || s.name.toLowerCase().includes(q) || s.tags.some(t => t.includes(q)) || s.category.toLowerCase().includes(q);
    return catMatch && searchMatch;
  });
}

function renderSkillGrid() {
  const grid = document.getElementById('skillGrid');
  const filtered = getFilteredSkills();

  if (filtered.length === 0) {
    grid.innerHTML = `<p class="no-results">No skills match your search. Try a different keyword.</p>`;
    return;
  }

  grid.innerHTML = filtered.map((s, i) => {
    const sel = selectedIds.has(s.id);
    const delay = Math.min(i * 0.03, 0.5);
    return `
      <div class="skill-card ${sel ? 'selected' : ''} animate-fade-in-up"
           style="animation-delay:${delay}s"
           id="card-${s.id}"
           data-id="${s.id}"
           role="button" tabindex="0"
           aria-pressed="${sel}"
           aria-label="${s.name} — ${s.category}">
        <div class="skill-card-header">
          <span class="skill-category-label">${s.category}</span>
          <div class="skill-toggle">
            ${sel
              ? `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><polyline points="20 6 9 17 4 12"/></svg>`
              : `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>`
            }
          </div>
        </div>
        <div class="skill-name">${s.name}</div>
        <div class="skill-gravity">
          <span class="gravity-icon">↗</span>
          <div class="gravity-bar"><div class="gravity-fill" style="width:${s.gravity}%"></div></div>
          <span class="gravity-value">${s.gravity}</span>
        </div>
      </div>`;
  }).join('');
}

function renderStackBar() {
  const bar = document.getElementById('stackBar');
  const badges = document.getElementById('stackBadges');

  if (selectedIds.size === 0) {
    bar.classList.remove('visible');
    return;
  }
  bar.classList.add('visible');

  badges.innerHTML = [...selectedIds].map(id => {
    const s = SKILLS.find(x => x.id === id);
    return s ? `<span class="stack-badge">${s.name} <span class="remove-badge" data-id="${id}" aria-label="Remove ${s.name}">×</span></span>` : '';
  }).join('');
}

function renderRecommendations() {
  const section = document.getElementById('sectionRecommend');
  const grid = document.getElementById('recommendGrid');

  if (selectedIds.size === 0) {
    section.classList.remove('visible');
    return;
  }
  section.classList.add('visible');

  const recs = getRecommendations();
  if (recs.length === 0) {
    grid.innerHTML = `<p class="no-results" style="grid-column:1/-1">You've already selected a broad range! Try searching for more specific skills.</p>`;
    return;
  }

  grid.innerHTML = recs.map((s, i) => `
    <div class="rec-card animate-fade-in-up" style="animation-delay:${i * 0.05}s">
      <div class="rec-card-top">
        <span class="rec-match">▲ ${s.pct}% MATCH</span>
        <span class="rec-proximity">${s.matchingTags.slice(0, 2).join(', ')}</span>
      </div>
      <div class="rec-skill-name">${s.name}</div>
      <p class="rec-description">${s.description}</p>
      <div class="rec-tags">
        ${s.matchingTags.slice(0, 4).map(t => `<span class="rec-tag">${t}</span>`).join('')}
      </div>
      <button class="rec-add-btn" data-id="${s.id}" aria-label="Add ${s.name} to stack">
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
          <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
        ADD TO STACK
      </button>
    </div>`).join('');
}

function renderAll() {
  renderSkillGrid();
  renderStackBar();
  renderRecommendations();
}

// =============================================
// TOGGLE SKILL
// =============================================
function toggleSkill(id) {
  if (selectedIds.has(id)) {
    selectedIds.delete(id);
  } else {
    selectedIds.add(id);
  }
  saveStack();
  renderAll();
}

// =============================================
// EVENT DELEGATION
// =============================================
function setupEvents() {
  // Skill grid clicks
  document.getElementById('skillGrid').addEventListener('click', e => {
    const card = e.target.closest('.skill-card');
    if (card) toggleSkill(card.dataset.id);
  });
  document.getElementById('skillGrid').addEventListener('keydown', e => {
    if (e.key === 'Enter' || e.key === ' ') {
      const card = e.target.closest('.skill-card');
      if (card) { e.preventDefault(); toggleSkill(card.dataset.id); }
    }
  });

  // Stack bar — remove badges
  document.getElementById('stackBadges').addEventListener('click', e => {
    const btn = e.target.closest('.remove-badge');
    if (btn) toggleSkill(btn.dataset.id);
  });

  // Clear all
  document.getElementById('clearStack').addEventListener('click', () => {
    selectedIds.clear();
    saveStack();
    renderAll();
  });

  // Recommendation add buttons
  document.getElementById('recommendGrid').addEventListener('click', e => {
    const btn = e.target.closest('.rec-add-btn');
    if (btn) toggleSkill(btn.dataset.id);
  });

  // Explore button scroll
  document.getElementById('exploreBtn').addEventListener('click', () => {
    document.getElementById('sectionSelect').scrollIntoView({ behavior: 'smooth' });
  });

  // Category filters
  document.getElementById('categoryFilters').addEventListener('click', e => {
    const pill = e.target.closest('.filter-pill');
    if (!pill) return;
    activeFilter = pill.dataset.cat;
    document.querySelectorAll('.filter-pill').forEach(p => p.classList.toggle('active', p.dataset.cat === activeFilter));
    renderSkillGrid();
  });

  // Search
  document.getElementById('searchInput').addEventListener('input', e => {
    searchQuery = e.target.value.trim();
    renderSkillGrid();
  });
}

// ===========================================
// BACKGROUND ANIMATION (DOM BASED)
// ===========================================
function initCanvas() {
  const container = document.getElementById('topo-container');
  if (!container) return;

  let baseRotateZ = -25;
  let currentRotateZ = -25;
  
  // Optional: Add subtle mouse interaction
  let targetRotateX = 55;
  let targetRotateY = 0;
  let currentRotateX = 55;
  let currentRotateY = 0;

  window.addEventListener('mousemove', (e) => {
    const x = (e.clientX / window.innerWidth) * 2 - 1;
    const y = (e.clientY / window.innerHeight) * 2 - 1;
    // Slight tilt based on mouse
    targetRotateY = x * 2;
    targetRotateX = 55 - y * 2;
  });

  function animate() {
    // Continuous rotation
    baseRotateZ -= 0.05;
    currentRotateZ += (baseRotateZ - currentRotateZ) * 0.1;
    
    // Smooth mouse tilt
    currentRotateX += (targetRotateX - currentRotateX) * 0.05;
    currentRotateY += (targetRotateY - currentRotateY) * 0.05;

    container.style.transform = `rotateX(${currentRotateX}deg) rotateY(${currentRotateY}deg) rotateZ(${currentRotateZ}deg)`;

    requestAnimationFrame(animate);
  }

  animate();
}

// =============================================
// INIT
// =============================================
function init() {
  // Render category filter pills
  const filterContainer = document.getElementById('categoryFilters');
  if (filterContainer) {
    filterContainer.innerHTML = CATEGORIES.map(cat =>
      `<button class="filter-pill ${cat === 'All' ? 'active' : ''}" data-cat="${cat}" aria-label="Filter by ${cat}">${cat}</button>`
    ).join('');
  }

  renderAll();
  setupEvents();
  initCanvas();
}

document.addEventListener('DOMContentLoaded', init);
