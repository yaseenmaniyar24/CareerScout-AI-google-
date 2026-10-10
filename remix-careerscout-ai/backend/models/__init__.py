# backend/models/__init__.py
from .schemas import (
    UserProfile,
    Opportunity,
    SkillMatchItem,
    SearchRequest,
    SearchResponse,
    AnalyzeJobRequest,
    JobAnalysisResponse,
    RoadmapRequest,
    RoadmapResponse,
    CareerReportRequest,
    CareerReportResponse,
)

__all__ = [
    "UserProfile",
    "Opportunity",
    "SkillMatchItem",
    "SearchRequest",
    "SearchResponse",
    "AnalyzeJobRequest",
    "JobAnalysisResponse",
    "RoadmapRequest",
    "RoadmapResponse",
    "CareerReportRequest",
    "CareerReportResponse",
]
