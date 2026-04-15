from flask import Flask, request, jsonify
from flask_cors import CORS
import json
from datetime import datetime
from recommendation_engine import SkillsRecommender

app = Flask(__name__)
CORS(app)

# Initialize recommendation engine
recommender = SkillsRecommender()

@app.route('/api/health', methods=['GET'])
def health_check():
    return jsonify({"status": "healthy", "timestamp": datetime.now().isoformat()})

@app.route('/api/roles', methods=['GET'])
def get_roles():
    """Get all available career roles"""
    roles = recommender.get_all_roles()
    return jsonify({"roles": roles})

@app.route('/api/skills', methods=['GET'])
def get_all_skills():
    """Get all available skills"""
    skills = recommender.get_all_skills()
    return jsonify({"skills": skills})

@app.route('/api/recommend', methods=['POST'])
def get_recommendations():
    """Get skill recommendations based on user input"""
    data = request.json
    
    current_skills = data.get('current_skills', [])
    target_role = data.get('target_role', '')
    experience_level = data.get('experience_level', 'intermediate')
    timeline = data.get('timeline', 6)  # months
    
    if not target_role:
        return jsonify({"error": "Target role is required"}), 400
    
    # Get recommendations
    recommendations = recommender.recommend(
        current_skills=current_skills,
        target_role=target_role,
        experience_level=experience_level,
        timeline=timeline
    )
    
    return jsonify(recommendations)

@app.route('/api/career-path', methods=['POST'])
def get_career_path():
    """Get detailed career path visualization"""
    data = request.json
    
    current_role = data.get('current_role', '')
    target_role = data.get('target_role', '')
    current_skills = data.get('current_skills', [])
    
    path = recommender.get_career_path(
        current_role=current_role,
        target_role=target_role,
        current_skills=current_skills
    )
    
    return jsonify(path)

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
