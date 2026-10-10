import React, { useState, useMemo } from 'react';
import { Opportunity, UserProfile } from '../types';
import { DashboardStats } from '../components/DashboardStats';
import { SearchPanel } from '../components/SearchPanel';
import { OpportunityCard } from '../components/OpportunityCard';
import { SkillGapChart } from '../components/SkillGapChart';
import {
  Briefcase,
  Sparkles,
  ArrowUpDown,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Flame,
  Search,
  Bookmark,
} from 'lucide-react';

interface DashboardProps {
  opportunities: Opportunity[];
  stats: {
    total_opportunities: number;
    strong_matches: number;
    average_match: number;
    critical_skill_gaps: number;
  };
  executionSource: 'serpapi_live' | 'demo_mode';
  queriesExecuted: string[];
  profile: UserProfile;
  onSearch: (role?: string, location?: string) => void;
  onViewAnalysis: (opp: Opportunity) => void;
  onGenerateRoadmap: (opp: Opportunity) => void;
  onGoToProfile?: () => void;
  isLoading: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({
  opportunities,
  stats,
  executionSource,
  queriesExecuted,
  profile,
  onSearch,
  onViewAnalysis,
  onGenerateRoadmap,
  onGoToProfile,
  isLoading,
}) => {
  const [filterTier, setFilterTier] = useState<'all' | 'strong' | 'recommended' | 'upskill' | 'saved'>('all');
  const [sortBy, setSortBy] = useState<'match' | 'title' | 'company'>('match');
  const [searchQuery, setSearchQuery] = useState('');
  const [savedOpportunities, setSavedOpportunities] = useState<Opportunity[]>(() => {
    try {
      const raw = localStorage.getItem('careerscout_saved_jobs');
      return raw ? JSON.parse(raw) : [];
    } catch {
      return [];
    }
  });

  const savedIds = useMemo(
    () => new Set(savedOpportunities.map((o) => o.id)),
    [savedOpportunities]
  );

  const handleToggleSave = (opp: Opportunity) => {
    setSavedOpportunities((prev) => {
      const exists = prev.some((item) => item.id === opp.id);
      const updated = exists
        ? prev.filter((item) => item.id !== opp.id)
        : [opp, ...prev];
      try {
        localStorage.setItem('careerscout_saved_jobs', JSON.stringify(updated));
      } catch {
        // ignore storage errors
      }
      return updated;
    });
  };

  // Extract all unique missing skills across opportunities
  const aggregateMissingSkills = useMemo(() => {
    const counts: Record<string, number> = {};
    for (const opp of opportunities) {
      for (const skill of opp.missing_skills || []) {
        counts[skill] = (counts[skill] || 0) + 1;
      }
    }
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6);
  }, [opportunities]);

  // Filtered & sorted opportunities
  const filteredOpportunities = useMemo(() => {
    const sourceList = filterTier === 'saved' ? savedOpportunities : opportunities;

    return sourceList
      .filter((opp) => {
        if (filterTier === 'strong' && opp.match_score < 80) return false;
        if (filterTier === 'recommended' && (opp.match_score < 68 || opp.match_score >= 80)) return false;
        if (filterTier === 'upskill' && opp.match_score >= 68) return false;

        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const matchesTitle = opp.title.toLowerCase().includes(q);
          const matchesComp = opp.company.toLowerCase().includes(q);
          const matchesSkills = (opp.matched_skills || []).some((s) => s.toLowerCase().includes(q));
          return matchesTitle || matchesComp || matchesSkills;
        }

        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'match') return b.match_score - a.match_score;
        if (sortBy === 'title') return a.title.localeCompare(b.title);
        return a.company.localeCompare(b.company);
      });
  }, [opportunities, savedOpportunities, filterTier, sortBy, searchQuery]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pb-2">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white">
              Career Intelligence Dashboard
            </h1>
            {executionSource === 'serpapi_live' ? (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
                SerpApi Live Data
              </span>
            ) : (
              <span className="text-xs px-2.5 py-0.5 rounded-full bg-amber-500/10 text-amber-400 border border-amber-500/30 font-semibold">
                Demo Dataset
              </span>
            )}
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Analyzing {opportunities.length} live opportunities discovered for {profile.name || 'Candidate'} ({profile.preferred_role || 'All Roles'})
          </p>
        </div>

        {/* Executed Queries Chips */}
        {queriesExecuted && queriesExecuted.length > 0 && (
          <div className="flex flex-wrap items-center gap-1.5 text-xs">
            <span className="text-slate-500 font-medium">SerpApi Queries:</span>
            {queriesExecuted.map((q, idx) => (
              <span
                key={idx}
                className="px-2 py-0.5 rounded-md bg-slate-800 text-blue-300 font-mono text-[11px] border border-slate-700"
              >
                &ldquo;{q}&rdquo;
              </span>
            ))}
          </div>
        )}
      </div>

      {/* 4 Stats Cards */}
      <DashboardStats stats={stats} source={executionSource} />

      {/* Search & Custom Override Panel */}
      <SearchPanel
        onSearch={onSearch}
        isLoading={isLoading}
        initialRole={profile.preferred_role}
        initialLocation={profile.preferred_location}
      />

      {/* Cross-Cutting Market Skill Gap Analysis banner */}
      {aggregateMissingSkills.length > 0 && (
        <div className="glass-panel p-5 rounded-2xl border border-amber-500/20 bg-amber-500/[0.03]">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <Flame className="w-5 h-5 text-amber-400" />
              <h3 className="font-bold text-sm text-white">
                Market Skill Gap Radar for Indian Tech Hiring
              </h3>
            </div>
            <span className="text-xs text-slate-400">
              Frequently required skills missing from your current profile
            </span>
          </div>

          <div className="flex flex-wrap gap-2">
            {aggregateMissingSkills.map(([skill, count], idx) => (
              <div
                key={idx}
                className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-amber-500/30 text-xs"
              >
                <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
                <span className="font-semibold text-slate-200">{skill}</span>
                <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 font-mono">
                  {count} jobs demand this
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Filter and Sorting Toolbar */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 bg-slate-900/50 p-3 rounded-2xl border border-slate-800">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs text-slate-400 font-medium flex items-center gap-1">
            <Filter className="w-3.5 h-3.5 text-blue-400" /> Filter:
          </span>
          <button
            onClick={() => setFilterTier('all')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTier === 'all'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            All ({opportunities.length})
          </button>
          <button
            onClick={() => setFilterTier('strong')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTier === 'strong'
                ? 'bg-emerald-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Strong Match (≥80%)
          </button>
          <button
            onClick={() => setFilterTier('recommended')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTier === 'recommended'
                ? 'bg-blue-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Recommended (68-79%)
          </button>
          <button
            onClick={() => setFilterTier('upskill')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer ${
              filterTier === 'upskill'
                ? 'bg-amber-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            Upskilling Needed
          </button>
          <button
            onClick={() => setFilterTier('saved')}
            className={`px-3 py-1 rounded-xl text-xs font-semibold transition-colors cursor-pointer flex items-center gap-1.5 ${
              filterTier === 'saved'
                ? 'bg-purple-600 text-white'
                : 'bg-slate-800 text-slate-300 hover:text-white'
            }`}
          >
            <Bookmark className="w-3 h-3" fill={filterTier === 'saved' ? 'currentColor' : 'none'} />
            <span>Saved ({savedOpportunities.length})</span>
          </button>
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search companies or skills..."
              className="w-48 sm:w-56 px-3 py-1.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <ArrowUpDown className="w-3.5 h-3.5 text-slate-400" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-slate-950 border border-slate-800 rounded-xl px-2.5 py-1.5 text-xs text-slate-200 focus:outline-none"
            >
              <option value="match">Match Score (Highest)</option>
              <option value="company">Company (A-Z)</option>
              <option value="title">Role Title</option>
            </select>
          </div>
        </div>
      </div>

      {/* Opportunities Grid */}
      {opportunities.length === 0 && filterTier !== 'saved' ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Briefcase className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Enter Your Profile &amp; Target Role First
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            You haven&apos;t entered your candidate details or searched for a target role yet. Complete your profile with your Name, Target Role, and Skills to get personalized job recommendations.
          </p>
          {onGoToProfile && (
            <button
              onClick={onGoToProfile}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Candidate Profile &amp; Skills</span>
            </button>
          )}
        </div>
      ) : filteredOpportunities.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-5">
          {filteredOpportunities.map((opportunity) => (
            <OpportunityCard
              key={opportunity.id}
              opportunity={opportunity}
              onViewAnalysis={onViewAnalysis}
              onGenerateRoadmap={onGenerateRoadmap}
              isSaved={savedIds.has(opportunity.id)}
              onToggleSave={() => handleToggleSave(opportunity)}
            />
          ))}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Search className="w-10 h-10 text-slate-600 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-white mb-1">No matching opportunities found</h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto mb-4">
            Try adjusting your search criteria or resetting filters to see all available listings.
          </p>
          <button
            onClick={() => {
              setFilterTier('all');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-colors"
          >
            Reset Filters
          </button>
        </div>
      )}
    </div>
  );
};
