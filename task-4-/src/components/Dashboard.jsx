import { useState, useEffect } from "react";

export default function Dashboard({ schedule, progress, toggleSession, subjects }) {
  const [activeDay, setActiveDay] = useState(0);
  const [animKey, setAnimKey] = useState(0);

  const changeDay = (i) => {
    setActiveDay(i);
    setAnimKey(k => k + 1);
  };

  if (!subjects.length) {
    return (
      <div className="page-container" style={{ alignItems: "center", paddingTop: "4rem", textAlign: "center" }}>
        <div style={{ fontSize: "3.5rem", marginBottom: "1rem" }}>📅</div>
        <h2 className="page-title">No Schedule Yet</h2>
        <p className="page-sub" style={{ marginTop: "0.5rem" }}>Add subjects to generate your study plan.</p>
      </div>
    );
  }

  const totalSessions = schedule.reduce((s, d) => s + d.sessions.length, 0);
  const doneSessions = Object.values(progress).filter(Boolean).length;
  const pct = totalSessions ? Math.round((doneSessions / totalSessions) * 100) : 0;
  const day = schedule[activeDay];

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Study Schedule</h2>
        <p className="page-sub">Click any session to mark it complete.</p>
      </div>

      {/* PROGRESS */}
      <div className="progress-section">
        <div className="progress-header">
          <span className="progress-label">Overall Progress</span>
          <AnimatedPct pct={pct} />
        </div>
        <div className="progress-track">
          <div className="progress-fill" style={{ width: `${pct}%` }} />
        </div>
        <div style={{ display: "flex", gap: "1rem", marginTop: "1rem" }}>
          {subjects.slice(0, 5).map(s => {
            const subDone = schedule.reduce((acc, d) => acc + (progress[`${d.date}_${s.name}`] ? 1 : 0), 0);
            const subTotal = schedule.reduce((acc, d) => acc + (d.sessions.find(x => x.subject === s.name) ? 1 : 0), 0);
            const sp = subTotal ? Math.round((subDone / subTotal) * 100) : 0;
            return (
              <div key={s.id} style={{ flex: 1, minWidth: 0 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.7rem", color: "var(--text2)", marginBottom: "0.3rem" }}>
                  <span style={{ overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{s.name}</span>
                  <span style={{ fontFamily: "DM Mono,monospace", flexShrink: 0, paddingLeft: "0.3rem" }}>{sp}%</span>
                </div>
                <div style={{ height: "3px", background: "rgba(255,255,255,0.05)", borderRadius: "2px", overflow: "hidden" }}>
                  <div style={{ height: "100%", width: `${sp}%`, background: s.color, borderRadius: "2px", boxShadow: `0 0 8px ${s.color}`, transition: "width 0.6s ease" }} />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* DAY SELECTOR */}
      <div className="day-scroll-wrap">
        <div className="day-scroll">
          {schedule.map((d, i) => {
            const dayDone = d.sessions.filter(s => progress[`${d.date}_${s.subject}`]).length;
            const date = new Date(d.date);
            return (
              <button key={d.date} className={`day-chip ${activeDay === i ? "active" : ""} ${d.examAlert ? "has-alert" : ""}`} onClick={() => changeDay(i)}>
                {i === 0 && <span className="today-ring" />}
                <span className="chip-day">{date.toLocaleDateString("en-US", { weekday: "short" })}</span>
                <span className="chip-date">{date.toLocaleDateString("en-US", { month: "short", day: "numeric" })}</span>
                {dayDone > 0 && <span className="chip-done">{dayDone}/{d.sessions.length} ✓</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* DAY DETAIL */}
      {day && (
        <div key={animKey} className="day-detail">
          {day.examAlert && <div className="alert-banner">🚨 {day.examAlert}</div>}
          <div className="day-meta">
            <h3 className="day-heading">{day.dayLabel}</h3>
            <span className="day-hours">{day.sessions.reduce((s, x) => s + x.hours, 0).toFixed(1)}h planned</span>
          </div>
          <div className="sessions-list">
            {day.sessions.map(s => {
              const key = `${day.date}_${s.subject}`;
              const done = !!progress[key];
              const barPct = (s.hours / 6) * 100;
              return (
                <div
                  key={key}
                  className={`session-row ${done ? "done" : ""}`}
                  style={{ "--s-color": s.color }}
                  onClick={() => toggleSession(day.date, s.subject)}
                >
                  <div className="session-check">{done ? "✓" : ""}</div>
                  <div className="session-info">
                    <span className="session-name">{s.subject}</span>
                    <div className="session-tags">
                      <span className={`badge p-${s.priority.toLowerCase()}`}>{s.priority}</span>
                      <span className={`badge d-${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>
                    </div>
                  </div>
                  <div className="session-right">
                    <div className="session-hrs">{s.hours}h</div>
                    <div className="session-bar-wrap">
                      <div className="session-bar-fill" style={{ width: `${barPct}%` }} />
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

function AnimatedPct({ pct }) {
  const [display, setDisplay] = useState(0);
  useEffect(() => {
    let start = null;
    const target = pct;
    const step = (ts) => {
      if (!start) start = ts;
      const p = Math.min((ts - start) / 600, 1);
      setDisplay(Math.round((1 - Math.pow(1 - p, 3)) * target));
      if (p < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }, [pct]);
  return <span className="progress-pct">{display}%</span>;
}