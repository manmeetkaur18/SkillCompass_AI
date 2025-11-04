import json
import re
from typing import List, Dict, Set
from pathlib import Path

class SkillsExtractor:
    def __init__(self):
        # Load skills database
        db_path = Path(__file__).parent.parent / "data" / "skills_database.json"
        with open(db_path, 'r') as f:
            self.skills_db = json.load(f)
        
        # Flatten all skills into a set for fast lookup
        self.all_skills = set()
        for category, skills in self.skills_db.items():
            if category != "skill_aliases":
                self.all_skills.update([s.lower() for s in skills])
    
    def normalize_skill(self, skill: str) -> str:
        """Normalize skill names using aliases"""
        skill = skill.strip()
        aliases = self.skills_db.get("skill_aliases", {})
        
        # Check if skill has an alias
        for alias, canonical in aliases.items():
            if skill.lower() == alias.lower():
                return canonical
        
        return skill
    
    def extract_by_keywords(self, text: str) -> Set[str]:
        """Extract skills using keyword matching"""
        found_skills = set()
        text_lower = text.lower()
        
        # Search for each skill in the text
        for skill in self.all_skills:
            # Use word boundaries to avoid partial matches
            pattern = r'\b' + re.escape(skill) + r'\b'
            if re.search(pattern, text_lower, re.IGNORECASE):
                # Find the original case from text
                match = re.search(pattern, text, re.IGNORECASE)
                if match:
                    found_skills.add(match.group())
        
        return found_skills
    
    def extract_by_context(self, text: str) -> Set[str]:
        """Extract skills by looking at common resume patterns"""
        found_skills = set()
        
        # Common patterns in resumes
        patterns = [
            r'Skills?[:\s]+([^\n]+)',
            r'Technologies?[:\s]+([^\n]+)',
            r'Tools?[:\s]+([^\n]+)',
            r'Proficient in[:\s]+([^\n]+)',
            r'Experience (?:with|in)[:\s]+([^\n]+)',
        ]
        
        for pattern in patterns:
            matches = re.finditer(pattern, text, re.IGNORECASE | re.MULTILINE)
            for match in matches:
                skills_line = match.group(1)
                # Split by common delimiters
                potential_skills = re.split(r'[,;|•·]', skills_line)
                
                for skill in potential_skills:
                    skill = skill.strip()
                    if skill.lower() in self.all_skills:
                        found_skills.add(skill)
        
        return found_skills
    
    def extract_skills(self, resume_text: str) -> Dict[str, List[str]]:
        """Main extraction function using keyword matching only"""
        # Extract using both methods
        keyword_skills = self.extract_by_keywords(resume_text)
        context_skills = self.extract_by_context(resume_text)
        
        # Combine and normalize
        all_skills = keyword_skills.union(context_skills)
        normalized_skills = [self.normalize_skill(s) for s in all_skills]
        
        # Remove duplicates and sort
        unique_skills = sorted(list(set(normalized_skills)))
        
        # Categorize skills
        categorized = self._categorize_skills(unique_skills)
        
        return {
            "all_skills": unique_skills,
            "categorized": categorized,
            "count": len(unique_skills)
        }
    
    def _categorize_skills(self, skills: List[str]) -> Dict[str, List[str]]:
        """Organize skills by category"""
        categorized = {}
        
        for category, skill_list in self.skills_db.items():
            if category == "skill_aliases":
                continue
            
            category_skills = [
                s for s in skills 
                if s.lower() in [sl.lower() for sl in skill_list]
            ]
            
            if category_skills:
                categorized[category] = category_skills
        
        return categorized