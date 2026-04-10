# 🚀 QUICK START GUIDE

Get your Liquid Distortion Social Feed running in 3 steps!

## Step 1: Install Dependencies

Open your terminal in this project folder and run:

```bash
npm install
```

This will install all required packages (React, Three.js, GSAP, etc.)

---

## Step 2: Start Development Server

```bash
npm run dev
```

Your app will automatically open at **http://localhost:3000**

You should see:
- 3 social media feed items with liquid distortion effects
- Hover over images to see the shader effects
- Scroll down to see GSAP animations

---

## Step 3: Customize (Optional)

### Change Shader Effects

Open `src/App.jsx` and modify the shaderType:

```jsx
// Try these different effects:
shaderType="liquidDistortion"  // Default organic distortion
shaderType="glassRefraction"   // Glass-like effect
shaderType="magneticField"     // Magnetic pull
shaderType="kaleidoscope"      // Symmetrical patterns
shaderType="rgbSplit"          // Color separation
shaderType="pixelSort"         // Glitch effect
shaderType="bubbleLens"        // Magnifying bubble
```

### Add Your Own Images

In `src/social-media-feed-item.jsx`, find the `posts` array and replace the `imageUrl`:

```javascript
const posts = [
  {
    id: 1,
    imageUrl: 'YOUR_IMAGE_URL_HERE',  // Change this
    username: 'your_username',
    caption: 'Your caption here',
    likes: 1000,
    timestamp: '1h ago'
  }
];
```

### Change Colors

Edit the styles in `src/social-media-feed-item.jsx`:

```javascript
.feed-item {
  background: linear-gradient(135deg, #YOUR_COLOR 0%, #YOUR_COLOR 100%);
}
```

---

## 🎯 What You're Seeing

### Interactive Features:
1. **Hover Effects** - Move your cursor over the images
2. **Scroll Animations** - Scroll down to see staggered reveals
3. **Like Button** - Click to see hover states
4. **Responsive Design** - Resize your browser window

### Technical Stack:
- ⚛️ React 18
- 🎨 Three.js + React Three Fiber (WebGL)
- 📜 GSAP (Animations)
- ⚡ Vite (Build tool)

---

## 🔧 Common Commands

```bash
npm run dev      # Start development server
npm run build    # Build for production
npm run preview  # Preview production build
```

---

## 💡 Next Steps

1. **Read the full README.md** for detailed documentation
2. **Explore additional-shaders.js** for 6 bonus shader effects
3. **Customize the design** to match your style
4. **Add real data** from your API or database

---

## ❓ Need Help?

Check these files:
- `README.md` - Full documentation
- `src/social-media-feed-item.jsx` - Main component code
- `src/additional-shaders.js` - Extra shader examples

---

**That's it! You're ready to go! 🎉**

Enjoy creating with WebGL shaders!
