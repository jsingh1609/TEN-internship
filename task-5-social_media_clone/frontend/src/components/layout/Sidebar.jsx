import React from 'react';
import {
  Home, Search, Compass, Film, MessageCircle,
  Heart, PlusSquare, Menu, Camera
} from 'lucide-react';

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
  return (
    <div className="hidden md:flex flex-col w-20 xl:w-64 fixed h-screen border-r border-neutral-800 bg-black/80 backdrop-blur-xl p-3 pt-8 pb-5 z-50 transition-all duration-300">
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

      <SidebarItem icon={Menu} label="More" />
    </div>
  );
}
