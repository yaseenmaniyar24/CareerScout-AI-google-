export interface UserProfile {
  name: string;
  education: string;
  college: string;
  degree: string;
  branch: string;
  year: string;
  graduation_year: string;
  preferred_role: string;
  preferred_location: string;
  preferred_work_mode: string;
  experience_level: string;
  skills: string[];
  programming_languages: string[];
  frameworks: string[];
  tools: string[];
  projects: string;
  resume_text: string;
}

export type SkillStatus = 'MATCHED' | 'PARTIAL' | 'MISSING';

export interface SkillMatchItem {
  skill: string;
  user_level: number;
  required_level: number;
  status: SkillStatus;
  importance: 'CRITICAL' | 'IMPORTANT' | 'NICE_TO_HAVE';
}

export interface Opportunity {
  id: string;
  title: string;
  company: string;
  location: string;
  description: string;
  apply_url: string;
  posted_at: string;
  salary: string;
  job_type: string;
  source: string;
  thumbnail?: string;
  match_score: number;
  skill_score: number;
  role_score: number;
  experience_score: number;
  technology_score: number;
  location_score: number;
  job_quality_score: number;
  matched_skills: string[];
  partial_skills: string[];
  missing_skills: string[];
  recommendation: 'Strongly Recommended' | 'Recommended' | 'Consider with Upskilling' | 'Reach Opportunity';
  strengths: string[];
  gap_summary: string;
  is_demo?: boolean;
}

export interface DetailedAnalysis {
  opportunity_id: string;
  title: string;
  company: string;
  match_score: number;
  matched_skills: string[];
  partial_skills: string[];
  missing_skills: string[];
  candidate_strengths: string[];
  missing_requirements: string[];
  recommendation: string;
  role_insights: string;
  interview_focus_areas: string[];
  skill_breakdown: SkillMatchItem[];
  scoring_explanation: {
    skill_factor: string;
    role_factor: string;
    experience_factor: string;
    tech_factor: string;
    location_factor: string;
    quality_factor: string;
  };
}

export interface RoadmapDay {
  day: number;
  week: number;
  goal: string;
  topic: string;
  task: string;
  estimated_hours: number;
  expected_outcome: string;
  resource_hint?: string;
}

export interface RoadmapWeek {
  week: number;
  title: string;
  theme: string;
  days: RoadmapDay[];
}

export interface Roadmap {
  target_role: string;
  target_company?: string;
  total_days: number;
  summary: string;
  weeks: RoadmapWeek[];
}

export interface RecommendedProject {
  title: string;
  description: string;
  tech_stack: string[];
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  portfolio_value: string;
}

export interface LearningResource {
  name: string;
  type: 'Documentation' | 'Free Course' | 'Hands-on Lab' | 'Paper/Blog';
  url_or_topic: string;
  estimated_time: string;
}

export interface CareerReport {
  readiness_score: number;
  summary: string;
  top_strengths: string[];
  top_weaknesses: string[];
  recommended_technologies: string[];
  recommended_projects: RecommendedProject[];
  recommended_learning_resources: LearningResource[];
  recommended_job_types: string[];
  interview_preparation_topics: string[];
  portfolio_recommendations: string[];
  market_insights: string;
}

export interface SearchAgentStep {
  id: string;
  label: string;
  status: 'pending' | 'running' | 'completed' | 'failed';
  details?: string;
}

export interface SearchResponse {
  opportunities: Opportunity[];
  total_found: number;
  queries_executed: string[];
  execution_source: 'serpapi_live' | 'demo_mode';
  stats: {
    total_opportunities: number;
    strong_matches: number;
    average_match: number;
    critical_skill_gaps: number;
  };
}
