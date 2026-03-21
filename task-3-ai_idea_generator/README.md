# ✦ IdeaSpark — AI Idea Generator

> *Turn any keyword into your next big startup idea — powered by OpenAI GPT.*

A full-stack AI-powered web application that generates creative startup and project ideas based on user input. Built as part of the **Vibe Coding Internship** assignment using React.js, Node.js, Express, and the OpenAI API.

---

## 🌐 Live Demo

🔗 **Live Site:** *(Deploy on Vercel/Render and add URL here)*
🔗 **GitHub Repo:** [github.com/jsingh1609/TEN-internship](https://github.com/jsingh1609/TEN-internship)

---

## 📸 Screenshots

> Add screenshots of each page here after running locally.

| Page | Description |
|------|-------------|
| Landing | Hero, how-it-works, category chips, CTA |
| Generator | Input form, category select, idea count, results grid |
| Saved | Favourited ideas with copy-all and clear actions |
| History | Past generation sessions with expand & re-run |

---

## ✨ Features

### Core
- ✅ **Keyword-based idea generation** — enter any domain, problem, or technology
- ✅ **AI-generated ideas** — GPT-3.5-turbo returns structured startup ideas
- ✅ **Copy idea** — copy any idea to clipboard instantly
- ✅ **Save / Favourite ideas** — star ideas to save them to the Saved page
- ✅ **Generation history** — every session is saved; expand to view past ideas

### Advanced
- ✅ **Category selection** — AI & ML, FinTech, Healthcare, EdTech, CleanTech, E-Commerce, SaaS, Web3, Gaming, Social, Productivity
- ✅ **Idea count control** — choose 3, 5, 8, or 10 ideas per generation
- ✅ **Share idea** — native share API or clipboard fallback
- ✅ **Re-run past queries** — click "Re-run" on any history entry to regenerate
- ✅ **Loading skeletons** — smooth skeleton cards while AI is generating
- ✅ **Error handling** — friendly messages for invalid API keys, rate limits, etc.
- ✅ **Persistent storage** — saved ideas and history stored in LocalStorage

### UI / UX
- ✅ **Dark electric theme** — deep navy + neon lime green
- ✅ **Fully responsive** — mobile, tablet, desktop
- ✅ **Smooth animations** — card entrance, skeleton pulse, expand/collapse
- ✅ **Grid dot background + ambient glow orbs**

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js 18, React Router v6 |
| **Backend** | Node.js, Express.js |
| **AI** | OpenAI API (GPT-3.5-turbo) |
| **HTTP** | Fetch API (frontend → backend proxy) |
| **Storage** | Browser LocalStorage |
| **Styling** | Pure CSS with CSS custom properties |
| **Fonts** | Syne (display) + Cabinet Grotesk (body) |

---

## 📁 Project Structure

```
ideaspark/
│
├── package.json                  ← Root scripts
├── .gitignore
├── README.md
│
├── backend/
│   ├── server.js                 ← Express server + OpenAI route
│   ├── package.json
│   └── .env.example              ← Copy to .env and add API key
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css              ← Global styles + CSS variables
        ├── App.js                 ← Router + layout
        ├── context/
        │   └── IdeaContext.js     ← Global state (ideas, saved, history)
        ├── components/
        │   ├── Navbar.js / .css
        │   └── IdeaCard.js / .css
        └── pages/
            ├── Landing.js / .css  ← Home page
            ├── Generator.js / .css← Main idea generation page
            ├── Saved.js / .css    ← Saved / favourite ideas
            └── History.js / .css  ← Past generation sessions
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm v9+
- An OpenAI API key → [platform.openai.com/api-keys](https://platform.openai.com/api-keys)

### Step 1 — Clone the repo
```bash
git clone --no-checkout https://github.com/jsingh1609/TEN-internship.git
cd TEN-internship
git sparse-checkout init --cone
git sparse-checkout set task-3-ai-idea-generator
git checkout main
cd task-3-ai-idea-generator
```

### Step 2 — Set up the backend
```bash
cd backend
npm install
cp .env.example .env
```
Open `.env` and add your OpenAI API key:
```
OPENAI_API_KEY=sk-your-key-here
PORT=5000
```

### Step 3 — Start the backend
```bash
npm run dev
# Server running at http://localhost:5000
```

### Step 4 — Set up and start the frontend
Open a **new terminal**:
```bash
cd frontend
npm install
npm start
# App running at http://localhost:3000
```

### Step 5 — Open in browser
```
http://localhost:3000
```

> ⚠️ Both terminals must be running at the same time. The React dev server proxies API calls to `localhost:5000` automatically.

---

## 🔌 API Reference

### `POST /api/generate`

Generates startup ideas based on user input.

**Request Body:**
```json
{
  "keyword":  "remote work tools",
  "category": "SaaS",
  "count":    5
}
```

**Response:**
```json
{
  "success": true,
  "keyword": "remote work tools",
  "category": "SaaS",
  "ideas": [
    {
      "id": 1,
      "name": "AsyncHub",
      "tagline": "Kill unnecessary meetings forever.",
      "description": "A platform that replaces synchronous meetings with async video threads...",
      "technology": "WebRTC, React, Node.js",
      "audience": "Remote-first teams and distributed startups"
    }
  ]
}
```

---

## 📋 Internship Task Requirements Coverage

| Requirement | Status | Details |
|-------------|--------|---------|
| Web app that generates ideas using AI | ✅ Done | OpenAI GPT-3.5-turbo integration |
| Allow users to input keywords/domains | ✅ Done | Text input + category select |
| Generate multiple creative ideas | ✅ Done | 3, 5, 8, or 10 ideas per request |
| Copy or save generated ideas | ✅ Done | Copy button + star to save |
| History of generated ideas | ✅ Done | Full history page with expand & re-run |
| Category selection (Advanced) | ✅ Done | 12 categories available |
| Favourite ideas section (Advanced) | ✅ Done | Full Saved page |
| Share ideas (Advanced) | ✅ Done | Native share API + clipboard fallback |
| React.js frontend | ✅ Done | React 18 + React Router v6 |
| Node.js + Express backend | ✅ Done | REST API with OpenAI integration |
| Clean and structured code | ✅ Done | Separated components, pages, context |
| GitHub repository | ⬜ Pending | Push to your repo |
| Project documentation | ✅ Done | This README |
| Screenshots | ⬜ Pending | Add after running locally |

---

## 👨‍💻 Author

**Built for the Vibe Coding Internship — AI Idea Generator Task**

Made with ♥ using React, Node.js, and OpenAI.

**Jasjeet Singh**
🔗 [github.com/jsingh1609](https://github.com/jsingh1609)

---

*IdeaSpark — Where every great startup begins.*
