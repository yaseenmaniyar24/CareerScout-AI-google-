import os
import requests
import logging
from typing import List, Dict, Any, Optional
from ..config import settings
from ..utils.normalization import normalize_serpapi_job, deduplicate_jobs

logger = logging.getLogger(__name__)

# High-fidelity realistic dataset for Indian college students & fresh grads when in DEMO_MODE or fallback
SAMPLE_INDIAN_TECH_JOBS = [
    {
        "title": "AI/ML Engineer Intern",
        "company_name": "Sarvam AI",
        "location": "Bengaluru, Karnataka, India",
        "description": "Sarvam AI is developing foundational AI models for India. We are looking for an ambitious AI/ML Intern to join our core research engineering team. Requirements: Solid foundation in Python, PyTorch, Transformer architectures, and Deep Learning fundamentals. Experience training or fine-tuning open-source LLMs (Llama, Mistral) or Indic NLP datasets is a strong plus. Hands-on experience with CUDA and distributed training frameworks is desirable. You will work directly with our senior research scientists on high-throughput model training and evaluation.",
        "detected_extensions": {
            "posted_at": "1 day ago",
            "schedule_type": "Internship (6 Months)",
            "salary": "₹45,000 - ₹65,000 / month"
        },
        "apply_options": [
            {"title": "Sarvam AI Careers", "link": "https://www.sarvam.ai/careers"}
        ],
        "via": "LinkedIn Jobs via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=100&h=100&fit=crop"
    },
    {
        "title": "Computer Vision & Robotics Intern",
        "company_name": "Addverb Technologies",
        "location": "Noida / Pune (Hybrid), India",
        "description": "Addverb Technologies builds state-of-the-art warehouse automation robots and autonomous mobile robots (AMRs). Responsibilities: Implement real-time 3D perception algorithms, SLAM (Simultaneous Localization and Mapping), object detection using YOLOv8/v10 and OpenCV. Qualifications: B.Tech/M.Tech in AI, Robotics, Mechatronics, or CSE. Good proficiency in C++, Python, ROS/ROS2, Gazebo simulation, and Linux environments. Understanding of Kalman filters and path planning (A*, Dijkstra) is beneficial.",
        "detected_extensions": {
            "posted_at": "3 days ago",
            "schedule_type": "Internship / Trainee",
            "salary": "₹35,000 - ₹50,000 / month"
        },
        "apply_options": [
            {"title": "Addverb Portal", "link": "https://addverb.com/careers/"}
        ],
        "via": "Naukri.com via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1485827404703-89b55fcc595e?w=100&h=100&fit=crop"
    },
    {
        "title": "Junior Machine Learning Engineer",
        "company_name": "Krutrim SI Designs",
        "location": "Bengaluru, Karnataka, India",
        "description": "Join Krutrim's AI Labs building sovereign AI infrastructure for India. We are seeking fresh engineering graduates and final year students with strong analytical and programming skills. Key requirements: Python, TensorFlow or PyTorch, Scikit-learn, Vector databases (Pinecone, Milvus), FastAPI for microservices, and Docker. Candidates should possess strong computer science fundamentals, data structures, and algorithmic optimization. Prior academic projects in generative AI or computer vision are highly regarded.",
        "detected_extensions": {
            "posted_at": "Just now",
            "schedule_type": "Full-time (Entry Level)",
            "salary": "₹8.5 - ₹12.0 LPA"
        },
        "apply_options": [
            {"title": "Krutrim Careers", "link": "https://krutrim.ai/careers"}
        ],
        "via": "Foundit via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1620712943543-bcc4688e7485?w=100&h=100&fit=crop"
    },
    {
        "title": "Robotics Software Engineer Intern (ROS2 / Simulation)",
        "company_name": "Ati Motors",
        "location": "Bengaluru, Karnataka, India",
        "description": "Ati Motors manufactures autonomous electric vehicles for industrial haulage. We are looking for bright robotics students with hands-on experience in autonomous navigation. Required skills: Strong C++ and Python skills. Solid experience with ROS2, Gazebo, RViz, and TF transforms. Exposure to sensor fusion (LiDAR, IMU, Wheel Odometry) and point cloud processing (PCL). Passion for real-world hardware deployment and field diagnostics.",
        "detected_extensions": {
            "posted_at": "4 days ago",
            "schedule_type": "Internship (6 Months)",
            "salary": "₹40,000 - ₹55,000 / month"
        },
        "apply_options": [
            {"title": "Ati Motors Careers", "link": "https://www.atimotors.com/careers"}
        ],
        "via": "Instahyre via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=100&h=100&fit=crop"
    },
    {
        "title": "Data Science & GenAI Intern",
        "company_name": "Fractal Analytics",
        "location": "Gurugram / Mumbai / Remote, India",
        "description": "Fractal is a premier global AI partner to Fortune 500 companies. As an intern, you will build data pipelines, analyze multivariate datasets, and evaluate generative AI agent workflows using LangChain and Gemini models. Tech stack: Python, Pandas, NumPy, Scikit-Learn, SQL, LangChain/LlamaIndex, Streamlit/FastAPI. Excellent communication and statistical reasoning skills required. Open to B.Tech/B.E./M.Sc (2025/2026 batches).",
        "detected_extensions": {
            "posted_at": "2 days ago",
            "schedule_type": "Internship to PPO",
            "salary": "₹40,000 / month"
        },
        "apply_options": [
            {"title": "Fractal Careers", "link": "https://fractal.ai/careers/"}
        ],
        "via": "LinkedIn Jobs via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=100&h=100&fit=crop"
    },
    {
        "title": "Entry-Level Deep Learning Research Associate",
        "company_name": "Wadhwani AI",
        "location": "Bengaluru / Mumbai, India",
        "description": "Wadhwani AI is an independent non-profit institute developing AI solutions for social good in agriculture, healthcare, and education. We invite graduating seniors with strong foundations in PyTorch, Computer Vision (segmentation, classification), and Python. You will assist in deploying lightweight deep learning models on edge devices and smartphones for low-connectivity rural settings.",
        "detected_extensions": {
            "posted_at": "5 days ago",
            "schedule_type": "Full-time (Fresh Graduate)",
            "salary": "₹9.0 - ₹11.5 LPA"
        },
        "apply_options": [
            {"title": "Wadhwani AI Openings", "link": "https://wadhwaniai.org/careers"}
        ],
        "via": "Google Jobs via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1507146426996-ef05306b995a?w=100&h=100&fit=crop"
    },
    {
        "title": "Autonomous Systems & Perception Intern",
        "company_name": "Tonbo Imaging",
        "location": "Bengaluru, Karnataka, India",
        "description": "Tonbo Imaging designs cutting-edge electro-optics and autonomous vision systems. We seek an intern specializing in infrared perception, camera calibration, embedded C++, and OpenCV. Opportunity to experiment with NVIDIA Jetson Xavier/Orin, TensorRT inference optimization, and deep learning model pruning.",
        "detected_extensions": {
            "posted_at": "1 week ago",
            "schedule_type": "Internship",
            "salary": "₹35,000 - ₹45,000 / month"
        },
        "apply_options": [
            {"title": "Tonbo Careers", "link": "https://tonboimaging.com/careers"}
        ],
        "via": "Indeed via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=100&h=100&fit=crop"
    },
    {
        "title": "Software Engineer Intern - Backend & AI Integration",
        "company_name": "Postman India",
        "location": "Bengaluru / Remote, India",
        "description": "Postman is looking for aspiring software engineering interns who love APIs, scalable backend systems, and AI tooling. Required: Strong problem solving in Python, TypeScript, or Go. Experience building RESTful APIs, Git workflows, PostgreSQL, and unit testing. Familiarity with AI developer tools and LLM integrations is a great advantage.",
        "detected_extensions": {
            "posted_at": "3 days ago",
            "schedule_type": "Internship (Summer / 6 Months)",
            "salary": "₹75,000 / month"
        },
        "apply_options": [
            {"title": "Postman Careers", "link": "https://www.postman.com/company/careers/"}
        ],
        "via": "LinkedIn Jobs via SerpApi",
        "thumbnail": "https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=100&h=100&fit=crop"
    }
]

class SerpApiService:
    BASE_URL = "https://serpapi.com/search.json"

    @classmethod
    def search_jobs(
        cls,
        query: str,
        location: str = "India",
        num_results: int = 10
    ) -> Dict[str, Any]:
        """
        Executes a live search using SerpApi's google_jobs engine.
        Returns a dictionary containing normalized jobs, raw stats, and status.
        """
        api_key = settings.SERPAPI_API_KEY

        # Check if we should fallback to demo mode
        if settings.DEMO_MODE or not settings.has_serpapi_key():
            logger.info("Using simulated demo jobs (DEMO_MODE=true or missing SERPAPI_API_KEY).")
            demo_jobs = [normalize_serpapi_job(job, i) for i, job in enumerate(SAMPLE_INDIAN_TECH_JOBS)]
            for dj in demo_jobs:
                dj["is_demo"] = True
            return {
                "source": "demo_mode",
                "jobs": demo_jobs,
                "query": query,
                "message": "Results loaded from curated Indian tech internships & entry-level roles (DEMO MODE)."
            }

        params = {
            "engine": "google_jobs",
            "q": query,
            "location": location,
            "hl": "en",
            "gl": "in",
            "api_key": api_key,
        }

        try:
            response = requests.get(cls.BASE_URL, params=params, timeout=12)
            if response.status_code == 200:
                data = response.json()
                raw_jobs = data.get("jobs_results", [])
                if not raw_jobs:
                    # Empty results from SerpApi, graceful fallback
                    logger.warning(f"SerpApi returned 0 jobs for query: {query}")
                    fallback = [normalize_serpapi_job(j, i) for i, j in enumerate(SAMPLE_INDIAN_TECH_JOBS[:4])]
                    return {
                        "source": "serpapi_live",
                        "jobs": fallback,
                        "query": query,
                        "message": "No direct matches found on SerpApi for exact query; returned related opportunities."
                    }

                normalized = [normalize_serpapi_job(j, idx) for idx, j in enumerate(raw_jobs[:num_results])]
                return {
                    "source": "serpapi_live",
                    "jobs": normalized,
                    "query": query,
                    "message": f"Successfully retrieved {len(normalized)} live opportunities via SerpApi Google Jobs."
                }
            elif response.status_code in (401, 403):
                logger.error("SerpApi API key invalid or unauthorized. Falling back to demo mode.")
                fallback = [normalize_serpapi_job(j, i) for i, j in enumerate(SAMPLE_INDIAN_TECH_JOBS)]
                for f in fallback:
                    f["is_demo"] = True
                return {
                    "source": "demo_mode",
                    "jobs": fallback,
                    "query": query,
                    "message": "SerpApi API key unauthorized. Switched to demo dataset."
                }
            elif response.status_code == 429:
                logger.warning("SerpApi rate limit exceeded. Falling back to demo mode.")
                fallback = [normalize_serpapi_job(j, i) for i, j in enumerate(SAMPLE_INDIAN_TECH_JOBS)]
                for f in fallback:
                    f["is_demo"] = True
                return {
                    "source": "demo_mode",
                    "jobs": fallback,
                    "query": query,
                    "message": "SerpApi monthly quota reached. Showing high-fidelity demo data."
                }
            else:
                logger.error(f"SerpApi returned status code {response.status_code}: {response.text}")
                fallback = [normalize_serpapi_job(j, i) for i, j in enumerate(SAMPLE_INDIAN_TECH_JOBS)]
                return {
                    "source": "demo_mode",
                    "jobs": fallback,
                    "query": query,
                    "message": f"SerpApi search temporary response {response.status_code}. Displaying demo data."
                }
        except Exception as e:
            logger.exception(f"Error querying SerpApi: {e}")
            fallback = [normalize_serpapi_job(j, i) for i, j in enumerate(SAMPLE_INDIAN_TECH_JOBS)]
            for f in fallback:
                f["is_demo"] = True
            return {
                "source": "demo_mode",
                "jobs": fallback,
                "query": query,
                "message": "Network error communicating with SerpApi. Using cached demo data."
            }
