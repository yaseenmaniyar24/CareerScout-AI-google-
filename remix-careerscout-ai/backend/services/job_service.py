import logging
from typing import List, Dict, Any, Optional
from .serpapi_service import SerpApiService
from .gemini_service import GeminiService
from .matching_service import MatchingService
from ..utils.normalization import deduplicate_jobs

logger = logging.getLogger(__name__)

class JobService:
    @classmethod
    def search_and_rank_opportunities(
        cls,
        profile: Dict[str, Any],
        custom_role: Optional[str] = None,
        custom_location: Optional[str] = None,
        force_demo: bool = False
    ) -> Dict[str, Any]:
        """
        Full AI Career Intelligence Pipeline:
        1. Query generation via Gemini
        2. SerpApi live Google Jobs search
        3. Deduplication & normalization
        4. Deterministic multi-factor scoring
        5. Ranking by match score
        6. Statistical aggregation
        """
        # Update profile with overrides if provided
        prof_copy = dict(profile)
        if custom_role:
            prof_copy["preferred_role"] = custom_role
        if custom_location:
            prof_copy["preferred_location"] = custom_location

        location = prof_copy.get("preferred_location") or "India"

        # 1. Generate smart search queries
        queries = GeminiService.generate_search_queries(prof_copy)
        if custom_role:
            queries.insert(0, f"{custom_role} internship {location}")

        all_raw_jobs = []
        execution_source = "serpapi_live"

        if force_demo:
            res = SerpApiService.search_jobs("demo search", location=location)
            all_raw_jobs.extend(res.get("jobs", []))
            execution_source = "demo_mode"
        else:
            # Query SerpApi with primary queries
            # Limit queries to 2 to conserve SerpApi credits while giving broad results
            for q in queries[:2]:
                logger.info(f"Executing SerpApi search query: {q}")
                res = SerpApiService.search_jobs(q, location=location, num_results=10)
                all_raw_jobs.extend(res.get("jobs", []))
                if res.get("source") == "demo_mode":
                    execution_source = "demo_mode"

        # Deduplicate jobs
        deduped = deduplicate_jobs(all_raw_jobs)

        # Evaluate each opportunity with deterministic matching
        evaluated = []
        for j in deduped:
            scored = MatchingService.evaluate_opportunity(prof_copy, j)
            evaluated.append(scored)

        # Sort descending by match score
        evaluated.sort(key=lambda x: x.get("match_score", 0), reverse=True)

        # Compute dashboard statistics
        total_found = len(evaluated)
        strong_matches = sum(1 for j in evaluated if j.get("match_score", 0) >= 78)
        avg_score = int(round(sum(j.get("match_score", 0) for j in evaluated) / max(total_found, 1)))

        # Unique critical skill gaps across top jobs
        all_missing = []
        for j in evaluated[:6]:
            all_missing.extend(j.get("missing_skills", []))
        critical_gaps_count = len(set(all_missing))

        return {
            "opportunities": evaluated,
            "total_found": total_found,
            "queries_executed": queries[:2] if not force_demo else ["Curated Indian Tech Opportunities"],
            "execution_source": execution_source,
            "stats": {
                "total_opportunities": total_found,
                "strong_matches": strong_matches,
                "average_match": avg_score,
                "critical_skill_gaps": critical_gaps_count,
            }
        }
