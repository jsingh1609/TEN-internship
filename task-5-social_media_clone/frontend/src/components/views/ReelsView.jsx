import React from 'react';
import { Film, Heart, MessageCircle, Send, MoreHorizontal } from 'lucide-react';

export default function ReelsView() {
  return (
    <div className="w-full max-w-[400px] h-[calc(100vh-140px)] mx-auto mt-4 md:mt-8 rounded-xl bg-neutral-900 relative flex items-center justify-center overflow-hidden animate-slide-up-fade shadow-2xl">
      <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/90 z-10" />
      <Film className="w-16 h-16 text-white/20 animate-pulse absolute z-0" />
      <img
        src="https://images.unsplash.com/photo-1618172193622-ae2d025f4032?q=80&w=1000&auto=format&fit=crop"
        alt="Reel bg"
        className="absolute inset-0 w-full h-full object-cover opacity-80"
      />

      <div className="absolute bottom-6 left-4 z-20 space-y-3 w-3/4 animate-fade-in">
        <div className="flex items-center gap-2 cursor-pointer">
          <img src="https://picsum.photos/seed/reel/50/50" className="w-8 h-8 rounded-full border border-neutral-700" alt="creator" />
          <span className="font-semibold text-sm hover:underline">vibecode_life</span>
          <button className="text-xs font-semibold px-2 py-1 border border-white rounded-lg ml-2 hover:bg-white hover:text-black transition-colors">Follow</button>
        </div>
        <p className="text-sm">Enjoying the developer vibes! 🎵 #coding #reels #vibecode</p>
        <div className="flex items-center gap-2 bg-white/20 w-fit px-3 py-1 rounded-full text-xs font-medium backdrop-blur-sm cursor-pointer">
          <Film className="w-3 h-3" /> Original Audio - chill_beats
        </div>
      </div>

      <div className="absolute bottom-6 right-4 z-20 flex flex-col items-center gap-6 animate-fade-in">
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Heart className="w-7 h-7 group-hover:scale-110 transition-transform text-white group-active:text-red-500" />
          <span className="text-xs font-medium drop-shadow-md">12.4K</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <MessageCircle className="w-7 h-7 group-hover:scale-110 transition-transform" />
          <span className="text-xs font-medium drop-shadow-md">342</span>
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <Send className="w-7 h-7 group-hover:scale-110 transition-transform -rotate-12" />
        </div>
        <div className="flex flex-col items-center gap-1 cursor-pointer group">
          <MoreHorizontal className="w-7 h-7 group-hover:scale-110 transition-transform" />
        </div>
        <div className="w-8 h-8 rounded-lg overflow-hidden border-2 border-white mt-2 cursor-pointer animate-spin-slow">
          <img src="https://picsum.photos/seed/audio/50/50" className="w-full h-full object-cover" alt="audio track" />
        </div>
      </div>
    </div>
  );
}
