from fastapi import APIRouter, HTTPException
from ..models.schemas import CareerReportRequest, CareerReportResponse, RoadmapRequest, RoadmapResponse
from ..services.gemini_service import GeminiService
from ..services.roadmap_service import RoadmapService

router = APIRouter(prefix="/api", tags=["analysis"])

@router.post("/career/report", response_model=CareerReportResponse)
async def generate_career_report(request: CareerReportRequest):
    try:
        opps = [o.model_dump() for o in request.selected_opportunities] if request.selected_opportunities else None
        report = GeminiService.generate_career_report(
            profile=request.profile.model_dump(),
            opportunities=opps
        )
        return report
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate career report: {str(e)}")

@router.post("/roadmap/generate", response_model=RoadmapResponse)
async def generate_roadmap(request: RoadmapRequest):
    try:
        opp = request.opportunity.model_dump() if request.opportunity else None
        roadmap = RoadmapService.create_roadmap(
            profile=request.profile.model_dump(),
            opportunity=opp,
            target_role=request.target_role
        )
        return roadmap
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to generate roadmap: {str(e)}")
