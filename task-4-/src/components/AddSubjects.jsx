import { useState } from "react";

const today = new Date().toISOString().split("T")[0];

export default function AddSubjects({ subjects, addSubject, removeSubject }) {
  const [form, setForm] = useState({ name: "", examDate: "", priority: "Medium", difficulty: "Medium" });
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  const handle = (e) => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = () => {
    if (!form.name.trim()) return setError("Subject name is required.");
    if (!form.examDate) return setError("Please pick an exam date.");
    if (form.examDate < today) return setError("Exam date must be in the future.");
    setError("");
    addSubject(form);
    setForm({ name: "", examDate: "", priority: "Medium", difficulty: "Medium" });
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h2 className="page-title">Your Subjects</h2>
        <p className="page-sub">Add subjects with exam dates to generate your personalized schedule.</p>
      </div>

      <div className="form-card">
        <div className="form-title">Add New Subject</div>
        <div className="form-row">
          <div className="field">
            <label>Subject Name</label>
            <input name="name" value={form.name} onChange={handle}
              placeholder="e.g. Mathematics" onKeyDown={e => e.key === "Enter" && submit()} />
          </div>
          <div className="field">
            <label>Exam Date</label>
            <input type="date" name="examDate" min={today} value={form.examDate} onChange={handle} />
          </div>
        </div>
        <div className="form-row">
          <div className="field">
            <label>Priority</label>
            <select name="priority" value={form.priority} onChange={handle}>
              <option>High</option><option>Medium</option><option>Low</option>
            </select>
          </div>
          <div className="field">
            <label>Difficulty</label>
            <select name="difficulty" value={form.difficulty} onChange={handle}>
              <option>Hard</option><option>Medium</option><option>Easy</option>
            </select>
          </div>
        </div>
        {error && <p className="error-msg">⚠ {error}</p>}
        <button className="btn-primary" onClick={submit} style={{ alignSelf: "flex-start" }}>
          {added ? "✓ Added!" : "+ Add Subject"}
        </button>
      </div>

      <div className="subjects-grid">
        {subjects.map((s, i) => {
          const days = Math.ceil((new Date(s.examDate) - new Date()) / 86400000);
          return (
            <SubjectCard key={s.id} s={s} days={days} i={i} removeSubject={removeSubject} />
          );
        })}
        {!subjects.length && (
          <div className="empty-state">
            <span className="empty-icon">📚</span>
            <p>No subjects yet.<br />Add your first one above.</p>
          </div>
        )}
      </div>
    </div>
  );
}

function SubjectCard({ s, days, i, removeSubject }) {
  const cardRef = useState(null)[0];

  const handleMouseMove = (e) => {
    const card = e.currentTarget;
    const rect = card.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * 100;
    const y = ((e.clientY - rect.top) / rect.height) * 100;
    card.style.setProperty("--mx", `${x}%`);
    card.style.setProperty("--my", `${y}%`);
    const rotY = ((e.clientX - rect.left) / rect.width - 0.5) * 10;
    const rotX = -((e.clientY - rect.top) / rect.height - 0.5) * 8;
    card.style.transform = `perspective(600px) rotateX(${rotX}deg) rotateY(${rotY}deg) translateY(-6px)`;
  };

  const handleMouseLeave = (e) => {
    e.currentTarget.style.transform = "";
  };

  return (
    <div
      className="subject-card"
      style={{ "--accent-color": s.color, animationDelay: `${i * 0.08}s` }}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div className="sc-header">
        <span className="sc-dot" style={{ background: s.color, color: s.color }} />
        <span className="sc-name">{s.name}</span>
        <button className="sc-del" onClick={() => removeSubject(s.id)}>✕</button>
      </div>
      <div className="sc-badges">
        <span className={`badge p-${s.priority.toLowerCase()}`}>{s.priority}</span>
        <span className={`badge d-${s.difficulty.toLowerCase()}`}>{s.difficulty}</span>
      </div>
      <div className="sc-footer">
        <span className="sc-date">
          📅 {new Date(s.examDate).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </span>
        <span className={`days-pill ${days <= 3 ? "urgent" : days <= 7 ? "soon" : ""}`}>{days}d</span>
      </div>
    </div>
  );
}