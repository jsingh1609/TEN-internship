# StudyFlow – Smart Study Planner

AI-powered study scheduler built with React + pure logic scheduling.

## Setup

```bash
npm install
npm run dev
```

## Build & Deploy (Vercel)

```bash
npm run build
# Push to GitHub, connect repo on vercel.com
```

## Features
- Add subjects with exam dates, priority, and difficulty
- Auto-generates 14-day study schedule using smart scoring logic
- Daily session view with progress tracking (localStorage)
- Exam alert banners when exam is tomorrow
- Fully responsive, dark UI

## How the Scheduler Works
Each subject gets a priority score:
`score = difficulty × priority × (1 / daysUntil)`

Daily study hours (6h) are distributed proportionally by score — so harder, closer-deadline subjects get more time automatically.

## Project Structure
```
src/
  App.jsx          # Main app + Landing page
  App.css          # All styles
  utils/
    scheduler.js   # Pure scheduling logic
  components/
    AddSubjects.jsx
    Dashboard.jsx
```
