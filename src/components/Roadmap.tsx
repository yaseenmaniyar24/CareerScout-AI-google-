import React, { useState } from 'react';
import { Roadmap as RoadmapType, RoadmapDay } from '../types';
import { exportRoadmapToPDF } from '../utils/pdfExport';
import {
  Calendar,
  CheckCircle2,
  Clock,
  BookOpen,
  Target,
  Sparkles,
  Download,
  Filter,
  Check,
} from 'lucide-react';

interface RoadmapProps {
  roadmap: RoadmapType;
  onRefresh?: () => void;
}

export const Roadmap: React.FC<RoadmapProps> = ({ roadmap, onRefresh }) => {
  const [selectedWeek, setSelectedWeek] = useState<number | 'all'>('all');
  const [completedDays, setCompletedDays] = useState<Set<number>>(new Set());

  const toggleDayCompletion = (dayNum: number) => {
    const updated = new Set(completedDays);
    if (updated.has(dayNum)) {
      updated.delete(dayNum);
    } else {
      updated.add(dayNum);
    }
    setCompletedDays(updated);
  };

  const allDays: RoadmapDay[] = roadmap.weeks.flatMap((w) => w.days);
  const displayedWeeks =
    selectedWeek === 'all'
      ? roadmap.weeks
      : roadmap.weeks.filter((w) => w.week === selectedWeek);

  const completionPercentage = Math.round((completedDays.size / Math.max(roadmap.total_days, 1)) * 100);

  const handleDownload = () => {
    exportRoadmapToPDF(roadmap);
  };

  return (
    <div className="space-y-6">
      {/* Roadmap Header card */}
      <div className="glass-panel p-6 sm:p-8 rounded-2xl border border-slate-800">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 pb-6 mb-6 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-wider px-2.5 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                30-Day Execution Sprint
              </span>
              {roadmap.target_company && (
                <span className="text-xs text-slate-400">Targeting {roadmap.target_company}</span>
              )}
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
              {roadmap.target_role} Roadmap
            </h2>
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-2xl leading-relaxed">
              {roadmap.summary}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {onRefresh && (
              <button
                onClick={onRefresh}
                className="px-4 py-2 rounded-xl bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-xs font-semibold border border-blue-500/30 flex items-center gap-1.5 transition-colors cursor-pointer"
              >
                <Sparkles className="w-4 h-4 text-blue-400" />
                <span>Regenerate Plan</span>
              </button>
            )}
            <button
              onClick={handleDownload}
              className="px-4 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-slate-700 flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4 text-slate-400" />
              <span>Export Plan</span>
            </button>
          </div>
        </div>

        {/* Progress tracker bar */}
        <div className="bg-slate-900/80 p-4 rounded-xl border border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="w-full sm:w-auto">
            <div className="flex items-center justify-between sm:justify-start gap-3 text-xs mb-1.5">
              <span className="font-semibold text-slate-200">Curriculum Progress</span>
              <span className="text-blue-400 font-bold font-mono">
                {completedDays.size} / {roadmap.total_days} Days ({completionPercentage}%)
              </span>
            </div>
            <div className="w-full sm:w-80 h-2 bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-300"
                style={{ width: `${completionPercentage}%` }}
              />
            </div>
          </div>

          {/* Week Filter Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
            <button
              onClick={() => setSelectedWeek('all')}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer ${
                selectedWeek === 'all'
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
              }`}
            >
              All (30 Days)
            </button>
            {roadmap.weeks.map((w) => (
              <button
                key={w.week}
                onClick={() => setSelectedWeek(w.week)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors cursor-pointer shrink-0 ${
                  selectedWeek === w.week
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                }`}
              >
                Week {w.week}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Weeks & Days List */}
      <div className="space-y-8">
        {displayedWeeks.map((week) => (
          <div key={week.week} className="space-y-4">
            {/* Week Heading */}
            <div className="flex items-baseline justify-between gap-3 border-b border-slate-800 pb-2">
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  <span className="w-6 h-6 rounded-lg bg-blue-500/20 text-blue-400 text-xs font-bold flex items-center justify-center">
                    W{week.week}
                  </span>
                  <span>{week.title}</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">{week.theme}</p>
              </div>
              <span className="text-xs font-mono text-slate-500">
                {week.days.length} Days
              </span>
            </div>

            {/* Days Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {week.days.map((day) => {
                const isDone = completedDays.has(day.day);
                return (
                  <div
                    key={day.day}
                    className={`glass-card p-4 rounded-xl border transition-all ${
                      isDone
                        ? 'border-emerald-500/30 bg-emerald-950/10 opacity-75'
                        : 'border-slate-800/80 hover:border-blue-500/30'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3 mb-2">
                      <div className="flex items-center gap-2">
                        <span className="text-[11px] font-bold font-mono px-2 py-0.5 rounded-md bg-slate-800 text-blue-400 border border-slate-700">
                          Day {day.day}
                        </span>
                        <h4 className={`font-semibold text-sm ${isDone ? 'line-through text-slate-400' : 'text-white'}`}>
                          {day.goal}
                        </h4>
                      </div>

                      <button
                        onClick={() => toggleDayCompletion(day.day)}
                        className={`w-6 h-6 rounded-md border flex items-center justify-center transition-colors cursor-pointer shrink-0 ${
                          isDone
                            ? 'bg-emerald-500 border-emerald-400 text-slate-950'
                            : 'border-slate-700 hover:border-slate-500 text-transparent'
                        }`}
                        title={isDone ? 'Mark Incomplete' : 'Mark Completed'}
                      >
                        <Check className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <div className="text-xs text-indigo-300 font-medium mb-1.5 flex items-center gap-1.5">
                      <Target className="w-3.5 h-3.5 text-indigo-400" />
                      <span>{day.topic}</span>
                    </div>

                    <p className="text-xs text-slate-300 leading-relaxed mb-3">
                      {day.task}
                    </p>

                    <div className="pt-2 border-t border-slate-800/60 flex flex-wrap items-center justify-between gap-2 text-[11px] text-slate-400">
                      <span className="flex items-center gap-1">
                        <Clock className="w-3 h-3 text-slate-500" />
                        {day.estimated_hours} hrs dedicated
                      </span>

                      {day.resource_hint && (
                        <span className="flex items-center gap-1 text-slate-400 truncate max-w-[200px]" title={day.resource_hint}>
                          <BookOpen className="w-3 h-3 text-purple-400 shrink-0" />
                          <span className="truncate">{day.resource_hint}</span>
                        </span>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
