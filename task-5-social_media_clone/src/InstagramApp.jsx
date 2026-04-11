import React, { useState, useRef, useEffect } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Profile Page Component
const ProfilePage = ({ user, onClose, onFollowToggle }) => {
  const [activeTab, setActiveTab] = useState('posts');
  const [following, setFollowing] = useState(user.isFollowing || false);

  const handleFollow = () => {
    setFollowing(!following);
    onFollowToggle?.(user.username, !following);
  };

  return (
    <div className="profile-modal" onClick={onClose}>
      <div className="profile-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-profile" onClick={onClose}>×</button>
        
        {/* Profile Header */}
        <div className="profile-header">
          <div className="profile-avatar-large">
            <img src={user.avatar} alt={user.username} />
          </div>
          
          <div className="profile-info">
            <div className="profile-name-row">
              <h2 className="profile-username">{user.username}</h2>
              {user.verified && <span className="verified-badge">✓</span>}
              <button 
                className={`follow-btn ${following ? 'following' : ''}`}
                onClick={handleFollow}
              >
                {following ? 'Following' : 'Follow'}
              </button>
              <button className="message-btn">Message</button>
            </div>
            
            <div className="profile-stats">
              <div className="stat">
                <span className="stat-number">{user.stats?.posts || 0}</span>
                <span className="stat-label">posts</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.stats?.followers || 0}</span>
                <span className="stat-label">followers</span>
              </div>
              <div className="stat">
                <span className="stat-number">{user.stats?.following || 0}</span>
                <span className="stat-label">following</span>
              </div>
            </div>
            
            <div className="profile-bio">
              <p className="bio-name">{user.name}</p>
              <p className="bio-text">{user.bio}</p>
              {user.website && (
                <a href={user.website} className="bio-link" target="_blank" rel="noopener noreferrer">
                  {user.website}
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Profile Tabs */}
        <div className="profile-tabs">
          <button 
            className={`tab ${activeTab === 'posts' ? 'active' : ''}`}
            onClick={() => setActiveTab('posts')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <rect x="0" y="0" width="4" height="4"/>
              <rect x="5" y="0" width="4" height="4"/>
              <rect x="10" y="0" width="2" height="4"/>
              <rect x="0" y="5" width="4" height="4"/>
              <rect x="5" y="5" width="4" height="4"/>
              <rect x="10" y="5" width="2" height="4"/>
              <rect x="0" y="10" width="4" height="2"/>
              <rect x="5" y="10" width="4" height="2"/>
              <rect x="10" y="10" width="2" height="2"/>
            </svg>
            POSTS
          </button>
          <button 
            className={`tab ${activeTab === 'saved' ? 'active' : ''}`}
            onClick={() => setActiveTab('saved')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
              <path d="M1 1h10v10l-5-3-5 3V1z"/>
            </svg>
            SAVED
          </button>
          <button 
            className={`tab ${activeTab === 'tagged' ? 'active' : ''}`}
            onClick={() => setActiveTab('tagged')}
          >
            <svg width="12" height="12" viewBox="0 0 12 12" fill="none" stroke="currentColor">
              <rect x="1" y="1" width="10" height="10" rx="2"/>
              <circle cx="6" cy="6" r="2"/>
            </svg>
            TAGGED
          </button>
        </div>

        {/* Profile Grid */}
        <div className="profile-grid">
          {user.posts?.map((post, idx) => (
            <div key={idx} className="grid-item">
              <img src={post.thumbnail} alt="" />
              <div className="grid-overlay">
                <span>❤️ {post.likes}</span>
                <span>💬 {post.comments}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .profile-modal {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.85);
          z-index: 2000;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow-y: auto;
          padding: 20px;
        }

        .profile-container {
          background: #000;
          border: 1px solid #262626;
          border-radius: 12px;
          width: 100%;
          max-width: 935px;
          max-height: 90vh;
          overflow-y: auto;
          position: relative;
        }

        .close-profile {
          position: absolute;
          top: 16px;
          right: 16px;
          background: none;
          border: none;
          color: #fff;
          font-size: 32px;
          cursor: pointer;
          z-index: 10;
        }

        .profile-header {
          padding: 40px 40px 24px;
          display: flex;
          gap: 40px;
        }

        .profile-avatar-large {
          width: 150px;
          height: 150px;
          flex-shrink: 0;
        }

        .profile-avatar-large img {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          object-fit: cover;
        }

        .profile-info {
          flex: 1;
        }

        .profile-name-row {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .profile-username {
          font-size: 28px;
          font-weight: 300;
          color: #fff;
          margin: 0;
        }

        .follow-btn, .message-btn {
          padding: 7px 16px;
          border-radius: 8px;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          border: none;
        }

        .follow-btn {
          background: #0095f6;
          color: #fff;
        }

        .follow-btn.following {
          background: #262626;
          color: #fff;
        }

        .message-btn {
          background: #262626;
          color: #fff;
        }

        .profile-stats {
          display: flex;
          gap: 40px;
          margin-bottom: 20px;
        }

        .stat {
          display: flex;
          gap: 4px;
        }

        .stat-number {
          color: #fff;
          font-weight: 600;
        }

        .stat-label {
          color: #fff;
        }

        .profile-bio {
          color: #fff;
        }

        .bio-name {
          font-weight: 600;
          margin: 0 0 4px 0;
        }

        .bio-text {
          margin: 0 0 8px 0;
          line-height: 1.5;
        }

        .bio-link {
          color: #0095f6;
          text-decoration: none;
          font-weight: 600;
        }

        .profile-tabs {
          border-top: 1px solid #262626;
          display: flex;
          justify-content: center;
          gap: 60px;
        }

        .tab {
          background: none;
          border: none;
          color: #8e8e8e;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 1px;
          padding: 16px 0;
          cursor: pointer;
          display: flex;
          align-items: center;
          gap: 6px;
          border-top: 1px solid transparent;
          margin-top: -1px;
        }

        .tab.active {
          color: #fff;
          border-top-color: #fff;
        }

        .profile-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 4px;
          padding: 0 0 40px 0;
        }

        .grid-item {
          aspect-ratio: 1;
          position: relative;
          cursor: pointer;
          overflow: hidden;
        }

        .grid-item img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .grid-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.3);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 20px;
          color: #fff;
          font-weight: 600;
          opacity: 0;
          transition: opacity 0.2s;
        }

        .grid-item:hover .grid-overlay {
          opacity: 1;
        }

        @media (max-width: 768px) {
          .profile-header {
            padding: 24px;
            flex-direction: column;
            align-items: center;
            text-align: center;
          }

          .profile-stats {
            justify-content: center;
          }

          .profile-grid {
            grid-template-columns: repeat(3, 1fr);
          }
        }
      `}</style>
    </div>
  );
};

// Notification Component
const Notifications = ({ notifications, onClose }) => {
  return (
    <div className="notifications-panel">
      <div className="notifications-header">
        <h3>Notifications</h3>
        <button onClick={onClose}>×</button>
      </div>
      <div className="notifications-list">
        {notifications.map((notif) => (
          <div key={notif.id} className={`notification-item ${notif.read ? '' : 'unread'}`}>
            <img src={notif.avatar} alt={notif.username} />
            <div className="notification-content">
              <p>
                <strong>{notif.username}</strong> {notif.text}
              </p>
              <span className="notification-time">{notif.time}</span>
            </div>
            {notif.postThumbnail && (
              <img src={notif.postThumbnail} alt="Post" className="notification-thumbnail" />
            )}
          </div>
        ))}
      </div>

      <style jsx>{`
        .notifications-panel {
          position: fixed;
          top: 60px;
          right: 20px;
          width: 400px;
          max-height: 600px;
          background: #262626;
          border: 1px solid #363636;
          border-radius: 8px;
          overflow: hidden;
          z-index: 1000;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .notifications-header {
          padding: 16px;
          border-bottom: 1px solid #363636;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notifications-header h3 {
          color: #fff;
          margin: 0;
          font-size: 16px;
          font-weight: 600;
        }

        .notifications-header button {
          background: none;
          border: none;
          color: #fff;
          font-size: 24px;
          cursor: pointer;
        }

        .notifications-list {
          max-height: 540px;
          overflow-y: auto;
        }

        .notification-item {
          padding: 12px 16px;
          display: flex;
          gap: 12px;
          align-items: center;
          border-bottom: 1px solid #363636;
          cursor: pointer;
        }

        .notification-item:hover {
          background: #1a1a1a;
        }

        .notification-item.unread {
          background: rgba(0, 149, 246, 0.1);
        }

        .notification-item > img {
          width: 44px;
          height: 44px;
          border-radius: 50%;
          object-fit: cover;
        }

        .notification-content {
          flex: 1;
        }

        .notification-content p {
          color: #fff;
          font-size: 14px;
          margin: 0 0 4px 0;
        }

        .notification-time {
          color: #8e8e8e;
          font-size: 12px;
        }

        .notification-thumbnail {
          width: 44px;
          height: 44px;
          object-fit: cover;
        }

        @media (max-width: 768px) {
          .notifications-panel {
            width: calc(100vw - 40px);
            right: 20px;
          }
        }
      `}</style>
    </div>
  );
};

// Reaction Animation Component
const ReactionAnimation = ({ type, position }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  if (!visible) return null;

  const reactions = {
    love: '❤️',
    fire: '🔥',
    clap: '👏',
    wow: '😮',
    laugh: '😂',
    score: '+10'
  };

  return (
    <div 
      className="reaction-animation"
      style={{
        left: position?.x || '50%',
        top: position?.y || '50%',
      }}
    >
      {reactions[type] || reactions.love}
      
      <style jsx>{`
        .reaction-animation {
          position: absolute;
          transform: translate(-50%, -50%);
          font-size: 60px;
          pointer-events: none;
          z-index: 1000;
          animation: reactionFloat 1.5s ease-out;
        }

        @keyframes reactionFloat {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0) rotate(0deg);
          }
          20% {
            opacity: 1;
            transform: translate(-50%, -50%) scale(1.2) rotate(10deg);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -120%) scale(0.8) rotate(-10deg);
          }
        }
      `}</style>
    </div>
  );
};

// Enhanced Feed Item with scoring
const InstagramFeedItem = ({ post, onProfileClick, onReaction }) => {
  const containerRef = useRef();
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [likeCount, setLikeCount] = useState(post.likes);
  const [reactions, setReactions] = useState([]);
  const [score, setScore] = useState(post.score || 0);
  const [showReactions, setShowReactions] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const timer = setTimeout(() => {
      gsap.from(container, {
        opacity: 0,
        y: 30,
        duration: 0.6,
        ease: 'power2.out',
        scrollTrigger: {
          trigger: container,
          start: 'top 90%',
        }
      });
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  const handleLike = () => {
    setLiked(!liked);
    setLikeCount(liked ? likeCount - 1 : likeCount + 1);
    
    if (!liked) {
      addReaction('love');
      incrementScore(10);
    }
  };

  const addReaction = (type, position) => {
    const id = Date.now() + Math.random();
    setReactions(prev => [...prev, { id, type, position }]);
    setTimeout(() => {
      setReactions(prev => prev.filter(r => r.id !== id));
    }, 1500);
  };

  const incrementScore = (points) => {
    setScore(prev => prev + points);
    addReaction('score');
  };

  const handleDoubleTap = (e) => {
    if (!liked) {
      const rect = e.currentTarget.getBoundingClientRect();
      const position = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top
      };
      handleLike();
      addReaction('love', position);
    }
  };

  const handleComment = (e) => {
    e.preventDefault();
    if (comment.trim()) {
      setComments([
        ...comments,
        {
          id: Date.now(),
          username: 'You',
          text: comment,
          timestamp: 'Just now',
          likes: 0
        }
      ]);
      setComment('');
      incrementScore(5);
    }
  };

  const images = Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl];

  return (
    <div ref={containerRef} className="feed-item">
      <div className="feed-content">
        {/* Header */}
        <div className="post-header">
          <div className="user-info-left" onClick={() => onProfileClick?.(post.user)}>
            <div className="user-avatar">
              <img src={post.avatar} alt={post.username} />
            </div>
            <div className="user-details">
              <div className="username-location">
                <h3 className="username">{post.username}</h3>
                {post.verified && <span className="verified-badge">✓</span>}
              </div>
              {post.location && <span className="location">{post.location}</span>}
            </div>
          </div>
          <button className="more-options">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
              <circle cx="10" cy="3" r="1.5"/>
              <circle cx="10" cy="10" r="1.5"/>
              <circle cx="10" cy="17" r="1.5"/>
            </svg>
          </button>
        </div>

        {/* Image */}
        <div className="image-container" onDoubleClick={handleDoubleTap}>
          <img 
            src={images[currentImageIndex]} 
            alt="Post" 
            className="post-image"
          />
          
          {/* Reactions */}
          {reactions.map((reaction) => (
            <ReactionAnimation 
              key={reaction.id}
              type={reaction.type}
              position={reaction.position}
            />
          ))}

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              {currentImageIndex > 0 && (
                <button 
                  className="carousel-btn prev"
                  onClick={() => setCurrentImageIndex(currentImageIndex - 1)}
                >
                  ‹
                </button>
              )}
              {currentImageIndex < images.length - 1 && (
                <button 
                  className="carousel-btn next"
                  onClick={() => setCurrentImageIndex(currentImageIndex + 1)}
                >
                  ›
                </button>
              )}
              <div className="carousel-dots">
                {images.map((_, idx) => (
                  <span 
                    key={idx} 
                    className={`dot ${idx === currentImageIndex ? 'active' : ''}`}
                  />
                ))}
              </div>
            </>
          )}

          {/* Score Badge */}
          {score > 0 && (
            <div className="score-badge">
              🏆 {score}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="post-actions">
          <div className="action-left">
            <button 
              className={`action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
              onContextMenu={(e) => {
                e.preventDefault();
                setShowReactions(!showReactions);
              }}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#ff4757' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>

            {/* Reaction Picker */}
            {showReactions && (
              <div className="reaction-picker">
                {['love', 'fire', 'clap', 'wow', 'laugh'].map((type) => (
                  <button
                    key={type}
                    onClick={() => {
                      addReaction(type);
                      setShowReactions(false);
                      incrementScore(5);
                    }}
                  >
                    {type === 'love' && '❤️'}
                    {type === 'fire' && '🔥'}
                    {type === 'clap' && '👏'}
                    {type === 'wow' && '😮'}
                    {type === 'laugh' && '😂'}
                  </button>
                ))}
              </div>
            )}

            <button className="action-btn" onClick={() => setShowComments(!showComments)}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z"/>
              </svg>
            </button>
            <button className="action-btn">
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M22 2L11 13M22 2l-7 20-4-9-9-4 20-7z"/>
              </svg>
            </button>
          </div>
          <button 
            className={`action-btn ${saved ? 'saved' : ''}`}
            onClick={() => {
              setSaved(!saved);
              if (!saved) incrementScore(3);
            }}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {/* Likes */}
        <div className="likes-section">
          <span className="likes-count">{likeCount.toLocaleString()} likes</span>
        </div>

        {/* Caption */}
        <div className="post-caption">
          <span className="caption-username">{post.username}</span>
          <span className="caption-text">{post.caption}</span>
          {post.hashtags && (
            <div className="hashtags">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="hashtag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* Comments */}
        {comments.length > 0 && !showComments && (
          <button className="view-comments" onClick={() => setShowComments(true)}>
            View all {comments.length} comments
          </button>
        )}

        {showComments && (
          <div className="comments-section">
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <span className="comment-username">{c.username}</span>
                <span className="comment-text">{c.text}</span>
              </div>
            ))}
          </div>
        )}

        <span className="post-timestamp">{post.timestamp}</span>

        {/* Add Comment */}
        <form className="add-comment" onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={!comment.trim()}>Post</button>
        </form>
      </div>

      <style jsx>{`
        .feed-item {
          max-width: 614px;
          margin: 0 auto 24px;
          background: #000;
          border: 1px solid #262626;
          border-radius: 8px;
          overflow: hidden;
        }

        .feed-content {
          width: 100%;
        }

        .post-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 14px 16px;
        }

        .user-info-left {
          display: flex;
          align-items: center;
          gap: 12px;
          cursor: pointer;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          overflow: hidden;
        }

        .user-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .user-details {
          display: flex;
          flex-direction: column;
          gap: 2px;
        }

        .username-location {
          display: flex;
          align-items: center;
          gap: 4px;
        }

        .username {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
          margin: 0;
        }

        .verified-badge {
          color: #0095f6;
          font-size: 12px;
        }

        .location {
          font-size: 12px;
          color: #a8a8a8;
        }

        .more-options {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
        }

        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #000;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }

        .carousel-btn {
          position: absolute;
          top: 50%;
          transform: translateY(-50%);
          background: rgba(0, 0, 0, 0.5);
          border: none;
          color: #fff;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          font-size: 24px;
          z-index: 10;
        }

        .carousel-btn.prev { left: 12px; }
        .carousel-btn.next { right: 12px; }

        .carousel-dots {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
        }

        .dot.active {
          background: #fff;
        }

        .score-badge {
          position: absolute;
          top: 16px;
          right: 16px;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: #fff;
          padding: 8px 16px;
          border-radius: 20px;
          font-weight: 600;
          font-size: 14px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.3);
          animation: scorePopIn 0.3s ease-out;
        }

        @keyframes scorePopIn {
          0% { transform: scale(0); }
          70% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          padding: 6px 16px;
        }

        .action-left {
          display: flex;
          gap: 16px;
          position: relative;
        }

        .action-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          transition: transform 0.2s;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .action-btn.liked svg {
          fill: #ff4757;
          stroke: #ff4757;
        }

        .action-btn.saved svg {
          fill: #fff;
        }

        .reaction-picker {
          position: absolute;
          bottom: 100%;
          left: 0;
          background: #262626;
          border-radius: 50px;
          padding: 8px 12px;
          display: flex;
          gap: 8px;
          margin-bottom: 8px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
        }

        .reaction-picker button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          transition: transform 0.2s;
        }

        .reaction-picker button:hover {
          transform: scale(1.3);
        }

        .likes-section {
          padding: 0 16px 8px;
        }

        .likes-count {
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .post-caption {
          padding: 0 16px 8px;
          font-size: 14px;
        }

        .caption-username {
          font-weight: 600;
          color: #fff;
          margin-right: 6px;
        }

        .caption-text {
          color: #fff;
        }

        .hashtags {
          margin-top: 8px;
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
        }

        .hashtag {
          color: #0095f6;
          cursor: pointer;
        }

        .view-comments {
          background: none;
          border: none;
          color: #a8a8a8;
          font-size: 14px;
          cursor: pointer;
          padding: 0 16px 8px;
        }

        .comments-section {
          padding: 0 16px 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .comment {
          margin-bottom: 8px;
        }

        .comment-username {
          font-weight: 600;
          color: #fff;
          margin-right: 6px;
          font-size: 14px;
        }

        .comment-text {
          color: #fff;
          font-size: 14px;
        }

        .post-timestamp {
          display: block;
          padding: 0 16px 12px;
          font-size: 10px;
          color: #a8a8a8;
          text-transform: uppercase;
        }

        .add-comment {
          display: flex;
          border-top: 1px solid #262626;
          padding: 6px 16px;
        }

        .add-comment input {
          flex: 1;
          background: none;
          border: none;
          color: #fff;
          font-size: 14px;
          outline: none;
          padding: 12px 0;
        }

        .add-comment button {
          background: none;
          border: none;
          color: #0095f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
        }

        .add-comment button:disabled {
          opacity: 0.3;
        }
      `}</style>
    </div>
  );
};

// Main App Component
const InstagramApp = () => {
  const [selectedProfile, setSelectedProfile] = useState(null);
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('home');

  const notifications = [
    {
      id: 1,
      username: 'design_daily',
      avatar: 'https://ui-avatars.com/api/?name=DD&background=f093fb&color=fff',
      text: 'liked your post',
      time: '2h ago',
      read: false,
      postThumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=100'
    },
    {
      id: 2,
      username: 'creative_studio',
      avatar: 'https://ui-avatars.com/api/?name=CS&background=764ba2&color=fff',
      text: 'started following you',
      time: '5h ago',
      read: false
    },
    {
      id: 3,
      username: 'art_collective',
      avatar: 'https://ui-avatars.com/api/?name=AC&background=4facfe&color=fff',
      text: 'commented: "Amazing work! 🔥"',
      time: '1d ago',
      read: true,
      postThumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100'
    }
  ];

  const posts = [
    {
      id: 1,
      username: 'creative_studio',
      avatar: 'https://ui-avatars.com/api/?name=CS&background=764ba2&color=fff',
      verified: true,
      location: 'San Francisco, CA',
      imageUrl: [
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800'
      ],
      caption: 'Exploring creative design patterns ✨',
      hashtags: ['design', 'creative', 'art'],
      likes: 1247,
      score: 45,
      timestamp: '2 HOURS AGO',
      comments: [
        { id: 1, username: 'design_lover', text: 'Incredible! 🔥', likes: 12 }
      ],
      user: {
        username: 'creative_studio',
        name: 'Creative Studio',
        avatar: 'https://ui-avatars.com/api/?name=CS&background=764ba2&color=fff',
        verified: true,
        bio: '🎨 Design & Creative Agency\n📍 San Francisco, CA\n✉️ hello@creative.studio',
        website: 'https://creative.studio',
        stats: { posts: 324, followers: 12500, following: 892 },
        posts: [
          { thumbnail: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=300', likes: 1247, comments: 45 },
          { thumbnail: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=300', likes: 892, comments: 32 },
          { thumbnail: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=300', likes: 2103, comments: 67 }
        ]
      }
    },
    {
      id: 2,
      username: 'abstract_mind',
      avatar: 'https://ui-avatars.com/api/?name=AM&background=667eea&color=fff',
      verified: false,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      caption: 'Distortion as a language',
      hashtags: ['abstract', 'art'],
      likes: 892,
      score: 30,
      timestamp: '5 HOURS AGO',
      comments: [],
      user: {
        username: 'abstract_mind',
        name: 'Abstract Mind',
        avatar: 'https://ui-avatars.com/api/?name=AM&background=667eea&color=fff',
        bio: 'Digital artist & creator',
        stats: { posts: 156, followers: 8920, following: 432 },
        posts: []
      }
    }
  ];

  return (
    <div className="instagram-app">
      {/* Top Navigation */}
      <nav className="top-nav">
        <div className="nav-container">
          <h1 className="logo">Instagram</h1>
          
          <div className="search-bar">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="#8e8e8e">
              <path d="M11.5 6.5a5 5 0 1 1-10 0 5 5 0 0 1 10 0zM15.5 15l-3.5-3.5"/>
            </svg>
            <input 
              type="text" 
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>

          <div className="nav-icons">
            <button className={activeTab === 'home' ? 'active' : ''} onClick={() => setActiveTab('home')}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill={activeTab === 'home' ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/>
                <polyline points="9 22 9 12 15 12 15 22"/>
              </svg>
            </button>
            <button>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <rect x="2" y="7" width="20" height="15" rx="2" ry="2"/>
                <polyline points="22,7 13.5,15.5 8.5,15.5 2,7"/>
              </svg>
            </button>
            <button>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="3"/>
                <path d="M12 1v6m0 6v6m5.5-11.5l-4.24 4.24M10.74 12.76l-4.24 4.24m8.48-8.48l-4.24-4.24M10.74 11.24L6.5 7"/>
              </svg>
            </button>
            <button 
              className={showNotifications ? 'active' : ''}
              onClick={() => setShowNotifications(!showNotifications)}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M12 22c1.1 0 2-.9 2-2h-4c0 1.1.89 2 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4c0-.83-.67-1.5-1.5-1.5s-1.5.67-1.5 1.5v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1l-2-2z"/>
              </svg>
              {notifications.filter(n => !n.read).length > 0 && (
                <span className="notification-dot"></span>
              )}
            </button>
            <button>
              <div className="nav-avatar">
                <img src="https://ui-avatars.com/api/?name=You&background=667eea&color=fff" alt="You" />
              </div>
            </button>
          </div>
        </div>
      </nav>

      {/* Notifications */}
      {showNotifications && (
        <Notifications 
          notifications={notifications}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Feed */}
      <div className="feed-container">
        {posts.map((post) => (
          <InstagramFeedItem 
            key={post.id}
            post={post}
            onProfileClick={setSelectedProfile}
          />
        ))}
      </div>

      {/* Profile Modal */}
      {selectedProfile && (
        <ProfilePage 
          user={selectedProfile}
          onClose={() => setSelectedProfile(null)}
        />
      )}

      <style jsx>{`
        .instagram-app {
          min-height: 100vh;
          background: #000;
          padding-top: 60px;
        }

        .top-nav {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: #000;
          border-bottom: 1px solid #262626;
          z-index: 100;
        }

        .nav-container {
          max-width: 975px;
          margin: 0 auto;
          padding: 8px 20px;
          display: flex;
          align-items: center;
          justify-content: space-between;
        }

        .logo {
          font-family: 'Billabong', cursive;
          font-size: 28px;
          color: #fff;
          margin: 0;
          font-weight: 400;
        }

        .search-bar {
          position: relative;
          display: flex;
          align-items: center;
        }

        .search-bar svg {
          position: absolute;
          left: 12px;
        }

        .search-bar input {
          background: #262626;
          border: none;
          border-radius: 8px;
          padding: 8px 12px 8px 36px;
          color: #fff;
          font-size: 14px;
          width: 268px;
        }

        .search-bar input::placeholder {
          color: #8e8e8e;
        }

        .nav-icons {
          display: flex;
          gap: 20px;
        }

        .nav-icons button {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          position: relative;
        }

        .nav-icons button.active {
          font-weight: bold;
        }

        .notification-dot {
          position: absolute;
          top: 8px;
          right: 8px;
          width: 6px;
          height: 6px;
          background: #ff4757;
          border-radius: 50%;
        }

        .nav-avatar {
          width: 24px;
          height: 24px;
          border-radius: 50%;
          overflow: hidden;
        }

        .nav-avatar img {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .feed-container {
          max-width: 614px;
          margin: 20px auto;
          padding: 0 20px;
        }

        @import url('https://fonts.googleapis.com/css2?family=Billabong&display=swap');
      `}</style>
    </div>
  );
};

export default InstagramApp;
