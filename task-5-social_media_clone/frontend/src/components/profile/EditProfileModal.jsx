import React, { useState, useRef } from 'react';
import { X, Camera } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function EditProfileModal({ userProfile, setUserProfile, onClose }) {
  const { updateUser } = useAuth();
  const [formData, setFormData] = useState({
    username: userProfile.username || '',
    first_name: userProfile.first_name || '',
    last_name: userProfile.last_name || '',
    bio: userProfile.bio || '',
    email: userProfile.email || '',
  });
  const [saving, setSaving] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarFile, setAvatarFile] = useState(null);
  const fileInputRef = useRef(null);

  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setAvatarFile(file);
      setAvatarPreview(URL.createObjectURL(file));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    try {
      // Update avatar if changed
      if (avatarFile) {
        const avatarFormData = new FormData();
        avatarFormData.append('avatar_file', avatarFile);
        await api.updateAvatar(avatarFormData);
      }

      // Update profile
      const updated = await api.updateUser(userProfile.id, formData);
      setUserProfile(updated);
      updateUser(updated);
      onClose();
    } catch (error) {
      console.error('Error updating profile:', error);
    }
    setSaving(false);
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
      <div className="glass-dark w-full max-w-md rounded-2xl overflow-hidden animate-scale-in shadow-2xl">
        <div className="flex justify-between items-center p-4 border-b border-white/10">
          <h3 className="font-bold text-lg">Edit Profile</h3>
          <X className="w-6 h-6 cursor-pointer hover:text-neutral-400 transition-colors" onClick={onClose} />
        </div>
        <div className="p-4 space-y-4">
          {/* Avatar Upload */}
          <div className="flex items-center gap-4 mb-6">
            <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
              <img
                src={avatarPreview || userProfile.avatar}
                className="w-16 h-16 rounded-full object-cover"
                alt="avatar"
              />
              <div className="absolute inset-0 bg-black/50 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                <Camera className="w-5 h-5 text-white" />
              </div>
            </div>
            <div>
              <button
                onClick={() => fileInputRef.current?.click()}
                className="text-blue-500 font-semibold text-sm hover:text-white transition-colors"
              >
                Change profile photo
              </button>
              <p className="text-xs text-neutral-500 mt-0.5">JPG, PNG up to 10MB</p>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleAvatarChange}
              className="hidden"
            />
          </div>

          <div>
            <label className="block text-sm text-neutral-400 mb-1 font-semibold">Username</label>
            <input
              type="text"
              value={formData.username}
              onChange={e => setFormData({ ...formData, username: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-colors text-sm"
            />
          </div>
          <div className="flex gap-3">
            <div className="flex-1">
              <label className="block text-sm text-neutral-400 mb-1 font-semibold">First Name</label>
              <input
                type="text"
                value={formData.first_name}
                onChange={e => setFormData({ ...formData, first_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
            </div>
            <div className="flex-1">
              <label className="block text-sm text-neutral-400 mb-1 font-semibold">Last Name</label>
              <input
                type="text"
                value={formData.last_name}
                onChange={e => setFormData({ ...formData, last_name: e.target.value })}
                className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 transition-colors text-sm"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm text-neutral-400 mb-1 font-semibold">Bio</label>
            <textarea
              value={formData.bio}
              onChange={e => setFormData({ ...formData, bio: e.target.value })}
              className="w-full bg-white/5 border border-white/10 rounded-xl p-3 text-white outline-none focus:border-purple-500/50 h-24 resize-none transition-colors text-sm"
              maxLength={500}
            />
            <div className="text-right text-xs text-neutral-500 mt-1">{formData.bio.length}/500</div>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full btn-gradient text-white font-bold py-3 rounded-xl mt-4 transition-all active:scale-[0.98] disabled:opacity-50"
          >
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}
