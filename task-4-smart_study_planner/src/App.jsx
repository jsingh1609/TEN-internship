import { useState, useEffect, useRef } from "react";
import { generateSchedule, COLORS } from "./utils/scheduler";
import AddSubjects from "./components/AddSubjects";
import Dashboard from "./components/Dashboard";
import Preloader from "./components/Preloader";
import CustomCursor from "./components/CustomCursor";
import Testimonials from "./components/Testimonials";
import HowItWorks from "./components/HowItWorks";
import "./App.css";

export default function App() {
  const [ready, setReady] = useState(false);
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

  useEffect(() => { localStorage.setItem("ssp_progress", JSON.stringify(progress)); }, [progress]);

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

  if (!ready) return <Preloader onDone={() => setReady(true)} />;

  return (
    <div className="app">
      <CustomCursor />
      <div className="scene-grid" />
      <div className="orb orb-1" /><div className="orb orb-2" /><div className="orb orb-3" />

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
        {page === "home" && <Landing setPage={setPage} subjects={subjects} schedule={schedule} progress={progress} total={totalSessions} done={doneSessions} />}
        {page === "subjects" && <AddSubjects subjects={subjects} addSubject={addSubject} removeSubject={removeSubject} />}
        {page === "schedule" && <Dashboard schedule={schedule} progress={progress} toggleSession={toggleSession} subjects={subjects} />}
      </main>
    </div>
  );
}

/* ── animated counter ── */
function useCountUp(target, duration = 900, delay = 0) {
  const [val, setVal] = useState(0);
  const [fired, setFired] = useState(false);
  const ref = useRef(null);
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting && !fired) setFired(true); }, { threshold: 0.3 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, [fired]);
  useEffect(() => {
    if (!fired) return;
    const t = setTimeout(() => {
      let start = null;
      const step = (ts) => {
        if (!start) start = ts;
        const p = Math.min((ts - start) / duration, 1);
        setVal(Math.round((1 - Math.pow(1 - p, 3)) * target));
        if (p < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    }, delay);
    return () => clearTimeout(t);
  }, [fired, target, duration, delay]);
  return [val, ref];
}

function StatCard({ icon, value, label, suffix = "", delay = 0 }) {
  const [count, ref] = useCountUp(typeof value === "number" ? value : 0, 900, delay);
  const display = typeof value === "number" ? `${count}${suffix}` : value;
  return (
    <div className="stat-card" ref={ref}>
      <div className="stat-icon-wrap">{icon}</div>
      <div className="stat-value">{display}</div>
      <div className="stat-label">{label}</div>
    </div>
  );
}

/* ── LANDING ── */
function Landing({ setPage, subjects, schedule, progress, total, done }) {
  const pct = total ? Math.round((done / total) * 100) : 0;
  const listRef = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver((entries) => {
      entries.forEach((e, i) => {
        if (e.isIntersecting) { setTimeout(() => e.target.classList.add("visible"), i * 80); obs.unobserve(e.target); }
      });
    }, { threshold: 0.08 });
    listRef.current?.querySelectorAll(".anim-item").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [subjects]);

  return (
    <div className="landing">

      {/* ── KEN BURNS HERO ── */}
      <div className="hero">
        <div className="kb-bg">
          <div className="kb-img kb-img-1" />
          <div className="kb-img kb-img-2" />
          <div className="kb-overlay" />
        </div>
        <div className="hero-content">
          <div className="hero-eyebrow">AI-Powered Study Planner</div>
          <h1 className="hero-title">Study <em>Smarter</em><br />Not Harder</h1>
          <p className="hero-sub">Add subjects, exam dates and difficulty. Get a beautiful, optimized 14-day study plan — instantly.</p>
          <div className="hero-actions">
            <button className="btn-primary" onClick={() => setPage("subjects")}>Get Started →</button>
            {subjects.length > 0 && <button className="btn-ghost" onClick={() => setPage("schedule")}>View Schedule</button>}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-row">
        <StatCard icon="📖" value={subjects.length} label="Subjects Added" delay={0} />
        <StatCard icon="📅" value={schedule.length} label="Study Days" delay={80} />
        <StatCard icon="🎯" value={pct} label="Progress" suffix="%" delay={160} />
      </div>

      {/* HOW IT WORKS — tabs + timeline */}
      <HowItWorks />

      {/* TESTIMONIALS */}
      <Testimonials />

      {/* UPCOMING EXAMS */}
      {subjects.length > 0 && (
        <div className="upcoming" ref={listRef}>
          <div className="section-label">Upcoming Exams</div>
          <div className="exam-list">
            {[...subjects].sort((a, b) => new Date(a.examDate) - new Date(b.examDate)).slice(0, 5).map((s, i) => {
              const days = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
              return (
                <div key={s.id} className="exam-card anim-item" style={{ borderLeftColor: s.color, transitionDelay: `${i * 60}ms` }}>
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