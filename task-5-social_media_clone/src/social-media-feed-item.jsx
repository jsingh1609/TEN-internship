import React, { useRef, useEffect, useState, Suspense } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useTexture } from '@react-three/drei';
import * as THREE from 'three';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

// Modular shader configuration - easily swap effects here
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
      
      // Smooth noise function for organic distortion
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
        
        // Calculate distance from mouse
        float dist = distance(uv, uMouse);
        float influence = smoothstep(0.5, 0.0, dist) * uHoverIntensity;
        
        // Create liquid ripple effect
        float noise1 = snoise(uv * 3.0 + uTime * 0.3);
        float noise2 = snoise(uv * 5.0 - uTime * 0.2);
        
        // Combine noise for organic movement
        vec2 distortion = vec2(noise1, noise2) * 0.02 * influence;
        
        // Add radial wave from mouse position
        float wave = sin(dist * 20.0 - uTime * 3.0) * 0.01 * influence;
        distortion += normalize(uv - uMouse) * wave;
        
        // Sample texture with distorted UV
        vec2 finalUV = uv + distortion;
        vec4 color = texture2D(uTexture, finalUV);
        
        // Subtle chromatic aberration on hover
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

// WebGL Image Component with modular shader system
const LiquidImage = ({ imageUrl, shaderType = 'liquidDistortion', onHover }) => {
  const meshRef = useRef();
  const mouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const targetMouseRef = useRef(new THREE.Vector2(0.5, 0.5));
  const hoverIntensityRef = useRef(0);
  const [isHovered, setIsHovered] = useState(false);
  
  // Load texture
  const texture = useTexture(imageUrl);
  
  // Get shader configuration
  const shaderConfig = SHADER_CONFIGS[shaderType];
  
  // Create shader material with selected config
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
    
    // Smooth mouse following
    mouseRef.current.lerp(targetMouseRef.current, 0.1);
    material.uniforms.uMouse.value.copy(mouseRef.current);
    
    // Animate hover intensity
    const targetIntensity = isHovered ? 1.0 : 0.3;
    hoverIntensityRef.current += (targetIntensity - hoverIntensityRef.current) * 0.1;
    material.uniforms.uHoverIntensity.value = hoverIntensityRef.current;
    
    // Update time for animation
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

// Main Feed Item Component
const SocialMediaFeedItem = ({ 
  post = {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop',
    username: 'creative_studio',
    caption: 'Exploring liquid motion in WebGL — where digital meets organic',
    likes: 1247,
    timestamp: '2h ago'
  },
  shaderType = 'liquidDistortion'
}) => {
  const containerRef = useRef();
  const contentRef = useRef();
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    const container = containerRef.current;
    const content = contentRef.current;
    if (!container || !content) return;

    // Small delay to ensure DOM is ready
    const timer = setTimeout(() => {
      // GSAP ScrollTrigger animation
      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: container,
          start: 'top 85%',
          end: 'top 30%',
          toggleActions: 'play none none none',
          // markers: true, // Uncomment for debugging
        }
      });

      // Staggered entrance animation
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
    }, 100);

    return () => {
      clearTimeout(timer);
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div ref={containerRef} className="feed-item">
      <div ref={contentRef} className="feed-content">
        {/* Post Header */}
        <div className="post-header">
          <div className="user-avatar">
            <div className="avatar-gradient"></div>
          </div>
          <div className="user-info">
            <h3 className="username">{post.username}</h3>
            <span className="timestamp">{post.timestamp}</span>
          </div>
        </div>

        {/* WebGL Canvas with Liquid Distortion */}
        <div className={`canvas-container ${isHovered ? 'hovered' : ''}`}>
          <Suspense fallback={
            <div className="canvas-loading">
              <div className="loading-spinner"></div>
            </div>
          }>
            <Canvas camera={{ position: [0, 0, 2], fov: 50 }}>
              <LiquidImage 
                imageUrl={post.imageUrl} 
                shaderType={shaderType}
                onHover={setIsHovered}
              />
            </Canvas>
          </Suspense>
          <div className="hover-indicator">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M12 2L2 7L12 12L22 7L12 2Z" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
              <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinejoin="round"/>
            </svg>
          </div>
        </div>

        {/* Post Caption */}
        <div className="post-caption">
          <p>{post.caption}</p>
        </div>

        {/* Post Actions */}
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

        .canvas-container {
          position: relative;
          width: 100%;
          aspect-ratio: 1;
          border-radius: 16px;
          overflow: hidden;
          margin-bottom: 20px;
          background: #000;
          transition: transform 0.4s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .canvas-container.hovered {
          transform: scale(1.02);
        }

        .canvas-container canvas {
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
          background: #0a0a0a;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 3px solid rgba(255, 255, 255, 0.1);
          border-top-color: #fff;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .hover-indicator {
          position: absolute;
          bottom: 16px;
          right: 16px;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          backdrop-filter: blur(10px);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          color: #fff;
          opacity: 0;
          transform: scale(0.8);
          transition: all 0.3s cubic-bezier(0.34, 1.56, 0.64, 1);
        }

        .canvas-container.hovered .hover-indicator {
          opacity: 1;
          transform: scale(1);
        }

        .hover-indicator svg {
          animation: float 2s ease-in-out infinite;
        }

        @keyframes float {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-4px); }
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

        /* Responsive Design */
        @media (max-width: 768px) {
          .feed-item {
            margin: 0 auto 40px;
            border-radius: 16px;
          }

          .feed-content {
            padding: 16px;
          }

          .canvas-container {
            border-radius: 12px;
          }

          .post-caption p {
            font-size: 15px;
          }
        }

        /* Font Loading */
        @import url('https://fonts.googleapis.com/css2?family=Epilogue:wght@400;600;700&family=Crimson+Pro:ital,wght@0,400;0,600;1,400&family=JetBrains+Mono:wght@400;500;600&display=swap');
      `}</style>
    </div>
  );
};

// Demo Component with Multiple Feed Items
const SocialFeedDemo = () => {
  const posts = [
    {
      id: 1,
      imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800&h=800&fit=crop',
      username: 'creative_studio',
      caption: 'Exploring liquid motion in WebGL — where digital meets organic',
      likes: 1247,
      timestamp: '2h ago'
    },
    {
      id: 2,
      imageUrl: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&h=800&fit=crop',
      username: 'abstract_mind',
      caption: 'Distortion as a language. Every ripple tells a story.',
      likes: 892,
      timestamp: '5h ago'
    },
    {
      id: 3,
      imageUrl: 'https://images.unsplash.com/photo-1557682250-33bd709cbe85?w=800&h=800&fit=crop',
      username: 'visual_architect',
      caption: 'When shaders breathe life into static imagery',
      likes: 2103,
      timestamp: '8h ago'
    }
  ];

  return (
    <div className="feed-demo">
      <div className="feed-header">
        <h1>Liquid Feed</h1>
        <p>Interactive WebGL-powered social media experience</p>
      </div>
      
      {posts.map((post) => (
        <SocialMediaFeedItem key={post.id} post={post} />
      ))}

      <style jsx>{`
        .feed-demo {
          min-height: 200vh;
          background: linear-gradient(180deg, #000000 0%, #0a0a0a 50%, #000000 100%);
          padding: 60px 20px 120px;
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
};

export default SocialFeedDemo;
