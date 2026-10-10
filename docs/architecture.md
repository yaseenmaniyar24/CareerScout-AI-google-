# CareerScout AI - System Architecture

> **"Find the opportunity. Understand the requirements. Become qualified."**  
> *Built for the SerpApi India Hackathon 2026*

---

## 1. High-Level System Architecture

CareerScout AI bridges real-world hiring telemetry with personalized curriculum generation for Indian engineering students and fresh graduates.

```
                           +------------------------+
                           |  Student Profile Form  |
                           |  (Skills, Degree, Role)|
                           +-----------+------------+
                                       |
                                       v
                           +------------------------+
                           |  Intelligent Strategy  |
                           | (Google Gemini 3.8 AI) |
                           +-----------+------------+
                                       |
                     [Generates Targeted Search Queries]
                                       |
                                       v
                           +------------------------+
                           |  SerpApi Live Search   |
                           | (engine: google_jobs)  |
                           +-----------+------------+
                                       |
                          [Live Job Feeds / Raw JSON]
                                       |
                                       v
                           +------------------------+
                           | Normalizer & Deduping  |
                           |  (Extract requirements)|
                           +-----------+------------+
                                       |
                                       v
                           +------------------------+
                           | Deterministic Matching |
                           | (6 Weighted Dimensions)|
                           +-----------+------------+
                                       |
                    +------------------+------------------+
                    |                                     |
                    v                                     v
       +-------------------------+           +-------------------------+
       |   Skill Gap Matrix      |           |    30-Day Curriculum    |
       | (Matched/Partial/Missing|           | (Day-by-Day Roadmap)    |
       +------------+------------+           +------------+------------+
                    |                                     |
                    +------------------+------------------+
                                       |
                                       v
                           +------------------------+
                           |    React Dashboard     |
                           | (Recharts & Analytics) |
                           +------------------------+
```

---

## 2. Why SerpApi is Essential

Traditional career guidance and chatbots rely on stale training data or fictional job samples. **CareerScout AI cannot function effectively without SerpApi.**

1. **Live Indian Market Discovery:** Hiring criteria for AI/ML, Robotics, and Computer Vision in Bengaluru, Pune, Gurugram, and Hyderabad change rapidly with the emergence of generative AI and sovereign LLM initiatives (e.g. Sarvam AI, Krutrim). SerpApi indexes live Google Jobs postings within minutes of publication.
2. **Real Employer Requirements:** Instead of speculating about what companies need, CareerScout AI extracts actual requirements from active postings via SerpApi.
3. **Verified Application URLs:** CareerScout AI connects students directly to the actual company application portal or hiring platform via SerpApi's `apply_options`. It never hallucinates job links.

---

## 3. Deterministic 6-Factor Matching Algorithm

CareerScout AI rejects opaque black-box LLM scoring in favor of an auditable, transparent model:

$$\text{Overall Match Score} = 0.30 \cdot S + 0.25 \cdot R + 0.15 \cdot E + 0.15 \cdot T + 0.10 \cdot L + 0.05 \cdot Q$$

Where:
- **$S$ (Skill Match - 30%):** Ratio of candidate skills matching required job competencies ($1.0 \times \text{Matched} + 0.5 \times \text{Partial}$).
- **$R$ (Role Relevance - 25%):** Target career trajectory overlap with employer title and function.
- **$E$ (Experience Fit - 15%):** Alignment for students, interns, and 0-1 year graduates.
- **$T$ (Technology Match - 15%):** Direct overlap of programming languages, frameworks, and runtime libraries.
- **$L$ (Location Fit - 10%):** Proximity to Indian tech hubs (Bengaluru, Hyderabad, Pune, Gurugram) or remote flexibility.
- **$Q$ (Listing Quality - 5%):** Completeness of verified application links and detailed requirements.

---

## 4. Technical Stack

| Component | Technology | Description |
|---|---|---|
| **Frontend** | React 19, TypeScript, Vite, Tailwind CSS | Fast, accessible dark-mode UI |
| **Data Visualization** | Recharts | Skill Gap Comparison and Benchmark matrix |
| **Backend** | Python FastAPI / Node.js Express runner | RESTful microservice architecture |
| **Live Search Data** | SerpApi (Google Jobs Engine) | Real-time Indian and global job telemetry |
| **AI Agent & Reasoning**| Google Gemini API (`gemini-3.8-flash`) | Query generation, gap synthesis, roadmap |
| **Schemas** | Pydantic / TypeScript Interfaces | End-to-end typed contracts |
