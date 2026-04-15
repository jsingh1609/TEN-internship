import json
from typing import List, Dict
import math

class SkillsRecommender:
    def __init__(self):
        self.skills_db = self._initialize_skills_db()
        self.roles_db = self._initialize_roles_db()
        self.career_paths = self._initialize_career_paths()
        
    def _initialize_skills_db(self) -> Dict:
        """Initialize skills database with categories and metadata"""
        return {
            # Programming Languages
            "Python": {
                "category": "Programming",
                "difficulty": "beginner",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 95
            },
            "JavaScript": {
                "category": "Programming",
                "difficulty": "beginner",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 98
            },
            "Java": {
                "category": "Programming",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": [],
                "market_demand": 90
            },
            "C++": {
                "category": "Programming",
                "difficulty": "intermediate",
                "time_to_learn": 5,
                "prerequisites": [],
                "market_demand": 75
            },
            "TypeScript": {
                "category": "Programming",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["JavaScript"],
                "market_demand": 92
            },
            "Go": {
                "category": "Programming",
                "difficulty": "intermediate",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 85
            },
            "Rust": {
                "category": "Programming",
                "difficulty": "advanced",
                "time_to_learn": 6,
                "prerequisites": ["C++"],
                "market_demand": 78
            },
            
            # Web Development
            "React": {
                "category": "Frontend",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["JavaScript"],
                "market_demand": 96
            },
            "Vue.js": {
                "category": "Frontend",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["JavaScript"],
                "market_demand": 82
            },
            "Angular": {
                "category": "Frontend",
                "difficulty": "intermediate",
                "time_to_learn": 3,
                "prerequisites": ["JavaScript", "TypeScript"],
                "market_demand": 80
            },
            "Node.js": {
                "category": "Backend",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["JavaScript"],
                "market_demand": 94
            },
            "Express.js": {
                "category": "Backend",
                "difficulty": "beginner",
                "time_to_learn": 1,
                "prerequisites": ["Node.js"],
                "market_demand": 88
            },
            "Django": {
                "category": "Backend",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["Python"],
                "market_demand": 85
            },
            "Flask": {
                "category": "Backend",
                "difficulty": "beginner",
                "time_to_learn": 1,
                "prerequisites": ["Python"],
                "market_demand": 80
            },
            "HTML/CSS": {
                "category": "Frontend",
                "difficulty": "beginner",
                "time_to_learn": 2,
                "prerequisites": [],
                "market_demand": 100
            },
            
            # Data Science & ML
            "Machine Learning": {
                "category": "Data Science",
                "difficulty": "advanced",
                "time_to_learn": 6,
                "prerequisites": ["Python", "Statistics"],
                "market_demand": 96
            },
            "Deep Learning": {
                "category": "Data Science",
                "difficulty": "advanced",
                "time_to_learn": 6,
                "prerequisites": ["Machine Learning", "Python"],
                "market_demand": 92
            },
            "TensorFlow": {
                "category": "Data Science",
                "difficulty": "advanced",
                "time_to_learn": 3,
                "prerequisites": ["Python", "Machine Learning"],
                "market_demand": 88
            },
            "PyTorch": {
                "category": "Data Science",
                "difficulty": "advanced",
                "time_to_learn": 3,
                "prerequisites": ["Python", "Machine Learning"],
                "market_demand": 90
            },
            "Pandas": {
                "category": "Data Science",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": ["Python"],
                "market_demand": 92
            },
            "NumPy": {
                "category": "Data Science",
                "difficulty": "intermediate",
                "time_to_learn": 1,
                "prerequisites": ["Python"],
                "market_demand": 90
            },
            "SQL": {
                "category": "Database",
                "difficulty": "beginner",
                "time_to_learn": 2,
                "prerequisites": [],
                "market_demand": 98
            },
            "Statistics": {
                "category": "Data Science",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": [],
                "market_demand": 85
            },
            "Data Visualization": {
                "category": "Data Science",
                "difficulty": "beginner",
                "time_to_learn": 2,
                "prerequisites": ["Python"],
                "market_demand": 88
            },
            
            # Cloud & DevOps
            "AWS": {
                "category": "Cloud",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": [],
                "market_demand": 96
            },
            "Azure": {
                "category": "Cloud",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": [],
                "market_demand": 92
            },
            "Docker": {
                "category": "DevOps",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": [],
                "market_demand": 94
            },
            "Kubernetes": {
                "category": "DevOps",
                "difficulty": "advanced",
                "time_to_learn": 4,
                "prerequisites": ["Docker"],
                "market_demand": 90
            },
            "CI/CD": {
                "category": "DevOps",
                "difficulty": "intermediate",
                "time_to_learn": 2,
                "prerequisites": [],
                "market_demand": 92
            },
            "Git": {
                "category": "Tools",
                "difficulty": "beginner",
                "time_to_learn": 1,
                "prerequisites": [],
                "market_demand": 100
            },
            
            # Mobile Development
            "React Native": {
                "category": "Mobile",
                "difficulty": "intermediate",
                "time_to_learn": 3,
                "prerequisites": ["React", "JavaScript"],
                "market_demand": 86
            },
            "Flutter": {
                "category": "Mobile",
                "difficulty": "intermediate",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 84
            },
            "iOS Development": {
                "category": "Mobile",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": [],
                "market_demand": 82
            },
            "Android Development": {
                "category": "Mobile",
                "difficulty": "intermediate",
                "time_to_learn": 4,
                "prerequisites": ["Java"],
                "market_demand": 85
            },
            
            # Soft Skills
            "Communication": {
                "category": "Soft Skills",
                "difficulty": "beginner",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 100
            },
            "Project Management": {
                "category": "Soft Skills",
                "difficulty": "intermediate",
                "time_to_learn": 3,
                "prerequisites": [],
                "market_demand": 90
            },
            "Leadership": {
                "category": "Soft Skills",
                "difficulty": "intermediate",
                "time_to_learn": 6,
                "prerequisites": [],
                "market_demand": 95
            },
            "Agile/Scrum": {
                "category": "Soft Skills",
                "difficulty": "beginner",
                "time_to_learn": 1,
                "prerequisites": [],
                "market_demand": 88
            }
        }
    
    def _initialize_roles_db(self) -> Dict:
        """Initialize roles database with required skills"""
        return {
            "Frontend Developer": {
                "required_skills": ["HTML/CSS", "JavaScript", "React", "Git"],
                "preferred_skills": ["TypeScript", "Vue.js", "CI/CD"],
                "avg_salary": 75000,
                "growth_rate": 15
            },
            "Backend Developer": {
                "required_skills": ["Python", "SQL", "Node.js", "Git"],
                "preferred_skills": ["Django", "Flask", "Docker", "AWS"],
                "avg_salary": 85000,
                "growth_rate": 18
            },
            "Full Stack Developer": {
                "required_skills": ["HTML/CSS", "JavaScript", "Python", "React", "Node.js", "SQL", "Git"],
                "preferred_skills": ["Docker", "AWS", "TypeScript", "CI/CD"],
                "avg_salary": 95000,
                "growth_rate": 20
            },
            "Data Scientist": {
                "required_skills": ["Python", "Statistics", "Machine Learning", "SQL", "Pandas"],
                "preferred_skills": ["Deep Learning", "TensorFlow", "PyTorch", "Data Visualization", "AWS"],
                "avg_salary": 110000,
                "growth_rate": 25
            },
            "Machine Learning Engineer": {
                "required_skills": ["Python", "Machine Learning", "Deep Learning", "TensorFlow", "Git"],
                "preferred_skills": ["PyTorch", "Docker", "Kubernetes", "AWS", "MLOps"],
                "avg_salary": 125000,
                "growth_rate": 30
            },
            "DevOps Engineer": {
                "required_skills": ["Docker", "Kubernetes", "AWS", "CI/CD", "Git"],
                "preferred_skills": ["Python", "Azure", "Terraform", "Monitoring"],
                "avg_salary": 105000,
                "growth_rate": 22
            },
            "Mobile Developer": {
                "required_skills": ["JavaScript", "React Native", "Git"],
                "preferred_skills": ["Flutter", "iOS Development", "Android Development", "CI/CD"],
                "avg_salary": 90000,
                "growth_rate": 17
            },
            "Data Analyst": {
                "required_skills": ["SQL", "Python", "Data Visualization", "Statistics"],
                "preferred_skills": ["Pandas", "Excel", "Tableau", "Communication"],
                "avg_salary": 70000,
                "growth_rate": 16
            },
            "Cloud Architect": {
                "required_skills": ["AWS", "Azure", "Docker", "Kubernetes", "Networking"],
                "preferred_skills": ["Python", "Terraform", "Security", "CI/CD"],
                "avg_salary": 135000,
                "growth_rate": 28
            },
            "Product Manager": {
                "required_skills": ["Project Management", "Communication", "Agile/Scrum", "Leadership"],
                "preferred_skills": ["SQL", "Data Visualization", "UX Design"],
                "avg_salary": 115000,
                "growth_rate": 19
            }
        }
    
    def _initialize_career_paths(self) -> Dict:
        """Initialize common career transition paths"""
        return {
            "Frontend Developer": ["Full Stack Developer", "Mobile Developer"],
            "Backend Developer": ["Full Stack Developer", "DevOps Engineer", "Cloud Architect"],
            "Full Stack Developer": ["DevOps Engineer", "Cloud Architect", "Product Manager"],
            "Data Analyst": ["Data Scientist", "Machine Learning Engineer"],
            "Data Scientist": ["Machine Learning Engineer", "Cloud Architect"],
            "DevOps Engineer": ["Cloud Architect"],
            "Mobile Developer": ["Full Stack Developer"]
        }
    
    def get_all_roles(self) -> List[str]:
        """Get list of all available roles"""
        return list(self.roles_db.keys())
    
    def get_all_skills(self) -> List[str]:
        """Get list of all available skills"""
        return list(self.skills_db.keys())
    
    def _calculate_skill_gap(self, current_skills: List[str], target_role: str) -> Dict:
        """Calculate skill gap for target role"""
        if target_role not in self.roles_db:
            return {"error": "Target role not found"}
        
        role_data = self.roles_db[target_role]
        required = set(role_data['required_skills'])
        preferred = set(role_data['preferred_skills'])
        current = set(current_skills)
        
        missing_required = required - current
        missing_preferred = preferred - current
        
        return {
            "missing_required": list(missing_required),
            "missing_preferred": list(missing_preferred),
            "completion_percentage": (len(current & required) / len(required) * 100) if required else 100
        }
    
    def _score_skill(self, skill: str, target_role: str, current_skills: List[str], 
                     experience_level: str, timeline: int) -> float:
        """Score a skill recommendation"""
        if skill not in self.skills_db:
            return 0.0
        
        skill_data = self.skills_db[skill]
        role_data = self.roles_db[target_role]
        
        score = 0.0
        
        # Priority score (required > preferred)
        if skill in role_data['required_skills']:
            score += 50
        elif skill in role_data['preferred_skills']:
            score += 30
        
        # Market demand weight
        score += skill_data['market_demand'] * 0.2
        
        # Prerequisites met?
        prereqs = skill_data['prerequisites']
        prereqs_met = all(p in current_skills for p in prereqs)
        if prereqs_met:
            score += 20
        else:
            score -= 30  # Penalize if prerequisites not met
        
        # Time to learn fits timeline?
        if skill_data['time_to_learn'] <= timeline:
            score += 15
        else:
            score -= (skill_data['time_to_learn'] - timeline) * 5
        
        # Difficulty matches experience
        difficulty_match = {
            'beginner': {'beginner': 20, 'intermediate': 10, 'advanced': 5},
            'intermediate': {'beginner': 15, 'intermediate': 20, 'advanced': 10},
            'advanced': {'beginner': 5, 'intermediate': 15, 'advanced': 20}
        }
        score += difficulty_match.get(experience_level, {}).get(skill_data['difficulty'], 0)
        
        return max(0, score)
    
    def recommend(self, current_skills: List[str], target_role: str, 
                  experience_level: str = 'intermediate', timeline: int = 6) -> Dict:
        """Generate skill recommendations"""
        if target_role not in self.roles_db:
            return {"error": "Target role not found"}
        
        # Calculate skill gap
        gap = self._calculate_skill_gap(current_skills, target_role)
        
        # Get all missing skills
        all_missing = gap['missing_required'] + gap['missing_preferred']
        
        # Score each missing skill
        recommendations = []
        for skill in all_missing:
            score = self._score_skill(skill, target_role, current_skills, experience_level, timeline)
            skill_data = self.skills_db.get(skill, {})
            
            # Check prerequisites
            prereqs = skill_data.get('prerequisites', [])
            prereqs_met = all(p in current_skills for p in prereqs)
            
            recommendations.append({
                "skill": skill,
                "score": score,
                "category": skill_data.get('category', 'Unknown'),
                "difficulty": skill_data.get('difficulty', 'Unknown'),
                "time_to_learn_months": skill_data.get('time_to_learn', 0),
                "market_demand": skill_data.get('market_demand', 0),
                "prerequisites": prereqs,
                "prerequisites_met": prereqs_met,
                "is_required": skill in gap['missing_required'],
                "reason": "Required for role" if skill in gap['missing_required'] else "Highly valued for role"
            })
        
        # Sort by score
        recommendations.sort(key=lambda x: x['score'], reverse=True)
        
        # Create learning phases
        phases = self._create_learning_phases(recommendations, timeline)
        
        return {
            "target_role": target_role,
            "completion_percentage": gap['completion_percentage'],
            "total_missing_skills": len(all_missing),
            "recommendations": recommendations[:10],  # Top 10
            "learning_phases": phases,
            "estimated_timeline_months": self._estimate_timeline(recommendations[:10]),
            "role_info": self.roles_db[target_role]
        }
    
    def _create_learning_phases(self, recommendations: List[Dict], timeline: int) -> List[Dict]:
        """Create phased learning plan"""
        phases = []
        current_month = 0
        learned_skills = []
        
        # Phase 1: Foundations (prerequisites and basics)
        phase1_skills = [r for r in recommendations if r['difficulty'] == 'beginner' and r['prerequisites_met']][:3]
        if phase1_skills:
            phase1_duration = max([s['time_to_learn_months'] for s in phase1_skills])
            phases.append({
                "phase": 1,
                "title": "Foundation Skills",
                "duration_months": phase1_duration,
                "skills": [s['skill'] for s in phase1_skills],
                "start_month": current_month + 1
            })
            current_month += phase1_duration
            learned_skills.extend([s['skill'] for s in phase1_skills])
        
        # Phase 2: Core required skills
        phase2_skills = [r for r in recommendations if r['is_required'] and r['skill'] not in learned_skills][:3]
        if phase2_skills and current_month < timeline:
            phase2_duration = max([s['time_to_learn_months'] for s in phase2_skills])
            phases.append({
                "phase": 2,
                "title": "Core Skills",
                "duration_months": min(phase2_duration, timeline - current_month),
                "skills": [s['skill'] for s in phase2_skills],
                "start_month": current_month + 1
            })
            current_month += phase2_duration
            learned_skills.extend([s['skill'] for s in phase2_skills])
        
        # Phase 3: Advanced/Preferred
        phase3_skills = [r for r in recommendations if not r['is_required'] and r['skill'] not in learned_skills][:2]
        if phase3_skills and current_month < timeline:
            phase3_duration = max([s['time_to_learn_months'] for s in phase3_skills])
            phases.append({
                "phase": 3,
                "title": "Advanced Skills",
                "duration_months": min(phase3_duration, timeline - current_month),
                "skills": [s['skill'] for s in phase3_skills],
                "start_month": current_month + 1
            })
        
        return phases
    
    def _estimate_timeline(self, recommendations: List[Dict]) -> int:
        """Estimate total learning timeline"""
        if not recommendations:
            return 0
        
        # Consider parallel learning and prerequisites
        return sum([r['time_to_learn_months'] for r in recommendations[:5]]) // 2
    
    def get_career_path(self, current_role: str, target_role: str, current_skills: List[str]) -> Dict:
        """Get career path from current to target role"""
        # Direct path
        if current_role in self.career_paths and target_role in self.career_paths[current_role]:
            intermediate_roles = []
            path_type = "Direct"
        else:
            # Find intermediate role
            intermediate_roles = []
            path_type = "Multi-step"
            
            for role, next_roles in self.career_paths.items():
                if current_role == role or current_role == "":
                    if target_role in next_roles:
                        intermediate_roles = [role] if current_role != role else []
                        break
        
        # Calculate readiness for each step
        steps = []
        
        if current_role:
            current_gap = self._calculate_skill_gap(current_skills, current_role)
            steps.append({
                "role": current_role,
                "status": "current",
                "readiness": current_gap['completion_percentage']
            })
        
        for inter_role in intermediate_roles:
            inter_gap = self._calculate_skill_gap(current_skills, inter_role)
            steps.append({
                "role": inter_role,
                "status": "intermediate",
                "readiness": inter_gap['completion_percentage']
            })
        
        target_gap = self._calculate_skill_gap(current_skills, target_role)
        steps.append({
            "role": target_role,
            "status": "target",
            "readiness": target_gap['completion_percentage']
        })
        
        return {
            "path_type": path_type,
            "steps": steps,
            "total_steps": len(steps),
            "overall_readiness": target_gap['completion_percentage']
        }
