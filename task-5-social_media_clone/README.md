# 🎨 Vibegram - Instagram Clone

**Full-Stack Social Media Application for Vibecode Internship**

Built with Django REST Framework + React | Complete Instagram-like experience with posts, stories, comments, likes, messages, and more!

---

## 📸 Features

### ✨ Core Features
- **User Profiles** - Customizable profiles with bio, avatar, follower/following counts
- **Posts** - Create, view, like, and comment on photo posts
- **Stories** - 24-hour expiring content (like Instagram Stories)
- **Feed** - Personalized feed with posts from followed users
- **Explore** - Discover new content and users
- **Messages** - Direct messaging between users
- **Reels** - Video content section (UI implemented)
- **Search** - Find users across the platform
- **Notifications** - Activity updates and interactions
- **Comments** - Nested commenting system
- **Likes** - Double-tap to like posts
- **Responsive Design** - Perfect on mobile, tablet, and desktop

### 🎯 Technical Highlights
- **Backend**: Django 4.2 + Django REST Framework
- **Frontend**: React with Hooks (useState, useEffect, useRef)
- **Database**: SQLite (easily switchable to PostgreSQL)
- **API**: RESTful API with proper serialization
- **Authentication Ready**: User model extended from AbstractUser
- **Real-time Updates**: Live feed refresh and interactions
- **Optimized Performance**: Lazy loading, intersection observers
- **Professional UI**: Instagram-inspired design with custom animations

---

## 🚀 Quick Start

### Prerequisites
- Python 3.8+
- Node.js 14+ & npm
- Git

### Backend Setup

```bash
# 1. Clone the repository
git clone <your-repo-url>
cd vibegram-instagram-clone

# 2. Create virtual environment
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# 3. Install dependencies
pip install django djangorestframework django-cors-headers pillow

# 4. Run migrations
python manage.py makemigrations
python manage.py migrate

# 5. Populate demo data
python manage.py populate_data

# 6. Create superuser (for admin panel)
python manage.py createsuperuser

# 7. Run development server
python manage.py runserver
```

Backend will be available at `http://localhost:8000`
Admin panel at `http://localhost:8000/admin`

### Frontend Setup

```bash
# 1. Navigate to frontend directory
cd frontend

# 2. Install dependencies
npm install react react-dom lucide-react

# 3. Install development tools
npm install -D vite @vitejs/plugin-react

# 4. Create vite.config.js
cat > vite.config.js << 'EOF'
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000
  }
})
EOF

# 5. Update package.json scripts
npm pkg set scripts.dev="vite"
npm pkg set scripts.build="vite build"
npm pkg set scripts.preview="vite preview"

# 6. Create index.html
cat > index.html << 'EOF'
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Vibegram - Instagram Clone</title>
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
EOF

# 7. Create main.jsx
cat > src/main.jsx << 'EOF'
import React from 'react'
import ReactDOM from 'reactDOM/client'
import App from './App'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)
EOF

# 8. Start development server
npm run dev
```

Frontend will be available at `http://localhost:3000`

---

## 📁 Project Structure

```
vibegram-instagram-clone/
├── api/                          # Django app
│   ├── migrations/               # Database migrations
│   ├── management/commands/      # Custom management commands
│   │   └── populate_data.py     # Demo data population
│   ├── admin.py                 # Admin interface config
│   ├── models.py                # Database models
│   ├── serializers.py           # DRF serializers
│   ├── views.py                 # API endpoints
│   └── urls.py                  # API routing
├── vibegram_backend/             # Django project
│   ├── settings.py              # Project settings
│   ├── urls.py                  # Main URL routing
│   └── wsgi.py                  # WSGI config
├── frontend/                     # React app
│   ├── src/
│   │   ├── App.jsx              # Main React component
│   │   └── main.jsx             # Entry point
│   ├── package.json             # Dependencies
│   └── vite.config.js           # Vite configuration
├── db.sqlite3                    # SQLite database
└── manage.py                     # Django management

```

---

## 🔌 API Endpoints

### Users
- `GET /api/users/` - List all users
- `GET /api/users/{id}/` - Get user details
- `PATCH /api/users/{id}/` - Update user profile
- `GET /api/users/{id}/posts/` - Get user's posts
- `GET /api/users/{id}/followers/` - Get followers
- `GET /api/users/{id}/following/` - Get following
- `GET /api/users/?search=query` - Search users

### Posts
- `GET /api/posts/` - List all posts
- `POST /api/posts/` - Create new post
- `GET /api/posts/{id}/` - Get post details
- `POST /api/posts/{id}/like/` - Like a post
- `POST /api/posts/{id}/unlike/` - Unlike a post
- `GET /api/posts/{id}/comments/` - Get post comments
- `GET /api/posts/feed/` - Get personalized feed

### Comments
- `GET /api/comments/` - List all comments
- `POST /api/comments/` - Create new comment
- `DELETE /api/comments/{id}/` - Delete comment

### Stories
- `GET /api/stories/` - List active stories
- `POST /api/stories/` - Create new story
- `DELETE /api/stories/{id}/` - Delete story

### Messages
- `GET /api/messages/` - List all messages
- `POST /api/messages/` - Send message
- `GET /api/messages/conversations/` - Get conversation list
- `GET /api/messages/with_user/?user_id=X` - Get messages with specific user

### Follows
- `GET /api/follows/` - List all follows
- `POST /api/follows/` - Follow user
- `DELETE /api/follows/{id}/` - Unfollow user

---

## 💾 Database Schema

### User Model
```python
- id (AutoField)
- username (CharField)
- email (EmailField)
- first_name (CharField)
- last_name (CharField)
- bio (TextField)
- avatar (URLField)
- followers_count (IntegerField)
- following_count (IntegerField)
```

### Post Model
```python
- id (AutoField)
- user (ForeignKey → User)
- image (URLField)
- caption (TextField)
- location (CharField)
- likes_count (IntegerField)
- comments_count (IntegerField)
- created_at (DateTimeField)
- updated_at (DateTimeField)
```

### Comment, Like, Story, Follow, Message
See `api/models.py` for complete schema.

---

## 🎨 UI/UX Features

### Advanced Interactions
- Seamless image zooming on feed posts
- Share Modal allowing direct post forwarding into DMs
- Expandable Emoji Picker with a curated grid of 50+ emojis
- Mock Audio and Video Calling system with real-time UI simulations
- Interactive 'More' navigation menu with issue reporting flow
- Functional local image attachment logic in messages

### Animations & Aesthetics
- Immersive Three.js Animated Background featuring tracking particles and rotating glass torus halos
- Glassmorphic floating UI elements and semi-transparent sidebars
- Slide-up fade on scroll
- Staggered grid loading for seamless profile rendering
- Smooth hover scale transitions
- Huge double-tap heart popping animation
- Story ring gradients

### Responsive Design
- Mobile-first approach
- Adaptive navigation (bottom nav on mobile, sidebar on desktop)
- Responsive grid layouts
- Touch-optimized interactions

### Performance
- Intersection Observer for lazy loading
- Image optimization
- Minimal re-renders
- Efficient state management

---

## 🧪 Testing

### Test the Backend

```bash
# Test API endpoints
python manage.py test

# Access admin panel
python manage.py runserver
# Visit http://localhost:8000/admin

# Test individual endpoints with curl
curl http://localhost:8000/api/posts/feed/
curl http://localhost:8000/api/users/
curl http://localhost:8000/api/stories/
```

### Test the Frontend

1. Open `http://localhost:3000`
2. Navigate through different views (Home, Search, Explore, Reels, Messages, Profile)
3. Test interactions:
   - Like/unlike posts
   - Create new posts
   - Edit profile
   - Search for users
   - View stories
   - Send messages

---

## 🚢 Deployment

### Backend (Django)

#### Option 1: Heroku
```bash
# Install dependencies
pip install gunicorn dj-database-url whitenoise

# Create Procfile
echo "web: gunicorn vibegram_backend.wsgi" > Procfile

# Create runtime.txt
echo "python-3.11.0" > runtime.txt

# Update settings.py for production
# - Set DEBUG = False
# - Add Heroku domain to ALLOWED_HOSTS
# - Configure database with dj-database-url

# Deploy
heroku create vibegram-app
git push heroku main
heroku run python manage.py migrate
heroku run python manage.py populate_data
```

#### Option 2: Railway/Render
Similar to Heroku, update settings and deploy via Git.

### Frontend (React)

#### Option 1: Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
# Update API_BASE_URL to production backend URL
```

#### Option 2: Netlify
```bash
npm run build
# Deploy dist/ folder to Netlify
```

---

## 🛠️ Development Tips

### Adding New Features

1. **Backend**: Add model → Create migration → Update serializer → Create view → Add URL
2. **Frontend**: Update API helper → Create component → Add to view router

### Common Issues

**CORS Errors**: Ensure `django-cors-headers` is installed and `CORS_ALLOW_ALL_ORIGINS = True` in settings

**Port Already in Use**: 
```bash
# Kill process on port 8000
lsof -ti:8000 | xargs kill -9
```

**Database Locked**: Close all connections and restart server

---

## 📝 Future Enhancements

- [ ] Real authentication (JWT/OAuth)
- [ ] WebSocket for real-time messaging
- [ ] Video upload for Reels
- [ ] Push notifications
- [ ] Image filters and editing
- [ ] Hashtag ranking system
- [x] Saved posts collection  *(Completed)*
- [x] In-app post sharing to DMs *(Completed)*
- [ ] Multiple image carousel
- [ ] Story replies
- [ ] Direct message reactions

---

## 👨‍💻 Author

**Vibecode Intern**
- GitHub: [Your GitHub]
- LinkedIn: [Your LinkedIn]
- Email: intern@vibecode.com

---

## 📄 License

This project is created for educational purposes as part of the Vibecode Internship Program.

---

## 🙏 Acknowledgments

- Instagram for UI/UX inspiration
- Vibecode for the internship opportunity
- React and Django communities

---

**Made with ❤️ in Lucknow, UP**
