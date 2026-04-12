import React, { useState, useEffect, useRef } from 'react';
import { X, Heart, Send, Smile } from 'lucide-react';
import api from '../../api';

export default function PostDetail({ post, onClose }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [commentText, setCommentText] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const commentsEndRef = useRef(null);

  useEffect(() => {
    loadComments();
  }, [post.id]);

  const loadComments = async () => {
    try {
      const data = await api.getComments(post.id);
      setComments(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Error loading comments:', err);
    }
    setLoading(false);
  };

  const handleSubmitComment = async () => {
    if (!commentText.trim() || submitting) return;
    setSubmitting(true);
    try {
      const newComment = await api.createComment(post.id, commentText);
      setComments(prev => [newComment, ...prev]);
      setCommentText('');
      commentsEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    } catch (err) {
      console.error('Error posting comment:', err);
    }
    setSubmitting(false);
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.deleteComment(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
    } catch (err) {
      console.error('Error deleting comment:', err);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4 animate-fade-in" onClick={onClose}>
      <div
        className="bg-black border border-neutral-800 rounded-2xl overflow-hidden animate-scale-in shadow-2xl w-full max-w-4xl max-h-[90vh] flex flex-col md:flex-row"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Image Side */}
        <div className="w-full md:w-1/2 bg-neutral-950 flex items-center justify-center max-h-[40vh] md:max-h-none">
          <img src={post.image} alt="Post" className="w-full h-full object-cover" />
        </div>

        {/* Comments Side */}
        <div className="w-full md:w-1/2 flex flex-col max-h-[50vh] md:max-h-none">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b border-neutral-800">
            <div className="flex items-center gap-3">
              <img src={post.user.avatar} className="w-8 h-8 rounded-full object-cover" alt="avatar" />
              <span className="font-semibold text-sm">{post.user.username}</span>
            </div>
            <X className="w-5 h-5 cursor-pointer hover:text-neutral-400 transition-colors" onClick={onClose} />
          </div>

          {/* Caption */}
          <div className="px-4 py-3 border-b border-neutral-800">
            <div className="flex items-start gap-3">
              <img src={post.user.avatar} className="w-8 h-8 rounded-full flex-shrink-0 object-cover" alt="avatar" />
              <div>
                <span className="font-semibold text-sm mr-2">{post.user.username}</span>
                <span className="text-sm text-neutral-300">{post.caption}</span>
                <div className="text-xs text-neutral-500 mt-1">{post.time_ago}</div>
              </div>
            </div>
          </div>

          {/* Comments List */}
          <div className="flex-1 overflow-y-auto px-4 py-3 space-y-4 scrollbar-hide">
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="flex items-start gap-3">
                    <div className="w-8 h-8 rounded-full skeleton flex-shrink-0" />
                    <div className="flex-1 space-y-2">
                      <div className="skeleton h-3 w-24" />
                      <div className="skeleton h-3 w-48" />
                    </div>
                  </div>
                ))}
              </div>
            ) : comments.length > 0 ? (
              comments.map((comment) => (
                <div key={comment.id} className="flex items-start gap-3 group animate-slide-up-fade">
                  <img
                    src={comment.user?.avatar || 'https://picsum.photos/seed/default/50/50'}
                    className="w-8 h-8 rounded-full flex-shrink-0 object-cover"
                    alt="avatar"
                  />
                  <div className="flex-1">
                    <div>
                      <span className="font-semibold text-sm mr-2">{comment.user?.username || 'user'}</span>
                      <span className="text-sm text-neutral-300">{comment.text}</span>
                    </div>
                    <div className="flex items-center gap-4 mt-1">
                      <span className="text-xs text-neutral-500">
                        {new Date(comment.created_at).toLocaleDateString()}
                      </span>
                      <Heart className="w-3 h-3 text-neutral-500 cursor-pointer hover:text-red-500 transition-colors" />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-neutral-500 py-8">
                <p className="text-lg font-semibold mb-1">No comments yet</p>
                <p className="text-sm">Start the conversation.</p>
              </div>
            )}
            <div ref={commentsEndRef} />
          </div>

          {/* Comment Input */}
          <div className="p-4 border-t border-neutral-800">
            <div className="flex items-center gap-3">
              <Smile className="w-6 h-6 text-neutral-400 cursor-pointer hover:text-white transition-colors flex-shrink-0" />
              <input
                type="text"
                placeholder="Add a comment..."
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSubmitComment()}
                className="bg-transparent flex-1 outline-none text-sm"
              />
              <button
                onClick={handleSubmitComment}
                disabled={!commentText.trim() || submitting}
                className={`font-semibold text-sm transition-all ${
                  commentText.trim() ? 'text-blue-500 hover:text-white' : 'text-blue-900'
                }`}
              >
                {submitting ? '...' : 'Post'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
