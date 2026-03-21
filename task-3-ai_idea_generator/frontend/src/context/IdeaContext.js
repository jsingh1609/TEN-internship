import React, { createContext, useContext, useState, useEffect } from 'react';

const IdeaContext = createContext();

export function IdeaProvider({ children }) {
  // Current generated ideas
  const [ideas,     setIdeas]     = useState([]);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [lastQuery, setLastQuery] = useState(null);

  // Saved / favourite ideas
  const [saved, setSaved] = useState(() => {
    try { return JSON.parse(localStorage.getItem('is_saved') || '[]'); }
    catch { return []; }
  });

  // Generation history
  const [history, setHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem('is_history') || '[]'); }
    catch { return []; }
  });

  // Persist to localStorage
  useEffect(() => { localStorage.setItem('is_saved',   JSON.stringify(saved));   }, [saved]);
  useEffect(() => { localStorage.setItem('is_history', JSON.stringify(history)); }, [history]);

  // Generate ideas via backend
  async function generateIdeas({ keyword, category, count }) {
    setLoading(true);
    setError(null);
    setIdeas([]);

    try {
      const res = await fetch('/api/generate', {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ keyword, category, count }),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Failed to generate ideas.');

      setIdeas(data.ideas);
      setLastQuery({ keyword, category, count });

      // Add to history
      const entry = {
        id:        Date.now(),
        keyword,
        category:  category || 'Any',
        count:     data.ideas.length,
        ideas:     data.ideas,
        createdAt: new Date().toISOString(),
      };
      setHistory(prev => [entry, ...prev].slice(0, 50));

    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  // Toggle save/unsave an idea
  function toggleSave(idea) {
    setSaved(prev => {
      const exists = prev.find(s => s.id === idea.id && s.name === idea.name);
      if (exists) return prev.filter(s => !(s.id === idea.id && s.name === idea.name));
      return [{ ...idea, savedAt: new Date().toISOString() }, ...prev];
    });
  }

  function isSaved(idea) {
    return saved.some(s => s.name === idea.name);
  }

  function clearHistory() {
    setHistory([]);
    localStorage.removeItem('is_history');
  }

  function clearSaved() {
    setSaved([]);
    localStorage.removeItem('is_saved');
  }

  return (
    <IdeaContext.Provider value={{
      ideas, loading, error, lastQuery,
      generateIdeas,
      saved, toggleSave, isSaved, clearSaved,
      history, clearHistory,
    }}>
      {children}
    </IdeaContext.Provider>
  );
}

export function useIdeas() { return useContext(IdeaContext); }
