import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Landing from './pages/Landing';
import Generator from './pages/Generator';
import Saved from './pages/Saved';
import History from './pages/History';
import { IdeaProvider } from './context/IdeaContext';

export default function App() {
  return (
    <IdeaProvider>
      <BrowserRouter>
        {/* Animated background */}
        <div className="bg-wrap">
          <div className="bg-mesh" />
          <div className="bg-grid" />
          <div className="bg-scan" />
          <div className="particles">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="particle" />
            ))}
          </div>
        </div>

        <Navbar />

        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/generate" element={<Generator />} />
          <Route path="/saved" element={<Saved />} />
          <Route path="/history" element={<History />} />
        </Routes>
      </BrowserRouter>
    </IdeaProvider>
  );
}