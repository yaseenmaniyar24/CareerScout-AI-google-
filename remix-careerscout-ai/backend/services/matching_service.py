from typing import List, Dict, Any
from ..utils.scoring import calculate_match_score
from .gemini_service import GeminiService

class MatchingService:
    @classmethod
    def evaluate_opportunity(
        cls,
        profile: Dict[str, Any],
        job: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Calculates transparent deterministic scores and enriches with skill breakdowns.
        """
        score_res = calculate_match_score(profile, job)
        
        enriched = dict(job)
        enriched.update({
            "match_score": score_res["overall_score"],
            "skill_score": score_res["skill_score"],
            "role_score": score_res["role_score"],
            "experience_score": score_res["experience_score"],
            "technology_score": score_res["technology_score"],
            "location_score": score_res["location_score"],
            "job_quality_score": score_res["job_quality_score"],
            "matched_skills": score_res["matched_skills"],
            "partial_skills": score_res["partial_skills"],
            "missing_skills": score_res["missing_skills"],
            "recommendation": score_res["recommendation"],
            "strengths": [f"Matches requirement for {s}" for s in score_res["matched_skills"][:3]],
            "gap_summary": f"Missing key tools: {', '.join(score_res['missing_skills'][:2])}" if score_res["missing_skills"] else "Strong profile alignment across primary tech stack."
        })
        return enriched

    @classmethod
    def deep_analyze_opportunity(
        cls,
        profile: Dict[str, Any],
        job: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Detailed breakdown for 'View Analysis' modal/view.
        """
        score_res = calculate_match_score(profile, job)
        qualitative = GeminiService.analyze_job_fit(profile, job)

        return {
            "opportunity_id": job.get("id", "job_1"),
            "title": job.get("title", ""),
            "company": job.get("company", ""),
            "match_score": score_res["overall_score"],
            "matched_skills": score_res["matched_skills"],
            "partial_skills": score_res["partial_skills"],
            "missing_skills": score_res["missing_skills"],
            "candidate_strengths": qualitative.get("candidate_strengths", []),
            "missing_requirements": qualitative.get("missing_requirements", []),
            "recommendation": score_res["recommendation"],
            "role_insights": qualitative.get("role_insights", ""),
            "interview_focus_areas": qualitative.get("interview_focus_areas", []),
            "skill_breakdown": score_res["skill_breakdown"],
            "scoring_explanation": score_res["explanation"],
        }
