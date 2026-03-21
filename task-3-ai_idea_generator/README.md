# ✦ IdeaSpark — AI Idea Generator

> *"Turn any keyword into your next big startup idea — powered by Groq AI."*

A beautifully designed, full-stack AI-powered web application that generates creative startup and project ideas based on user input. Built as part of the **Vibe Coding Internship** — Task 3 using React.js, Node.js, Express, and the Groq AI API.

---

## 🌐 Live Links

🔗 **Live Site:** [ideaspark-jasjeet.vercel.app](https://ideaspark-jasjeet.vercel.app)

🔗 **Backend API:** [ideaspark-backend-ejb9.onrender.com](https://ideaspark-backend-ejb9.onrender.com)

🔗 **GitHub Repo:** [github.com/jsingh1609/TEN-internship](https://github.com/jsingh1609/TEN-internship/tree/main/task-3-ai_idea_generator)

---

## 📸 Screenshots

> Add screenshots of each page here after running locally.

| Page | Description |
|------|-------------|
| Landing | Hero, how-it-works, category chips, CTA |
| Generator | Input form, custom category dropdown, idea count, results grid |
| Saved | Favourited ideas with copy-all and clear actions |
| History | Past generation sessions with expand & re-run |

---

## ✨ Features

### Core
- ✅ **Keyword-based idea generation** — enter any domain, problem, or technology
- ✅ **AI-generated ideas** — Groq Llama 3.3-70b returns structured startup ideas
- ✅ **Copy idea** — copy any idea to clipboard instantly
- ✅ **Save / Favourite ideas** — star ideas to save them to the Saved page
- ✅ **Generation history** — every session is saved; expand to view past ideas
- ✅ **⚡ Starter Prompt** — every idea includes an actionable first step to start building

### Advanced
- ✅ **Category selection** — 12 categories: AI & ML, FinTech, Healthcare, EdTech, CleanTech, E-Commerce, SaaS, Web3, Gaming, Social, Productivity + Any
- ✅ **Custom glassmorphic dropdown** — transparent blurred category selector
- ✅ **Idea count control** — choose 3, 5, 8, or 10 ideas per generation
- ✅ **Share idea** — native share API or clipboard fallback
- ✅ **Re-run past queries** — click "Re-run" on any history entry to regenerate
- ✅ **Loading skeletons** — smooth skeleton cards while AI is generating
- ✅ **Error handling** — friendly messages for API errors and rate limits

### Dynamic UI / UX
- ✅ **Animated floating particles** rising up the screen
- ✅ **Moving gradient mesh** background
- ✅ **Pulsing grid lines** background pattern
- ✅ **Glowing border** on card hover with lime → cyan gradient
- ✅ **Shimmer effect** on buttons
- ✅ **Number color change** on card hover (gradient lime → cyan)
- ✅ **Staggered card animations** on load
- ✅ **Spotlight glow** behind hero title
- ✅ **Spinning glowing logo**
- ✅ **Fully responsive** — mobile, tablet, desktop

### Data
- ✅ **LocalStorage persistence** — saved ideas and history survive page refresh
- ✅ **No frameworks/libraries** — pure React with CSS
- ✅ **Deployed** — frontend on Vercel, backend on Render

---

## ⚡ Starter Prompt Feature

Every generated idea includes a **Starter Prompt** — a green-highlighted actionable sentence that tells developers exactly how to begin building the idea:

> *"Build a REST API with Node.js and Express that accepts user prompts and returns AI-generated..."*

This helps turn ideas into action immediately!

---

## 🛠️ Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React.js 18, React Router v6 |
| **Backend** | Node.js, Express.js |
| **AI** | Groq API (Llama 3.3-70b-versatile) — Free & Fast |
| **Deployment** | Vercel (frontend) + Render (backend) |
| **Storage** | Browser LocalStorage |
| **Styling** | Pure CSS with CSS custom properties |
| **Fonts** | Syne (display) + DM Sans (body) |

---

## 📁 Project Structure

```
task-3-ai_idea_generator/
│
├── README.md
├── package.json                        ← Root scripts
│
├── backend/
│   ├── server.js                       ← Express server + Groq AI route
│   └── package.json
│
└── frontend/
    ├── package.json
    ├── public/
    │   └── index.html
    └── src/
        ├── index.js
        ├── index.css                   ← Global styles + animations + particles
        ├── App.js                      ← Router + animated background
        ├── context/
        │   └── IdeaContext.js          ← Global state (ideas, saved, history)
        ├── components/
        │   ├── Navbar.js / .css        ← Sticky navbar with glow effects
        │   └── IdeaCard.js / .css      ← Idea card with starter prompt
        └── pages/
            ├── Landing.js / .css       ← Home page with hero & categories
            ├── Generator.js / .css     ← Main idea generation + custom dropdown
            ├── Saved.js / .css         ← Saved / favourite ideas
            └── History.js / .css       ← Past generation sessions
```

---

## 🚀 How to Run Locally

### Prerequisites
- Node.js v18+
- npm v9+
- A Groq API key (free) → [console.groq.com](https://console.groq.com)

### Step 1 — Clone the repo
```bash
git clone --no-checkout https://github.com/jsingh1609/TEN-internship.git
cd TEN-internship
git sparse-checkout init --cone
git sparse-checkout set task-3-ai_idea_generator
git checkout main
cd task-3-ai_idea_generator
```

### Step 2 — Set up the backend
```bash
cd backend
npm install
```

Create a `.env` file:
```
GROQ_API_KEY=gsk_your-groq-key-here
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

> ⚠️ Both terminals must be running at the same time.

---

## 🔌 API Reference

### `POST /api/generate`

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
      "description": "A platform that replaces synchronous meetings...",
      "technology": "WebRTC, React, Node.js",
      "audience": "Remote-first teams and distributed startups",
      "starterPrompt": "Build a React app with WebRTC integration that allows teams to record async video messages..."
    }
  ]
}
```

---

## 📋 Internship Task Requirements Coverage

| Requirement | Status | Details |
|-------------|--------|---------|
| Web app that generates ideas using AI | ✅ Done | Groq Llama 3.3 integration |
| Allow users to input keywords/domains | ✅ Done | Text input + custom category dropdown |
| Generate multiple creative ideas | ✅ Done | 3, 5, 8, or 10 ideas per request |
| Copy or save generated ideas | ✅ Done | Copy button + star to save |
| History of generated ideas | ✅ Done | Full history page with expand & re-run |
| Category selection (Advanced) | ✅ Done | 12 categories available |
| Favourite ideas section (Advanced) | ✅ Done | Full Saved page |
| Share ideas (Advanced) | ✅ Done | Native share API + clipboard fallback |
| React.js frontend | ✅ Done | React 18 + React Router v6 |
| Node.js + Express backend | ✅ Done | REST API with Groq AI integration |
| Clean and structured code | ✅ Done | Separated components, pages, context |
| GitHub repository | ✅ Done | [View Repo](https://github.com/jsingh1609/TEN-internship/tree/main/task-3-ai_idea_generator) |
| Project documentation | ✅ Done | This README |
| Deployed & Live | ✅ Done | Vercel + Render |
| **Starter Prompt** | ✅ Bonus | Actionable first step for every idea |
| **Dynamic UI** | ✅ Bonus | Particles, glowing cards, animations |
| **Custom Dropdown** | ✅ Bonus | Glassmorphic category selector |

---

## 👨‍💻 Author

**Built for the Vibe Coding Internship — AI Idea Generator Task**

Made with ♥ using React, Node.js, and Groq AI.

**Jasjeet Singh**
🔗 [github.com/jsingh1609](https://github.com/jsingh1609)

---

*IdeaSpark — Where every great startup begins.*