import React from 'react';
import { AlertCircle, RefreshCw, Compass, ArrowLeft } from 'lucide-react';

interface ErrorStateProps {
  message?: string;
  onRetry: () => void;
  onSwitchToDemo: () => void;
}

export const ErrorState: React.FC<ErrorStateProps> = ({
  message,
  onRetry,
  onSwitchToDemo,
}) => {
  return (
    <div className="glass-panel p-8 sm:p-12 rounded-3xl border border-rose-500/30 max-w-xl mx-auto my-12 text-center">
      <div className="w-16 h-16 rounded-2xl bg-rose-500/15 border border-rose-500/30 text-rose-400 flex items-center justify-center mx-auto mb-5">
        <AlertCircle className="w-8 h-8" />
      </div>

      <h3 className="text-xl font-bold text-white mb-2">Live Search Notice</h3>
      <p className="text-xs sm:text-sm text-slate-300 mb-6 leading-relaxed">
        {message ||
          'Live search could not complete. This can happen if the SerpApi monthly quota is exhausted, the network is unreachable, or an API key is missing.'}
      </p>

      <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 text-left text-xs text-slate-400 mb-6 space-y-2">
        <div className="font-semibold text-slate-300">How to proceed:</div>
        <p>• <strong>Instant Demo Mode:</strong> Switch to our curated dataset of verified Indian tech internships (Sarvam AI, Addverb, Krutrim, Ati Motors).</p>
        <p>• <strong>Check SerpApi key:</strong> Configure <code className="text-blue-400">SERPAPI_API_KEY</code> in environment variables.</p>
      </div>

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={onSwitchToDemo}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/40 text-xs font-semibold flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <Compass className="w-4 h-4" />
          <span>Switch to Demo Mode</span>
        </button>

        <button
          onClick={onRetry}
          className="w-full sm:w-auto px-6 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 flex items-center justify-center gap-2 cursor-pointer transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Retry Search</span>
        </button>
      </div>
    </div>
  );
};
