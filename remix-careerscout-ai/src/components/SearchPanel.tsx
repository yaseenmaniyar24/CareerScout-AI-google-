import React, { useState } from 'react';
import { Search, MapPin, Briefcase, Filter, Sparkles, RefreshCw } from 'lucide-react';

interface SearchPanelProps {
  onSearch: (role?: string, location?: string) => void;
  isLoading: boolean;
  initialRole?: string;
  initialLocation?: string;
}

const QUICK_FILTERS = [
  { label: 'AI Internships', role: 'AI Intern', location: 'India' },
  { label: 'ML Internships', role: 'Machine Learning Intern', location: 'Bengaluru' },
  { label: 'Robotics Software', role: 'Robotics Software Intern', location: 'India' },
  { label: 'Computer Vision', role: 'Computer Vision Engineer', location: 'India' },
  { label: 'Data Science', role: 'Data Science Intern', location: 'India' },
  { label: 'Remote AI Jobs', role: 'AI Engineer', location: 'Remote' },
];

export const SearchPanel: React.FC<SearchPanelProps> = ({
  onSearch,
  isLoading,
  initialRole = 'AI/ML Engineer',
  initialLocation = 'India',
}) => {
  const [role, setRole] = useState(initialRole);
  const [location, setLocation] = useState(initialLocation);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(role, location);
  };

  return (
    <div className="glass-panel p-5 rounded-2xl border border-slate-800 shadow-xl mb-8">
      <form onSubmit={handleSubmit} className="flex flex-col md:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <Briefcase className="w-4 h-4 text-blue-400" />
          </div>
          <input
            type="text"
            value={role}
            onChange={(e) => setRole(e.target.value)}
            placeholder="Target role (e.g. AI/ML Engineer, Robotics Intern)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-blue-500 transition-colors"
          />
        </div>

        <div className="relative flex-1 w-full md:max-w-xs">
          <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-slate-400">
            <MapPin className="w-4 h-4 text-purple-400" />
          </div>
          <input
            type="text"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder="Location (e.g. India, Bengaluru, Remote)"
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900/90 border border-slate-700/80 text-white text-sm focus:outline-none focus:border-purple-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full md:w-auto px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold shadow-md shadow-blue-500/20 disabled:opacity-50 transition-all flex items-center justify-center gap-2 cursor-pointer"
        >
          {isLoading ? (
            <RefreshCw className="w-4 h-4 animate-spin text-white" />
          ) : (
            <Search className="w-4 h-4" />
          )}
          <span>Search Live</span>
        </button>
      </form>

      {/* Quick filter chips */}
      <div className="flex flex-wrap items-center gap-2 mt-3 pt-3 border-t border-slate-800/80">
        <span className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider flex items-center gap-1">
          <Filter className="w-3 h-3" /> Quick filters:
        </span>
        {QUICK_FILTERS.map((chip, idx) => (
          <button
            key={idx}
            type="button"
            onClick={() => {
              setRole(chip.role);
              setLocation(chip.location);
              onSearch(chip.role, chip.location);
            }}
            className="text-xs px-2.5 py-1 rounded-lg bg-slate-800/60 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700/60 transition-colors cursor-pointer"
          >
            {chip.label}
          </button>
        ))}
      </div>
    </div>
  );
};
