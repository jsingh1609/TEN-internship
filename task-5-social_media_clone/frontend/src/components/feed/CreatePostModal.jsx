import React, { useState, useRef } from 'react';
import { X, Image as ImageIcon, MapPin, Upload } from 'lucide-react';
import api from '../../api';

export default function CreatePostModal({ onPost, onClose, userProfile }) {
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [caption, setCaption] = useState('');
  const [location, setLocation] = useState('');
  const [sharing, setSharing] = useState(false);
  const [useUrl, setUseUrl] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
      setImagePreview(URL.createObjectURL(file));
      setUseUrl(false);
    }
  };

  const handleShare = async () => {
    if (!imageFile && !imageUrl) return;
    setSharing(true);
    try {
      const formData = new FormData();
      if (imageFile) {
        formData.append('image_file', imageFile);
      } else {
        formData.append('image', imageUrl);
      }
      formData.append('caption', caption);
      formData.append('location', location);

      const newPost = await api.createPost(formData);
      onPost(newPost);
      onClose();
    } catch (error) {
      console.error('Error creating post:', error);
    }
    setSharing(false);
  };

  const previewSrc = imagePreview || imageUrl;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-dark w-full max-w-lg rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <X className="w-6 h-6 cursor-pointer hover:text-neutral-400 transition-colors" onClick={onClose} />
          <h3 className="font-bold text-lg">Create new post</h3>
          <button
            onClick={handleShare}
            disabled={sharing || (!imageFile && !imageUrl)}
            className="text-blue-500 font-bold hover:text-white transition-colors disabled:opacity-50"
          >
            {sharing ? 'Sharing...' : 'Share'}
          </button>
        </div>

        <div className="flex flex-col md:flex-row" style={{ minHeight: '400px' }}>
          {/* Image Preview / Upload */}
          <div className="w-full md:w-1/2 bg-black/50 flex flex-col items-center justify-center p-4 min-h-[200px]">
            {previewSrc ? (
              <div className="relative w-full h-full flex items-center justify-center">
                <img src={previewSrc} alt="Preview" className="max-h-[300px] object-contain rounded-lg" />
                <button
                  onClick={() => { setImageFile(null); setImagePreview(''); setImageUrl(''); }}
                  className="absolute top-2 right-2 bg-black/60 rounded-full p-1 hover:bg-black/80 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div className="text-center space-y-4">
                <div className="w-20 h-20 mx-auto border-2 border-dashed border-neutral-600 rounded-2xl flex items-center justify-center animate-float">
                  <ImageIcon className="w-10 h-10 text-neutral-500" />
                </div>
                <p className="text-neutral-400 text-sm">Drag photos here or</p>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="btn-gradient text-white font-semibold py-2 px-6 rounded-xl text-sm"
                >
                  <Upload className="w-4 h-4 inline mr-2" />
                  Select from device
                </button>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  onChange={handleFileChange}
                  className="hidden"
                />
                <button
                  onClick={() => setUseUrl(true)}
                  className="block mx-auto text-neutral-500 text-xs hover:text-neutral-300 transition-colors"
                >
                  or use image URL
                </button>
              </div>
            )}
          </div>

          {/* Details */}
          <div className="w-full md:w-1/2 p-4 flex flex-col border-t md:border-t-0 md:border-l border-white/10">
            <div className="flex items-center gap-3 mb-4">
              <img src={userProfile.avatar} className="w-8 h-8 rounded-full" alt="avatar" />
              <span className="font-semibold text-sm">{userProfile.username}</span>
            </div>
            <textarea
              placeholder="Write a caption..."
              value={caption}
              onChange={e => setCaption(e.target.value)}
              className="w-full bg-transparent text-white outline-none resize-none flex-1 mb-3 text-sm placeholder-neutral-500"
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
              {useUrl && !imageFile && (
                <div className="flex items-center gap-2 bg-white/5 rounded-lg p-2.5">
                  <ImageIcon className="w-4 h-4 text-neutral-400 flex-shrink-0" />
                  <input
                    type="text"
                    placeholder="Paste image URL..."
                    value={imageUrl}
                    onChange={e => setImageUrl(e.target.value)}
                    className="w-full bg-transparent text-xs outline-none text-white placeholder-neutral-500"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
