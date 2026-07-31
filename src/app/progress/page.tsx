'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';
import { fetchProgressSummary } from '@/lib/progress/client';
import type { ProgressSummary } from '@/lib/progress/types';

export default function Progress() {
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const nextSummary = await fetchProgressSummary();
      if (nextSummary) {
        setSummary(nextSummary);
      }
    };

    void load();
  }, []);

  const metrics = [
    { label: 'Daily Progress', value: summary?.dailyProgress ?? 0 },
    { label: 'Completion Accuracy', value: summary?.completionPercentage ?? 0 },
    { label: 'Current Streak', value: Math.min(100, (summary?.currentStreak ?? 0) * 10) },
    { label: 'Level Progress', value: Math.min(100, (summary?.xp ?? 0) % 100) },
  ];

  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h1 className="text-3xl font-bold text-white">My Progress</h1>
            <p className="text-white/50 mt-2">Server-validated progress calculated from completion events.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">XP</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.xp ?? 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Level</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.level ?? 1}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Streak</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.currentStreak ?? 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Total Completions</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.totalCompletions ?? 0}</p>
              </div>
            </div>

            <div className="space-y-6">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md"
                >
                  <p className="text-lg font-bold text-white mb-4">{metric.label}</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full" style={{ width: `${metric.value}%` }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
