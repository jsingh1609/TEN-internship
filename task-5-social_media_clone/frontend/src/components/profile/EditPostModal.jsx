import React, { useState } from 'react';
import { X, MapPin } from 'lucide-react';
import api from '../../api';

export default function EditPostModal({ post, onUpdate, onClose }) {
  const [caption, setCaption] = useState(post.caption || '');
  const [location, setLocation] = useState(post.location || '');
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    setSaving(true);
    try {
      const updatedPost = await api.updatePost(post.id, {
        caption,
        location
      });
      onUpdate(updatedPost);
      onClose();
    } catch (error) {
      console.error('Error updating post:', error);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-dark w-full max-w-lg rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <X className="w-6 h-6 cursor-pointer hover:text-neutral-400 transition-colors" onClick={onClose} />
          <h3 className="font-bold text-lg">Edit Info</h3>
          <button
            onClick={handleSave}
            disabled={saving || (caption === post.caption && location === post.location)}
            className="text-blue-500 font-bold hover:text-white transition-colors disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Done'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row max-h-[70vh] overflow-y-auto">
          {/* Image */}
          <div className="w-full md:w-1/2 bg-black/50 flex items-center justify-center p-4">
            <img src={post.image} alt="Post" className="max-h-[300px] object-contain rounded-lg" />
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-4 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <img src={post.user.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              <span className="font-semibold text-sm">{post.user.username}</span>
            </div>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full bg-transparent text-white outline-none resize-none flex-1 mb-3 text-sm placeholder-neutral-500 min-h-[100px]"
            />
            <div className="space-y-2">
              <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5">
                <MapPin className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Add location..."
                  value={location}
                  onChange={e => setLocation(e.target.value)}
                  className="w-full bg-transparent text-xs outline-none text-white placeholder-neutral-500"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
