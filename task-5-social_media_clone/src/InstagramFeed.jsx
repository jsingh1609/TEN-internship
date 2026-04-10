import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Modular shader configuration
const SHADER_CONFIGS = {
  liquidDistortion: {
    vertexShader: `
      varying vec2 vUv;
      void main() {
        vUv = uv;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: `
      uniform sampler2D uTexture;
      uniform vec2 uMouse;
      uniform float uTime;
      uniform float uHoverIntensity;
      varying vec2 vUv;
      
      vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
      vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }
      
      float snoise(vec2 v) {
        const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
        vec2 i  = floor(v + dot(v, C.yy));
        vec2 x0 = v -   i + dot(i, C.xx);
        vec2 i1;
        i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
        vec4 x12 = x0.xyxy + C.xxzz;
        x12.xy -= i1;
        i = mod289(i);
        vec3 p = permute(permute(i.y + vec3(0.0, i1.y, 1.0)) + i.x + vec3(0.0, i1.x, 1.0));
        vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
        m = m*m;
        m = m*m;
        vec3 x = 2.0 * fract(p * C.www) - 1.0;
        vec3 h = abs(x) - 0.5;
        vec3 ox = floor(x + 0.5);
        vec3 a0 = x - ox;
        m *= 1.79284291400159 - 0.85373472095314 * (a0*a0 + h*h);
        vec3 g;
        g.x  = a0.x  * x0.x  + h.x  * x0.y;
        g.yz = a0.yz * x12.xz + h.yz * x12.yw;
        return 130.0 * dot(m, g);
      }
      
      void main() {
        vec2 uv = vUv;
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.5, 0.0, dist) * uHoverIntensity;
        
        float noise1 = snoise(uv * 3.0 + uTime * 0.3);
        float noise2 = snoise(uv * 5.0 - uTime * 0.2);
        
        vec2 distortion = vec2(noise1, noise2) * 0.02 * influence;
        float wave = sin(dist * 20.0 - uTime * 3.0) * 0.01 * influence;
        distortion += normalize(uv - uMouse) * wave;
        
        vec2 finalUV = uv + distortion;
        vec4 color = texture2D(uTexture, finalUV);
        
        if (influence > 0.1) {
          float aberration = 0.003 * influence;
          float r = texture2D(uTexture, finalUV + vec2(aberration, 0.0)).r;
          float g = texture2D(uTexture, finalUV).g;
          float b = texture2D(uTexture, finalUV - vec2(aberration, 0.0)).b;
          color = vec4(r, g, b, color.a);
        }
        
        gl_FragColor = color;
      }
    `,
    uniforms: {
      uTexture: { value: null },
      uMouse: { value: new THREE.Vector2(0.5, 0.5) },
      uTime: { value: 0 },
      uHoverIntensity: { value: 0 }
    }
  }
};

// WebGL Image Component
const LiquidImage = ({ imageUrl, shaderType = 'liquidDistortion', onHover }) => {
  const meshRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverIntensityRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  
  const texture = useTexture(imageUrl);
  const shaderConfig = SHADER_CONFIGS[shaderType];
  
  const material = useRef(
    new THREE.ShaderMaterial({
      vertexShader: shaderConfig.vertexShader,
      fragmentShader: shaderConfig.fragmentShader,
      uniforms: {
        ...shaderConfig.uniforms,
        uTexture: { value: texture }
      }
    })
  ).current;

  useFrame((state) => {
    if (!meshRef.current) return;
    mouseRef.current.lerp(targetMouseRef.current, 0.1);
    material.uniforms.uMouse.value.copy(mouseRef.current);
    const targetIntensity = isHovered ? 1.0 : 0.3;
    hoverIntensityRef.current += (targetIntensity - hoverIntensityRef.current) * 0.1;
    material.uniforms.uHoverIntensity.value = hoverIntensityRef.current;
    material.uniforms.uTime.value = state.clock.elapsedTime;
  });

  const handlePointerMove = (e) => {
    targetMouseRef.current.set(e.uv.x, e.uv.y);
  };

  const handlePointerEnter = () => {
    setIsHovered(true);
    onHover?.(true);
  };

  const handlePointerLeave = () => {
    setIsHovered(false);
    onHover?.(false);
  };

  return (
    <mesh
      ref={meshRef}
      material={material}
      onPointerMove={handlePointerMove}
      onPointerEnter={handlePointerEnter}
      onPointerLeave={handlePointerLeave}
    >
      <planeGeometry args={[2, 2]} />
    </mesh>
  );
};

// Stories Component
const Stories = ({ stories }) => {
  const [activeStory, setActiveStory] = useState(null);

  return (
    <>
      <div className="stories-container">
        <div className="stories-scroll">
          {stories.map((story) => (
            <div
              key={story.id}
              className={`story-item ${story.hasNewStory ? 'new-story' : ''}`}
              onClick={() => setActiveStory(story)}
            >
              <div className="story-ring">
                <img src={story.avatar} alt={story.username} />
              </div>
              <span className="story-username">{story.username}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Story Viewer Modal */}
      {activeStory && (
        <div className="story-viewer" onClick={() => setActiveStory(null)}>
          <div className="story-content">
            <div className="story-header">
              <img src={activeStory.avatar} alt={activeStory.username} />
              <span>{activeStory.username}</span>
              <span className="story-time">{activeStory.time}</span>
            </div>
            <img src={activeStory.image} alt="Story" className="story-image" />
            <div className="story-progress">
              <div className="story-progress-bar"></div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

// Instagram-like Feed Item
const InstagramFeedItem = ({ 
  post,
  shaderType = 'liquidDistortion',
  enableWebGL = true
}) => {
  const containerRef = useRef();
  const contentRef = useRef();
  const [isHovered, setIsHovered] = useState(false);
  const [liked, setLiked] = useState(post.isLiked || false);
  const [saved, setSaved] = useState(post.isSaved || false);
  const [showComments, setShowComments] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [comment, setComment] = useState('');
  const [comments, setComments] = useState(post.comments || []);
  const [likeCount, setLikeCount] = useState(post.likes);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    const timer = setTimeout(() => {
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'top 30%',
          toggleActions: 'play none none none',
        }
      });

      tl.from(container, {
        opacity: 0,
        y: 60,
        duration: 0.8,
        ease: 'power3.out'
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
    
    // Heart animation
    if (!liked) {
      const heart = document.createElement('div');
      heart.className = 'floating-heart';
      heart.innerHTML = '❤️';
      containerRef.current?.querySelector('.canvas-container')?.appendChild(heart);
      setTimeout(() => heart.remove(), 1000);
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
    }
  };

  const handleDoubleTap = () => {
    if (!liked) {
      handleLike();
    }
  };

  const images = Array.isArray(post.imageUrl) ? post.imageUrl : [post.imageUrl];

  return (
    <div ref={containerRef} className="instagram-feed-item">
      <div ref={contentRef} className="feed-content">
        {/* Post Header */}
        <div className="post-header">
          <div className="user-info-left">
            <div className="user-avatar">
              <img src={post.avatar || `https://ui-avatars.com/api/?name=${post.username}&background=667eea&color=fff`} alt={post.username} />
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

        {/* Image Carousel */}
        <div className="image-carousel" onDoubleClick={handleDoubleTap}>
          <div className={`canvas-container ${isHovered ? 'hovered' : ''}`}>
            {enableWebGL ? (
              <Suspense fallback={
                <div className="canvas-loading">
                  <img src={images[currentImageIndex]} alt="Loading" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                </div>
              }>
                <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
                  <LiquidImage 
                    imageUrl={images[currentImageIndex]} 
                    shaderType={shaderType}
                    onHover={setIsHovered}
                  />
                </Canvas>
              </Suspense>
            ) : (
              <img 
                src={images[currentImageIndex]} 
                alt="Post" 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            )}
          </div>

          {/* Carousel Controls */}
          {images.length > 1 && (
            <>
              <button 
                className="carousel-btn prev"
                onClick={() => setCurrentImageIndex((currentImageIndex - 1 + images.length) % images.length)}
                style={{ display: currentImageIndex === 0 ? 'none' : 'flex' }}
              >
                ‹
              </button>
              <button 
                className="carousel-btn next"
                onClick={() => setCurrentImageIndex((currentImageIndex + 1) % images.length)}
                style={{ display: currentImageIndex === images.length - 1 ? 'none' : 'flex' }}
              >
                ›
              </button>
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
        </div>

        {/* Action Buttons */}
        <div className="post-actions">
          <div className="action-left">
            <button 
              className={`action-btn ${liked ? 'liked' : ''}`}
              onClick={handleLike}
            >
              <svg width="24" height="24" viewBox="0 0 24 24" fill={liked ? '#ff4757' : 'none'} stroke="currentColor" strokeWidth="2">
                <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
              </svg>
            </button>
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
            onClick={() => setSaved(!saved)}
          >
            <svg width="24" height="24" viewBox="0 0 24 24" fill={saved ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2">
              <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z"/>
            </svg>
          </button>
        </div>

        {/* Likes Count */}
        <div className="likes-section">
          <span className="likes-count">{likeCount.toLocaleString()} likes</span>
        </div>

        {/* Caption */}
        <div className="post-caption">
          <span className="caption-username">{post.username}</span>
          <span className="caption-text">{post.caption}</span>
          {post.hashtags && post.hashtags.length > 0 && (
            <div className="hashtags">
              {post.hashtags.map((tag, idx) => (
                <span key={idx} className="hashtag">#{tag}</span>
              ))}
            </div>
          )}
        </div>

        {/* View Comments */}
        {comments.length > 0 && !showComments && (
          <button className="view-comments" onClick={() => setShowComments(true)}>
            View all {comments.length} comments
          </button>
        )}

        {/* Comments Section */}
        {showComments && (
          <div className="comments-section">
            {comments.map((c) => (
              <div key={c.id} className="comment">
                <span className="comment-username">{c.username}</span>
                <span className="comment-text">{c.text}</span>
                <div className="comment-meta">
                  <span className="comment-time">{c.timestamp}</span>
                  {c.likes > 0 && <span className="comment-likes">{c.likes} likes</span>}
                  <button className="comment-reply">Reply</button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Timestamp */}
        <span className="post-timestamp">{post.timestamp}</span>

        {/* Add Comment */}
        <form className="add-comment" onSubmit={handleComment}>
          <input
            type="text"
            placeholder="Add a comment..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
          <button type="submit" disabled={!comment.trim()}>
            Post
          </button>
        </form>
      </div>

      <style jsx>{`
        .instagram-feed-item {
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
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
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
          display: flex;
          align-items: center;
        }

        .image-carousel {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          background: #000;
        }

        .canvas-container {
          width: 100%;
          height: 100%;
          position: relative;
          transition: transform 0.3s ease;
        }

        .canvas-container.hovered {
          transform: scale(1.01);
        }

        .canvas-container canvas,
        .canvas-container img {
          display: block;
          width: 100%;
          height: 100%;
        }

        .canvas-loading {
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
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
          backdrop-filter: blur(4px);
        }

        .carousel-btn.prev {
          left: 12px;
        }

        .carousel-btn.next {
          right: 12px;
        }

        .carousel-dots {
          position: absolute;
          top: 12px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          gap: 4px;
          z-index: 10;
        }

        .dot {
          width: 6px;
          height: 6px;
          border-radius: 50%;
          background: rgba(255, 255, 255, 0.4);
          transition: all 0.3s;
        }

        .dot.active {
          background: #fff;
          width: 8px;
          height: 8px;
        }

        .floating-heart {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 100px;
          pointer-events: none;
          animation: floatUp 1s ease-out;
          z-index: 100;
        }

        @keyframes floatUp {
          0% {
            opacity: 0;
            transform: translate(-50%, -50%) scale(0);
          }
          50% {
            opacity: 1;
            transform: translate(-50%, -60%) scale(1.2);
          }
          100% {
            opacity: 0;
            transform: translate(-50%, -80%) scale(1);
          }
        }

        .post-actions {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 6px 16px;
        }

        .action-left {
          display: flex;
          gap: 16px;
        }

        .action-btn {
          background: none;
          border: none;
          color: #fff;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          transition: all 0.2s;
        }

        .action-btn:hover {
          transform: scale(1.1);
        }

        .action-btn.liked {
          animation: likeAnimation 0.3s ease;
        }

        @keyframes likeAnimation {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.2); }
        }

        .action-btn.liked svg {
          fill: #ff4757;
          stroke: #ff4757;
        }

        .action-btn.saved svg {
          fill: #fff;
        }

        .likes-section {
          padding: 0 16px 8px;
        }

        .likes-count {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
          font-size: 14px;
          font-weight: 600;
          color: #fff;
        }

        .post-caption {
          padding: 0 16px 8px;
          font-size: 14px;
          line-height: 18px;
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
          font-size: 14px;
        }

        .hashtag:hover {
          text-decoration: underline;
        }

        .view-comments {
          background: none;
          border: none;
          color: #a8a8a8;
          font-size: 14px;
          cursor: pointer;
          padding: 0 16px 8px;
          text-align: left;
        }

        .comments-section {
          padding: 0 16px 8px;
          max-height: 200px;
          overflow-y: auto;
        }

        .comment {
          margin-bottom: 12px;
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

        .comment-meta {
          display: flex;
          gap: 12px;
          margin-top: 4px;
          font-size: 12px;
          color: #a8a8a8;
        }

        .comment-reply {
          background: none;
          border: none;
          color: #a8a8a8;
          cursor: pointer;
          font-size: 12px;
          font-weight: 600;
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
          align-items: center;
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

        .add-comment input::placeholder {
          color: #a8a8a8;
        }

        .add-comment button {
          background: none;
          border: none;
          color: #0095f6;
          font-size: 14px;
          font-weight: 600;
          cursor: pointer;
          padding: 12px 0;
        }

        .add-comment button:disabled {
          opacity: 0.3;
          cursor: default;
        }

        @media (max-width: 768px) {
          .instagram-feed-item {
            border-radius: 0;
            border-left: none;
            border-right: none;
            margin-bottom: 16px;
          }
        }
      `}</style>
    </div>
  );
};

// Instagram Feed Demo
const InstagramFeed = () => {
  const stories = [
    {
      id: 1,
      username: 'Your Story',
      avatar: 'https://ui-avatars.com/api/?name=You&background=667eea&color=fff',
      hasNewStory: false,
      image: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
      time: '2h ago'
    },
    {
      id: 2,
      username: 'creative_studio',
      avatar: 'https://ui-avatars.com/api/?name=CS&background=764ba2&color=fff',
      hasNewStory: true,
      image: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800',
      time: '5h ago'
    },
    {
      id: 3,
      username: 'design_daily',
      avatar: 'https://ui-avatars.com/api/?name=DD&background=f093fb&color=fff',
      hasNewStory: true,
      image: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800',
      time: '8h ago'
    },
    {
      id: 4,
      username: 'art_collective',
      avatar: 'https://ui-avatars.com/api/?name=AC&background=4facfe&color=fff',
      hasNewStory: true,
      image: 'https://images.unsplash.com/photo-1634017839464-5c339ebe3cb4?w=800',
      time: '12h ago'
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
        'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop',
        'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=800&fit=crop'
      ],
      caption: 'Exploring liquid motion in WebGL — where digital meets organic ✨',
      hashtags: ['webgl', 'creative', 'design', 'motiondesign'],
      likes: 1247,
      isLiked: false,
      isSaved: false,
      timestamp: '2 HOURS AGO',
      comments: [
        { id: 1, username: 'design_lover', text: 'This is incredible! 🔥', timestamp: '1h ago', likes: 12 },
        { id: 2, username: 'webgl_wizard', text: 'What shader are you using?', timestamp: '45m ago', likes: 5 }
      ]
    },
    {
      id: 2,
      username: 'abstract_mind',
      avatar: 'https://ui-avatars.com/api/?name=AM&background=667eea&color=fff',
      verified: false,
      location: 'New York, NY',
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop',
      caption: 'Distortion as a language. Every ripple tells a story.',
      hashtags: ['abstract', 'digitalart', 'generativeart'],
      likes: 892,
      isLiked: true,
      isSaved: false,
      timestamp: '5 HOURS AGO',
      comments: [
        { id: 3, username: 'art_enthusiast', text: 'Love the concept!', timestamp: '3h ago', likes: 8 }
      ]
    },
    {
      id: 3,
      username: 'visual_architect',
      avatar: 'https://ui-avatars.com/api/?name=VA&background=f093fb&color=fff',
      verified: true,
      location: 'Los Angeles, CA',
      imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=800&fit=crop',
      caption: 'When shaders breathe life into static imagery 🎨',
      hashtags: ['shader', 'webgl', 'threejs', 'interactive'],
      likes: 2103,
      isLiked: false,
      isSaved: true,
      timestamp: '8 HOURS AGO',
      comments: []
    }
  ];

  return (
    <div className="instagram-feed">
      <div className="feed-container">
        <Stories stories={stories} />
        
        {posts.map((post) => (
          <InstagramFeedItem 
            key={post.id} 
            post={post}
            enableWebGL={true}
          />
        ))}
      </div>

      <style jsx>{`
        .instagram-feed {
          min-height: 100vh;
          background: #000;
          padding: 20px 0;
        }

        .feed-container {
          max-width: 614px;
          margin: 0 auto;
        }

        .stories-container {
          background: #000;
          border: 1px solid #262626;
          border-radius: 8px;
          padding: 16px;
          margin-bottom: 24px;
          overflow: hidden;
        }

        .stories-scroll {
          display: flex;
          gap: 16px;
          overflow-x: auto;
          scrollbar-width: none;
        }

        .stories-scroll::-webkit-scrollbar {
          display: none;
        }

        .story-item {
          flex-shrink: 0;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
        }

        .story-ring {
          width: 66px;
          height: 66px;
          border-radius: 50%;
          padding: 2px;
          background: linear-gradient(45deg, #f09433 0%, #e6683c 25%, #dc2743 50%, #cc2366 75%, #bc1888 100%);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .story-item:not(.new-story) .story-ring {
          background: #262626;
        }

        .story-ring img {
          width: 60px;
          height: 60px;
          border-radius: 50%;
          border: 2px solid #000;
          object-fit: cover;
        }

        .story-username {
          font-size: 12px;
          color: #fff;
          max-width: 66px;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }

        .story-viewer {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.95);
          z-index: 1000;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
        }

        .story-content {
          max-width: 500px;
          width: 100%;
          position: relative;
        }

        .story-header {
          position: absolute;
          top: 20px;
          left: 20px;
          right: 20px;
          display: flex;
          align-items: center;
          gap: 10px;
          z-index: 10;
          color: #fff;
        }

        .story-header img {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          border: 2px solid #fff;
        }

        .story-time {
          margin-left: auto;
          font-size: 12px;
          color: rgba(255, 255, 255, 0.7);
        }

        .story-image {
          width: 100%;
          height: auto;
          max-height: 80vh;
          object-fit: contain;
          border-radius: 8px;
        }

        .story-progress {
          position: absolute;
          top: 10px;
          left: 20px;
          right: 20px;
          height: 2px;
          background: rgba(255, 255, 255, 0.3);
          border-radius: 1px;
          overflow: hidden;
        }

        .story-progress-bar {
          height: 100%;
          background: #fff;
          width: 0;
          animation: progress 5s linear forwards;
        }

        @keyframes progress {
          to { width: 100%; }
        }

        @media (max-width: 768px) {
          .feed-container {
            max-width: 100%;
          }

          .stories-container {
            border-radius: 0;
            border-left: none;
            border-right: none;
          }
        }
      `}</style>
    </div>
  );
};

export default InstagramFeed;
