import React from 'react';
import { Heart, MessageCircle } from 'lucide-react';

export default function MobileHeader({ setCurrentView }) {
  return (
    <div className="md:hidden fixed top-0 w-full bg-black/80 backdrop-blur-xl border-b border-neutral-800 flex justify-between items-center p-4 z-50">
      <div
        className="text-xl font-serif tracking-wider font-semibold gradient-text cursor-pointer"
        onClick={() => setCurrentView('home')}
      >
        Vibegram
      </div>
      <div className="flex gap-4">
        <div
          className="relative cursor-pointer hover:scale-110 active:scale-90 transition-transform"
          onClick={() => setCurrentView('notifications')}
        >
          <Heart className="w-6 h-6" />
          <div className="absolute -top-1 -right-1 bg-red-500 w-2 h-2 rounded-full border border-black" />
        </div>
        <MessageCircle
          onClick={() => setCurrentView('messages')}
          className="w-6 h-6 cursor-pointer hover:scale-110 active:scale-90 transition-transform"
        />
      </div>
    </div>
  );
}
