import React, { useState, useEffect } from 'react';
import { Search } from 'lucide-react';
import api from '../../api';

export default function SearchView({ searchQuery, setSearchQuery }) {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (searchQuery.trim()) {
      setLoading(true);
      const timer = setTimeout(() => {
        api.searchUsers(searchQuery)
          .then(data => {
            setResults(data.results || data);
            setLoading(false);
          })
          .catch(err => {
            console.error('Search error:', err);
            setLoading(false);
          });
      }, 300); // debounce API calls
      return () => clearTimeout(timer);
    } else {
      setResults([]);
    }
  }, [searchQuery]);

  return (
    <div className="w-full max-w-[470px] mx-auto pt-8 px-4 animate-slide-up-fade">
      <h2 className="text-2xl font-bold mb-6">Search</h2>
      <div className="relative mb-6">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-neutral-400 w-5 h-5" />
        <input
          type="text"
          placeholder="Search users..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full bg-white/10 text-white rounded-xl pl-10 pr-4 py-3 outline-none focus:ring-1 focus:ring-purple-500 transition-all border border-white/5 backdrop-blur-sm"
        />
      </div>
      <div className="space-y-4">
        {loading ? (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-full skeleton" />
                <div className="flex-1 space-y-2">
                  <div className="h-3 w-24 skeleton" />
                  <div className="h-2 w-32 skeleton" />
                </div>
              </div>
            ))}
          </div>
        ) : results.length > 0 ? (
          results.map(user => (
            <div 
              key={user.id} 
              onClick={() => alert(`View profile for @${user.username} (Coming soon!)`)}
              className="flex items-center justify-between cursor-pointer hover:bg-white/5 p-2 rounded-xl transition-colors glass-dark -mx-2"
            >
              <div className="flex items-center gap-3">
                <img src={user.avatar} alt={user.username} className="w-12 h-12 rounded-full object-cover" />
                <div>
                  <div className="text-sm font-semibold text-white">{user.username}</div>
                  <div className="text-xs text-neutral-400">{user.first_name} {user.last_name}</div>
                </div>
              </div>
            </div>
          ))
        ) : searchQuery ? (
          <div className="text-neutral-500 text-center mt-8">No results found for "{searchQuery}"</div>
        ) : (
          <div className="text-neutral-500 text-center mt-8">Search for profiles on Vibegram</div>
        )}
      </div>
    </div>
  );
}
