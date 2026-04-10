# 🌊 Liquid Distortion Social Feed

A production-ready React + WebGL social media feed component featuring real-time liquid distortion shader effects, GSAP scroll animations, and a modular shader system.

![Demo](https://img.shields.io/badge/WebGL-Powered-blue) ![React](https://img.shields.io/badge/React-18.2-61DAFB) ![Three.js](https://img.shields.io/badge/Three.js-0.160-black)

## ✨ Features

- 🎨 **Real-time WebGL Liquid Distortion** - Interactive shader effects that respond to cursor movement
- 🔄 **Modular Shader System** - 7 different shader effects ready to swap
- 📜 **GSAP ScrollTrigger** - Smooth scroll-based reveal animations with staggered entrance
- 🎯 **Premium Editorial Design** - Distinctive typography and dark theme aesthetics
- ⚡ **Performance Optimized** - Smooth 60fps rendering on modern devices
- 📱 **Fully Responsive** - Beautiful on desktop, tablet, and mobile

---

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ installed
- Modern browser with WebGL 2.0 support

### Installation & Running

```bash
# Install dependencies (if not already done)
npm install

# Start development server
npm run dev
```

The app will automatically open at **http://localhost:3000**

### Build for Production

```bash
# Create optimized production build
npm run build

# Preview production build
npm run preview
```

---

## 📁 Project Structure

```
task-5-social_media_clone/
├── src/
│   ├── social-media-feed-item.jsx    # Main component with demo
│   ├── additional-shaders.js         # 6 bonus shader effects
│   ├── App.jsx                        # Root app component
│   ├── App.css                        # Global styles
│   ├── main.jsx                       # Entry point
│   └── index.css                      # Base CSS
├── public/                            # Static assets
├── index.html                         # HTML entry point
├── vite.config.js                     # Vite configuration
├── package.json                       # Dependencies
└── README.md                          # This file
```

---

## 🎮 Usage Examples

### Basic Implementation

```jsx
import { SocialMediaFeedItem } from './social-media-feed-item';

function MyFeed() {
  const post = {
    id: 1,
    imageUrl: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=800',
    username: 'creative_studio',
    caption: 'Exploring liquid motion in WebGL',
    likes: 1247,
    timestamp: '2h ago'
  };

  return <SocialMediaFeedItem post={post} />;
}
```

### Using Different Shaders

```jsx
// Available shader types:
// - liquidDistortion (default)
// - glassRefraction
// - magneticField
// - kaleidoscope
// - rgbSplit
// - pixelSort
// - bubbleLens

<SocialMediaFeedItem 
  post={post} 
  shaderType="kaleidoscope" 
/>
```

### Multiple Feed Items

```jsx
const posts = [
  { id: 1, imageUrl: '...', username: 'user1', ... },
  { id: 2, imageUrl: '...', username: 'user2', ... },
  { id: 3, imageUrl: '...', username: 'user3', ... }
];

return (
  <div>
    {posts.map(post => (
      <SocialMediaFeedItem key={post.id} post={post} />
    ))}
  </div>
);
```

---

## 🎨 Customizing Shaders

### Adding a New Shader Effect

1. Open `src/social-media-feed-item.jsx`
2. Add your shader to the `SHADER_CONFIGS` object:

```javascript
const SHADER_CONFIGS = {
  // ... existing shaders
  
  myCustomShader: {
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
      
      void main() {
        vec2 uv = vUv;
        // Your custom shader logic here
        gl_FragColor = texture2D(uTexture, uv);
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
```

3. Use it:

```jsx
<SocialMediaFeedItem post={post} shaderType="myCustomShader" />
```

### Using Pre-built Additional Shaders

Import the additional shaders and merge them:

```javascript
import { ADDITIONAL_SHADERS } from './additional-shaders';

const SHADER_CONFIGS = {
  liquidDistortion: { /* ... */ },
  ...ADDITIONAL_SHADERS  // Adds 6 more shader effects
};
```

---

## 🎯 Shader Effects Gallery

### 1. Liquid Distortion (Default)
Organic noise-based distortion with chromatic aberration on hover
```jsx
<SocialMediaFeedItem post={post} shaderType="liquidDistortion" />
```

### 2. Glass Refraction
Smooth glass-like refraction with radial waves
```jsx
<SocialMediaFeedItem post={post} shaderType="glassRefraction" />
```

### 3. Magnetic Field
Magnetic pull effect with circular motion
```jsx
<SocialMediaFeedItem post={post} shaderType="magneticField" />
```

### 4. Kaleidoscope
Symmetrical patterns with animated rotation
```jsx
<SocialMediaFeedItem post={post} shaderType="kaleidoscope" />
```

### 5. RGB Split
Chromatic aberration with animated color channel separation
```jsx
<SocialMediaFeedItem post={post} shaderType="rgbSplit" />
```

### 6. Pixel Sort
Glitch-style pixel sorting with scan lines
```jsx
<SocialMediaFeedItem post={post} shaderType="pixelSort" />
```

### 7. Bubble Lens
Magnifying bubble lens with color fringing
```jsx
<SocialMediaFeedItem post={post} shaderType="bubbleLens" />
```

---

## ⚙️ Configuration

### Customizing GSAP Animations

Edit the ScrollTrigger settings in `social-media-feed-item.jsx`:

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top 80%',        // When animation starts
    end: 'top 20%',          // When animation ends
    toggleActions: 'play none none reverse',
    scrub: false,            // Set to true for scroll-linked animation
    markers: false           // Set to true for debugging
  }
});
```

### Adjusting Stagger Timing

```javascript
.from(content.querySelectorAll('.post-action'), {
  opacity: 0,
  scale: 0.8,
  duration: 0.5,      // Animation duration
  stagger: 0.1,       // Delay between each element
  ease: 'back.out(1.7)'  // Easing function
}, '-=0.3');
```

### Customizing Colors & Typography

Edit the inline styles in `social-media-feed-item.jsx`:

```javascript
<style jsx>{`
  .feed-item {
    background: linear-gradient(135deg, #0a0a0a 0%, #1a1a1a 100%);
    /* Change background gradient */
  }
  
  .username {
    font-family: 'Epilogue', -apple-system, sans-serif;
    /* Change font family */
    color: #ffffff;
    /* Change text color */
  }
`}</style>
```

---

## 🔧 Performance Optimization

### For Mobile Devices

```javascript
// Detect mobile and reduce shader quality
const isMobile = window.innerWidth < 768;
const shaderType = isMobile ? 'liquidDistortion' : 'kaleidoscope';

<SocialMediaFeedItem post={post} shaderType={shaderType} />
```

### Reduce Canvas Quality

```jsx
<Canvas 
  dpr={[1, 2]}              // Limit pixel ratio
  frameloop="demand"        // Render only when needed
  performance={{ min: 0.5 }} // Adaptive performance
>
  <LiquidImage imageUrl={post.imageUrl} />
</Canvas>
```

### Optimize Images

- Use WebP format
- Recommended size: 800x800px
- Enable CDN caching
- Use lazy loading for off-screen items

---

## 🌐 Browser Support

| Browser | Version | Support |
|---------|---------|---------|
| Chrome  | 90+     | ✅ Full |
| Firefox | 88+     | ✅ Full |
| Safari  | 15+     | ✅ Full |
| Edge    | 90+     | ✅ Full |
| Mobile Safari | 15+ | ⚠️ Limited (no hover) |
| Chrome Mobile | 90+ | ⚠️ Limited (no hover) |

### Required Browser Features
- WebGL 2.0
- ES6 modules
- CSS Grid & Flexbox
- CSS Custom Properties

---

## 📦 Dependencies

```json
{
  "react": "^18.2.0",
  "react-dom": "^18.2.0",
  "three": "^0.160.0",
  "@react-three/fiber": "^8.15.0",
  "@react-three/drei": "^9.95.0",
  "gsap": "^3.12.5"
}
```

---

## 🐛 Troubleshooting

### Textures Not Loading

**Problem**: Images don't appear or show broken texture  
**Solution**: Check CORS settings and use a proxy if needed

```javascript
const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(imageUrl)}`;
<LiquidImage imageUrl={proxyUrl} />
```

### Performance Issues

**Problem**: Low FPS or laggy animations  
**Solution**: Reduce shader complexity

```javascript
// Lower shader quality
material.uniforms.uQuality = { value: 0.5 };

// Disable effects on mobile
const enableEffects = !('ontouchstart' in window);
```

### Scroll Animations Not Triggering

**Problem**: GSAP animations don't play  
**Solution**: Refresh ScrollTrigger after content loads

```javascript
import { ScrollTrigger } from 'gsap/ScrollTrigger';

useEffect(() => {
  ScrollTrigger.refresh();
}, []);
```

### WebGL Context Lost

**Problem**: Canvas goes black  
**Solution**: Add context restoration

```javascript
<Canvas onCreated={({ gl }) => {
  gl.domElement.addEventListener('webglcontextlost', (e) => {
    e.preventDefault();
    setTimeout(() => {
      gl.forceContextRestore();
    }, 100);
  });
}} />
```

---

## 🎓 Learning Resources

### WebGL Shaders
- [The Book of Shaders](https://thebookofshaders.com/)
- [Shadertoy](https://www.shadertoy.com/)
- [WebGL Fundamentals](https://webglfundamentals.org/)

### React Three Fiber
- [Official Docs](https://docs.pmnd.rs/react-three-fiber)
- [drei Components](https://github.com/pmndrs/drei)

### GSAP
- [GSAP Docs](https://greensock.com/docs/)
- [ScrollTrigger](https://greensock.com/docs/v3/Plugins/ScrollTrigger)

---

## 🤝 Contributing

Feel free to submit issues and enhancement requests!

---

## 📄 License

MIT License - feel free to use in your projects!

---

## 🙏 Credits

- **Shader Techniques**: Adapted from classic Simplex noise algorithms
- **Fonts**: Epilogue, Crimson Pro, JetBrains Mono (Google Fonts)
- **Framework**: Built with React Three Fiber & GSAP
- **Sample Images**: Unsplash

---

## 💡 Pro Tips

1. **Start Simple**: Begin with the default `liquidDistortion` shader
2. **Experiment**: Try all 7 shader effects to see what fits your style
3. **Customize**: Adjust colors, fonts, and timing to match your brand
4. **Optimize**: Test on mobile devices and adjust performance settings
5. **Monitor Performance**: Use browser DevTools to check FPS
6. **Learn Shaders**: Modify the GLSL code to create unique effects

---

**Made with ❤️ using React, Three.js, and GSAP**

For questions or issues, check the troubleshooting section or open an issue on GitHub.
