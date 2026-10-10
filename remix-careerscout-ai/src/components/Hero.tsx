import React from 'react';
import { Search, Sparkles, TrendingUp, Compass, Target, ArrowRight, ShieldCheck, Zap } from 'lucide-react';

interface HeroProps {
  onStartSearch: () => void;
  onExploreDemo: () => void;
}

export const Hero: React.FC<HeroProps> = ({ onStartSearch, onExploreDemo }) => {
  return (
    <div className="relative overflow-hidden pt-10 pb-16 md:pt-16 md:pb-20">
      {/* Background radial gradients */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[450px] bg-gradient-to-b from-blue-600/15 via-indigo-600/10 to-transparent blur-3xl -z-10 pointer-events-none" />
      <div className="absolute -top-24 right-10 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl -z-10 pointer-events-none" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        {/* Hackathon Badge */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-blue-500/10 border border-blue-500/25 text-blue-300 text-xs font-semibold mb-6 shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-blue-400" />
          <span>SerpApi India Hackathon 2026 Special Project</span>
          <span className="w-1 h-1 rounded-full bg-blue-400" />
          <span className="text-slate-400 font-normal">For College Students & Fresh Grads</span>
        </div>

        {/* Title & Tagline */}
        <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold tracking-tight text-white mb-6">
          CAREERSCOUT <span className="gradient-text">AI</span>
        </h1>
        
        <p className="text-xl sm:text-2xl font-semibold text-slate-200 mb-4 max-w-3xl mx-auto tracking-tight">
          &ldquo;Find the opportunity. Understand the requirements. Become qualified.&rdquo;
        </p>

        <p className="text-base sm:text-lg text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
          Your AI Career Intelligence Agent. Discover live hiring opportunities, decode real employer requirements, expose your precise skill gaps, and execute a personalized 30-day roadmap.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
          <button
            onClick={onStartSearch}
            className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-500 hover:to-indigo-500 text-white font-semibold text-base shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all duration-200 flex items-center justify-center gap-2.5 group cursor-pointer"
          >
            <Search className="w-5 h-5 text-blue-200 group-hover:scale-110 transition-transform" />
            <span>Find My Opportunities</span>
            <ArrowRight className="w-4 h-4 text-blue-200 group-hover:translate-x-1 transition-transform" />
          </button>

          <button
            onClick={onExploreDemo}
            className="w-full sm:w-auto px-7 py-3.5 rounded-xl bg-slate-800/80 hover:bg-slate-800 text-slate-200 hover:text-white font-medium text-base border border-slate-700/80 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
          >
            <Compass className="w-5 h-5 text-purple-400" />
            <span>Explore Demo (Instant Preview)</span>
          </button>
        </div>

        {/* 4 Core Pillars Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 max-w-4xl mx-auto text-left mb-16">
          <div className="glass-card p-4 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-blue-500/15 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-3">
              <Search className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Live Search
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Powered by SerpApi Google Jobs live engine across India & remote.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-indigo-500/15 border border-indigo-500/30 flex items-center justify-center text-indigo-400 mb-3">
              <Target className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              AI Matching
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Deterministic 6-factor scoring formula from 0-100% with no black-box bias.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-purple-500/15 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-3">
              <TrendingUp className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Skill Gap Analysis
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Classified into Matched, Partial, and Missing skills against job posts.
            </p>
          </div>

          <div className="glass-card p-4 rounded-xl">
            <div className="w-8 h-8 rounded-lg bg-pink-500/15 border border-pink-500/30 flex items-center justify-center text-pink-400 mb-3">
              <Zap className="w-4 h-4" />
            </div>
            <h4 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-1">
              Career Roadmap
            </h4>
            <p className="text-xs text-slate-400 leading-relaxed">
              Actionable 30-day curriculum with daily tasks, hours, and project milestones.
            </p>
          </div>
        </div>

        {/* How It Works Pipeline Banner */}
        <div className="glass-panel p-5 rounded-2xl max-w-4xl mx-auto border border-slate-800">
          <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 text-center mb-4">
            How The Career Intelligence Pipeline Works
          </div>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-auto justify-center">
              <span className="w-5 h-5 rounded-full bg-blue-500/20 text-blue-400 font-bold flex items-center justify-center text-[10px]">1</span>
              <span>Understand Profile</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-auto justify-center">
              <span className="w-5 h-5 rounded-full bg-indigo-500/20 text-indigo-400 font-bold flex items-center justify-center text-[10px]">2</span>
              <span>SerpApi Live Query</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-auto justify-center">
              <span className="w-5 h-5 rounded-full bg-purple-500/20 text-purple-400 font-bold flex items-center justify-center text-[10px]">3</span>
              <span>Deduplicate & Score</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-auto justify-center">
              <span className="w-5 h-5 rounded-full bg-pink-500/20 text-pink-400 font-bold flex items-center justify-center text-[10px]">4</span>
              <span>Extract Skill Gaps</span>
            </div>
            <span className="text-slate-600 hidden sm:inline">→</span>
            <div className="flex items-center gap-2 text-slate-300 font-medium bg-slate-900/80 px-3 py-2 rounded-lg border border-slate-800 w-full sm:w-auto justify-center">
              <span className="w-5 h-5 rounded-full bg-emerald-500/20 text-emerald-400 font-bold flex items-center justify-center text-[10px]">5</span>
              <span>Build 30-Day Plan</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
