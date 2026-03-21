import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { useIdeas } from '../context/IdeaContext';
import './Navbar.css';

export default function Navbar() {
  const { saved }       = useIdeas();
  const location        = useLocation();
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 8);
    window.addEventListener('scroll', handler);
    return () => window.removeEventListener('scroll', handler);
  }, []);

  const nav = [
    { to: '/',         label: 'Home' },
    { to: '/generate', label: 'Generate' },
    { to: '/saved',    label: `Saved ${saved.length > 0 ? `(${saved.length})` : ''}` },
    { to: '/history',  label: 'History' },
  ];

  return (
    <nav className={`navbar ${scrolled ? 'scrolled' : ''}`}>
      <div className="nav-inner">
        <Link to="/" className="nav-logo">
          <span className="logo-spark">✦</span>
          IdeaSpark
        </Link>
        <ul className="nav-links">
          {nav.map(n => (
            <li key={n.to}>
              <Link
                to={n.to}
                className={`nav-link ${location.pathname === n.to ? 'active' : ''}`}
              >
                {n.label}
              </Link>
            </li>
          ))}
        </ul>
        <Link to="/generate" className="nav-cta">
          Generate Ideas →
        </Link>
      </div>
    </nav>
  );
}
