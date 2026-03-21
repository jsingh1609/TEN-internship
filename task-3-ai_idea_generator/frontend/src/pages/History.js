import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import IdeaCard from '../components/IdeaCard';
import './History.css';

export default function History() {
  const { history, clearHistory, generateIdeas } = useIdeas();
  const [expanded,     setExpanded]     = useState(null);
  const [confirmClear, setConfirmClear] = useState(false);
  const navigate = useNavigate();

  function toggleExpand(id) {
    setExpanded(prev => prev === id ? null : id);
  }

  function handleClear() {
    if (confirmClear) {
      clearHistory();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }

  async function rerun(entry) {
    await generateIdeas({
      keyword:  entry.keyword,
      category: entry.category,
      count:    entry.count,
    });
    navigate('/generate');
  }

  function fmtDate(iso) {
    return new Date(iso).toLocaleString('en-IN', {
      month: 'short', day: 'numeric', year: 'numeric',
      hour: 'numeric', minute: '2-digit', hour12: true,
    });
  }

  return (
    <div className="history-page page-enter">
      <div className="history-inner">

        {/* Header */}
        <div className="history-header">
          <div>
            <div className="section-tag">Past Generations</div>
            <h1 className="history-title">Generation History</h1>
            <p className="history-sub">
              {history.length > 0
                ? `${history.length} generation${history.length !== 1 ? 's' : ''} recorded.`
                : 'No generations yet.'}
            </p>
          </div>
          {history.length > 0 && (
            <button
              className={`action-btn danger ${confirmClear ? 'confirm' : ''}`}
              onClick={handleClear}
            >
              {confirmClear ? '⚠️ Confirm Clear' : '🗑 Clear History'}
            </button>
          )}
        </div>

        {/* History list */}
        {history.length > 0 ? (
          <div className="history-list">
            {history.map((entry) => (
              <div key={entry.id} className="history-entry">

                {/* Entry header */}
                <div className="he-header" onClick={() => toggleExpand(entry.id)}>
                  <div className="he-left">
                    <div className="he-dot" />
                    <div className="he-info">
                      <div className="he-keyword">"{entry.keyword}"</div>
                      <div className="he-meta">
                        {entry.category !== 'Any' && (
                          <span className="he-cat">{entry.category}</span>
                        )}
                        <span className="he-count">{entry.count} ideas</span>
                        <span className="he-time">{fmtDate(entry.createdAt)}</span>
                      </div>
                    </div>
                  </div>
                  <div className="he-right">
                    <button
                      className="rerun-btn"
                      onClick={(e) => { e.stopPropagation(); rerun(entry); }}
                      title="Re-run this query"
                    >
                      ↻ Re-run
                    </button>
                    <span className="expand-icon">
                      {expanded === entry.id ? '▲' : '▼'}
                    </span>
                  </div>
                </div>

                {/* Expanded ideas */}
                {expanded === entry.id && (
                  <div className="he-ideas">
                    <div className="ideas-grid">
                      {entry.ideas.map((idea, i) => (
                        <IdeaCard key={i} idea={idea} index={i} />
                      ))}
                    </div>
                  </div>
                )}

              </div>
            ))}
          </div>
        ) : (
          <div className="history-empty">
            <div className="empty-icon">◎</div>
            <h3>No history yet</h3>
            <p>Every time you generate ideas, the session will be saved here so you can revisit it anytime.</p>
            <Link to="/generate" className="btn-primary">
              ✦ Generate Your First Ideas
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
