import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StoryViewer({ stories, initialIndex, onClose }) {
  const [currentIndex, setCurrentIndex] = useState(initialIndex);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const STORY_DURATION = 5000; // 5 seconds per story

  const story = stories[currentIndex];

  const goNext = useCallback(() => {
    if (currentIndex < stories.length - 1) {
      setCurrentIndex(prev => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, stories.length, onClose]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 100) {
          goNext();
          return 0;
        }
        return prev + (100 / (STORY_DURATION / 50));
      });
    }, 50);

    return () => clearInterval(interval);
  }, [isPaused, goNext]);

  // Reset progress on story change
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowRight') goNext();
    if (e.key === 'ArrowLeft') goPrev();
    if (e.key === 'Escape') onClose();
  }, [goNext, goPrev, onClose]);

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!story) return null;

  return (
    <div className="fixed inset-0 z-[200] bg-black/95 flex items-center justify-center animate-fade-in">
      {/* Close Button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-2 hover:bg-white/10 rounded-full transition-colors"
      >
        <X className="w-7 h-7 text-white" />
      </button>

      {/* Navigation Arrows */}
      {currentIndex > 0 && (
        <button
          onClick={goPrev}
          className="absolute left-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </button>
      )}
      {currentIndex < stories.length - 1 && (
        <button
          onClick={goNext}
          className="absolute right-4 z-50 p-2 bg-white/10 hover:bg-white/20 rounded-full transition-colors backdrop-blur-sm"
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </button>
      )}

      {/* Story Container */}
      <div
        className="relative w-full max-w-[420px] h-[85vh] max-h-[750px] rounded-2xl overflow-hidden shadow-2xl shadow-black/50 animate-scale-in"
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Progress Bars */}
        <div className="absolute top-0 left-0 right-0 z-30 flex gap-1 p-3 pt-4">
          {stories.map((_, i) => (
            <div key={i} className="flex-1 h-[3px] bg-white/30 rounded-full overflow-hidden">
              <div
                className="h-full bg-white rounded-full transition-none"
                style={{
                  width: i < currentIndex ? '100%' : i === currentIndex ? `${progress}%` : '0%',
                }}
              />
            </div>
          ))}
        </div>

        {/* User Info */}
        <div className="absolute top-10 left-0 right-0 z-30 flex items-center gap-3 px-4">
          <img
            src={story.user.avatar}
            alt={story.user.username}
            className="w-8 h-8 rounded-full border-2 border-white object-cover"
          />
          <span className="font-semibold text-sm text-white drop-shadow-lg">
            {story.user.username}
          </span>
          <span className="text-xs text-white/70">
            {story.is_user ? 'Your story' : ''}
          </span>
        </div>

        {/* Gradient Overlays */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute top-0 left-0 right-0 h-32 bg-gradient-to-b from-black/60 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/60 to-transparent" />
        </div>

        {/* Story Image */}
        <img
          src={story.image}
          alt="Story"
          className="w-full h-full object-cover"
        />

        {/* Left/Right tap zones */}
        <div className="absolute inset-0 z-25 flex">
          <div className="w-1/3 h-full" onClick={goPrev} />
          <div className="w-1/3 h-full" />
          <div className="w-1/3 h-full" onClick={goNext} />
        </div>
      </div>
    </div>
  );
}
