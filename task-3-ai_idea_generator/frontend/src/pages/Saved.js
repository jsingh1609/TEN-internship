import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import IdeaCard from '../components/IdeaCard';
import './Saved.css';

export default function Saved() {
  const { saved, clearSaved } = useIdeas();
  const [confirmClear, setConfirmClear] = useState(false);

  function handleClear() {
    if (confirmClear) {
      clearSaved();
      setConfirmClear(false);
    } else {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3000);
    }
  }

  function copyAll() {
    const text = saved.map((idea, i) =>
      `${i + 1}. ${idea.name}\n"${idea.tagline}"\n${idea.description}\nTech: ${idea.technology}\nAudience: ${idea.audience}`
    ).join('\n\n---\n\n');
    navigator.clipboard.writeText(text);
    alert('All saved ideas copied to clipboard!');
  }

  return (
    <div className="saved-page page-enter">
      <div className="saved-inner">

        {/* Header */}
        <div className="saved-header">
          <div>
            <div className="section-tag">Favourites</div>
            <h1 className="saved-title">Saved Ideas</h1>
            <p className="saved-sub">
              {saved.length > 0
                ? `You have ${saved.length} saved idea${saved.length !== 1 ? 's' : ''}.`
                : 'No saved ideas yet. Star ideas you like to save them here.'}
            </p>
          </div>

          {saved.length > 0 && (
            <div className="saved-actions">
              <button className="action-btn" onClick={copyAll}>
                ⎘ Copy All
              </button>
              <button
                className={`action-btn danger ${confirmClear ? 'confirm' : ''}`}
                onClick={handleClear}
              >
                {confirmClear ? '⚠️ Confirm Clear' : '🗑 Clear All'}
              </button>
            </div>
          )}
        </div>

        {/* Ideas grid */}
        {saved.length > 0 ? (
          <div className="ideas-grid">
            {saved.map((idea, i) => (
              <IdeaCard key={`${idea.name}-${i}`} idea={idea} index={i} />
            ))}
          </div>
        ) : (
          <div className="saved-empty">
            <div className="empty-icon">☆</div>
            <h3>Nothing saved yet</h3>
            <p>Generate some ideas and click the ☆ star button to save your favourites here.</p>
            <Link to="/generate" className="btn-primary">
              ✦ Generate Ideas
            </Link>
          </div>
        )}

      </div>
    </div>
  );
}
