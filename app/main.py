from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Dict, List, Optional
import logging

from app.text_parser import ResumeParser
from app.skills_extractor import SkillsExtractor
from app.market_analyzer import MarketAnalyzer

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Initialize FastAPI
app = FastAPI(
    title="SkillCompass AI API",
    description="Resume skill extraction and analysis",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify exact origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize extractors and analyzer
parser = ResumeParser()
extractor = SkillsExtractor()
analyzer = MarketAnalyzer()

# ============================================
# RESPONSE MODELS
# ============================================

class SkillsResponse(BaseModel):
    all_skills: List[str]
    categorized: Dict[str, List[str]]
    count: int
    resume_text_preview: str

class HealthResponse(BaseModel):
    status: str
    message: str

class SkillsListRequest(BaseModel):
    skills: List[str]

class RoleComparisonRequest(BaseModel):
    skills: List[str]
    target_role: str

class RoleComparisonResponse(BaseModel):
    target_role: str
    experience_level: str
    avg_salary: int
    readiness_percentage: float
    matched_required_skills: List[str]
    missing_required_skills: List[str]
    matched_nice_to_have: List[str]
    missing_nice_to_have: List[str]
    total_required: int
    total_matched: int

class SkillRanking(BaseModel):
    skill: str
    priority_score: float
    demand_score: int
    growth_rate: int
    trend: str
    saturation: str
    job_postings: int
    avg_salary: int

class RankedSkillsResponse(BaseModel):
    ranked_skills: List[SkillRanking]
    count: int

# ============================================
# ROUTES
# ============================================

@app.get("/", response_model=HealthResponse)
async def root():
    return {
        "status": "online",
        "message": "SkillCompass AI API is running"
    }

@app.get("/health", response_model=HealthResponse)
async def health_check():
    return {
        "status": "healthy",
        "message": "All systems operational"
    }

@app.post("/api/extract-skills", response_model=SkillsResponse)
async def extract_skills(file: UploadFile = File(...)):
    """
    Extract skills from uploaded resume (PDF or DOCX)
    """
    try:
        # Validate file type
        if not file.filename.lower().endswith(('.pdf', '.docx')):
            raise HTTPException(
                status_code=400,
                detail="Invalid file format. Only PDF and DOCX allowed."
            )
        
        # Read file content
        file_content = await file.read()
        
        # Extract text from resume
        logger.info(f"Parsing resume: {file.filename}")
        resume_text = parser.extract_text(file_content, file.filename)
        
        if not resume_text or len(resume_text) < 50:
            raise HTTPException(
                status_code=400,
                detail="Could not extract sufficient text from resume"
            )
        
        # Extract skills
        logger.info("Extracting skills...")
        skills_data = extractor.extract_skills(resume_text)
        
        # Return response
        return {
            **skills_data,
            "resume_text_preview": resume_text[:200] + "..."
        }
    
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        logger.error(f"Error processing resume: {str(e)}")
        raise HTTPException(status_code=500, detail=f"Processing error: {str(e)}")

@app.post("/api/test-skills")
async def test_skills_extraction(text: str):
    """
    Test endpoint: Extract skills from plain text
    """
    try:
        skills_data = extractor.extract_skills(text)
        return skills_data
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.get("/api/roles", response_model=List[str])
async def get_available_roles():
    """
    Get list of all available job roles
    """
    return analyzer.get_all_roles()

@app.post("/api/rank-skills", response_model=RankedSkillsResponse)
async def rank_skills(request: SkillsListRequest):
    """
    Rank skills by market priority
    """
    try:
        ranked = analyzer.rank_skills(request.skills)
        return {
            "ranked_skills": ranked,
            "count": len(ranked)
        }
    except Exception as e:
        logger.error(f"Error ranking skills: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/compare-role")
async def compare_with_role(request: RoleComparisonRequest):
    """
    Compare user skills with target job role
    """
    try:
        comparison = analyzer.compare_with_role(
            request.skills,
            request.target_role
        )
        
        if "error" in comparison:
            raise HTTPException(status_code=404, detail=comparison["error"])
        
        return comparison
    except HTTPException:
        raise
    except Exception as e:
        logger.error(f"Error comparing with role: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze-resume-full")
async def analyze_resume_full(
    file: UploadFile = File(...),
    target_role: Optional[str] = None
):
    """
    Complete resume analysis with skill extraction, ranking, and role comparison
    """
    try:
        # Extract skills from resume
        file_content = await file.read()
        resume_text = parser.extract_text(file_content, file.filename)
        skills_data = extractor.extract_skills(resume_text)
        
        user_skills = skills_data["all_skills"]
        
        # Rank skills by market priority
        ranked_skills = analyzer.rank_skills(user_skills)
        
        # Role comparison (if provided)
        role_comparison = None
        if target_role:
            role_comparison = analyzer.compare_with_role(user_skills, target_role)
        
        return {
            "extracted_skills": skills_data,
            "market_analysis": {
                "ranked_skills": ranked_skills,
                "top_skills": ranked_skills[:5]  # Top 5 highest priority
            },
            "role_comparison": role_comparison,
            "available_roles": analyzer.get_all_roles()
        }
    
    except Exception as e:
        logger.error(f"Error in full analysis: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))