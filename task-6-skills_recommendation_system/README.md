# 🎯 Skills Recommendation System

A full-stack web application that provides AI-powered career planning and skills recommendations based on your current skills and career goals.

## 🌟 Features

- **Smart Skill Gap Analysis**: Identifies missing skills for your target role
- **Personalized Recommendations**: ML-based scoring considers market demand, prerequisites, difficulty, and timeline
- **Phased Learning Plans**: Breaks down learning into manageable phases
- **Career Path Visualization**: Shows readiness percentage and career progression
- **40+ Skills Database**: Covers programming, data science, cloud, DevOps, and soft skills
- **10+ Career Roles**: From frontend developer to cloud architect
- **Modern UI**: Beautiful, responsive interface with glass morphism design

## 🏗️ Architecture

### Backend (Flask + Python)
- **RESTful API** with Flask
- **Recommendation Engine** with multi-factor scoring algorithm:
  - Role requirements matching (required vs. preferred skills)
  - Market demand weighting
  - Prerequisite checking
  - Timeline feasibility
  - Experience level matching
  - Difficulty scoring
- **Career Path Analysis** with transition pathways
- **Learning Phase Generation** with optimized sequencing

### Frontend (React + TailwindCSS)
- **3-Step Wizard**: Current skills → Target role → Recommendations
- **Interactive UI Components**:
  - Multi-select skill badges
  - Career role selector
  - Experience level picker
  - Timeline slider
  - Circular progress indicators
- **Responsive Design**: Works on desktop, tablet, and mobile

## 📊 Recommendation Algorithm

The system uses a **hybrid scoring approach**:

```
Score = Priority(50) + Market_Demand(0.2x) + Prerequisites_Bonus(20) 
        + Timeline_Fit(15) + Difficulty_Match(20)
```

**Factors:**
1. **Priority Weight**: Required skills (50 pts) > Preferred skills (30 pts)
2. **Market Demand**: 0-100 scale multiplied by 0.2
3. **Prerequisites**: +20 if met, -30 if not met
4. **Timeline**: +15 if fits within timeline, penalized if exceeds
5. **Difficulty Match**: Experience level alignment (0-20 pts)

## 🚀 Getting Started

### Prerequisites
- Python 3.8+
- pip
- Modern web browser

### Installation & Setup

1. **Clone/Navigate to project directory**
```bash
cd skills-recommendation-system
```

2. **Install Python dependencies**
```bash
cd backend
pip install -r requirements.txt
```

3. **Start the backend server**
```bash
python app.py
```
Backend runs at: `http://localhost:5000`

4. **Open the frontend** (in a new terminal)
```bash
cd ../frontend
python -m http.server 8000
```
Frontend runs at: `http://localhost:8000`

Or simply open `frontend/index.html` directly in your browser.

## 📁 Project Structure

```
skills-recommendation-system/
├── backend/
│   ├── app.py                      # Flask API server
│   ├── recommendation_engine.py    # Core recommendation logic
│   └── requirements.txt            # Python dependencies
├── frontend/
│   └── index.html                  # React SPA
├── data/                           # (Future: datasets)
└── README.md
```

## 🎮 How to Use

### Step 1: Select Current Skills
- Search and select all skills you currently possess
- Skills are categorized by type (Programming, Frontend, Backend, etc.)
- Select as many as applicable

### Step 2: Define Target Role & Preferences
- Choose your target career role from 10+ options
- Set your experience level (Beginner/Intermediate/Advanced)
- Adjust timeline slider (3-24 months)

### Step 3: View Recommendations
- **Readiness Score**: See how close you are to the target role
- **Learning Phases**: Get a phased plan (Foundation → Core → Advanced)
- **Top Recommendations**: View ranked skills with:
  - Priority level (Required/Preferred)
  - Learning time
  - Market demand
  - Prerequisites
  - Rationale

## 🔧 API Endpoints

### GET `/api/health`
Health check endpoint

### GET `/api/roles`
Returns all available career roles

### GET `/api/skills`
Returns all available skills in the database

### POST `/api/recommend`
Get skill recommendations

**Request Body:**
```json
{
  "current_skills": ["Python", "JavaScript", "Git"],
  "target_role": "Full Stack Developer",
  "experience_level": "intermediate",
  "timeline": 6
}
```

**Response:**
```json
{
  "target_role": "Full Stack Developer",
  "completion_percentage": 42.8,
  "total_missing_skills": 4,
  "recommendations": [...],
  "learning_phases": [...],
  "estimated_timeline_months": 8,
  "role_info": {...}
}
```

### POST `/api/career-path`
Get career transition path analysis

## 🗃️ Database

Currently uses in-memory Python dictionaries. Future enhancements:

- **Skills Database** (40+ skills):
  - Technical skills (Python, React, TensorFlow, AWS, etc.)
  - Soft skills (Communication, Leadership, Project Management)
  - Metadata: category, difficulty, learning time, prerequisites, market demand

- **Roles Database** (10+ roles):
  - Required vs. Preferred skills
  - Average salary
  - Growth rate

- **Career Paths Database**:
  - Common transition pathways between roles

## 🎨 Design Features

- **Glass Morphism**: Modern translucent cards with backdrop blur
- **Gradient Background**: Purple gradient for visual appeal
- **Smooth Animations**: Fade-in effects and hover states
- **Progress Visualization**: Circular progress indicators
- **Responsive Layout**: Grid-based responsive design
- **Color-Coded Tags**: Difficulty levels and priorities

## 📈 Future Enhancements

### Phase 1: Data Enhancement
- [ ] Real job market data scraping (LinkedIn, Indeed)
- [ ] Learning resource recommendations (Coursera, Udemy links)
- [ ] Salary data integration
- [ ] User feedback loop

### Phase 2: Advanced Features
- [ ] User authentication and profiles
- [ ] Save/track progress
- [ ] Interactive skill roadmap visualization
- [ ] Collaborative filtering (users with similar paths)
- [ ] Certificate recommendations

### Phase 3: ML Improvements
- [ ] Deep learning skill embeddings
- [ ] Graph neural networks for skill relationships
- [ ] Reinforcement learning for path optimization
- [ ] NLP for job description parsing

### Phase 4: Scale & Deploy
- [ ] PostgreSQL database
- [ ] Redis caching
- [ ] Docker containerization
- [ ] AWS/Heroku deployment
- [ ] Analytics dashboard

## 🧪 Testing Ideas

1. **Unit Tests**: Test recommendation scoring logic
2. **Integration Tests**: Test API endpoints
3. **User Studies**: Gather feedback on recommendations
4. **A/B Testing**: Compare algorithm variations
5. **Metrics**: Track recommendation acceptance rate

## 📊 Evaluation Metrics

- **Precision@K**: How many of top-K recommendations are relevant?
- **Coverage**: Percentage of skill gaps addressed
- **Diversity**: Variety in skill categories recommended
- **User Satisfaction**: Survey-based feedback
- **Path Feasibility**: Can timeline estimates be met?

## 🤝 Contributing

This is an internship project, but suggestions are welcome!

## 📝 License

MIT License - feel free to use for your internship project.

## 👤 Author

Created as an internship project for skills recommendation system.

## 🙏 Acknowledgments

- Skills taxonomy inspired by O*NET and LinkedIn
- UI design using TailwindCSS
- Backend powered by Flask and Python

---

**Note**: This is a prototype/MVP. For production use, implement proper database, authentication, error handling, and testing.
