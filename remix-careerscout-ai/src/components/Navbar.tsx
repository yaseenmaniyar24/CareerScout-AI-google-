import React from 'react';
import { Compass, Sparkles, Search, Layers, Calendar, FileText, Activity } from 'lucide-react';

interface NavbarProps {
  currentTab: 'search' | 'dashboard' | 'opportunity' | 'roadmap' | 'report';
  setCurrentTab: (tab: 'search' | 'dashboard' | 'opportunity' | 'roadmap' | 'report') => void;
  isDemoMode: boolean;
  setIsDemoMode: (val: boolean) => void;
  systemStatus: {
    serpapi_configured: boolean;
    gemini_configured: boolean;
  } | null;
}

export const Navbar: React.FC<NavbarProps> = ({
  currentTab,
  setCurrentTab,
  isDemoMode,
  setIsDemoMode,
  systemStatus,
}) => {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/80 bg-[#090d16]/85 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div
            className="flex items-center gap-3 cursor-pointer group"
            onClick={() => setCurrentTab('search')}
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 p-[1px] shadow-lg shadow-blue-500/20">
              <div className="w-full h-full bg-[#0b1120] rounded-[11px] flex items-center justify-center">
                <Compass className="w-5 h-5 text-blue-400 group-hover:rotate-45 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg tracking-tight text-white font-sans">
                  CareerScout <span className="text-blue-400">AI</span>
                </span>
                <span className="text-[10px] font-semibold uppercase tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-300 border border-blue-500/20">
                  SerpApi Hackathon
                </span>
              </div>
              <p className="text-[11px] text-slate-400 hidden sm:block">
                Find. Understand. Become Qualified.
              </p>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="hidden md:flex items-center gap-1">
            <button
              onClick={() => setCurrentTab('search')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'search'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Search className="w-4 h-4" />
              Find Opportunities
            </button>
            <button
              onClick={() => setCurrentTab('dashboard')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'dashboard'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Layers className="w-4 h-4" />
              Dashboard
            </button>
            <button
              onClick={() => setCurrentTab('roadmap')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'roadmap'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <Calendar className="w-4 h-4" />
              30-Day Roadmap
            </button>
            <button
              onClick={() => setCurrentTab('report')}
              className={`flex items-center gap-2 px-3.5 py-1.5 rounded-lg text-sm font-medium transition-all ${
                currentTab === 'report'
                  ? 'bg-blue-600/15 text-blue-400 border border-blue-500/30 shadow-sm'
                  : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
              }`}
            >
              <FileText className="w-4 h-4" />
              AI Career Report
            </button>
          </nav>

          {/* Right status & controls */}
          <div className="flex items-center gap-3">
            {/* Live Data / Demo Mode Toggle */}
            <button
              onClick={() => setIsDemoMode(!isDemoMode)}
              className={`flex items-center gap-2 text-xs px-2.5 py-1.5 rounded-lg font-medium border transition-colors ${
                isDemoMode
                  ? 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                  : 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
              }`}
              title={
                isDemoMode
                  ? 'Demo Mode enabled (using curated high-fidelity sample datasets)'
                  : 'Live search mode (queries SerpApi live Google Jobs engine)'
              }
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  isDemoMode ? 'bg-amber-400' : 'bg-emerald-400 animate-pulse'
                }`}
              />
              <span className="hidden sm:inline">
                {isDemoMode ? 'Demo Mode' : 'SerpApi Live'}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};
