import React from 'react';
import { Roadmap as RoadmapType, UserProfile, Opportunity } from '../types';
import { Roadmap } from '../components/Roadmap';
import { Calendar, RefreshCw, Sparkles, Compass } from 'lucide-react';

interface RoadmapPageProps {
  roadmap: RoadmapType | null;
  profile: UserProfile;
  selectedOpportunity: Opportunity | null;
  onGenerateRoadmap: () => void;
  onGoToProfile?: () => void;
  isLoading: boolean;
}

export const RoadmapPage: React.FC<RoadmapPageProps> = ({
  roadmap,
  profile,
  selectedOpportunity,
  onGenerateRoadmap,
  onGoToProfile,
  isLoading,
}) => {
  const targetRole = (profile.preferred_role || selectedOpportunity?.title || '').trim();

  // Automatically regenerate if the user changed their Target Role and the cached roadmap is for an older role
  React.useEffect(() => {
    if (
      targetRole &&
      roadmap &&
      roadmap.target_role.toLowerCase().trim() !== targetRole.toLowerCase().trim() &&
      !isLoading
    ) {
      onGenerateRoadmap();
    }
  }, [targetRole, roadmap, isLoading]);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 pb-12">
      {isLoading ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <RefreshCw className="w-8 h-8 text-blue-400 animate-spin mx-auto mb-4" />
          <h3 className="text-lg font-bold text-white mb-1">
            Synthesizing 30-Day Technical Curriculum for {targetRole}...
          </h3>
          <p className="text-xs text-slate-400 max-w-sm mx-auto">
            Structuring daily modules across core fundamentals, tooling, capstone engineering, and technical interviews.
          </p>
        </div>
      ) : roadmap && targetRole ? (
        <Roadmap roadmap={roadmap} onRefresh={onGenerateRoadmap} />
      ) : !targetRole ? (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Target Role Required for 30-Day Plan
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            You haven&apos;t entered a Target Role or Skills yet. Please complete your Candidate Profile first so we can generate a 30-Day Roadmap tailored to your exact role.
          </p>
          {onGoToProfile && (
            <button
              onClick={onGoToProfile}
              className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              <span>Enter Target Role &amp; Profile</span>
            </button>
          )}
        </div>
      ) : (
        <div className="glass-panel p-12 rounded-3xl text-center border border-slate-800">
          <Compass className="w-12 h-12 text-blue-400 mx-auto mb-4" />
          <h3 className="text-xl font-bold text-white mb-2">
            Ready to Generate Your 30-Day Roadmap
          </h3>
          <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mb-6">
            Generate a custom daily preparation sprint tailored specifically to your target role ({targetRole}) and skill profile.
          </p>
          <button
            onClick={onGenerateRoadmap}
            className="px-6 py-3 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-lg shadow-blue-500/25 transition-all inline-flex items-center gap-2 cursor-pointer"
          >
            <Sparkles className="w-4 h-4" />
            <span>Generate 30-Day Plan for {targetRole}</span>
          </button>
        </div>
      )}
    </div>
  );
};
