from typing import List, Dict, Any, Optional
import hashlib
import re

def clean_html(text: str) -> str:
    if not text:
        return ""
    clean = re.sub(r'<[^>]+>', ' ', text)
    clean = re.sub(r'\s+', ' ', clean).strip()
    return clean

def extract_apply_url(job_data: Dict[str, Any]) -> str:
    apply_options = job_data.get("apply_options", [])
    if isinstance(apply_options, list) and len(apply_options) > 0:
        first_opt = apply_options[0]
        if isinstance(first_opt, dict) and first_opt.get("link"):
            return first_opt.get("link", "")
    if job_data.get("job_id"):
        return f"https://www.google.com/search?q={job_data.get('title', 'job')}&ibp=htl;jobs#fpstate=tldetail&htidocid={job_data.get('job_id')}"
    return job_data.get("link") or "https://www.google.com/search?q=jobs"

def normalize_serpapi_job(raw_job: Dict[str, Any], index: int = 0) -> Dict[str, Any]:
    title = raw_job.get("title") or "Engineering Opportunity"
    company = raw_job.get("company_name") or raw_job.get("company") or "Tech Company"
    location = raw_job.get("location") or "India (Hybrid/Remote)"
    raw_desc = raw_job.get("description") or ""
    description = clean_html(raw_desc)
    
    # Extensions parsing (SerpApi provides detected_extensions)
    extensions = raw_job.get("detected_extensions", {})
    posted_at = extensions.get("posted_at") or raw_job.get("posted_at") or "Recently posted"
    schedule_type = extensions.get("schedule_type") or "Full-time / Internship"
    salary = extensions.get("salary") or "Competitive / Stipend based"

    apply_url = extract_apply_url(raw_job)
    thumbnail = raw_job.get("thumbnail")

    # Generate unique deterministic ID
    unique_str = f"{title}_{company}_{location}_{index}"
    job_id = "job_" + hashlib.md5(unique_str.encode("utf-8")).hexdigest()[:12]

    return {
        "id": job_id,
        "title": title,
        "company": company,
        "location": location,
        "description": description[:1500] if description else f"{title} at {company} in {location}.",
        "apply_url": apply_url,
        "posted_at": posted_at,
        "salary": salary,
        "job_type": schedule_type,
        "source": raw_job.get("via") or "Google Jobs via SerpApi",
        "thumbnail": thumbnail,
        "is_demo": False,
    }

def deduplicate_jobs(jobs: List[Dict[str, Any]]) -> List[Dict[str, Any]]:
    seen = set()
    deduped = []
    for job in jobs:
        # Key based on company and normalized title
        clean_title = re.sub(r'[^a-zA-Z0-9]', '', (job.get("title") or "").lower())
        clean_comp = re.sub(r'[^a-zA-Z0-9]', '', (job.get("company") or "").lower())
        key = f"{clean_title}::{clean_comp}"
        if key not in seen:
            seen.add(key)
            deduped.append(job)
    return deduped
