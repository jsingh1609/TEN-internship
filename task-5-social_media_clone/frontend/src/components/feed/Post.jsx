import React, { useState, useEffect, useRef } from 'react';
import {
  Heart, MessageCircle, Send, Bookmark, MoreHorizontal, Smile,
  Edit3, Trash2, X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import api from '../../api';

export default function Post({ post, isLiked, onLikeToggle, onPostDelete, onPostEdit, onOpenComments }) {
  const { user } = useAuth();
  const [showHeart, setShowHeart] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [commentText, setCommentText] = useState('');
  const [localLiked, setLocalLiked] = useState(isLiked);
  const [likesCount, setLikesCount] = useState(post.likes_count);
  const [showMenu, setShowMenu] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const postRef = useRef(null);
  const menuRef = useRef(null);

  const isOwner = user && post.user && user.id === post.user.id;

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => setIsVisible(entry.isIntersecting),
      { threshold: 0.1, rootMargin: '50px 0px' }
    );
    if (postRef.current) observer.observe(postRef.current);
    return () => observer.disconnect();
  }, []);

  // Close menu on outside click
  useEffect(() => {
    const handleClick = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setShowMenu(false);
      }
    };
    if (showMenu) document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showMenu]);

  const handleDoubleTap = async () => {
    if (!localLiked) await handleLike();
    setShowHeart(true);
    setTimeout(() => setShowHeart(false), 1000);
  };

  const handleLike = async () => {
    try {
      if (localLiked) {
        await api.unlikePost(post.id);
        setLocalLiked(false);
        setLikesCount(prev => Math.max(0, prev - 1));
      } else {
        await api.likePost(post.id);
        setLocalLiked(true);
        setLikesCount(prev => prev + 1);
      }
      if (onLikeToggle) onLikeToggle(post.id);
    } catch (err) {
      console.error('Like error:', err);
    }
  };

  const handleCommentSubmit = async () => {
    if (commentText.trim()) {
      try {
        await api.createComment(post.id, commentText);
        setCommentText('');
      } catch (err) {
        console.error('Comment error:', err);
      }
    }
  };

  const handleDelete = async () => {
    try {
      await api.deletePost(post.id);
      if (onPostDelete) onPostDelete(post.id);
    } catch (err) {
      console.error('Delete error:', err);
    }
    setShowDeleteConfirm(false);
    setShowMenu(false);
  };

  return (
    <>
      <div
        ref={postRef}
        className={`border-b md:border md:border-neutral-800 md:rounded-xl mb-4 md:mb-6 bg-black pb-4 transition-all duration-700 ease-out transform ${
          isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-12 scale-95'
        }`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-3">
          <div className="flex items-center gap-3 cursor-pointer">
            <div className="bg-gradient-to-tr from-yellow-400 to-fuchsia-600 p-[2px] rounded-full">
              <img src={post.user.avatar} className="w-8 h-8 rounded-full border-2 border-black object-cover" alt="avatar" />
            </div>
            <div>
              <div className="text-sm font-semibold hover:text-neutral-300">{post.user.username}</div>
              {post.location && <div className="text-xs text-neutral-400">{post.location}</div>}
            </div>
          </div>
          <div className="relative" ref={menuRef}>
            <MoreHorizontal
              className="w-5 h-5 cursor-pointer text-neutral-400 hover:text-white transition-colors"
              onClick={() => setShowMenu(!showMenu)}
            />
            {showMenu && (
              <div className="absolute right-0 top-8 glass-dark rounded-xl py-2 min-w-[180px] z-40 animate-scale-in shadow-xl">
                {isOwner && (
                  <>
                    <button
                      onClick={() => { setShowMenu(false); if (onPostEdit) onPostEdit(post); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/10 transition-colors"
                    >
                      <Edit3 className="w-4 h-4" /> Edit post
                    </button>
                    <button
                      onClick={() => { setShowMenu(false); setShowDeleteConfirm(true); }}
                      className="flex items-center gap-3 w-full px-4 py-2.5 text-sm text-red-400 hover:bg-white/10 transition-colors"
                    >
                      <Trash2 className="w-4 h-4" /> Delete post
                    </button>
                    <div className="h-px bg-white/10 mx-3 my-1" />
                  </>
                )}
                <button className="flex items-center gap-3 w-full px-4 py-2.5 text-sm hover:bg-white/10 transition-colors">
                  <Send className="w-4 h-4" /> Share
                </button>
              </div>
            )}
          </div>
        </div>

        {/* Image */}
        <div className="relative w-full aspect-square bg-neutral-900 flex items-center justify-center cursor-pointer" onDoubleClick={handleDoubleTap}>
          <img src={post.image} alt="Post content" className="w-full h-full object-cover" />
          {showHeart && (
            <div className="absolute inset-0 flex items-center justify-center z-10">
              <Heart className="w-24 h-24 text-white fill-white drop-shadow-2xl animate-heart-pop" />
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="p-3">
          <div className="flex justify-between items-center mb-3">
            <div className="flex gap-4">
              <button onClick={handleLike} className="hover:opacity-60 transition-all active:scale-75">
                <Heart className={`w-6 h-6 transition-colors duration-300 ${localLiked ? 'fill-red-500 text-red-500' : 'text-white'}`} />
              </button>
              <button
                onClick={() => onOpenComments && onOpenComments(post)}
                className="hover:opacity-60 transition-all active:scale-75"
              >
                <MessageCircle className="w-6 h-6" />
              </button>
              <button className="hover:opacity-60 transition-all active:scale-75">
                <Send className="w-6 h-6" />
              </button>
            </div>
            <button onClick={() => setIsSaved(!isSaved)} className="hover:opacity-60 transition-all active:scale-75">
              <Bookmark className={`w-6 h-6 transition-colors duration-300 ${isSaved ? 'fill-white text-white' : 'text-white'}`} />
            </button>
          </div>

          <div className="text-sm font-semibold mb-1 cursor-pointer">
            {likesCount.toLocaleString()} likes
          </div>

          <div className="text-sm mb-1">
            <span className="font-semibold cursor-pointer hover:underline mr-2">{post.user.username}</span>
            <span>{post.caption}</span>
          </div>

          <div
            className="text-sm text-neutral-400 mb-2 cursor-pointer hover:text-neutral-300"
            onClick={() => onOpenComments && onOpenComments(post)}
          >
            View all {post.comments_count} comments
          </div>

          <div className="text-[10px] text-neutral-500 font-semibold tracking-wider mb-2">
            {post.time_ago}
          </div>
        </div>

        {/* Inline Comment */}
        <div className="hidden md:flex items-center px-3 py-2 border-t border-neutral-800">
          <Smile className="w-6 h-6 text-neutral-400 mr-3 cursor-pointer hover:text-white transition-colors" />
          <input
            type="text"
            placeholder="Add a comment..."
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleCommentSubmit()}
            className="bg-transparent flex-1 outline-none text-sm py-2"
          />
          <button
            onClick={handleCommentSubmit}
            disabled={!commentText.trim()}
            className={`font-semibold text-sm transition-all duration-300 ${
              commentText.trim() ? 'text-blue-500 hover:text-white cursor-pointer' : 'text-blue-900 cursor-not-allowed'
            }`}
          >
            Post
          </button>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in">
          <div className="glass-dark rounded-2xl overflow-hidden animate-scale-in w-full max-w-sm">
            <div className="p-6 text-center">
              <h3 className="text-lg font-bold mb-2">Delete Post?</h3>
              <p className="text-neutral-400 text-sm mb-6">Are you sure you want to delete this post? This action cannot be undone.</p>
              <div className="flex flex-col gap-2">
                <button
                  onClick={handleDelete}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-semibold py-3 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Delete
                </button>
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="w-full bg-neutral-800 hover:bg-neutral-700 text-white font-semibold py-3 rounded-xl transition-colors active:scale-[0.98]"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
