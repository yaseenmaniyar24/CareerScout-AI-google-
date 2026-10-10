import React from 'react';
import { Briefcase, Target, TrendingUp, AlertTriangle, ShieldCheck } from 'lucide-react';

interface DashboardStatsProps {
  stats: {
    total_opportunities: number;
    strong_matches: number;
    average_match: number;
    critical_skill_gaps: number;
  };
  source: 'serpapi_live' | 'demo_mode';
}

export const DashboardStats: React.FC<DashboardStatsProps> = ({ stats, source }) => {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-8">
      {/* Stat 1 */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Opportunities Found
          </span>
          <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400">
            <Briefcase className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-sans">
            {stats.total_opportunities}
          </span>
          <span className="text-xs text-blue-400 font-medium">Live Listings</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-blue-400" />
          <span>Google Jobs via SerpApi</span>
        </div>
      </div>

      {/* Stat 2 */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Strong Matches
          </span>
          <div className="w-8 h-8 rounded-lg bg-emerald-500/15 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
            <Target className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-emerald-400 font-sans">
            {stats.strong_matches}
          </span>
          <span className="text-xs text-emerald-400/80 font-medium">≥ 78% Fit</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
          <span>High interview probability</span>
        </div>
      </div>

      {/* Stat 3 */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Average Alignment
          </span>
          <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400">
            <TrendingUp className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-white font-sans">
            {stats.average_match}%
          </span>
          <span className="text-xs text-indigo-400 font-medium">Overall Score</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-400" />
          <span>Weighted across 6 vectors</span>
        </div>
      </div>

      {/* Stat 4 */}
      <div className="glass-card p-5 rounded-2xl relative overflow-hidden">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">
            Critical Skill Gaps
          </span>
          <div className="w-8 h-8 rounded-lg bg-amber-500/15 border border-amber-500/30 flex items-center justify-center text-amber-400">
            <AlertTriangle className="w-4 h-4" />
          </div>
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-extrabold text-amber-400 font-sans">
            {stats.critical_skill_gaps}
          </span>
          <span className="text-xs text-amber-400/80 font-medium">Target Competencies</span>
        </div>
        <div className="text-[11px] text-slate-400 mt-2 flex items-center gap-1">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
          <span>Covered in 30-Day Plan</span>
        </div>
      </div>
    </div>
  );
};
