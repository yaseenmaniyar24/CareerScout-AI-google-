from fastapi import APIRouter, HTTPException
from ..models.schemas import UserProfile
from ..services.gemini_service import GeminiService

router = APIRouter(prefix="/api/profile", tags=["profile"])

@router.post("/analyze")
async def analyze_profile(profile: UserProfile):
    try:
        queries = GeminiService.generate_search_queries(profile.model_dump())
        cand_skills = profile.skills + profile.programming_languages + profile.frameworks
        return {
            "status": "success",
            "candidate_name": profile.name,
            "target_role": profile.preferred_role,
            "total_skills_identified": len(cand_skills),
            "generated_search_queries": queries,
            "readiness_indicator": "Strong Candidate" if len(cand_skills) >= 5 else "Developing Candidate"
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze profile: {str(e)}")
