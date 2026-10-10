import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from .config import settings
from .routes.profile import router as profile_router
from .routes.jobs import router as jobs_router
from .routes.analysis import router as analysis_router
from .services.serpapi_service import SAMPLE_INDIAN_TECH_JOBS

app = FastAPI(
    title="CareerScout AI Backend",
    description="Live Career Intelligence Agent for Indian Students & Graduates powered by SerpApi & Google Gemini",
    version="1.0.0"
)

# Enable CORS for local Vite dev and cloud previews
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(profile_router)
app.include_router(jobs_router)
app.include_router(analysis_router)

@app.get("/api/health")
async def health_check():
    return {
        "status": "healthy",
        "service": "CareerScout AI",
        "serpapi_configured": settings.has_serpapi_key(),
        "gemini_configured": settings.has_gemini_key(),
        "demo_mode": settings.DEMO_MODE,
        "environment": settings.ENVIRONMENT
    }

@app.get("/api/demo")
async def demo_endpoint():
    return {
        "message": "CareerScout AI Demo Dataset",
        "sample_count": len(SAMPLE_INDIAN_TECH_JOBS),
        "target_audience": "Indian College Students & Fresh Graduates",
        "sample_jobs": SAMPLE_INDIAN_TECH_JOBS[:3]
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("backend.main:app", host="0.0.0.0", port=settings.PORT, reload=True)
