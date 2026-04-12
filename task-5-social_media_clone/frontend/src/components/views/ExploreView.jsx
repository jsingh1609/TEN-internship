import React, { useState } from 'react';
import { Heart } from 'lucide-react';

export default function ExploreView() {
  const [likedItems, setLikedItems] = useState({});
  const [showHeartIndex, setShowHeartIndex] = useState(null);

  const handleDoubleTap = (index) => {
    setLikedItems(prev => ({ ...prev, [index]: true }));
    setShowHeartIndex(index);
    setTimeout(() => setShowHeartIndex(null), 1000);
  };

  return (
    <div className="w-full max-w-[935px] mx-auto pt-4 md:pt-8 px-1 md:px-4 animate-slide-up-fade grid grid-cols-3 gap-1 md:gap-4 pb-20">
      {[...Array(15)].map((_, i) => (
        <div 
          key={i} 
          onDoubleClick={() => handleDoubleTap(i)}
          className="aspect-square bg-neutral-900 overflow-hidden cursor-pointer group relative"
        >
          <img
            src={`https://picsum.photos/seed/${i + 400}/500/500`}
            alt="Explore"
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500 select-none"
          />
          <div className={`absolute inset-0 transition-opacity duration-300 flex items-center justify-center gap-4 ${likedItems[i] ? 'bg-black/40 opacity-100' : 'bg-black/40 opacity-0 group-hover:opacity-100'}`}>
            <div className="flex items-center gap-1 font-bold">
              <Heart className={`w-5 h-5 ${likedItems[i] ? 'fill-red-500 text-red-500' : 'fill-white text-white'}`} /> 
              {Math.floor(Math.random() * 900) + 100 + (likedItems[i] ? 1 : 0)}
            </div>
          </div>
          {showHeartIndex === i && (
            <div className="absolute inset-0 flex items-center justify-center z-10 pointer-events-none">
              <Heart className="w-16 h-16 md:w-24 md:h-24 text-white fill-white drop-shadow-2xl animate-heart-pop" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
