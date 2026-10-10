from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class UserProfile(BaseModel):
    name: str = Field(default="Candidate")
    education: str = Field(default="B.Tech")
    college: str = Field(default="")
    degree: str = Field(default="B.Tech")
    branch: str = Field(default="Computer Science")
    year: str = Field(default="3rd Year")
    graduation_year: str = Field(default="2026")
    preferred_role: str = Field(default="AI/ML Engineer")
    preferred_location: str = Field(default="India")
    preferred_work_mode: str = Field(default="Hybrid")
    experience_level: str = Field(default="Student")
    skills: List[str] = Field(default_factory=list)
    programming_languages: List[str] = Field(default_factory=list)
    frameworks: List[str] = Field(default_factory=list)
    tools: List[str] = Field(default_factory=list)
    projects: str = Field(default="")
    resume_text: str = Field(default="")

class SkillMatchItem(BaseModel):
    skill: str
    user_level: int
    required_level: int
    status: str  # 'MATCHED' | 'PARTIAL' | 'MISSING'
    importance: str = "IMPORTANT"  # 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE'

class Opportunity(BaseModel):
    id: str
    title: str
    company: str
    location: str
    description: str
    apply_url: str
    posted_at: str = "Recently"
    salary: str = "Competitive"
    job_type: str = "Full-time / Internship"
    source: str = "Google Jobs (via SerpApi)"
    thumbnail: Optional[str] = None
    match_score: int
    skill_score: int
    role_score: int
    experience_score: int
    technology_score: int
    location_score: int
    job_quality_score: int
    matched_skills: List[str] = Field(default_factory=list)
    partial_skills: List[str] = Field(default_factory=list)
    missing_skills: List[str] = Field(default_factory=list)
    recommendation: str
    strengths: List[str] = Field(default_factory=list)
    gap_summary: str = ""
    is_demo: bool = False

class SearchStats(BaseModel):
    total_opportunities: int
    strong_matches: int
    average_match: int
    critical_skill_gaps: int

class SearchRequest(BaseModel):
    profile: UserProfile
    custom_role: Optional[str] = None
    custom_location: Optional[str] = None
    force_demo: bool = False

class SearchResponse(BaseModel):
    opportunities: List[Opportunity]
    total_found: int
    queries_executed: List[str]
    execution_source: str  # 'serpapi_live' | 'demo_mode'
    stats: SearchStats

class AnalyzeJobRequest(BaseModel):
    profile: UserProfile
    opportunity: Opportunity

class JobAnalysisResponse(BaseModel):
    opportunity_id: str
    title: str
    company: str
    match_score: int
    matched_skills: List[str]
    partial_skills: List[str]
    missing_skills: List[str]
    candidate_strengths: List[str]
    missing_requirements: List[str]
    recommendation: str
    role_insights: str
    interview_focus_areas: List[str]
    skill_breakdown: List[SkillMatchItem]
    scoring_explanation: Dict[str, str]

class RoadmapDay(BaseModel):
    day: int
    week: int
    goal: str
    topic: str
    task: str
    estimated_hours: int = 2
    expected_outcome: str
    resource_hint: Optional[str] = None

class RoadmapWeek(BaseModel):
    week: int
    title: str
    theme: str
    days: List[RoadmapDay]

class RoadmapResponse(BaseModel):
    target_role: str
    target_company: Optional[str] = None
    total_days: int = 30
    summary: str
    weeks: List[RoadmapWeek]

class RoadmapRequest(BaseModel):
    profile: UserProfile
    opportunity: Optional[Opportunity] = None
    target_role: Optional[str] = None

class RecommendedProject(BaseModel):
    title: str
    description: str
    tech_stack: List[str]
    difficulty: str
    portfolio_value: str

class LearningResource(BaseModel):
    name: str
    type: str
    url_or_topic: str
    estimated_time: str

class CareerReportRequest(BaseModel):
    profile: UserProfile
    selected_opportunities: Optional[List[Opportunity]] = None

class CareerReportResponse(BaseModel):
    readiness_score: int
    summary: str
    top_strengths: List[str]
    top_weaknesses: List[str]
    recommended_technologies: List[str]
    recommended_projects: List[RecommendedProject]
    recommended_learning_resources: List[LearningResource]
    recommended_job_types: List[str]
    interview_preparation_topics: List[str]
    portfolio_recommendations: List[str]
    market_insights: str
