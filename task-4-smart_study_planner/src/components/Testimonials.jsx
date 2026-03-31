import { useState, useEffect, useRef } from "react";

const QUOTES = [
  { text: "StudyFlow cut my exam prep time in half. The schedule it generated was exactly what I needed.", name: "Priya S.", role: "BCA Final Year", avatar: "🎓" },
  { text: "I used to wing my study schedule. Now I actually know which subject needs the most time.", name: "Arjun M.", role: "Engineering Student", avatar: "💻" },
  { text: "The priority scoring is genius — it automatically puts harder subjects closer to their exam dates.", name: "Zara K.", role: "Pre-Med Student", avatar: "🔬" },
  { text: "Clean, fast, no nonsense. This is the first study app I've actually kept using.", name: "Dev R.", role: "MBA Aspirant", avatar: "📊" },
];

export default function Testimonials() {
  const [active, setActive] = useState(0);
  const [animDir, setAnimDir] = useState("in");
  const timerRef = useRef(null);

  const go = (i) => {
    setAnimDir("out");
    setTimeout(() => {
      setActive(i);
      setAnimDir("in");
    }, 320);
    resetTimer();
  };

  const resetTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setAnimDir("out");
      setTimeout(() => {
        setActive(a => { const n = (a + 1) % QUOTES.length; return n; });
        setAnimDir("in");
      }, 320);
    }, 4000);
  };

  useEffect(() => {
    resetTimer();
    return () => clearInterval(timerRef.current);
  }, []);

  const q = QUOTES[active];

  return (
    <div className="testimonials-wrap">
      <div className="section-label">What Students Say</div>
      <div className="testimonial-card">
        <div className="testi-quote-mark">"</div>
        <p className={`testi-text testi-${animDir}`}>{q.text}</p>
        <div className={`testi-author testi-${animDir}`}>
          <span className="testi-avatar">{q.avatar}</span>
          <div>
            <div className="testi-name">{q.name}</div>
            <div className="testi-role">{q.role}</div>
          </div>
        </div>
        <div className="testi-dots">
          {QUOTES.map((_, i) => (
            <button key={i} className={`testi-dot ${i===active?"active":""}`} onClick={() => go(i)} />
          ))}
        </div>
      </div>
    </div>
  );
}
