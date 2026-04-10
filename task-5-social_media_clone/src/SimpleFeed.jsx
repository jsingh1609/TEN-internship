import React, { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

function SimpleFeedItem({ post }) {
  const containerRef = useRef();
  const contentRef = useRef();

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const tl = gsap.timeline({
      scrollTrigger: {
        trigger: container,
        start: 'top 80%',
        end: 'top 20%',
        toggleActions: 'play none none reverse'
      }
    });

    tl.from(container, {
      opacity: 0,
      y: 60,
      duration: 0.8,
      ease: 'power3.out'
    })
    .from(content.querySelector('.post-header'), {
      opacity: 0,
      x: -30,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.4')
    .from(content.querySelector('.post-caption'), {
      opacity: 0,
      y: 20,
      duration: 0.6,
      ease: 'power2.out'
    }, '-=0.3')
    .from(content.querySelectorAll('.post-action'), {
      opacity: 0,
      scale: 0.8,
      duration: 0.4,
      stagger: 0.1,
      ease: 'back.out(1.7)'
    }, '-=0.3');

    return () => {
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="feed-item">
      <div ref={contentRef} className="feed-content">
        <div className="post-header">
          <div className="user-avatar">
            <div className="avatar-gradient"></div>
          </div>
          <div className="user-info">
            <h3 className="username">{post.username}</h3>
            <span className="timestamp">{post.timestamp}</span>
          </div>
        </div>

        <div className="image-container">
          <img src={post.imageUrl} alt={post.caption} className="post-image" />
        </div>

        <div className="post-caption">
          <p>{post.caption}</p>
        </div>

        <div className="post-actions">
          <button className="post-action action-like">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
            <span className="like-count">{post.likes.toLocaleString()}</span>
          </button>
          <button className="post-action action-comment">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M21 11.5a8.38 8.38 0 0 1-.9 3.8 8.5 8.5 0 0 1-7.6 4.7 8.38 8.38 0 0 1-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 0 1-.9-3.8 8.5 8.5 0 0 1 4.7-7.6 8.38 8.38 0 0 1 3.8-.9h.5a8.48 8.48 0 0 1 8 8v.5z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </button>
          <button className="post-action action-share">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <circle cx="18" cy="5" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="6" cy="12" r="3" stroke="currentColor" strokeWidth="2"/>
              <circle cx="18" cy="19" r="3" stroke="currentColor" strokeWidth="2"/>
              <path d="M8.59 13.51l6.83 3.98M15.41 6.51l-6.82 3.98" stroke="currentColor" strokeWidth="2"/>
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .feed-item {
          max-width: 600px;
          margin: 0 auto 80px;
          background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
          border-radius: 24px;
          overflow: hidden;
          box-shadow: 
            0 4px 6px rgba(0, 0, 0, 0.1),
            0 20px 60px rgba(0, 0, 0, 0.3),
            inset 0 1px 0 rgba(255, 255, 255, 0.05);
        }

        .feed-content {
          padding: 24px;
        }

        .post-header {
          display: flex;
          align-items: center;
          gap: 12px;
          margin-bottom: 20px;
        }

        .user-avatar {
          width: 48px;
          height: 48px;
          border-radius: 50%;
          position: relative;
          overflow: hidden;
        }

        .avatar-gradient {
          width: 100%;
          height: 100%;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          animation: rotateGradient 3s ease-in-out infinite;
        }

        @keyframes rotateGradient {
          0%, 100% { transform: rotate(0deg) scale(1); }
          50% { transform: rotate(180deg) scale(1.1); }
        }

        .user-info {
          flex: 1;
        }

        .username {
          font-family: 'Epilogue', -apple-system, sans-serif;
          font-size: 16px;
          font-weight: 600;
          color: #ffffff;
          margin: 0 0 2px 0;
          letter-spacing: -0.01em;
        }

        .timestamp {
          font-family: 'JetBrains Mono', monospace;
          font-size: 12px;
          color: #888;
          letter-spacing: 0.02em;
        }

        .image-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          background: #000;
        }

        .post-image {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.6s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .post-image:hover {
          transform: scale(1.05);
        }

        .post-caption {
          margin-bottom: 20px;
        }

        .post-caption p {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 17px;
          line-height: 1.6;
          color: #e0e0e0;
          margin: 0;
          font-style: italic;
        }

        .post-actions {
          display: flex;
          gap: 20px;
          align-items: center;
        }

        .post-action {
          display: flex;
          align-items: center;
          gap: 8px;
          background: transparent;
          border: none;
          color: #888;
          cursor: pointer;
          padding: 8px 12px;
          border-radius: 12px;
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
          font-family: 'JetBrains Mono', monospace;
          font-size: 14px;
          font-weight: 500;
        }

        .post-action:hover {
          color: #fff;
          background: rgba(255, 255, 255, 0.05);
          transform: translateY(-2px);
        }

        .action-like:hover {
          color: #ff4757;
        }

        .action-like:hover svg path {
          fill: #ff4757;
          stroke: #ff4757;
        }

        .post-action svg {
          transition: all 0.3s ease;
        }

        .like-count {
          font-weight: 600;
        }

        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}

function SimpleFeed() {
  const posts = [
    {
      id: 1,
      imageUrl: 'https://picsum.photos/800/800?random=1',
      username: 'creative_studio',
      caption: 'Simple version without WebGL - Scroll animations still work perfectly!',
      likes: 1247,
      timestamp: '2h ago'
    },
    {
      id: 2,
      imageUrl: 'https://picsum.photos/800/800?random=2',
      username: 'design_wizard',
      caption: 'This version uses regular images with smooth hover effects',
      likes: 892,
      timestamp: '5h ago'
    },
    {
      id: 3,
      imageUrl: 'https://picsum.photos/800/800?random=3',
      username: 'visual_artist',
      caption: 'No WebGL required - works on all devices and browsers',
      likes: 2103,
      timestamp: '8h ago'
    }
  ];

  return (
    <div className="feed-demo">
      <div className="feed-header">
        <h1>Simple Feed</h1>
        <p>No WebGL - Always works on any device</p>
      </div>
      
      {posts.map((post) => (
        <SimpleFeedItem key={post.id} post={post} />
      ))}

      <style jsx>{`
        .feed-demo {
          min-height: 100vh;
          background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
          padding: 60px 20px;
        }

        .feed-header {
          max-width: 600px;
          margin: 0 auto 60px;
          text-align: center;
        }

        .feed-header h1 {
          font-family: 'Epilogue', -apple-system, sans-serif;
          font-size: 56px;
          font-weight: 700;
          background: linear-gradient(135deg, #fff 0%, #888 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin: 0 0 12px 0;
          letter-spacing: -0.03em;
        }

        .feed-header p {
          font-family: 'Crimson Pro', Georgia, serif;
          font-size: 18px;
          color: #666;
          margin: 0;
          font-style: italic;
        }

        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
}

export default SimpleFeed;
