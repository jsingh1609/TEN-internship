import React from 'react';
import { Link } from 'react-router-dom';
import './Landing.css';

const CATEGORIES = ['AI & ML','FinTech','Healthcare','EdTech','CleanTech','E-Commerce','SaaS','Web3'];

export default function Landing() {
  return (
    <div className="landing page-enter">

      {/* ── Hero ── */}
      <section className="hero">
        <div className="hero-eyebrow">
          <span className="dot-pulse"></span>
          Powered by OpenAI GPT
        </div>
        <h1 className="hero-title">
          Turn any idea into<br/>
          <span className="hero-accent">your next big startup.</span>
        </h1>
        <p className="hero-sub">
          Enter a keyword, domain, or problem — IdeaSpark generates
          creative, actionable startup ideas tailored to you in seconds.
        </p>
        <div className="hero-btns">
          <Link to="/generate" className="btn-primary">
            ✦ Start Generating
          </Link>
          <Link to="/history" className="btn-ghost">
            View History →
          </Link>
        </div>

        {/* Stats */}
        <div className="hero-stats">
          <div className="stat"><strong>AI</strong><span>Powered</span></div>
          <div className="stat-sep"/>
          <div className="stat"><strong>8+</strong><span>Categories</span></div>
          <div className="stat-sep"/>
          <div className="stat"><strong>∞</strong><span>Ideas</span></div>
          <div className="stat-sep"/>
          <div className="stat"><strong>Free</strong><span>No sign-up</span></div>
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="how">
        <div className="section-tag">How it works</div>
        <h2 className="section-title">Three steps to your next big idea.</h2>
        <div className="steps">
          {[
            { n:'01', title:'Enter a keyword', desc:'Type any domain, technology, industry, or problem you want ideas for.' },
            { n:'02', title:'Pick a category', desc:'Narrow it down — AI, FinTech, Healthcare, EdTech and more.' },
            { n:'03', title:'Get AI-generated ideas', desc:'Receive 5–10 unique, actionable startup ideas with descriptions, tech stack, and target audience.' },
          ].map(s => (
            <div className="step-card" key={s.n}>
              <div className="step-num">{s.n}</div>
              <h3>{s.title}</h3>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="cats-section">
        <div className="section-tag">Categories</div>
        <h2 className="section-title">Explore any industry.</h2>
        <div className="cats-grid">
          {CATEGORIES.map(c => (
            <Link to={`/generate?category=${encodeURIComponent(c)}`} key={c} className="cat-chip">
              {c}
            </Link>
          ))}
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="cta-banner">
        <h2>Ready to spark your next idea?</h2>
        <p>Join thousands of entrepreneurs and developers generating ideas with AI.</p>
        <Link to="/generate" className="btn-primary btn-lg">
          Generate Ideas Now →
        </Link>
      </section>

    </div>
  );
}
