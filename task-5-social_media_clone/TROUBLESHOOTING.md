# 🔧 TROUBLESHOOTING & TIPS

Common issues and solutions for the Liquid Distortion Social Feed project.

---

## 🚨 Common Issues

### Issue 1: "npm install" fails

**Symptoms:**
- Errors during package installation
- Missing dependencies warnings

**Solutions:**

```bash
# Solution 1: Clear npm cache
npm cache clean --force
npm install

# Solution 2: Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install

# Solution 3: Use yarn instead
npm install -g yarn
yarn install
```

---

### Issue 2: Images don't load / Black screens

**Symptoms:**
- Canvas shows black screen
- No images visible
- Console shows CORS errors

**Solutions:**

**Option A: Use local images**
```javascript
// In src/social-media-feed-item.jsx
const posts = [
  {
    id: 1,
    imageUrl: '/images/your-image.jpg',  // Put images in public/images/
    username: 'creative_studio',
    caption: 'Your caption',
    likes: 1247,
    timestamp: '2h ago'
  }
];
```

**Option B: Use CORS proxy for external images**
```javascript
const imageUrl = `https://corsproxy.io/?${encodeURIComponent(originalUrl)}`;
```

**Option C: Use images from CDNs that allow CORS**
- Unsplash: ✅ (already used in demo)
- Pexels: ✅
- Pixabay: ✅
- Your own server with CORS enabled: ✅

---

### Issue 3: WebGL not supported

**Symptoms:**
- Error: "WebGL context could not be created"
- Blank canvas

**Solutions:**

1. **Check browser support:**
   - Visit: https://get.webgl.org/
   - Upgrade to Chrome 90+, Firefox 88+, or Safari 15+

2. **Enable hardware acceleration:**
   - Chrome: Settings → System → Use hardware acceleration
   - Firefox: Preferences → Performance → Use recommended performance settings

3. **Update graphics drivers**

---

### Issue 4: Low performance / Lag

**Symptoms:**
- Choppy animations
- Low FPS
- Browser freezes

**Solutions:**

**For Development:**
```javascript
// In src/social-media-feed-item.jsx
// Reduce shader quality
<Canvas dpr={[1, 1.5]} performance={{ min: 0.5 }}>
```

**For Mobile:**
```javascript
// Disable effects on mobile
const isMobile = window.innerWidth < 768;

{!isMobile && (
  <Canvas>
    <LiquidImage imageUrl={post.imageUrl} />
  </Canvas>
)}

{isMobile && (
  <img src={post.imageUrl} alt="Post" />
)}
```

**Optimize Images:**
- Resize to max 800x800px
- Use WebP format
- Compress images (80% quality)

---

### Issue 5: Scroll animations don't trigger

**Symptoms:**
- No animations when scrolling
- Feed items appear instantly

**Solutions:**

```javascript
// Add ScrollTrigger refresh after component mount
import { useEffect } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

useEffect(() => {
  // Refresh ScrollTrigger after images load
  const images = document.querySelectorAll('img');
  let loadedCount = 0;
  
  images.forEach(img => {
    if (img.complete) loadedCount++;
    else img.addEventListener('load', () => {
      loadedCount++;
      if (loadedCount === images.length) {
        ScrollTrigger.refresh();
      }
    });
  });
}, []);
```

---

### Issue 6: Port 3000 already in use

**Symptoms:**
- Error: "Port 3000 is already in use"
- Can't start dev server

**Solutions:**

**Option A: Use different port**
```bash
# In vite.config.js, change port:
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3001,  // Change to any available port
    open: true
  }
})
```

**Option B: Kill process on port 3000**
```bash
# On Windows:
netstat -ano | findstr :3000
taskkill /PID <PID_NUMBER> /F

# On Mac/Linux:
lsof -ti:3000 | xargs kill -9
```

---

## 💡 Pro Tips

### Tip 1: Debug Mode for Shaders

Add console logs to see shader values:

```javascript
useFrame((state) => {
  if (!meshRef.current) return;
  
  // Debug values
  console.log('Mouse:', mouseRef.current);
  console.log('Hover Intensity:', hoverIntensityRef.current);
  console.log('Time:', state.clock.elapsedTime);
});
```

---

### Tip 2: Create Custom Post Data

```javascript
// src/data/posts.js
export const samplePosts = [
  {
    id: 1,
    imageUrl: 'https://your-image-url.com/image1.jpg',
    username: 'design_wizard',
    caption: 'Creating magic with code ✨',
    likes: 2500,
    timestamp: '3h ago'
  },
  // Add more posts...
];

// Then import and use:
import { samplePosts } from './data/posts';

function App() {
  return (
    <div>
      {samplePosts.map(post => (
        <SocialMediaFeedItem key={post.id} post={post} />
      ))}
    </div>
  );
}
```

---

### Tip 3: Add Loading States

```javascript
import { Suspense } from 'react';

function App() {
  return (
    <Suspense fallback={
      <div className="loading">
        <p>Loading magical effects...</p>
      </div>
    }>
      <SocialFeedDemo />
    </Suspense>
  );
}
```

---

### Tip 4: Enable GSAP Debug Markers

See exactly when animations trigger:

```javascript
const tl = gsap.timeline({
  scrollTrigger: {
    trigger: container,
    start: 'top 80%',
    end: 'top 20%',
    markers: true,  // Add this line
    id: 'feed-item'  // Optional label
  }
});
```

---

### Tip 5: Monitor Performance

```javascript
// Add FPS counter
import Stats from 'stats.js';

const stats = new Stats();
stats.showPanel(0); // 0: fps, 1: ms, 2: mb
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();
  // Your animation code
  stats.end();
  requestAnimationFrame(animate);
}
```

---

### Tip 6: Keyboard Shortcuts for Development

While `npm run dev` is running:

- `Ctrl + C` - Stop server
- `R` - Restart server
- `U` - Update packages
- `O` - Open in browser
- `Q` - Quit

---

### Tip 7: Create Shader Presets

```javascript
// Create a shader preset system
const PRESET_CONFIGS = {
  subtle: { intensity: 0.3, speed: 1.0 },
  normal: { intensity: 0.6, speed: 1.5 },
  extreme: { intensity: 1.0, speed: 2.5 }
};

<SocialMediaFeedItem 
  post={post} 
  preset="extreme"  // subtle, normal, or extreme
/>
```

---

## 🎨 Customization Ideas

### 1. Add Dark/Light Mode Toggle

```javascript
const [theme, setTheme] = useState('dark');

<div className={`feed-demo ${theme}`}>
  <button onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}>
    Toggle Theme
  </button>
  <SocialFeedDemo />
</div>
```

### 2. Add Like Animation

```javascript
const [liked, setLiked] = useState(false);

<button 
  className={`action-like ${liked ? 'liked' : ''}`}
  onClick={() => setLiked(!liked)}
>
  <svg>...</svg>
  <span>{liked ? post.likes + 1 : post.likes}</span>
</button>
```

### 3. Add Comments Section

```javascript
const [comments, setComments] = useState([]);

<div className="comments">
  {comments.map(comment => (
    <div key={comment.id} className="comment">
      <strong>{comment.user}</strong>: {comment.text}
    </div>
  ))}
</div>
```

---

## 📊 Performance Benchmarks

**Target Performance:**
- Desktop: 60 FPS
- Mobile: 30-45 FPS
- Time to Interactive: < 3 seconds

**Optimization Checklist:**
- ✅ Images optimized (WebP, compressed)
- ✅ Shaders simplified for mobile
- ✅ Canvas DPR limited to [1, 2]
- ✅ Lazy loading for off-screen items
- ✅ Code splitting for large components
- ✅ Production build minified

---

## 🧪 Testing Checklist

Before deploying:

- [ ] Test on Chrome, Firefox, Safari
- [ ] Test on mobile devices (iOS, Android)
- [ ] Test with slow 3G connection
- [ ] Test scroll animations
- [ ] Test hover effects
- [ ] Test different screen sizes
- [ ] Check console for errors
- [ ] Verify all images load
- [ ] Check WebGL context limits
- [ ] Test with ad blockers enabled

---

## 📚 Additional Resources

### Documentation
- [Vite Docs](https://vitejs.dev/)
- [React Three Fiber](https://docs.pmnd.rs/react-three-fiber)
- [GSAP Docs](https://greensock.com/docs/)
- [Three.js Manual](https://threejs.org/manual/)

### Tools
- [GLSL Sandbox](http://glslsandbox.com/) - Test shaders
- [Shader Toy](https://www.shadertoy.com/) - Shader examples
- [WebGL Inspector](https://benvanik.github.io/WebGL-Inspector/) - Debug WebGL

### Communities
- [Three.js Discourse](https://discourse.threejs.org/)
- [React Three Fiber Discord](https://discord.gg/poimandres)
- [GSAP Forums](https://greensock.com/forums/)

---

## 🆘 Still Having Issues?

1. **Check the browser console** for error messages
2. **Review the README.md** for detailed documentation
3. **Try the QUICKSTART.md** for basic setup
4. **Search for similar issues** on GitHub/Stack Overflow
5. **Create a minimal reproduction** to isolate the problem

---

**Happy Coding! 🚀**

If all else fails, try turning it off and on again. It's not just a meme, it actually works! 😄
