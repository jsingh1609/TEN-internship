import React, { useState } from 'react';
import { useIdeas } from '../context/IdeaContext';
import './IdeaCard.css';

export default function IdeaCard({ idea, index }) {
  const { toggleSave, isSaved } = useIdeas();
  const [copied, setCopied]     = useState(false);
  const saved = isSaved(idea);

  function copyIdea() {
    const text = `💡 ${idea.name}\n"${idea.tagline}"\n\n${idea.description}\n\nTechnology: ${idea.technology}\nAudience: ${idea.audience}`;
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  function shareIdea() {
    const text = `💡 ${idea.name} — "${idea.tagline}" via IdeaSpark`;
    if (navigator.share) {
      navigator.share({ title: idea.name, text });
    } else {
      navigator.clipboard.writeText(text);
      alert('Link copied to clipboard!');
    }
  }

  return (
    <div
      className="idea-card"
      style={{ animationDelay: `${index * 0.08}s` }}
    >
      <div className="ic-header">
        <div className="ic-num">0{index + 1}</div>
        <div className="ic-actions">
          <button
            className={`ic-btn ${saved ? 'saved' : ''}`}
            onClick={() => toggleSave(idea)}
            title={saved ? 'Unsave' : 'Save idea'}
          >
            {saved ? '★' : '☆'}
          </button>
          <button className="ic-btn" onClick={copyIdea} title="Copy idea">
            {copied ? '✓' : '⎘'}
          </button>
          <button className="ic-btn" onClick={shareIdea} title="Share idea">
            ↗
          </button>
        </div>
      </div>

      <h3 className="ic-name">{idea.name}</h3>
      <p  className="ic-tagline">"{idea.tagline}"</p>
      <p  className="ic-desc">{idea.description}</p>

      <div className="ic-meta">
        <div className="ic-meta-item">
          <span className="ic-meta-label">Tech</span>
          <span className="ic-meta-val">{idea.technology}</span>
        </div>
        <div className="ic-meta-item">
          <span className="ic-meta-label">Audience</span>
          <span className="ic-meta-val">{idea.audience}</span>
        </div>
      </div>
    </div>
  );
}
