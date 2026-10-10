from typing import Dict, Any, Optional
from .gemini_service import GeminiService

class RoadmapService:
    @classmethod
    def create_roadmap(
        cls,
        profile: Dict[str, Any],
        opportunity: Optional[Dict[str, Any]] = None,
        target_role: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates 30-day skill improvement plan.
        """
        return GeminiService.generate_roadmap(
            profile=profile,
            opportunity=opportunity,
            target_role=target_role
        )
