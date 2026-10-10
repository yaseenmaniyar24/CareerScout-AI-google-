import React from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Cell,
  Legend,
} from 'recharts';
import { SkillMatchItem } from '../types';
import { TrendingUp, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface SkillGapChartProps {
  skillBreakdown?: SkillMatchItem[];
}

export const SkillGapChart: React.FC<SkillGapChartProps> = ({ skillBreakdown }) => {
  // Default data if none provided
  const data = skillBreakdown && skillBreakdown.length > 0
    ? skillBreakdown.map((item) => ({
        name: item.skill,
        candidateLevel: item.user_level,
        requiredLevel: item.required_level,
        status: item.status,
      }))
    : [
        { name: 'Python', candidateLevel: 100, requiredLevel: 85, status: 'MATCHED' },
        { name: 'Machine Learning', candidateLevel: 95, requiredLevel: 80, status: 'MATCHED' },
        { name: 'Deep Learning', candidateLevel: 90, requiredLevel: 80, status: 'MATCHED' },
        { name: 'TensorFlow', candidateLevel: 85, requiredLevel: 75, status: 'MATCHED' },
        { name: 'PyTorch', candidateLevel: 45, requiredLevel: 80, status: 'PARTIAL' },
        { name: 'Docker', candidateLevel: 20, requiredLevel: 70, status: 'MISSING' },
        { name: 'FastAPI', candidateLevel: 30, requiredLevel: 75, status: 'MISSING' },
      ];

  const getColor = (status: string) => {
    if (status === 'MATCHED') return '#10b981'; // emerald
    if (status === 'PARTIAL') return '#f59e0b'; // amber
    return '#f43f5e'; // rose
  };

  return (
    <div className="glass-panel rounded-2xl p-6 border border-slate-800">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-6 pb-4 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            <h3 className="font-bold text-base text-white">Skill Gap Matrix & Benchmarks</h3>
          </div>
          <p className="text-xs text-slate-400 mt-0.5">
            Real-world comparison of your profile competency against hiring requirements
          </p>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-3 text-xs">
          <span className="flex items-center gap-1 text-emerald-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-500" /> Matched (Ready)
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-amber-500" /> Partial (Needs Polish)
          </span>
          <span className="flex items-center gap-1 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-sm bg-rose-500" /> Missing (Action Gap)
          </span>
        </div>
      </div>

      <div className="h-72 w-full">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart
            data={data}
            margin={{ top: 10, right: 10, left: -20, bottom: 25 }}
          >
            <XAxis
              dataKey="name"
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              angle={-20}
              textAnchor="end"
            />
            <YAxis
              stroke="#64748b"
              fontSize={11}
              tickLine={false}
              domain={[0, 100]}
              unit="%"
            />
            <Tooltip
              content={({ active, payload }) => {
                if (active && payload && payload.length) {
                  const item = payload[0].payload;
                  return (
                    <div className="bg-slate-900 border border-slate-700 p-3 rounded-xl shadow-xl text-xs">
                      <p className="font-bold text-white mb-1">{item.name}</p>
                      <p className="text-blue-400">Your Level: {item.candidateLevel}%</p>
                      <p className="text-slate-400">Job Requirement: {item.requiredLevel}%</p>
                      <p className="mt-1 font-semibold" style={{ color: getColor(item.status) }}>
                        Status: {item.status}
                      </p>
                    </div>
                  );
                }
                return null;
              }}
            />
            <Bar dataKey="candidateLevel" radius={[6, 6, 0, 0]}>
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getColor(entry.status)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Actionable insight note */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 pt-4 border-t border-slate-800 text-xs">
        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Primary Competitive Advantage
          </span>
          <span className="text-emerald-400 font-semibold mt-1 block">
            {data.find((d) => d.status === 'MATCHED')?.name || 'Python & ML Core'}
          </span>
          <span className="text-[11px] text-slate-400">Surpasses recruiter baseline for entry roles.</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Highest ROI Upskill
          </span>
          <span className="text-amber-400 font-semibold mt-1 block">
            {data.find((d) => d.status === 'PARTIAL')?.name || 'PyTorch Architecture'}
          </span>
          <span className="text-[11px] text-slate-400">Fastest to bridge within 7 days.</span>
        </div>

        <div className="p-3 rounded-xl bg-slate-900/50 border border-slate-800">
          <span className="text-slate-400 block text-[10px] uppercase font-bold tracking-wider">
            Critical Filter Bottleneck
          </span>
          <span className="text-rose-400 font-semibold mt-1 block">
            {data.find((d) => d.status === 'MISSING')?.name || 'Docker Containerization'}
          </span>
          <span className="text-[11px] text-slate-400">Eliminates 65% of applicant rejections.</span>
        </div>
      </div>
    </div>
  );
};
