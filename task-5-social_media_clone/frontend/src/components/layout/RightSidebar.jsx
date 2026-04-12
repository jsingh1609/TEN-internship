import React, { useState } from 'react';
import { useAuth } from '../../context/AuthContext';

export default function RightSidebar({ userProfile, suggestedUsers = [] }) {
  const { logout } = useAuth();
  const [followed, setFollowed] = useState({});

  const handleFollow = (id) => {
    setFollowed(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="w-full">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4 cursor-pointer">
          <img src={userProfile.avatar} alt="Profile" className="w-12 h-12 rounded-full object-cover" />
          <div>
            <div className="text-sm font-semibold">{userProfile.username}</div>
            <div className="text-sm text-neutral-400">{userProfile.first_name} {userProfile.last_name}</div>
          </div>
        </div>
        <button
          onClick={logout}
          className="text-blue-500 text-xs font-semibold hover:text-white transition-colors"
        >
          Log out
        </button>
      </div>

      <div className="flex items-center justify-between mb-4">
        <div className="text-sm font-semibold text-neutral-400">Suggested for you</div>
        <button onClick={() => alert('View all suggestions')} className="text-white text-xs font-semibold hover:text-neutral-300">See All</button>
      </div>

      <div className="space-y-4">
        {suggestedUsers.map((user) => (
          <div key={user.id} className="flex items-center justify-between">
            <div className="flex items-center gap-3 cursor-pointer group">
              <img src={user.avatar} alt={user.username} className="w-8 h-8 rounded-full object-cover group-hover:scale-105 transition-transform" />
              <div>
                <div className="text-sm font-semibold group-hover:text-neutral-300 transition-colors">{user.username}</div>
                <div className="text-xs text-neutral-400 truncate w-[140px]">{user.relation}</div>
              </div>
            </div>
            <button 
              onClick={() => handleFollow(user.id)}
              className={`text-xs font-semibold transition-colors ${followed[user.id] ? 'text-neutral-400' : 'text-blue-500 hover:text-white'}`}
            >
              {followed[user.id] ? 'Following' : 'Follow'}
            </button>
          </div>
        ))}
      </div>


      <div className="mt-4 text-xs text-neutral-600">
        © 2026 VIBEGRAM FROM VIBECODE
      </div>
    </div>
  );
}
