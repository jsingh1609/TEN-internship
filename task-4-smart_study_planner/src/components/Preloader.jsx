import { useEffect, useState } from "react";

export default function Preloader({ onDone }) {
  const [phase, setPhase] = useState(0);
  // phase 0 = bar loading, 1 = text reveal, 2 = fade out

  useEffect(() => {
    const t1 = setTimeout(() => setPhase(1), 400);
    const t2 = setTimeout(() => setPhase(2), 1800);
    const t3 = setTimeout(() => onDone(), 2500);
    return () => { clearTimeout(t1); clearTimeout(t2); clearTimeout(t3); };
  }, []);

  return (
    <div className={`preloader ${phase === 2 ? "preloader-out" : ""}`}>
      <div className="preloader-inner">
        <div className={`pre-logo ${phase >= 1 ? "pre-logo-in" : ""}`}>
          <div className="pre-mark">📚</div>
          <div className="pre-brand">StudyFlow</div>
          <div className="pre-sub">AI Study Planner</div>
        </div>
        <div className="pre-bar-wrap">
          <div className={`pre-bar ${phase >= 0 ? "pre-bar-fill" : ""}`} />
        </div>
        <div className={`pre-pct ${phase >= 1 ? "pre-pct-in" : ""}`}>
          <LoadingPct active={phase >= 0} />
        </div>
      </div>
      <div className="pre-grid" />
    </div>
  );
}

function LoadingPct({ active }) {
  const [n, setN] = useState(0);
  useEffect(() => {
    if (!active) return;
    let v = 0;
    const iv = setInterval(() => {
      v += Math.random() * 18 + 4;
      if (v >= 100) { setN(100); clearInterval(iv); }
      else setN(Math.floor(v));
    }, 80);
    return () => clearInterval(iv);
  }, [active]);
  return <span>{n}%</span>;
}
