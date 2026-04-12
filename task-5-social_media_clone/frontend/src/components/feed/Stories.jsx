import React, { useRef } from 'react';
import { PlusSquare } from 'lucide-react';
import api from '../../api';

export default function Stories({ stories, onStoryClick, onStoryCreated }) {
  const fileInputRef = useRef(null);

  const handleStoryClick = (index, isUser) => {
    if (isUser) {
      fileInputRef.current?.click();
    } else {
      onStoryClick(index);
    }
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append('image_file', file);
      try {
        const newStory = await api.createStory(formData);
        if (onStoryCreated) onStoryCreated(newStory);
      } catch (err) {
        console.error('Error creating story:', err);
      }
    }
  };

  return (
    <div className="py-4 mb-4">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 px-2 items-center">
        {stories.map((story, index) => (
          <div
            key={story.id}
            onClick={() => handleStoryClick(index, story.is_user)}
            className="flex flex-col items-center gap-1 cursor-pointer min-w-[72px] hover:scale-105 active:scale-95 transition-all duration-200 group"
          >
            <div
              className={`p-[2px] rounded-full transition-all duration-500 ${
                story.has_unseen
                  ? 'bg-gradient-to-tr from-yellow-400 via-red-500 to-fuchsia-600 group-hover:rotate-12'
                  : story.is_user
                  ? 'bg-transparent'
                  : 'bg-neutral-800'
              }`}
            >
              <div className="bg-black p-[2px] rounded-full transform group-hover:-rotate-12 transition-transform duration-500">
                <div className="relative">
                  <img
                    src={story.user.avatar}
                    alt={story.user.username}
                    className="w-16 h-16 rounded-full object-cover border border-neutral-800"
                  />
                  {story.is_user && (
                    <div className="absolute bottom-0 right-0 bg-blue-500 rounded-full border-2 border-black">
                      <PlusSquare className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              </div>
            </div>
            <span className="text-xs text-neutral-400 truncate w-16 text-center">
              {story.is_user ? 'Your story' : story.user.username}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
