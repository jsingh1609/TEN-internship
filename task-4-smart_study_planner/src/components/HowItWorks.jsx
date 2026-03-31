import { useState, useEffect, useRef } from "react";

const TABS = [
  {
    id: "add",
    icon: "📝",
    label: "Add Subjects",
    title: "Enter Your Subjects",
    desc: "Add any subject with its exam date, priority level, and difficulty rating. The planner supports unlimited subjects across any field of study.",
    highlight: "Takes 30 seconds to set up",
    timeline: [
      { year: "Step 1", event: "Name your subject — e.g. Mathematics, History, Physics" },
      { year: "Step 2", event: "Pick your exam date from the calendar picker" },
      { year: "Step 3", event: "Rate priority (High/Med/Low) and difficulty (Hard/Med/Easy)" },
    ],
  },
  {
    id: "plan",
    icon: "🧠",
    label: "AI Schedules",
    title: "Smart Scheduling Logic",
    desc: "The algorithm scores each subject using difficulty × priority × urgency, then distributes your daily 6-hour study window proportionally — harder, closer-deadline subjects get more time automatically.",
    highlight: "Score = difficulty × priority × (1/days left)",
    timeline: [
      { year: "Urgent", event: "High difficulty + close deadline = most daily hours" },
      { year: "Balanced", event: "Equal scores split time evenly across subjects" },
      { year: "Relaxed", event: "Easy or far-away subjects get lighter daily sessions" },
    ],
  },
  {
    id: "track",
    icon: "📈",
    label: "Track Progress",
    title: "Stay On Track",
    desc: "Tap any session to mark it done. Watch your progress bars fill up per-subject and overall. Your progress is saved locally — it persists across browser refreshes.",
    highlight: "Progress auto-saves to your browser",
    timeline: [
      { year: "Daily", event: "Check off sessions as you complete them" },
      { year: "Weekly", event: "Per-subject progress bars show weak spots" },
      { year: "Exam day", event: "Red alert appears the day before every exam" },
    ],
  },
];

export default function HowItWorks() {
  const [active, setActive] = useState(0);
  const [visible, setVisible] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setVisible(true); }, { threshold: 0.15 });
    if (ref.current) obs.observe(ref.current);
    return () => obs.disconnect();
  }, []);

  const tab = TABS[active];

  return (
    <div ref={ref} className={`hiw-wrap ${visible ? "hiw-visible" : ""}`}>
      <div className="section-label">How It Works</div>
      {/* tab bar */}
      <div className="hiw-tabs">
        {TABS.map((t, i) => (
          <button key={t.id} className={`hiw-tab ${active===i?"active":""}`} onClick={() => setActive(i)}>
            <span className="hiw-tab-icon">{t.icon}</span>
            <span className="hiw-tab-label">{t.label}</span>
          </button>
        ))}
      </div>

      {/* content */}
      <div className="hiw-content" key={active}>
        <div className="hiw-left">
          <h3 className="hiw-title">{tab.title}</h3>
          <p className="hiw-desc">{tab.desc}</p>
          <div className="hiw-highlight">{tab.highlight}</div>
        </div>
        <div className="hiw-right">
          <div className="hiw-timeline">
            {tab.timeline.map((item, i) => (
              <div key={i} className="hiw-tl-item" style={{ animationDelay: `${i * 120}ms` }}>
                <div className="hiw-tl-dot" />
                <div className="hiw-tl-body">
                  <span className="hiw-tl-year">{item.year}</span>
                  <span className="hiw-tl-event">{item.event}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
