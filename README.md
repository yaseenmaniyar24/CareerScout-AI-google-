# CareerScout AI

> **"Find the opportunity. Understand the requirements. Become qualified."**  
> *Developed for the SerpApi India Hackathon 2026*

---

## 🌟 Overview

**CareerScout AI** is an AI-powered Career Intelligence Agent designed specifically for **Indian college students, engineering undergraduates, and fresh graduates** seeking internships and entry-level positions in AI/ML, Robotics, Computer Vision, and Software Engineering.

Unlike generic chatbots that provide speculative advice from static training data, CareerScout AI uses **live search telemetry from SerpApi** as a core dependency to uncover actual opportunities across Indian tech hubs (Bengaluru, Hyderabad, Pune, Gurugram, Noida) and remote teams. It transparently compares employer requirements against the student's background, identifies precise skill gaps, and generates an actionable **30-day preparation roadmap**.

---

## 🚨 The Problem

1. **Information Asymmetry:** Students in Indian colleges often study outdated syllabi while tech hiring standards evolve rapidly (e.g., emergence of sovereign LLM labs like Sarvam AI, autonomous robotics companies like Addverb and Ati Motors).
2. **Generic Advice ("AI Slop"):** Standard chatbots provide vague recommendations like "Learn Python and do LeetCode," without analyzing specific job specifications.
3. **Application Black Holes:** Students submit hundreds of generic resumes because they do not know their exact competency gaps or how employers evaluate candidates.

---

## 💡 The Solution

CareerScout AI introduces a closed-loop intelligence pipeline:
1. **Understands the candidate:** Ingests degrees, branches, projects, and tech stacks.
2. **Searches live opportunities with SerpApi:** Queries Google Jobs for active openings across India.
3. **Calculates a transparent match score:** Employs a deterministic 6-factor scoring engine (no black-box hallucinations).
4. **Exposes skill gaps:** Classifies required skills into **MATCHED**, **PARTIAL**, and **MISSING**.
5. **Generates a 30-day roadmap:** Delivers a week-by-week, day-by-day technical curriculum with tasks, time budgets, and project milestones to become qualified before applying.

---

## 🔍 Why SerpApi is Essential

Without SerpApi, CareerScout AI cannot function. 
- **Real-Time Hiring Data:** Job market requirements shift within weeks. SerpApi's `google_jobs` engine provides live, verified listings direct from employer portals, LinkedIn, and Indian job boards.
- **Accurate Application Links:** CareerScout AI directs students to the genuine application destination via SerpApi's `apply_options`.
- **Domain-Specific Query Expansion:** The Gemini agent expands student profiles into targeted SerpApi queries tailored to Indian tech hubs.

---

## 🧠 How Gemini AI is Used

Using the official `@google/genai` SDK and the flagship `gemini-3.8-flash` model:
- **Search Strategy Generation:** Synthesizes candidate skills and target roles into optimal SerpApi search queries.
- **Deep Qualitative Fit Analysis:** Pinpoints candidate strengths, employer expectations, and role nuances.
- **Interview Focus Areas:** Predicts technical topics candidates will encounter during whiteboard or technical rounds.
- **30-Day Curriculum Engineering:** Generates structured daily tasks, hours, and expected milestones.

---

## 📐 Deterministic 6-Factor Matching Algorithm

CareerScout AI does not rely on opaque LLM scoring. The scoring engine uses an auditable, weighted formulation:

$$\text{Overall Match Score} = (0.30 \times S) + (0.25 \times R) + (0.15 \times E) + (0.15 \times T) + (0.10 \times L) + (0.05 \times Q)$$

- **30% Skill Match ($S$):** Ratio of candidate skills matching detected employer requirements ($1.0 \times \text{Matched} + 0.5 \times \text{Partial}$).
- **25% Role Relevance ($R$):** Alignment of student goal with job title and description.
- **15% Experience Fit ($E$):** Alignment for students, interns, and fresh graduates.
- **15% Technology Match ($T$):** Concrete programming language and framework overlap.
- **10% Location Fit ($L$):** Indian tech hubs (Bengaluru, Pune, Hyderabad, etc.) or remote availability.
- **5% Job Quality ($Q$):** Verification of application URLs and comprehensive job descriptions.

---

## 🛠️ Technology Stack

- **Frontend:** React 19, TypeScript, Vite, Tailwind CSS
- **Visual Analytics:** Recharts (Visual Skill Gap Matrix)
- **Icons:** Lucide React
- **Live Search Engine:** SerpApi (Google Jobs engine)
- **AI Agent & Reasoning:** Google Gemini API (`gemini-3.8-flash`) via official Google GenAI SDK
- **Backend (Python):** FastAPI, Pydantic, Python-dotenv, Requests, Uvicorn
- **Full-Stack Runner:** Node.js Express server (`server.ts`) for zero-configuration unified execution

---

## 📂 Project Structure

```
careerscout-ai/
├── README.md                     # Comprehensive hackathon documentation
├── .env.example                  # Environment variable blueprint
├── .gitignore                    # Git ignore file protecting credentials
├── LICENSE                       # MIT License
├── docker-compose.yml            # Multi-service container orchestration
├── metadata.json                 # AI Studio app metadata
├── index.html                    # Single-page application entry
├── package.json                  # Node dependencies & execution scripts
├── server.ts                     # Full-stack server with SerpApi & Gemini
├── tsconfig.json                 # TypeScript compiler configuration
├── vite.config.ts                # Vite build configuration
│
├── backend/                      # Python FastAPI Microservice Architecture
│   ├── requirements.txt          # Python dependencies
│   ├── main.py                   # FastAPI application & CORS
│   ├── config.py                 # Environment configuration
│   ├── Dockerfile                # Python container image definition
│   ├── models/
│   │   ├── __init__.py
│   │   └── schemas.py            # Pydantic schemas (Request/Response)
│   ├── services/
│   │   ├── __init__.py
│   │   ├── serpapi_service.py    # SerpApi Google Jobs live connector
│   │   ├── gemini_service.py     # Google GenAI SDK integration
│   │   ├── job_service.py        # Discovery & ranking orchestration
│   │   ├── matching_service.py   # Multi-factor matching integration
│   │   └── roadmap_service.py    # 30-day curriculum service
│   ├── routes/
│   │   ├── __init__.py
│   │   ├── profile.py            # POST /api/profile/analyze
│   │   ├── jobs.py               # POST /api/jobs/search & /api/jobs/analyze
│   │   └── analysis.py           # POST /api/career/report & /api/roadmap/generate
│   └── utils/
│       ├── __init__.py
│       ├── scoring.py            # Deterministic 6-factor scoring engine
│       └── normalization.py      # Job normalization & deduplication
│
├── src/                          # React Frontend Architecture
│   ├── main.tsx                  # React DOM root entry
│   ├── App.tsx                   # Main application controller & state
│   ├── index.css                 # Dark theme styling & glassmorphism
│   ├── types/
│   │   └── index.ts              # TypeScript interface definitions
│   ├── services/
│   │   └── api.ts                # REST API client
│   ├── utils/
│   │   └── formatters.ts         # Formatting & color utilities
│   ├── components/
│   │   ├── Navbar.tsx            # Header navigation & system indicators
│   │   ├── Hero.tsx              # Landing hero & pipeline banner
│   │   ├── ProfileForm.tsx       # Student profile form with Indian presets
│   │   ├── SearchPanel.tsx       # Quick role/location search bar
│   │   ├── OpportunityCard.tsx   # Card component with match score
│   │   ├── MatchScore.tsx        # Gauge and 6-factor score breakdown
│   │   ├── SkillGapChart.tsx     # Recharts skill gap comparison
│   │   ├── Roadmap.tsx           # 30-day interactive daily curriculum
│   │   ├── DashboardStats.tsx    # Summary metric tiles
│   │   ├── LoadingState.tsx      # Agent workflow activity timeline
│   │   ├── ErrorState.tsx        # Graceful error & fallback handling
│   │   └── Footer.tsx            # Footer & hackathon credits
│   └── pages/
│       ├── Home.tsx              # Landing page
│       ├── Dashboard.tsx         # Opportunity feed & filters
│       ├── OpportunityDetails.tsx# Deep job analysis & gap audit
│       ├── RoadmapPage.tsx       # 30-Day execution roadmap
│       └── CareerReportPage.tsx  # Holistic career readiness report
│
└── docs/
    └── architecture.md           # Architectural blueprint
```

---

## 🚀 Installation & Running Locally

### 1. Prerequisites
- **Node.js**: v18 or higher
- **Python**: 3.10+ (if running the Python backend)
- **API Keys**:
  - `SERPAPI_API_KEY`: Obtain from [SerpApi](https://serpapi.com/) (100 free searches/month)
  - `GEMINI_API_KEY`: Obtain from [Google AI Studio](https://aistudio.google.com/)

### 2. Environment Configuration
Copy `.env.example` to `.env`:
```bash
cp .env.example .env
```
Fill in your credentials:
```env
GEMINI_API_KEY="your_gemini_api_key_here"
SERPAPI_API_KEY="your_serpapi_api_key_here"
DEMO_MODE="false"
```

### 3. Option A: Full-Stack Runner (Single Command)
Run the application using the integrated TypeScript server:
```bash
npm install
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) in your browser.

### 4. Option B: Running Python FastAPI + React Frontend

**Terminal 1 — Python Backend:**
```bash
python3 -m venv .venv
source .venv/bin/activate    # On Windows: .venv\Scripts\activate
pip install -r backend/requirements.txt
uvicorn backend.main:app --reload --port 8000
```

**Terminal 2 — React Frontend:**
```bash
npm install
npm run dev
```

---

## 🧪 Hackathon Demo Procedure

1. **Load Presets:** On the Home page, click on any preconfigured student profile, such as **"AI & Robotics (DSU)"** or **"GenAI & Data Science"**.
2. **Find Opportunities:** Click **"Find My Opportunities"**. Observe the agent progress through 7 stages: understanding the profile, generating SerpApi search queries, fetching live postings, and running deterministic scoring.
3. **Inspect the Dashboard:** View the live listings from companies across India (e.g. Sarvam AI, Addverb Technologies, Krutrim, Ati Motors). Filter by match tier (Strong Match $\ge$ 80%).
4. **View Deep Analysis:** Click **"View Analysis"** on an opportunity. Review:
   - The 6-factor score gauge.
   - **Why You Match** vs **Skill Gaps to Bridge**.
   - The visual **Recharts Skill Matrix** comparing candidate competencies against job demands.
   - Employer expectations and technical interview focus areas.
5. **Explore the 30-Day Roadmap:** Click **"Generate 30-Day Plan"**. Inspect the 4-week, day-by-day plan with specific goals, tasks, estimated hours, and expected outcomes.
6. **AI Career Report:** Navigate to **"AI Career Report"** to view the student's Career Readiness Index, top strengths, recommended projects, and free learning resources.

---

## 🔒 Security & Privacy

- **Zero Client-Side Keys:** Neither `SERPAPI_API_KEY` nor `GEMINI_API_KEY` are ever exposed to browser JavaScript bundles.
- **Server-Side Proxy:** All requests to SerpApi and Google Gemini execute via backend routes.
- **Safe Fallbacks:** When API rate limits are reached, the system transitions to realistic demo datasets without breaking or showing stack traces.

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).
d86f5bf (initial commit)
