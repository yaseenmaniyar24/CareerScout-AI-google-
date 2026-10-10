import React, { useState } from 'react';
import { Opportunity } from '../types';
import { getMatchScoreColor, truncateText } from '../utils/formatters';
import {
  Building2,
  MapPin,
  Calendar,
  ExternalLink,
  Bookmark,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  Sparkles,
  DollarSign,
  Briefcase,
  Share2,
} from 'lucide-react';

interface OpportunityCardProps {
  opportunity: Opportunity;
  onViewAnalysis: (opp: Opportunity) => void;
  onGenerateRoadmap: (opp: Opportunity) => void;
  isSaved?: boolean;
  onToggleSave?: (id: string) => void;
}

export const OpportunityCard: React.FC<OpportunityCardProps> = ({
  opportunity,
  onViewAnalysis,
  onGenerateRoadmap,
  isSaved = false,
  onToggleSave,
}) => {
  const scoreColors = getMatchScoreColor(opportunity.match_score);

  const handleToggle = () => {
    if (onToggleSave) {
      onToggleSave(opportunity.id);
    }
  };

  return (
    <div className="glass-card rounded-2xl p-5 sm:p-6 relative group flex flex-col justify-between">
      <div>
        {/* Top bar: Company & Match Score Badge */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            {opportunity.thumbnail ? (
              <img
                src={opportunity.thumbnail}
                alt={opportunity.company}
                className="w-11 h-11 rounded-xl object-cover border border-slate-700 bg-slate-800"
                onError={(e) => {
                  (e.target as HTMLElement).style.display = 'none';
                }}
              />
            ) : (
              <div className="w-11 h-11 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-slate-300">
                <Building2 className="w-5 h-5 text-blue-400" />
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-slate-200">
                  {opportunity.company}
                </span>
                {opportunity.is_demo && (
                  <span className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20">
                    Demo
                  </span>
                )}
              </div>
              <h3 className="font-bold text-base sm:text-lg text-white group-hover:text-blue-300 transition-colors line-clamp-1">
                {opportunity.title}
              </h3>
            </div>
          </div>

          {/* Match Score Badge */}
          <div
            className={`flex flex-col items-end px-3 py-1.5 rounded-xl border ${scoreColors.badge} shrink-0`}
          >
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-black font-sans tracking-tight">
                {opportunity.match_score}%
              </span>
              <span className="text-[10px] font-semibold uppercase">Match</span>
            </div>
            <span className="text-[10px] font-medium text-slate-400">
              {opportunity.recommendation}
            </span>
          </div>
        </div>

        {/* Location, Salary, Posted Meta */}
        <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-400 mb-4 pb-3 border-b border-slate-800/80">
          <span className="flex items-center gap-1">
            <MapPin className="w-3.5 h-3.5 text-purple-400" />
            {opportunity.location}
          </span>
          {opportunity.salary && (
            <span className="flex items-center gap-1 text-emerald-400 font-medium">
              <DollarSign className="w-3.5 h-3.5" />
              {opportunity.salary}
            </span>
          )}
          <span className="flex items-center gap-1">
            <Briefcase className="w-3.5 h-3.5 text-blue-400" />
            {opportunity.job_type}
          </span>
          <span className="flex items-center gap-1 text-slate-500">
            <Calendar className="w-3.5 h-3.5" />
            {opportunity.posted_at}
          </span>
        </div>

        {/* Short description */}
        <p className="text-xs text-slate-300 leading-relaxed mb-4">
          {truncateText(opportunity.description, 200)}
        </p>

        {/* Skill matching section */}
        <div className="space-y-2 mb-5">
          {/* Matched Skills */}
          {opportunity.matched_skills.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-semibold text-emerald-400 flex items-center gap-1 shrink-0 mt-0.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Matched:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.matched_skills.slice(0, 4).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-300 border border-emerald-500/20"
                  >
                    ✓ {s}
                  </span>
                ))}
                {opportunity.matched_skills.length > 4 && (
                  <span className="text-[10px] text-slate-500 self-center">
                    +{opportunity.matched_skills.length - 4} more
                  </span>
                )}
              </div>
            </div>
          )}

          {/* Missing Skills */}
          {opportunity.missing_skills.length > 0 && (
            <div className="flex items-start gap-2">
              <span className="text-[11px] font-semibold text-amber-400 flex items-center gap-1 shrink-0 mt-0.5">
                <AlertTriangle className="w-3.5 h-3.5" />
                Missing:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {opportunity.missing_skills.slice(0, 3).map((s, idx) => (
                  <span
                    key={idx}
                    className="text-[11px] px-2 py-0.5 rounded-md bg-amber-500/10 text-amber-300 border border-amber-500/20"
                  >
                    ⚠ {s}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-800/80 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onViewAnalysis(opportunity)}
            className="px-3.5 py-1.5 rounded-xl bg-blue-600/15 hover:bg-blue-600/25 text-blue-300 border border-blue-500/30 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Sparkles className="w-3.5 h-3.5 text-blue-400" />
            <span>View Analysis</span>
          </button>

          <button
            onClick={() => onGenerateRoadmap(opportunity)}
            className="px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 text-xs font-medium transition-colors cursor-pointer"
            title="Generate custom 30-day plan targeting this company"
          >
            <span>30-Day Plan</span>
          </button>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleToggle}
            className={`p-2 rounded-xl border transition-colors cursor-pointer ${
              isSaved
                ? 'bg-amber-500/15 text-amber-400 border-amber-500/30'
                : 'bg-slate-800/80 text-slate-400 hover:text-slate-200 border-slate-700'
            }`}
            title={isSaved ? 'Remove Bookmark' : 'Bookmark Opportunity'}
          >
            <Bookmark className="w-3.5 h-3.5" fill={isSaved ? 'currentColor' : 'none'} />
          </button>

          {opportunity.apply_url && (
            <a
              href={opportunity.apply_url}
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white text-xs font-semibold flex items-center gap-1.5 shadow-sm shadow-blue-500/20 transition-all cursor-pointer"
            >
              <span>Apply</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      </div>
    </div>
  );
};
