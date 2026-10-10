from typing import List, Dict, Tuple, Any
import re

TECH_KEYWORDS_MAP = {
    "python": ["python", "py", "python3"],
    "machine learning": ["machine learning", "ml", "statistical learning"],
    "deep learning": ["deep learning", "dl", "neural networks"],
    "tensorflow": ["tensorflow", "tf"],
    "pytorch": ["pytorch", "torch"],
    "scikit-learn": ["scikit-learn", "sklearn"],
    "computer vision": ["computer vision", "cv", "opencv", "yolo"],
    "nlp": ["nlp", "natural language processing", "llm", "transformers", "huggingface"],
    "robotics": ["robotics", "ros", "ros2", "slam", "kinematics", "gazebo"],
    "docker": ["docker", "container", "containers", "docker-compose"],
    "kubernetes": ["kubernetes", "k8s"],
    "aws": ["aws", "amazon web services", "ec2", "s3"],
    "gcp": ["gcp", "google cloud"],
    "c++": ["c++", "cpp"],
    "c": ["c"],
    "sql": ["sql", "postgresql", "mysql", "sqlite"],
    "git": ["git", "github", "gitlab"],
    "fastapi": ["fastapi", "flask", "django", "rest api"],
    "react": ["react", "react.js", "frontend"],
    "data science": ["data science", "pandas", "numpy", "matplotlib", "seaborn"],
}

def normalize_text(text: str) -> str:
    return text.lower().replace("-", " ").replace("_", " ").strip()

def classify_skills(
    candidate_skills: List[str],
    job_description: str,
    job_title: str
) -> Tuple[List[str], List[str], List[str], List[Dict[str, Any]]]:
    """
    Classifies skills into MATCHED, PARTIAL, MISSING based on candidate profile
    and detected job requirements.
    """
    desc_clean = normalize_text(job_description + " " + job_title)
    cand_skills_clean = [normalize_text(s) for s in candidate_skills if s.strip()]

    # Detect skills mentioned in job
    job_required_detected = []
    for canonical, aliases in TECH_KEYWORDS_MAP.items():
        for alias in aliases:
            # Word boundary regex check
            pattern = r'\b' + re.escape(alias) + r'\b'
            if re.search(pattern, desc_clean):
                if canonical not in job_required_detected:
                    job_required_detected.append(canonical)
                break

    # If few skills were detected, add canonical skills aligned to role
    if len(job_required_detected) < 3:
        if any(w in desc_clean for w in ["robotics", "robot", "ros"]):
            job_required_detected.extend(["robotics", "python", "c++", "ros", "computer vision"])
        elif any(w in desc_clean for w in ["computer vision", "vision", "opencv", "yolo"]):
            job_required_detected.extend(["computer vision", "python", "deep learning", "pytorch", "opencv"])
        elif any(w in desc_clean for w in ["machine learning", "ml", "ai"]):
            job_required_detected.extend(["python", "machine learning", "deep learning", "pytorch", "scikit-learn"])
        else:
            job_required_detected.extend(["python", "git", "sql", "problem solving"])
        job_required_detected = list(dict.fromkeys(job_required_detected))

    matched: List[str] = []
    partial: List[str] = []
    missing: List[str] = []
    breakdown: List[Dict[str, Any]] = []

    for req in job_required_detected:
        req_aliases = TECH_KEYWORDS_MAP.get(req, [req])
        is_exact = False
        is_partial = False

        for cand in cand_skills_clean:
            for alias in req_aliases:
                if cand == alias or cand == req:
                    is_exact = True
                    break
                elif cand in alias or alias in cand:
                    is_partial = True
            if is_exact:
                break

        canonical_display = req.title()
        if is_exact:
            matched.append(canonical_display)
            breakdown.append({
                "skill": canonical_display,
                "user_level": 90,
                "required_level": 80,
                "status": "MATCHED",
                "importance": "CRITICAL" if req in ["python", "machine learning", "deep learning", "robotics"] else "IMPORTANT"
            })
        elif is_partial:
            partial.append(canonical_display)
            breakdown.append({
                "skill": canonical_display,
                "user_level": 55,
                "required_level": 75,
                "status": "PARTIAL",
                "importance": "IMPORTANT"
            })
        else:
            missing.append(canonical_display)
            breakdown.append({
                "skill": canonical_display,
                "user_level": 15,
                "required_level": 70,
                "status": "MISSING",
                "importance": "CRITICAL" if req in ["docker", "pytorch", "ros", "fastapi"] else "IMPORTANT"
            })

    return matched, partial, missing, breakdown

def calculate_match_score(
    profile_dict: Dict[str, Any],
    job_dict: Dict[str, Any]
) -> Dict[str, Any]:
    """
    Transparent Deterministic Scoring System:
    30% Skill Match
    25% Role Relevance
    15% Experience Fit
    15% Technology Match
    10% Location Fit
    5% Job Quality
    Overall: 0 to 100
    """
    title = (job_dict.get("title") or "").lower()
    desc = (job_dict.get("description") or "").lower()
    loc = (job_dict.get("location") or "").lower()
    apply_url = job_dict.get("apply_url") or ""

    cand_skills = profile_dict.get("skills", [])
    cand_langs = profile_dict.get("programming_languages", [])
    cand_frameworks = profile_dict.get("frameworks", [])
    all_cand_skills = cand_skills + cand_langs + cand_frameworks

    pref_role = (profile_dict.get("preferred_role") or "ai/ml engineer").lower()
    pref_loc = (profile_dict.get("preferred_location") or "india").lower()
    exp_level = (profile_dict.get("experience_level") or "student").lower()

    # 1. Skill Match (30%)
    matched, partial, missing, breakdown = classify_skills(all_cand_skills, desc, title)
    total_req = max(len(matched) + len(partial) + len(missing), 1)
    skill_score_val = ((len(matched) * 1.0 + len(partial) * 0.5) / total_req) * 100
    skill_score = int(round(min(max(skill_score_val, 15), 100)))

    # 2. Role Relevance (25%)
    role_tokens = [t for t in pref_role.split() if len(t) > 2]
    role_hits = sum(1 for t in role_tokens if t in title or t in desc)
    if "intern" in pref_role and "intern" in title:
        role_hits += 2
    if any(k in title for k in ["ai", "ml", "machine learning", "robotics", "deep learning", "data science"]):
        if any(k in pref_role for k in ["ai", "ml", "machine learning", "robotics", "deep learning", "data science"]):
            role_hits += 2

    role_score = min(int(round((role_hits / max(len(role_tokens), 1)) * 60 + 40)), 100)

    # 3. Experience Fit (15%)
    exp_score = 75
    is_internship_or_entry = any(w in title or w in desc for w in ["intern", "trainee", "fresher", "junior", "entry", "graduate", "0-1", "0-2"])
    if is_internship_or_entry:
        exp_score = 95
    elif any(w in desc for w in ["5+ years", "senior", "lead", "staff", "principal", "7+ years"]):
        exp_score = 35
    elif any(w in desc for w in ["2-4 years", "2+ years", "3+ years"]):
        exp_score = 60

    # 4. Technology Match (15%)
    tech_hits = 0
    checked_techs = cand_langs + cand_frameworks
    if not checked_techs:
        checked_techs = all_cand_skills
    for tech in checked_techs:
        t_clean = normalize_text(tech)
        if t_clean and (t_clean in desc or t_clean in title):
            tech_hits += 1
    tech_score = int(round(min(max((tech_hits / max(len(checked_techs), 1)) * 100, 20), 100)))

    # 5. Location Fit (10%)
    location_score = 70
    if "remote" in desc or "remote" in loc or "anywhere" in loc:
        location_score = 100
    elif pref_loc in loc or "india" in loc:
        location_score = 95
    elif any(city in loc for city in ["bangalore", "bengaluru", "hyderabad", "pune", "delhi", "gurgaon", "noida", "chennai", "mumbai"]):
        location_score = 90
    else:
        location_score = 50

    # 6. Job Quality (5%)
    job_quality_score = 60
    if apply_url and apply_url.startswith("http"):
        job_quality_score += 20
    if len(desc) > 300:
        job_quality_score += 15
    if job_dict.get("salary") and job_dict.get("salary") != "Competitive":
        job_quality_score += 5
    job_quality_score = min(job_quality_score, 100)

    # Weighted Overall Score:
    overall_score = int(round(
        (skill_score * 0.30) +
        (role_score * 0.25) +
        (exp_score * 0.15) +
        (tech_score * 0.15) +
        (location_score * 0.10) +
        (job_quality_score * 0.05)
    ))
    overall_score = max(min(overall_score, 99), 20)

    # Recommendation string
    if overall_score >= 82:
        recommendation = "Strongly Recommended"
    elif overall_score >= 68:
        recommendation = "Recommended"
    elif overall_score >= 52:
        recommendation = "Consider with Upskilling"
    else:
        recommendation = "Reach Opportunity"

    explanation = {
        "overall": f"{overall_score}% total alignment based on 6 weighted hiring vectors.",
        "skill_factor": f"{skill_score}% - Matched {len(matched)} core competencies, {len(partial)} partial, {len(missing)} missing.",
        "role_factor": f"{role_score}% - Role relevance to '{pref_role}' target.",
        "experience_factor": f"{exp_score}% - Experience tier match for {exp_level}.",
        "tech_factor": f"{tech_score}% - Stack alignment with languages & frameworks.",
        "location_factor": f"{location_score}% - Location compatibility ({loc or 'India / Remote'}).",
        "quality_factor": f"{job_quality_score}% - Direct application link & verified description clarity.",
    }

    return {
        "overall_score": overall_score,
        "skill_score": skill_score,
        "role_score": role_score,
        "experience_score": exp_score,
        "technology_score": tech_score,
        "location_score": location_score,
        "job_quality_score": job_quality_score,
        "matched_skills": matched,
        "partial_skills": partial,
        "missing_skills": missing,
        "recommendation": recommendation,
        "explanation": explanation,
        "skill_breakdown": breakdown,
    }
