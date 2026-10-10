from fastapi import APIRouter, HTTPException
from ..models.schemas import SearchRequest, SearchResponse, AnalyzeJobRequest, JobAnalysisResponse
from ..services.job_service import JobService
from ..services.matching_service import MatchingService

router = APIRouter(prefix="/api/jobs", tags=["jobs"])

@router.post("/search", response_model=SearchResponse)
async def search_jobs(request: SearchRequest):
    try:
        result = JobService.search_and_rank_opportunities(
            profile=request.profile.model_dump(),
            custom_role=request.custom_role,
            custom_location=request.custom_location,
            force_demo=request.force_demo
        )
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Job search pipeline encountered an error: {str(e)}")

@router.post("/analyze", response_model=JobAnalysisResponse)
async def analyze_single_job(request: AnalyzeJobRequest):
    try:
        detailed = MatchingService.deep_analyze_opportunity(
            profile=request.profile.model_dump(),
            job=request.opportunity.model_dump()
        )
        return detailed
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to analyze job details: {str(e)}")
