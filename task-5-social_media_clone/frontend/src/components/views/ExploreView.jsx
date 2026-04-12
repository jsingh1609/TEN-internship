import React from 'react';
import { Heart } from 'lucide-react';

export default function ExploreView() {
  return (
    <div className="w-full max-w-[935px] mx-auto pt-4 md:pt-8 px-1 md:px-4 animate-slide-up-fade grid grid-cols-3 gap-1 md:gap-4 pb-20">
      {[...Array(15)].map((_, i) => (
        <div key={i} className="aspect-square bg-neutral-900 overflow-hidden cursor-pointer group relative">
          <img
            src={`https://picsum.photos/seed/${i + 400}/500/500`}
            alt="Explore"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          />
          <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-4">
            <div className="flex items-center gap-1 font-bold">
              <Heart className="w-5 h-5 fill-white text-white" /> {Math.floor(Math.random() * 900) + 100}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
