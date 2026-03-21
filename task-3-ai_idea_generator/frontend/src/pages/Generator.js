import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import IdeaCard from '../components/IdeaCard';
import './Generator.css';

const CATEGORIES = ['Any','AI & ML','FinTech','Healthcare','EdTech','CleanTech','E-Commerce','SaaS','Web3','Gaming','Social','Productivity'];
const COUNTS     = [3, 5, 8, 10];

export default function Generator() {
  const { generateIdeas, ideas, loading, error, lastQuery } = useIdeas();
  const [searchParams] = useSearchParams();

  const [keyword,  setKeyword]  = useState('');
  const [category, setCategory] = useState('Any');
  const [count,    setCount]    = useState(5);

  // Pre-fill category from URL param (from Landing category chips)
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat) setCategory(cat);
  }, [searchParams]);

  function handleSubmit(e) {
    e.preventDefault();
    if (!keyword.trim()) return;
    generateIdeas({ keyword, category, count });
  }

  return (
    <div className="generator page-enter">

      {/* ── Input Panel ── */}
      <section className="gen-panel">
        <div className="gen-panel-inner">
          <div className="gen-header">
            <div className="section-tag">AI Idea Generator</div>
            <h1 className="gen-title">What problem are you<br/>trying to solve?</h1>
            <p className="gen-sub">Enter a keyword, domain, or problem area and let AI do the rest.</p>
          </div>

          <form className="gen-form" onSubmit={handleSubmit}>
            {/* Keyword */}
            <div className="form-group">
              <label>Keyword / Domain / Problem</label>
              <div className="input-wrap">
                <span className="input-ico">✦</span>
                <input
                  type="text"
                  value={keyword}
                  onChange={e => setKeyword(e.target.value)}
                  placeholder="e.g. remote work, climate change, healthcare..."
                  maxLength={120}
                  autoFocus
                />
              </div>
            </div>

            {/* Category + Count */}
            <div className="form-row">
              <div className="form-group">
                <label>Category</label>
                <select value={category} onChange={e => setCategory(e.target.value)}>
                  {CATEGORIES.map(c => <option key={c}>{c}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Number of ideas</label>
                <div className="count-pills">
                  {COUNTS.map(n => (
                    <button
                      key={n} type="button"
                      className={`count-pill ${count === n ? 'active' : ''}`}
                      onClick={() => setCount(n)}
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button type="submit" className="gen-btn" disabled={loading || !keyword.trim()}>
              {loading ? (
                <><span className="spinner"/> Generating ideas...</>
              ) : (
                <>✦ Generate {count} Ideas</>
              )}
            </button>
          </form>
        </div>
      </section>

      {/* ── Results ── */}
      {error && (
        <div className="gen-error">
          ⚠️ {error}
        </div>
      )}

      {ideas.length > 0 && (
        <section className="results page-enter">
          <div className="results-header">
            <div>
              <div className="section-tag">Results</div>
              <h2 className="results-title">
                {ideas.length} ideas for <em>"{lastQuery?.keyword}"</em>
                {lastQuery?.category !== 'Any' && <span className="res-cat"> · {lastQuery.category}</span>}
              </h2>
            </div>
            <button
              className="regen-btn"
              onClick={() => generateIdeas(lastQuery)}
              disabled={loading}
            >
              ↻ Regenerate
            </button>
          </div>

          <div className="ideas-grid">
            {ideas.map((idea, i) => (
              <IdeaCard key={idea.id || i} idea={idea} index={i} />
            ))}
          </div>
        </section>
      )}

      {/* Loading skeleton */}
      {loading && (
        <section className="results">
          <div className="ideas-grid">
            {Array.from({ length: count }).map((_, i) => (
              <div key={i} className="idea-skeleton" style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="skel skel-num"/>
                <div className="skel skel-title"/>
                <div className="skel skel-tag"/>
                <div className="skel skel-line"/>
                <div className="skel skel-line short"/>
              </div>
            ))}
          </div>
        </section>
      )}

    </div>
  );
}
