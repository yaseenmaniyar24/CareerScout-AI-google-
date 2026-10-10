import React from 'react';
import { Opportunity, DetailedAnalysis, UserProfile } from '../types';
import { MatchScore } from '../components/MatchScore';
import { SkillGapChart } from '../components/SkillGapChart';
import {
  ArrowLeft,
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  CheckCircle2,
  AlertTriangle,
  Sparkles,
  CalendarDays,
  Briefcase,
  Share2,
  HelpCircle,
} from 'lucide-react';

interface OpportunityDetailsProps {
  opportunity: Opportunity;
  analysis: DetailedAnalysis | null;
  profile: UserProfile;
  onBack: () => void;
  onGenerateRoadmap: (opp: Opportunity) => void;
  isLoadingAnalysis: boolean;
}

export const OpportunityDetails: React.FC<OpportunityDetailsProps> = ({
  opportunity,
  analysis,
  profile,
  onBack,
  onGenerateRoadmap,
  isLoadingAnalysis,
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
      {/* Back button and quick actions */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-xs font-semibold text-slate-400 hover:text-white px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 transition-colors cursor-pointer"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Back to Opportunities</span>
        </button>

        <div className="flex items-center gap-3">
          <button
            onClick={() => onGenerateRoadmap(opportunity)}
            className="px-4 py-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-2 shadow-md shadow-blue-500/25 transition-all cursor-pointer"
          >
            <CalendarDays className="w-4 h-4 text-blue-200" />
            <span>Generate 30-Day Plan</span>
          </button>

          {opportunity.apply_url && (
            <a
              href={opportunity.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-white text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <span>Apply Directly</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
        </div>
      </div>

      {/* Hero Header */}
      <div className="glass-panel p-6 sm:p-8 rounded-3xl border border-slate-800 relative">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {opportunity.thumbnail ? (
              <img
                src={opportunity.thumbnail}
                alt={opportunity.company}
                className="w-16 h-16 rounded-2xl object-cover border border-slate-700 bg-slate-800"
              />
            ) : (
              <div className="w-16 h-16 rounded-2xl bg-slate-800 border border-slate-700 flex items-center justify-center text-blue-400">
                <Building2 className="w-8 h-8" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-sm font-semibold text-slate-300">
                  {opportunity.company}
                </span>
                {opportunity.is_demo && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Demo Dataset
                  </span>
                )}
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
                {opportunity.title}
              </h1>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-xs text-slate-400">
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <MapPin className="w-3.5 h-3.5 text-purple-400" />
              {opportunity.location}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <Briefcase className="w-3.5 h-3.5 text-blue-400" />
              {opportunity.job_type}
            </span>
            <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-slate-900 border border-slate-800">
              <Calendar className="w-3.5 h-3.5 text-slate-400" />
              {opportunity.posted_at}
            </span>
          </div>
        </div>
      </div>

      {/* Transparent Match Score Component */}
      <MatchScore
        score={analysis?.match_score ?? opportunity.match_score}
        skillScore={opportunity.skill_score}
        roleScore={opportunity.role_score}
        experienceScore={opportunity.experience_score}
        technologyScore={opportunity.technology_score}
        locationScore={opportunity.location_score}
        jobQualityScore={opportunity.job_quality_score}
        recommendation={opportunity.recommendation}
        scoringExplanation={analysis?.scoring_explanation}
      />

      {/* Why You Match vs Skill Gaps Two-Column */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Why You Match */}
        <div className="glass-panel p-6 rounded-2xl border border-emerald-500/30 bg-emerald-950/10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-emerald-500/20">
            <CheckCircle2 className="w-5 h-5 text-emerald-400" />
            <h3 className="font-bold text-base text-white">Why You Match</h3>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity.matched_skills.map((skill, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1 rounded-xl bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-xs font-semibold flex items-center gap-1.5"
                >
                  <span>✓</span> {skill}
                </span>
              ))}
            </div>

            {analysis?.candidate_strengths && (
              <div className="space-y-2 pt-2 border-t border-emerald-500/15">
                <span className="text-[11px] font-bold uppercase tracking-wider text-emerald-400/90 block">
                  Identified Strengths:
                </span>
                {analysis.candidate_strengths.map((str, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-emerald-400 mt-0.5">•</span>
                    <span>{str}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Skill Gaps & What is Missing */}
        <div className="glass-panel p-6 rounded-2xl border border-amber-500/30 bg-amber-950/10">
          <div className="flex items-center gap-2 mb-4 pb-3 border-b border-amber-500/20">
            <AlertTriangle className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-base text-white">Skill Gaps to Bridge</h3>
          </div>

          <div className="space-y-3">
            <div className="flex flex-wrap gap-2 mb-4">
              {opportunity.missing_skills.length > 0 ? (
                opportunity.missing_skills.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 rounded-xl bg-amber-500/15 text-amber-300 border border-amber-500/30 text-xs font-semibold flex items-center gap-1.5"
                  >
                    <span>⚠</span> {skill}
                  </span>
                ))
              ) : (
                <span className="text-xs text-emerald-400">
                  Zero major skill gaps detected! Your profile fulfills all primary technical criteria.
                </span>
              )}
            </div>

            {analysis?.missing_requirements && (
              <div className="space-y-2 pt-2 border-t border-amber-500/15">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400/90 block">
                  Employer Expectations:
                </span>
                {analysis.missing_requirements.map((req, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-slate-300">
                    <span className="text-amber-400 mt-0.5">•</span>
                    <span>{req}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Visual Recharts Skill Matrix */}
      <SkillGapChart skillBreakdown={analysis?.skill_breakdown} />

      {/* Deep Role Insights & Interview Focus Areas */}
      {analysis && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <h3 className="font-bold text-sm text-white">Role & Company Insights</h3>
            </div>
            <p className="text-xs text-slate-300 leading-relaxed">
              {analysis.role_insights}
            </p>
          </div>

          <div className="glass-panel p-6 rounded-2xl border border-slate-800">
            <div className="flex items-center gap-2 mb-3">
              <Briefcase className="w-5 h-5 text-blue-400" />
              <h3 className="font-bold text-sm text-white">Technical Interview Focus Areas</h3>
            </div>
            <div className="space-y-2 text-xs text-slate-300">
              {analysis.interview_focus_areas.map((area, idx) => (
                <div key={idx} className="flex items-start gap-2">
                  <span className="text-blue-400 font-mono font-bold">{idx + 1}.</span>
                  <span>{area}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Job Description Full View */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        <h3 className="font-bold text-base text-white mb-3">Job Description & Scope</h3>
        <div className="text-xs text-slate-300 leading-relaxed whitespace-pre-line bg-slate-900/60 p-5 rounded-xl border border-slate-800/80">
          {opportunity.description}
        </div>
      </div>
    </div>
  );
};
