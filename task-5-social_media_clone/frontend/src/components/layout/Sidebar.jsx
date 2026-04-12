import React, { useState, useRef, useEffect } from 'react';
import {
  Home, Search, Compass, Film, MessageCircle,
  Heart, PlusSquare, Menu, Camera, Settings, Bookmark, AlertCircle
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const SidebarItem = ({ icon: Icon, label, isActive, onClick }) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-4 p-3 my-1 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200 active:scale-95 group`}
  >
    <Icon
      className={`w-6 h-6 group-hover:scale-110 transition-transform duration-300 ${isActive ? 'stroke-[2.5px]' : 'stroke-[1.5px]'}`}
    />
    <span className={`hidden xl:block text-base ${isActive ? 'font-bold' : 'font-normal'}`}>
      {label}
    </span>
  </div>
);

export default function Sidebar({ currentView, setCurrentView, userProfile, onOpenCreate }) {
  const { logout } = useAuth();
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMoreMenu(false);
      }
    };
    if (showMoreMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMoreMenu]);

  return (
    <div className="hidden md:flex flex-col w-20 xl:w-64 fixed h-screen border-r border-neutral-800/50 bg-black/10 backdrop-blur-[2px] p-3 pt-8 pb-5 z-50 transition-all duration-300">
      <div
        className="px-3 mb-8 cursor-pointer hover:scale-105 transition-transform duration-300 w-fit"
        onClick={() => setCurrentView('home')}
      >
        <Camera className="w-6 h-6 xl:hidden" />
        <div className="hidden xl:block text-2xl font-serif tracking-wider font-semibold gradient-text">
          Vibegram
        </div>
      </div>

      <div className="flex-1 space-y-2">
        <SidebarItem icon={Home} label="Home" isActive={currentView === 'home'} onClick={() => setCurrentView('home')} />
        <SidebarItem icon={Search} label="Search" isActive={currentView === 'search'} onClick={() => setCurrentView('search')} />
        <SidebarItem icon={Compass} label="Explore" isActive={currentView === 'explore'} onClick={() => setCurrentView('explore')} />
        <SidebarItem icon={Film} label="Reels" isActive={currentView === 'reels'} onClick={() => setCurrentView('reels')} />
        <SidebarItem icon={MessageCircle} label="Messages" isActive={currentView === 'messages'} onClick={() => setCurrentView('messages')} />
        <SidebarItem icon={Heart} label="Notifications" isActive={currentView === 'notifications'} onClick={() => setCurrentView('notifications')} />
        <SidebarItem icon={PlusSquare} label="Create" onClick={onOpenCreate} />

        <div
          onClick={() => setCurrentView('profile')}
          className={`flex items-center gap-4 p-3 my-1 rounded-lg cursor-pointer hover:bg-white/10 transition-all duration-200 active:scale-95 group ${currentView === 'profile' ? 'font-bold' : ''}`}
        >
          <img
            src={userProfile.avatar}
            alt="Profile"
            className={`w-6 h-6 rounded-full object-cover group-hover:scale-110 transition-transform duration-300 ${currentView === 'profile' ? 'border-2 border-white' : ''}`}
          />
          <span className="hidden xl:block text-base">Profile</span>
        </div>
      </div>

      <div className="relative mt-auto" ref={menuRef}>
        {showMoreMenu && (
          <div className="absolute bottom-16 left-0 w-64 bg-neutral-900 border border-neutral-800 rounded-2xl shadow-2xl overflow-hidden animate-slide-up-fade z-50">
            <div className="p-2 space-y-1">
              <button 
                onClick={() => { setShowMoreMenu(false); alert('Settings module is currently under development for v2.0!'); }}
                className="w-full flex items-center gap-3 p-3 text-sm hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Settings className="w-5 h-5 text-neutral-300" /> Settings
              </button>
              <button 
                onClick={() => { setShowMoreMenu(false); setCurrentView('profile'); }}
                className="w-full flex items-center gap-3 p-3 text-sm hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <Bookmark className="w-5 h-5 text-neutral-300" /> Saved
              </button>
              <button 
                onClick={() => { 
                  setShowMoreMenu(false); 
                  const issue = prompt('Describe the issue you are facing:'); 
                  if(issue) alert('Thank you! Your report has been submitted to the Vibecode moderation team.'); 
                }}
                className="w-full flex items-center gap-3 p-3 text-sm hover:bg-neutral-800 rounded-lg transition-colors"
              >
                <AlertCircle className="w-5 h-5 text-neutral-300" /> Report a problem
              </button>
            </div>
            <div className="h-px bg-neutral-800 w-full" />
            <div className="p-2">
              <button 
                onClick={() => { setShowMoreMenu(false); alert('Multi-account support is currently in beta. Please log out to switch accounts for now.'); }}
                className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-800 rounded-lg transition-colors"
              >
                Switch accounts
              </button>
              <button onClick={logout} className="w-full text-left px-4 py-3 text-sm hover:bg-neutral-800 rounded-lg transition-colors text-red-500 font-semibold">
                Log out
              </button>
            </div>
          </div>
        )}
        <SidebarItem icon={Menu} label="More" onClick={() => setShowMoreMenu(!showMoreMenu)} />
      </div>
    </div>
  );
}
