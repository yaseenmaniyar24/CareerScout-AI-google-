import React from 'react';
import { Compass, ShieldCheck, Heart, Sparkles, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-800/80 bg-[#090d16] mt-20 pt-12 pb-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Col 1 */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2">
              <Compass className="w-5 h-5 text-blue-400" />
              <span className="font-bold text-sm text-white">CareerScout AI</span>
            </div>
            <p className="text-slate-400 max-w-sm leading-relaxed">
              &ldquo;Find the opportunity. Understand the requirements. Become qualified.&rdquo;
              An AI-powered career intelligence agent designed for Indian college students and fresh graduates.
            </p>
            <div className="flex items-center gap-2 text-[11px] text-slate-400">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Built for SerpApi India Hackathon 2026</span>
            </div>
          </div>

          {/* Col 2 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Core Integrations
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <span className="text-blue-400">⚡</span> SerpApi Google Jobs Engine
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-purple-400">✦</span> AI Skill Gap & Roadmap Engine
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-indigo-400">⚙</span> Deterministic 6-Factor Scoring
              </li>
              <li className="flex items-center gap-1.5">
                <span className="text-emerald-400">📊</span> Recharts Visual Matrix
              </li>
            </ul>
          </div>

          {/* Col 3 */}
          <div className="space-y-2">
            <h4 className="font-semibold text-slate-300 uppercase tracking-wider text-[11px]">
              Privacy & Security
            </h4>
            <ul className="space-y-1.5 text-slate-400">
              <li className="flex items-center gap-1.5">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> Zero Key Exposure in Client
              </li>
              <li>Server-side authenticated proxies</li>
              <li>Strict Pydantic request validation</li>
              <li>No telemetry tracking or data selling</li>
            </ul>
          </div>
        </div>

        <div className="pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
          <p>© 2026 CareerScout AI. Empowering India&apos;s next generation of engineers & researchers.</p>
          <div className="flex items-center gap-4">
            <span className="text-slate-500">Production-Ready Hackathon Release</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
