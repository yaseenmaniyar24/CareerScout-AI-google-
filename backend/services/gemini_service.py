import json
import logging
from typing import List, Dict, Any, Optional
from ..config import settings

logger = logging.getLogger(__name__)

class GeminiService:
    @classmethod
    def _get_client(cls):
        if not settings.has_gemini_key():
            return None
        try:
            from google import genai
            return genai.Client(
                api_key=settings.GEMINI_API_KEY,
                http_options={'headers': {'User-Agent': 'aistudio-build'}}
            )
        except Exception as e:
            logger.warning(f"Could not initialize Google GenAI SDK client: {e}")
            return None

    @classmethod
    def generate_search_queries(cls, profile: Dict[str, Any]) -> List[str]:
        """
        Generates 3-4 optimized SerpApi search queries based on the candidate's profile.
        """
        pref_role = profile.get("preferred_role") or "AI/ML Engineer"
        location = profile.get("preferred_location") or "India"
        skills = profile.get("skills", [])
        exp = profile.get("experience_level") or "Student"

        # Standard default queries
        default_queries = [
            f"{pref_role} internship {location}",
            f"entry level {pref_role} {location}",
            f"{' '.join(skills[:2])} intern {location}" if skills else f"Junior {pref_role} {location}",
        ]

        client = cls._get_client()
        if not client:
            return default_queries

        prompt = f"""
Given this student/graduate candidate career profile:
- Role Goal: {pref_role}
- Location: {location}
- Experience: {exp}
- Skills: {', '.join(skills)}
- Education: {profile.get('degree', 'B.Tech')} in {profile.get('branch', 'CSE')}

Generate 3-4 highly effective, concise search queries for Google Jobs via SerpApi to discover relevant internships and entry-level positions in India.
Return ONLY a valid JSON array of strings, for example: ["AI ML intern Bangalore", "Junior Machine Learning Engineer India", "Computer Vision robotics internship India"]
No markdown formatting, just the raw JSON array.
"""
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
            )
            raw = response.text.strip()
            # Clean possible markdown block
            if raw.startswith("```"):
                raw = raw.strip("`").replace("json", "").strip()
            parsed = json.loads(raw)
            if isinstance(parsed, list) and len(parsed) > 0:
                return [str(q).strip() for q in parsed[:4]]
        except Exception as e:
            logger.warning(f"Gemini query generation failed: {e}. Using defaults.")

        return default_queries

    @classmethod
    def analyze_job_fit(
        cls,
        profile: Dict[str, Any],
        opportunity: Dict[str, Any]
    ) -> Dict[str, Any]:
        """
        Deep qualitative analysis comparing candidate strengths with job requirements.
        """
        client = cls._get_client()
        cand_skills = profile.get("skills", [])
        title = opportunity.get("title", "")
        company = opportunity.get("company", "")
        desc = opportunity.get("description", "")

        fallback_analysis = {
            "candidate_strengths": [
                f"Solid foundational command of {cand_skills[0] if cand_skills else 'core programming'} suitable for {title}.",
                f"Relevant academic background in {profile.get('branch', 'Engineering')} aligning with {company}'s tech domain.",
                "Strong willingness to build end-to-end projects with modern developer tooling."
            ],
            "missing_requirements": [
                "Production-grade model deployment (FastAPI / Docker / Cloud services).",
                "Hands-on experience with large-scale distributed training or specialized hardware acceleration.",
                "Prior formal internship experience in an agile production engineering squad."
            ],
            "role_insights": f"{title} at {company} balances fundamental algorithm design with practical system implementation.",
            "interview_focus_areas": [
                "Core algorithmic trade-offs (time vs memory complexity in neural pipelines)",
                "System architecture for low-latency inference",
                "Debugging training loss and overfitting in deep models"
            ]
        }

        if not client:
            return fallback_analysis

        prompt = f"""
Candidate Profile:
- Name: {profile.get('name', 'Candidate')}
- Degree: {profile.get('degree', 'B.Tech')} {profile.get('branch', 'Engineering')} ({profile.get('year', '3rd Year')})
- Skills: {', '.join(cand_skills)}
- Projects: {profile.get('projects', 'Standard academic ML projects')}

Job Opportunity:
- Title: {title}
- Company: {company}
- Description: {desc[:1000]}

Provide a deep technical assessment as a JSON object with:
1. candidate_strengths: list of 3 specific strengths
2. missing_requirements: list of 3 practical technical gaps or missing experiences
3. role_insights: 2 sentence summary of what this company genuinely values
4. interview_focus_areas: list of 3 technical topics the candidate will be grilled on

Return ONLY valid JSON. No markdown ticks.
"""
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = raw.strip("`").replace("json", "").strip()
            parsed = json.loads(raw)
            if isinstance(parsed, dict) and "candidate_strengths" in parsed:
                return parsed
        except Exception as e:
            logger.warning(f"Gemini job fit analysis failed: {e}. Using fallback.")

        return fallback_analysis

    @classmethod
    def generate_roadmap(
        cls,
        profile: Dict[str, Any],
        opportunity: Optional[Dict[str, Any]] = None,
        target_role: Optional[str] = None
    ) -> Dict[str, Any]:
        """
        Generates a 30-day skill improvement roadmap structured across 4 weeks:
        Week 1: Fundamentals
        Week 2: Core Technical Skills
        Week 3: Project Implementation
        Week 4: Interview + Portfolio Prep
        """
        role = target_role or (opportunity.get("title") if opportunity else profile.get("preferred_role", "AI/ML Engineer"))
        missing = opportunity.get("missing_skills", []) if opportunity else ["PyTorch", "Docker", "Model Deployment"]
        
        client = cls._get_client()
        if not client:
            # Deterministic, rich fallback roadmap
            return cls._generate_fallback_roadmap(role, missing)

        prompt = f"""
Create a structured 30-day career roadmap for an Indian college student targeting the role: '{role}'.
Skill Gaps to conquer: {', '.join(missing) if missing else 'Advanced Deep Learning, Docker, System Design'}.
Current skills: {', '.join(profile.get('skills', ['Python', 'Machine Learning']))}.

Structure the response as a JSON object:
{{
  "target_role": "{role}",
  "total_days": 30,
  "summary": "High-intensity 30-day sprint engineered to close skill gaps and build a portfolio project.",
  "weeks": [
    {{
      "week": 1,
      "title": "Week 1: Fundamentals & Theory Deep Dive",
      "theme": "Solidifying foundations and core libraries",
      "days": [
        {{
          "day": 1,
          "week": 1,
          "goal": "Master Vectorization & Numerical Ops",
          "topic": "NumPy & Tensors Architecture",
          "task": "Implement manual backpropagation in NumPy without autograd",
          "estimated_hours": 2,
          "expected_outcome": "Solid intuition of gradients and computation graphs",
          "resource_hint": "CS231n Computation Graphs notes"
        }},
        ... and so on for all 7 days of week 1
      ]
    }},
    ... and so on for Week 2 (Core Technical Skills), Week 3 (Project Implementation), Week 4 (Interview & Portfolio Prep)
  ]
}}
Ensure exactly 4 weeks (7 days in Week 1, 7 in Week 2, 8 in Week 3, 8 in Week 4 totaling 30 days).
Return ONLY the raw JSON object.
"""
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = raw.strip("`").replace("json", "").strip()
            parsed = json.loads(raw)
            if isinstance(parsed, dict) and "weeks" in parsed and len(parsed["weeks"]) == 4:
                return parsed
        except Exception as e:
            logger.warning(f"Gemini roadmap generation failed: {e}. Falling back to deterministic plan.")

        return cls._generate_fallback_roadmap(role, missing)

    @classmethod
    def _generate_fallback_roadmap(cls, role: str, missing_skills: List[str]) -> Dict[str, Any]:
        """Provides a detailed, production-grade 30-day curriculum tailored to Indian student hackathons."""
        gap1 = missing_skills[0] if len(missing_skills) > 0 else "PyTorch"
        gap2 = missing_skills[1] if len(missing_skills) > 1 else "Docker"
        
        return {
            "target_role": role,
            "total_days": 30,
            "summary": f"Targeted 30-day technical sprint focusing on closing gaps in {gap1}, {gap2}, and building production-ready portfolio artifacts.",
            "weeks": [
                {
                    "week": 1,
                    "title": "Week 1: Fundamentals & Theoretical Mastery",
                    "theme": "Mathematical foundations, tensor operations, and modern data structures",
                    "days": [
                        {"day": 1, "week": 1, "goal": "Tensor Calculus & Gradients", "topic": f"{gap1} Basics", "task": "Construct a dynamic computation graph and compute autograd derivatives", "estimated_hours": 2, "expected_outcome": "Understand backward passes and loss gradients", "resource_hint": "Official PyTorch Tutorials"},
                        {"day": 2, "week": 1, "goal": "Custom Dataset Pipelines", "topic": "DataLoaders & Batching", "task": "Build custom PyTorch Dataset with data augmentations and multi-worker loading", "estimated_hours": 2, "expected_outcome": "Zero-bottleneck GPU ingestion pipeline", "resource_hint": "PyTorch torchvision doc"},
                        {"day": 3, "week": 1, "goal": "Loss Functions & Optimizers", "topic": "AdamW vs SGD & Schedulers", "task": "Implement learning rate warmup with cosine decay annealing", "estimated_hours": 2, "expected_outcome": "Stable model convergence without exploding gradients", "resource_hint": "Andrej Karpathy Neural Nets Zero to Hero"},
                        {"day": 4, "week": 1, "goal": "Convolutional / Spatial Features", "topic": "ResNet & Modern Vision Backbones", "task": "Fine-tune a pretrained ConvNeXt/ResNet-50 on a domain dataset", "estimated_hours": 3, "expected_outcome": "Working transfer learning workflow", "resource_hint": "Timm library documentation"},
                        {"day": 5, "week": 1, "goal": "Transformer Attention Mechanisms", "topic": "Scaled Dot-Product Self-Attention", "task": "Code multi-head attention from scratch in 50 lines of Python", "estimated_hours": 3, "expected_outcome": "Deep intuition of Q, K, V matrix projections", "resource_hint": "The Illustrated Transformer"},
                        {"day": 6, "week": 1, "goal": "Metrics & Evaluation", "topic": "Precision, Recall, F1, ROC-AUC", "task": "Build automated validation logging with confusion matrices", "estimated_hours": 2, "expected_outcome": "Thorough understanding of classification trade-offs", "resource_hint": "Scikit-Learn Evaluation Guides"},
                        {"day": 7, "week": 1, "goal": "Week 1 Milestone Review", "topic": "End-to-end Baseline Pipeline", "task": "Submit code to GitHub with clean README and validation metrics", "estimated_hours": 2, "expected_outcome": "Git repository ready for baseline training", "resource_hint": "GitHub Actions for CI"}
                    ]
                },
                {
                    "week": 2,
                    "title": "Week 2: Core Technical Skills & Tooling",
                    "theme": f"Containerization, deployment architectures, and {gap2}",
                    "days": [
                        {"day": 8, "week": 2, "goal": "Container Fundamentals", "topic": f"{gap2} Containerization", "task": "Write multi-stage Dockerfile for Python ML backend with slim images", "estimated_hours": 2, "expected_outcome": "Lightweight container under 300MB", "resource_hint": "Docker Official Best Practices"},
                        {"day": 9, "week": 2, "goal": "High-Throughput Microservice", "topic": "FastAPI & Async Endpoints", "task": "Expose model inference endpoint with Pydantic request validation", "estimated_hours": 2, "expected_outcome": "Sub-50ms inference server", "resource_hint": "FastAPI official documentation"},
                        {"day": 10, "week": 2, "goal": "Model Quantization & Inference", "topic": "ONNX Runtime & TensorRT", "task": "Convert PyTorch model to ONNX format and compare benchmark latency", "estimated_hours": 3, "expected_outcome": "2x to 4x throughput speedup", "resource_hint": "ONNX Runtime Tutorial"},
                        {"day": 11, "week": 2, "goal": "Vector Databases & Retrieval", "topic": "ChromaDB / Qdrant", "task": "Ingest 5,000 document embeddings and benchmark cosine similarity search", "estimated_hours": 2, "expected_outcome": "Functional semantic search layer", "resource_hint": "ChromaDB Quickstart"},
                        {"day": 12, "week": 2, "goal": "API Testing & Validation", "topic": "Pytest & Integration Tests", "task": "Write test suites mocking GPU inference and testing edge cases", "estimated_hours": 2, "expected_outcome": "Automated test coverage > 85%", "resource_hint": "FastAPI TestClient Guide"},
                        {"day": 13, "week": 2, "goal": "Container Orchestration", "topic": "Docker Compose & Env Configs", "task": "Run app, vector store, and Redis cache in multi-container network", "estimated_hours": 2, "expected_outcome": "One-command local environment launch", "resource_hint": "Docker Compose Spec"},
                        {"day": 14, "week": 2, "goal": "Week 2 Checkpoint Demo", "topic": "Interactive Swagger UI & Healthchecks", "task": "Verify production health endpoints and latency SLAs", "estimated_hours": 2, "expected_outcome": "Clean API contract documented", "resource_hint": "OpenAPI Specification"}
                    ]
                },
                {
                    "week": 3,
                    "title": "Week 3: Production Project Implementation",
                    "theme": "Engineering a standout capstone project that proves real-world competency",
                    "days": [
                        {"day": 15, "week": 3, "goal": "Project Architecture Design", "topic": "Problem Scoping & System Diagram", "task": "Diagram end-to-end pipeline and choose public dataset", "estimated_hours": 2, "expected_outcome": "System design blueprint in Excalidraw", "resource_hint": "System Design Primer"},
                        {"day": 16, "week": 3, "goal": "Data Ingestion & Cleaning", "topic": "Robust ETL Pipeline", "task": "Clean and preprocess dataset with anomaly detection", "estimated_hours": 3, "expected_outcome": "Reproducible dataset snapshot", "resource_hint": "Pandas Performance Guide"},
                        {"day": 17, "week": 3, "goal": "Model Experimentation", "topic": "Fine-Tuning & Hyperparameters", "task": "Log experiments with Weights & Biases or MLflow", "estimated_hours": 3, "expected_outcome": "Comparison chart proving model optimization", "resource_hint": "W&B Quickstart"},
                        {"day": 18, "week": 3, "goal": "Backend Service Integration", "topic": "Connecting Model to API", "task": "Hook model weights into FastAPI server with batching", "estimated_hours": 3, "expected_outcome": "Functional backend ready for client requests", "resource_hint": "FastAPI Background Tasks"},
                        {"day": 19, "week": 3, "goal": "Frontend / Demo Interface", "topic": "Streamlit / React Dashboard", "task": "Build intuitive UI allowing recruiters to test inputs and see outputs", "estimated_hours": 3, "expected_outcome": "Interactive web demo", "resource_hint": "Tailwind CSS / Streamlit"},
                        {"day": 20, "week": 3, "goal": "Cloud Deployment", "topic": "Hugging Face Spaces / Render", "task": "Deploy containerized app live on free cloud tier with public URL", "estimated_hours": 2, "expected_outcome": "Live working link for resume", "resource_hint": "HuggingFace Docker Spaces"},
                        {"day": 21, "week": 3, "goal": "Performance Benchmarking", "topic": "Load Testing", "task": "Simulate 50 concurrent requests and document latency p95", "estimated_hours": 2, "expected_outcome": "Measurable benchmark stats for resume bullet", "resource_hint": "Locust.io docs"},
                        {"day": 22, "week": 3, "goal": "Week 3 Project Showcase", "topic": "Demo Recording & Documentation", "task": "Record 60-second Loom demo video and write comprehensive README", "estimated_hours": 2, "expected_outcome": "High-impact repository with badge & GIF demo", "resource_hint": "Make a Readme guidelines"}
                    ]
                },
                {
                    "week": 4,
                    "title": "Week 4: Interview & Portfolio Preparation",
                    "theme": "Cracking technical interviews, resume optimization, and cold outreach",
                    "days": [
                        {"day": 23, "week": 4, "goal": "Core ML Theory Drills", "topic": "Loss Functions & Regularization", "task": "Explain bias-variance tradeoff, L1/L2 regularization, dropout on whiteboard", "estimated_hours": 2, "expected_outcome": "Fluent articulation of theoretical foundations", "resource_hint": "Chip Huyen ML System Design"},
                        {"day": 24, "week": 4, "goal": "System Design for ML", "topic": "Recommendation & Search Systems", "task": "Practice designing YouTube recommendation or fraud detection system", "estimated_hours": 2, "expected_outcome": "Structured communication framework for design rounds", "resource_hint": "ByteByteGo ML System Design"},
                        {"day": 25, "week": 4, "goal": "Coding Assessment Drills", "topic": "LeetCode Medium (Arrays, Trees, Graphs)", "task": "Solve 4 classic interview problems under 25-minute timer", "estimated_hours": 3, "expected_outcome": "Speed and syntax confidence under pressure", "resource_hint": "NeetCode 150"},
                        {"day": 26, "week": 4, "goal": "Resume Bullet Engineering", "topic": "Google XYZ Formula", "task": "Rewrite project bullets: 'Accomplished [X] as measured by [Y] by doing [Z]'", "estimated_hours": 2, "expected_outcome": "ATS-friendly resume targeting 90%+ match", "resource_hint": "Harvard Resume Guide"},
                        {"day": 27, "week": 4, "goal": "GitHub & LinkedIn Audit", "topic": "Developer Brand Polish", "task": "Pin capstone project, add live URL, update skills and tagline", "estimated_hours": 2, "expected_outcome": "Recruiter-ready digital presence", "resource_hint": "CareerScout AI Profile Guide"},
                        {"day": 28, "week": 4, "goal": "Mock Technical Interview", "topic": "Peer / AI Simulation", "task": "Complete 45-minute live technical walkthrough of capstone project", "estimated_hours": 2, "expected_outcome": "Clear, concise defense of architectural decisions", "resource_hint": "Pramp / Interviewing.io"},
                        {"day": 29, "week": 4, "goal": "Targeted Outreach & Referral Prep", "topic": "Warm InMail & Senior Alumni", "task": "Draft personalized messages to 10 alumni at target companies", "estimated_hours": 2, "expected_outcome": "High-converting outreach messages with project proof", "resource_hint": "CareerScout Networking Guide"},
                        {"day": 30, "week": 4, "goal": "Execution & Application Surge", "topic": "Direct Applications", "task": "Apply to top 5 matched opportunities discovered by CareerScout AI", "estimated_hours": 2, "expected_outcome": "Submitted applications with tailored cover notes", "resource_hint": "CareerScout Dashboard Apply Links"}
                    ]
                }
            ]
        }

    @classmethod
    def generate_career_report(
        cls,
        profile: Dict[str, Any],
        opportunities: Optional[List[Dict[str, Any]]] = None
    ) -> Dict[str, Any]:
        """
        Generates full career intelligence report.
        """
        client = cls._get_client()
        skills = profile.get("skills", ["Python"])
        role = profile.get("preferred_role", "AI/ML Engineer")

        fallback_report = {
            "readiness_score": 78,
            "summary": f"Strong candidate profile for entry-level {role} with commendable programming foundations. Upskilling in containerization, system architecture, and specialized frameworks will elevate you into the top 10% of applicants.",
            "top_strengths": [
                f"Core foundations in {', '.join(skills[:3])}.",
                f"Degree background in {profile.get('branch', 'CSE')} provides strong mathematical grounding.",
                "Eagerness to tackle real-world engineering challenges."
            ],
            "top_weaknesses": [
                "Production microservice deployment experience (Docker, Kubernetes, CI/CD).",
                "Large-scale distributed systems or distributed training fundamentals.",
                "Public portfolio demonstration of end-to-end deployed AI applications."
            ],
            "recommended_technologies": [
                "PyTorch (Deep Learning & Transformers)",
                "Docker & FastAPI (Microservice Deployment)",
                "ChromaDB / Qdrant (Vector Search & RAG)",
                "Weights & Biases (Experiment Tracking)",
                "ONNX Runtime (Model Inference Acceleration)"
            ],
            "recommended_projects": [
                {
                    "title": "Low-Latency Multimodal RAG Engine",
                    "description": "Build an API that processes technical PDF documentation and provides instant answers using vector embeddings and Gemini models.",
                    "tech_stack": ["Python", "FastAPI", "Docker", "Qdrant", "Gemini 3.8"],
                    "difficulty": "Intermediate",
                    "portfolio_value": "Demonstrates full-stack AI system design and production REST capabilities."
                },
                {
                    "title": "Edge Object Detection & Tracking for Autonomous Robots",
                    "description": "Implement YOLOv8 with DeepSORT tracking running in real-time on webcam or video stream with FPS telemetry.",
                    "tech_stack": ["Python", "OpenCV", "PyTorch", "ROS2", "TensorRT"],
                    "difficulty": "Advanced",
                    "portfolio_value": "Highly prized by robotics and computer vision companies like Addverb and Tonbo."
                }
            ],
            "recommended_learning_resources": [
                {"name": "Fast.ai Practical Deep Learning", "type": "Free Course", "url_or_topic": "https://course.fast.ai/", "estimated_time": "25 hours"},
                {"name": "Full Stack Deep Learning", "type": "Free Course", "url_or_topic": "https://fullstackdeeplearning.com/", "estimated_time": "20 hours"},
                {"name": "Docker for Python Developers", "type": "Documentation", "url_or_topic": "docker.com/developers", "estimated_time": "6 hours"},
                {"name": "SerpApi Job Market Insights", "type": "Paper/Blog", "url_or_topic": "serpapi.com/blog", "estimated_time": "3 hours"}
            ],
            "recommended_job_types": [
                f"{role} Intern (Summer / 6 Months)",
                "Junior Research Engineer",
                "Autonomous Systems Perception Intern",
                "Applied ML Graduate Trainee"
            ],
            "interview_preparation_topics": [
                "Vectorization vs looping & GPU memory management",
                "Overfitting diagnostics: dropout, weight decay, early stopping",
                "Designing a live recommendation or retrieval service",
                "Writing clean, modular code during timed 45-minute rounds"
            ],
            "portfolio_recommendations": [
                "Host a live web demo (e.g. Hugging Face Spaces or Cloud Run) for every GitHub repo.",
                "Embed benchmark graphs (FPS, latency, accuracy curve) directly in GitHub README.",
                "Write a 3-minute technical blog post summarizing key design trade-offs made in your project."
            ],
            "market_insights": "The Indian tech market has experienced a 42% surge in demand for engineering candidates who can bridge deep learning theory with containerized backend services."
        }

        if not client:
            return fallback_report

        prompt = f"""
Generate an AI Career Report for an Indian college student / graduate:
- Preferred Role: {role}
- Skills: {', '.join(skills)}
- Branch: {profile.get('branch', 'CSE')}
- College: {profile.get('college', 'Engineering College')}

Return a JSON object with:
1. readiness_score: int (between 60 and 95)
2. summary: string
3. top_strengths: list of 3 strings
4. top_weaknesses: list of 3 strings
5. recommended_technologies: list of 5 strings
6. recommended_projects: list of 2 objects (title, description, tech_stack list, difficulty, portfolio_value)
7. recommended_learning_resources: list of 3 objects (name, type, url_or_topic, estimated_time)
8. recommended_job_types: list of 3 strings
9. interview_preparation_topics: list of 4 strings
10. portfolio_recommendations: list of 3 strings
11. market_insights: string

Return ONLY valid JSON.
"""
        try:
            response = client.models.generate_content(
                model="gemini-3.8-flash",
                contents=prompt,
            )
            raw = response.text.strip()
            if raw.startswith("```"):
                raw = raw.strip("`").replace("json", "").strip()
            parsed = json.loads(raw)
            if isinstance(parsed, dict) and "readiness_score" in parsed:
                return parsed
        except Exception as e:
            logger.warning(f"Gemini career report generation failed: {e}. Using fallback.")

        return fallback_report
