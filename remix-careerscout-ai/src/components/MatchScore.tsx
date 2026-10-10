import React from 'react';
import { getMatchScoreColor } from '../utils/formatters';
import { Target, CheckCircle2, ShieldCheck, HelpCircle } from 'lucide-react';

interface MatchScoreProps {
  score: number;
  skillScore?: number;
  roleScore?: number;
  experienceScore?: number;
  technologyScore?: number;
  locationScore?: number;
  jobQualityScore?: number;
  recommendation?: string;
  scoringExplanation?: {
    skill_factor?: string;
    role_factor?: string;
    experience_factor?: string;
    tech_factor?: string;
    location_factor?: string;
    quality_factor?: string;
  };
}

export const MatchScore: React.FC<MatchScoreProps> = ({
  score,
  skillScore = 85,
  roleScore = 80,
  experienceScore = 90,
  technologyScore = 75,
  locationScore = 90,
  jobQualityScore = 70,
  recommendation = 'Strongly Recommended',
  scoringExplanation,
}) => {
  const colors = getMatchScoreColor(score);

  const factors = [
    { name: 'Skill Match', weight: '30%', score: skillScore, desc: scoringExplanation?.skill_factor || 'Competency coverage across required skills' },
    { name: 'Role Relevance', weight: '25%', score: roleScore, desc: scoringExplanation?.role_factor || 'Job title & responsibility fit with target goal' },
    { name: 'Experience Fit', weight: '15%', score: experienceScore, desc: scoringExplanation?.experience_factor || 'Internship / student / entry level alignment' },
    { name: 'Tech Stack', weight: '15%', score: technologyScore, desc: scoringExplanation?.tech_factor || 'Language & framework compatibility' },
    { name: 'Location Fit', weight: '10%', score: locationScore, desc: scoringExplanation?.location_factor || 'Proximity or remote work flexibility' },
    { name: 'Listing Quality', weight: '5%', score: jobQualityScore, desc: scoringExplanation?.quality_factor || 'Application link verified and complete details' },
  ];

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex items-center justify-between mb-6 pb-4 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-blue-400" />
          <h3 className="font-bold text-base text-white">Transparent Match Intelligence</h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs text-slate-400">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span>Deterministic 6-Vector Model</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center mb-6">
        {/* Big Score Gauge */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-slate-900/80 border border-slate-800 text-center">
          <div className="relative w-32 h-32 flex items-center justify-center mb-3">
            {/* SVG circular progress */}
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 100 100">
              <circle
                cx="50"
                cy="50"
                r="40"
                className="stroke-slate-800"
                strokeWidth="8"
                fill="none"
              />
              <circle
                cx="50"
                cy="50"
                r="40"
                className={colors.text}
                strokeWidth="8"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * score) / 100}
                strokeLinecap="round"
                fill="none"
                style={{ transition: 'stroke-dashoffset 1s ease-in-out' }}
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-3xl font-black text-white">{score}%</span>
              <span className="text-[10px] font-semibold uppercase text-slate-400">Match</span>
            </div>
          </div>

          <div className={`px-3 py-1 rounded-full text-xs font-bold border ${colors.badge}`}>
            {recommendation}
          </div>
          <p className="text-[11px] text-slate-400 mt-2 max-w-[180px]">
            Based on student profile versus real job requirements.
          </p>
        </div>

        {/* Breakdown Factors List */}
        <div className="md:col-span-2 space-y-3">
          {factors.map((item, idx) => (
            <div key={idx} className="space-y-1">
              <div className="flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-semibold text-slate-200">{item.name}</span>
                  <span className="text-[10px] text-slate-500 font-mono">({item.weight})</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="text-[11px] text-slate-400 font-mono">{item.score}%</span>
                </div>
              </div>

              {/* Progress bar */}
              <div className="w-full h-2 rounded-full bg-slate-800 overflow-hidden">
                <div
                  className={`h-full rounded-full transition-all duration-700 ${
                    item.score >= 80 ? 'bg-emerald-500' : item.score >= 65 ? 'bg-blue-500' : 'bg-amber-500'
                  }`}
                  style={{ width: `${item.score}%` }}
                />
              </div>

              {item.desc && (
                <p className="text-[10px] text-slate-400 leading-tight">
                  {item.desc}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>

      <div className="text-[11px] text-slate-500 bg-slate-900/60 p-3 rounded-xl border border-slate-800 flex items-start gap-2">
        <HelpCircle className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
        <span>
          <strong className="text-slate-300">Why deterministic scoring?</strong> Unlike probabilistic LLM hallucinations that change with every query, CareerScout AI uses an auditable, weighted algorithm ensuring fairness, transparency, and reproducible criteria for hackathon evaluation.
        </span>
      </div>
    </div>
  );
};
