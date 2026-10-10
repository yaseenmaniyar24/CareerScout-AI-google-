import React, { useState, useEffect } from 'react';
import { Sparkles, CheckCircle2, Loader2, Search, Cpu, Database, Compass } from 'lucide-react';

interface LoadingStateProps {
  onComplete?: () => void;
}

const AGENT_STAGES = [
  { label: 'Understanding candidate career profile & skills...', icon: Cpu },
  { label: 'Generating intelligent SerpApi search queries...', icon: Sparkles },
  { label: 'Querying SerpApi Google Jobs live engine across India & remote...', icon: Search },
  { label: 'Collecting, normalizing, and deduplicating listings...', icon: Database },
  { label: 'Extracting technical requirements and identifying skill gaps...', icon: Compass },
  { label: 'Executing deterministic 6-factor scoring algorithm...', icon: Cpu },
  { label: 'Synthesizing recommendations & preparing career intelligence...', icon: CheckCircle2 },
];

export const LoadingState: React.FC<LoadingStateProps> = () => {
  const [currentStageIdx, setCurrentStageIdx] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStageIdx((prev) => {
        if (prev < AGENT_STAGES.length - 1) {
          return prev + 1;
        }
        return prev;
      });
    }, 900);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-blue-500/30 shadow-2xl max-w-2xl mx-auto my-12 text-center relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Spinner radar */}
      <div className="relative w-20 h-20 mx-auto mb-6 flex items-center justify-center">
        <div className="absolute inset-0 rounded-full border-2 border-blue-500/20 animate-ping opacity-35" />
        <div className="absolute inset-0 rounded-full border-2 border-blue-500 border-t-transparent animate-spin" />
        <div className="w-12 h-12 rounded-full bg-slate-900 border border-blue-500/40 flex items-center justify-center">
          <Sparkles className="w-6 h-6 text-blue-400 animate-pulse" />
        </div>
      </div>

      <h3 className="text-xl font-bold text-white mb-2">
        CareerScout Agent At Work
      </h3>
      <p className="text-xs text-slate-400 mb-8 max-w-md mx-auto">
        Querying live SerpApi hiring feeds, extracting required technologies, and computing transparent match scores.
      </p>

      {/* Stage-by-stage progression */}
      <div className="space-y-3 text-left max-w-md mx-auto">
        {AGENT_STAGES.map((stage, idx) => {
          const isDone = idx < currentStageIdx;
          const isCurrent = idx === currentStageIdx;
          const isPending = idx > currentStageIdx;
          const Icon = stage.icon;

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 p-2.5 rounded-xl text-xs transition-all ${
                isCurrent
                  ? 'bg-blue-600/15 border border-blue-500/40 text-blue-200'
                  : isDone
                  ? 'text-slate-400 bg-slate-900/40'
                  : 'text-slate-600 opacity-40'
              }`}
            >
              {isDone ? (
                <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
              ) : isCurrent ? (
                <Loader2 className="w-4 h-4 text-blue-400 animate-spin shrink-0" />
              ) : (
                <div className="w-4 h-4 rounded-full border border-slate-700 shrink-0" />
              )}
              <span className={`font-medium ${isCurrent ? 'text-white' : ''}`}>
                {stage.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
