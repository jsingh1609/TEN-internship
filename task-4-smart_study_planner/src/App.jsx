import { useState, useEffect, useRef } from "react";
import { generateSchedule, COLORS } from "./utils/scheduler";
import AddSubjects from "./components/AddSubjects";
import Dashboard from "./components/Dashboard";
import "./App.css";

export default function App() {
  const [page, setPage] = useState("home");
  const [subjects, setSubjects] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ssp_subjects") || "[]"); } catch { return []; }
  });
  const [schedule, setSchedule] = useState([]);
  const [progress, setProgress] = useState(() => {
    try { return JSON.parse(localStorage.getItem("ssp_progress") || "{}"); } catch { return {}; }
  });

  useEffect(() => {
    if (subjects.length) setSchedule(generateSchedule(subjects));
    else setSchedule([]);
    localStorage.setItem("ssp_subjects", JSON.stringify(subjects));
  }, [subjects]);

  useEffect(() => {
    localStorage.setItem("ssp_progress", JSON.stringify(progress));
  }, [progress]);

  const addSubject = (sub) => {
    const color = COLORS[subjects.length % COLORS.length];
    setSubjects(prev => [...prev, { ...sub, id: Date.now(), color }]);
  };
  const removeSubject = (id) => setSubjects(prev => prev.filter(s => s.id !== id));
  const toggleSession = (dateKey, subjectName) => {
    const key = `${dateKey}_${subjectName}`;
    setProgress(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const totalSessions = schedule.reduce((s, d) => s + d.sessions.length, 0);
  const doneSessions = Object.values(progress).filter(Boolean).length;

  return (
    <div className="app">
      <div className="scene-grid" />
      <div className="orb orb-1" />
      <div className="orb orb-2" />
      <div className="orb orb-3" />

      <nav className="nav">
        <div className="nav-logo" onClick={() => setPage("home")}>
          <div className="logo-mark">📚</div>
          <span className="logo-text">StudyFlow</span>
        </div>
        <div className="nav-center">
          {[["home", "Home"], ["subjects", "Subjects"], ["schedule", "Schedule"]].map(([p, label]) => (
            <button key={p} className={`nav-btn ${page === p ? "active" : ""}`} onClick={() => setPage(p)}>
              {label}
            </button>
          ))}
        </div>
        <div className="nav-right">
          <span className="nav-pill">{subjects.length} subjects</span>
        </div>
      </nav>

      <main className="main">
        {page === "home" && <Landing setPage={setPage} subjects={subjects} schedule={schedule} progress={progress} totalSessions={totalSessions} doneSessions={doneSessions} />}
        {page === "subjects" && <AddSubjects subjects={subjects} addSubject={addSubject} removeSubject={removeSubject} />}
        {page === "schedule" && <Dashboard schedule={schedule} progress={progress} toggleSession={toggleSession} subjects={subjects} />}
      </main>
    </div>
  );
}

function useCountUp(target, duration = 900) {
  const [value, setValue] = useState(0);
  const [triggered, setTriggered] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !triggered) setTriggered(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [triggered]);
  useEffect(() => {
    if (!triggered) return;
    let start = null;
    const step = (ts) => {
      if (!start) start = ts;
      const pct = Math.min((ts - start) / duration, 1);
      const ease = 1 - Math.pow(1 - pct, 3);
      setValue(Math.round(ease * target));
      if (pct < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [triggered, target, duration]);
  return [value, ref];
}

function StatCard({ icon, value, label, suffix = "" }) {
  const [count, ref] = useCountUp(typeof value === "number" ? value : 0);
  const display = typeof value === "number" ? `${count}${suffix}` : value;
  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-icon-wrap">{icon}</div>
      <div className="stat-value">{display}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

function Landing({ setPage, subjects, schedule, progress, totalSessions, doneSessions }) {
  const pct = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0;
  return (
    <div className="landing">
      <div className="hero">
        <div className="hero-eyebrow">AI-Powered Study Planner</div>
        <h1 className="hero-title">Study <em>Smarter</em><br />Not Harder</h1>
        <p className="hero-sub">
          Add your subjects, exam dates and difficulty level. Get a beautiful, optimized 14-day study plan — instantly.
        </p>
        <div className="hero-actions">
          <button className="btn-primary" onClick={() => setPage("subjects")}>Get Started →</button>
          {subjects.length > 0 && <button className="btn-ghost" onClick={() => setPage("schedule")}>View Schedule</button>}
        </div>
      </div>

      <div className="stats-row">
        <StatCard icon="📖" value={subjects.length} label="Subjects Added" />
        <StatCard icon="📅" value={schedule.length} label="Study Days" />
        <StatCard icon="🎯" value={pct} label="Progress" suffix="%" />
      </div>

      {subjects.length > 0 && (
        <div className="upcoming">
          <div className="section-label">Upcoming Exams</div>
          <div className="exam-list">
            {[...subjects].sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).slice(0, 5).map((s, i) => {
              const days = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
              return (
                <div key={s.id} className="exam-card" style={{ borderLeftColor: s.color, animationDelay: `${i * 0.07}s` }}>
                  <span className="exam-dot" style={{ background: s.color, color: s.color }} />
                  <div className="exam-info">
                    <span className="exam-name">{s.name}</span>
                    <span className="exam-date">{new Date(s.examDate).toLocaleDateString("en-US", { weekday: "short", month: "short", day: "numeric" })}</span>
                  </div>
                  <span className={`days-pill ${days <= 3 ? "urgent" : days <= 7 ? "soon" : ""}`}>{days <= 0 ? "Today!" : `${days}d left`}</span>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}