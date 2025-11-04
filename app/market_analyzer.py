import json
from pathlib import Path
from typing import Dict, List, Optional

class MarketAnalyzer:
    """Analyze market demand and trends for skills"""
    
    def __init__(self):
        # Load market demand data
        demand_path = Path(__file__).parent.parent / "data" / "market_demand.json"
        with open(demand_path, 'r') as f:
            self.market_data = json.load(f)
        
        # Load job roles data
        roles_path = Path(__file__).parent.parent / "data" / "job_roles.json"
        with open(roles_path, 'r') as f:
            self.job_roles = json.load(f)
    
    def get_skill_demand(self, skill: str) -> Optional[Dict]:
        """Get market demand data for a specific skill"""
        # Try exact match first
        if skill in self.market_data:
            return self.market_data[skill]
        
        # Try case-insensitive match
        for key in self.market_data.keys():
            if key.lower() == skill.lower():
                return self.market_data[key]
        
        # Return default data for unknown skills
        return {
            "demand_score": 50,
            "growth_rate": 0,
            "job_postings": 1000,
            "trend": "unknown",
            "saturation": "unknown",
            "avg_salary": 75000
        }
    
    def calculate_priority_score(self, skill: str) -> float:
        """
        Calculate priority score for learning a skill
        Formula: priority = (demand_score * 0.6) + (growth_rate * 2.0) + (saturation_penalty)
        """
        demand_data = self.get_skill_demand(skill)
        
        # Base score from demand
        demand_component = demand_data["demand_score"] * 0.6
        
        # Growth potential
        growth_component = demand_data["growth_rate"] * 2.0
        
        # Saturation penalty
        saturation_penalties = {
            "very_high": -15,
            "high": -10,
            "medium": 0,
            "low": 5,
            "unknown": 0
        }
        saturation_penalty = saturation_penalties.get(
            demand_data["saturation"], 0
        )
        
        priority = demand_component + growth_component + saturation_penalty
        
        return round(priority, 2)
    
    def rank_skills(self, skills: List[str]) -> List[Dict]:
        """Rank skills by priority score"""
        ranked = []
        
        for skill in skills:
            demand_data = self.get_skill_demand(skill)
            priority = self.calculate_priority_score(skill)
            
            ranked.append({
                "skill": skill,
                "priority_score": priority,
                "demand_score": demand_data["demand_score"],
                "growth_rate": demand_data["growth_rate"],
                "trend": demand_data["trend"],
                "saturation": demand_data["saturation"],
                "job_postings": demand_data["job_postings"],
                "avg_salary": demand_data["avg_salary"]
            })
        
        # Sort by priority score (descending)
        ranked.sort(key=lambda x: x["priority_score"], reverse=True)
        
        return ranked
    
    def compare_with_role(self, user_skills: List[str], target_role: str) -> Dict:
        """Compare user skills with target job role requirements"""
        if target_role not in self.job_roles:
            return {
                "error": f"Role '{target_role}' not found",
                "available_roles": list(self.job_roles.keys())
            }
        
        role_data = self.job_roles[target_role]
        required_skills = set(role_data["required_skills"])
        nice_to_have_skills = set(role_data.get("nice_to_have", []))
        user_skills_set = set(user_skills)
        
        # Calculate matches
        matched_required = user_skills_set.intersection(required_skills)
        missing_required = required_skills - user_skills_set
        matched_nice = user_skills_set.intersection(nice_to_have_skills)
        missing_nice = nice_to_have_skills - user_skills_set
        
        # Calculate readiness percentage
        required_match_percent = (
            len(matched_required) / len(required_skills) * 100
            if required_skills else 0
        )
        
        return {
            "target_role": target_role,
            "experience_level": role_data["experience_level"],
            "avg_salary": role_data["avg_salary_usd"],
            "readiness_percentage": round(required_match_percent, 1),
            "matched_required_skills": list(matched_required),
            "missing_required_skills": list(missing_required),
            "matched_nice_to_have": list(matched_nice),
            "missing_nice_to_have": list(missing_nice),
            "total_required": len(required_skills),
            "total_matched": len(matched_required)
        }
    
    def get_all_roles(self) -> List[str]:
        """Get list of all available job roles"""
        return list(self.job_roles.keys())