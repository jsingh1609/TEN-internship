import React, { useState, useEffect } from 'react';
import { Heart, MessageCircle, Settings, Grid, Bookmark, LogOut } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function ProfileView({ userProfile, onOpenEdit, savedPosts = [] }) {
  const { logout } = useAuth();
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [activeTab, setActiveTab] = useState('posts');

  useEffect(() => {
    loadUserPosts();
  }, [userProfile.id]);

  const loadUserPosts = async () => {
    try {
      const posts = await api.getUserPosts(userProfile.id);
      setUserPosts(Array.isArray(posts) ? posts : []);
    } catch (err) {
      console.error('Error loading user posts:', err);
    }
    setLoading(false);
  };

  return (
    <div className="w-full max-w-[935px] mx-auto animate-slide-up-fade pb-20">
      {/* Profile Header */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 px-4 py-8 border-b border-neutral-800">
        <div className="md:w-1/3 flex justify-center">
          <div className="bg-gradient-to-tr from-purple-600 via-pink-500 to-orange-400 p-1 rounded-full cursor-pointer hover:scale-105 transition-transform duration-300">
            <img
              src={userProfile.avatar}
              alt="Profile"
              className="w-24 h-24 md:w-36 md:h-36 rounded-full object-cover border-4 border-black"
            />
          </div>
        </div>
        <div className="md:w-2/3 flex flex-col items-center md:items-start">
          <div className="flex flex-col md:flex-row items-center gap-4 mb-4">
            <h1 className="text-xl font-normal">{userProfile.username}</h1>
            <div className="flex gap-2">
              <button
                onClick={onOpenEdit}
                className="bg-neutral-800 hover:bg-neutral-700 active:scale-95 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all"
              >
                Edit profile
              </button>
              <button
                onClick={logout}
                className="bg-neutral-800 hover:bg-red-600/80 active:scale-95 text-white px-4 py-1.5 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5"
              >
                <LogOut className="w-4 h-4" /> Log out
              </button>
            </div>
          </div>
          <div className="hidden md:flex gap-8 mb-4">
            <span><span className="font-semibold">{userProfile.posts_count || userPosts.length}</span> posts</span>
            <span className="cursor-pointer hover:text-neutral-300"><span className="font-semibold">{userProfile.followers_count || 0}</span> followers</span>
            <span className="cursor-pointer hover:text-neutral-300"><span className="font-semibold">{userProfile.following_count || 0}</span> following</span>
          </div>
          <div className="text-center md:text-left">
            <div className="font-semibold">{userProfile.first_name} {userProfile.last_name}</div>
            <div className="text-sm whitespace-pre-line text-neutral-300 mt-1 leading-relaxed">
              {userProfile.bio}
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Stats */}
      <div className="flex md:hidden justify-around py-3 border-b border-neutral-800 text-sm">
        <div className="flex flex-col items-center"><span className="font-semibold">{userProfile.posts_count || userPosts.length}</span> <span className="text-neutral-400 text-xs">posts</span></div>
        <div className="flex flex-col items-center"><span className="font-semibold">{userProfile.followers_count || 0}</span> <span className="text-neutral-400 text-xs">followers</span></div>
        <div className="flex flex-col items-center"><span className="font-semibold">{userProfile.following_count || 0}</span> <span className="text-neutral-400 text-xs">following</span></div>
      </div>

      {/* Tab Bar */}
      <div className="flex justify-center gap-12 border-b border-neutral-800">
        <button onClick={() => setActiveTab('posts')} className={`py-3 px-2 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'posts' ? 'border-t-2 border-white text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Grid className="w-4 h-4" /> POSTS
        </button>
        <button onClick={() => setActiveTab('saved')} className={`py-3 px-2 text-sm font-semibold flex items-center gap-2 transition-colors ${activeTab === 'saved' ? 'border-t-2 border-white text-white' : 'text-neutral-500 hover:text-neutral-300'}`}>
          <Bookmark className="w-4 h-4" /> SAVED
        </button>
      </div>

      {/* Posts Grid */}
      <div className="grid grid-cols-3 gap-1 md:gap-2 mt-1 md:mt-4">
        {activeTab === 'saved' ? (
          savedPosts && savedPosts.length > 0 ? (
            savedPosts.map((post, i) => (
              <div
                key={post.id}
                className="aspect-square bg-neutral-900 group cursor-pointer relative overflow-hidden animate-slide-up-fade"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img src={post.image?.startsWith('/') ? `http://localhost:8000${post.image}` : post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                  <div className="flex items-center gap-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                    <Heart className="w-5 h-5 fill-white text-white" /> {post.likes_count}
                  </div>
                  <div className="flex items-center gap-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                    <MessageCircle className="w-5 h-5 fill-white text-white" /> {post.comments_count}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="col-span-3 text-center py-16 text-neutral-500">
              <div className="w-16 h-16 mx-auto border-2 border-neutral-700 rounded-full flex items-center justify-center mb-4">
                <Bookmark className="w-8 h-8" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Save</h3>
              <p className="text-sm">Save photos and videos that you want to see again. No one is notified, and only you can see what you've saved.</p>
            </div>
          )
        ) : loading ? (
          [...Array(6)].map((_, i) => (
            <div key={i} className="aspect-square skeleton" />
          ))
        ) : userPosts.length > 0 ? (
          userPosts.map((post, i) => (
            <div
              key={post.id}
              className="aspect-square bg-neutral-900 group cursor-pointer relative overflow-hidden animate-slide-up-fade"
              style={{ animationDelay: `${i * 100}ms` }}
            >
              <img src={post.image} alt="Post" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center gap-6">
                <div className="flex items-center gap-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300">
                  <Heart className="w-5 h-5 fill-white text-white" /> {post.likes_count}
                </div>
                <div className="flex items-center gap-2 font-bold transform translate-y-4 group-hover:translate-y-0 transition-all duration-300 delay-75">
                  <MessageCircle className="w-5 h-5 fill-white text-white" /> {post.comments_count}
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="col-span-3 text-center py-16 text-neutral-500">
            <div className="w-16 h-16 mx-auto border-2 border-neutral-700 rounded-full flex items-center justify-center mb-4">
              <Grid className="w-8 h-8" />
            </div>
            <h3 className="text-2xl font-bold text-white mb-2">Share Photos</h3>
            <p className="text-sm">When you share photos, they will appear on your profile.</p>
          </div>
        )}
      </div>
    </div>
  );
}
