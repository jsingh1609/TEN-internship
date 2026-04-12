import React from 'react';
import { Home, Search, PlusSquare, Film } from 'lucide-react';

export default function MobileBottomNav({ currentView, setCurrentView, userProfile, onOpenCreate }) {
  return (
    <div className="md:hidden fixed bottom-0 w-full bg-black/80 backdrop-blur-xl border-t border-neutral-800 flex justify-around items-center p-3 z-50">
      <Home
        onClick={() => setCurrentView('home')}
        className={`w-6 h-6 cursor-pointer transition-transform duration-200 active:scale-90 ${currentView === 'home' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`}
      />
      <Search
        onClick={() => setCurrentView('search')}
        className={`w-6 h-6 cursor-pointer active:scale-90 transition-transform ${currentView === 'search' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`}
      />
      <PlusSquare
        onClick={onOpenCreate}
        className="w-6 h-6 cursor-pointer active:scale-90 transition-transform"
      />
      <Film
        onClick={() => setCurrentView('reels')}
        className={`w-6 h-6 cursor-pointer active:scale-90 transition-transform ${currentView === 'reels' ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`}
      />
      <img
        onClick={() => setCurrentView('profile')}
        src={userProfile.avatar}
        alt="Profile"
        className={`w-6 h-6 rounded-full object-cover cursor-pointer transition-transform duration-200 active:scale-90 ${currentView === 'profile' ? 'border-[1.5px] border-white' : ''}`}
      />
    </div>
  );
}
