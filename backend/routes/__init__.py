# backend/routes/__init__.py
from .profile import router as profile_router
from .jobs import router as jobs_router
from .analysis import router as analysis_router

__all__ = ["profile_router", "jobs_router", "analysis_router"]
