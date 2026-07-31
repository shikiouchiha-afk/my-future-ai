'use client';

import { useEffect, useState } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';
import { fetchProgressSummary } from '@/lib/progress/client';
import type { ProgressSummary } from '@/lib/progress/types';

export default function Analytics() {
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

  const bars = [
    summary?.dailyProgress ?? 0,
    summary?.completionPercentage ?? 0,
    Math.min(100, (summary?.currentStreak ?? 0) * 10),
    Math.min(100, (summary?.longestStreak ?? 0) * 8),
    Math.min(100, Math.round(((summary?.xp ?? 0) % 100))),
    Math.min(100, (summary?.actionsToday ?? 0) * 20),
    Math.min(100, (summary?.totalCompletions ?? 0) % 100),
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
            <h1 className="text-3xl font-bold text-white">Analytics</h1>
            <p className="text-white/50 mt-2">Data is recalculated from server completion records.</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Daily Progress</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.dailyProgress ?? 0}%</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Current Streak</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.currentStreak ?? 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">XP</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.xp ?? 0}</p>
              </div>
              <div className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                <p className="text-xs text-white/60">Completions Today</p>
                <p className="text-2xl font-bold text-white mt-1">{summary?.actionsToday ?? 0}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Engagement Trend', 'Coach Interactions', 'Goal Progress', 'Habit Consistency', 'Time Allocation', 'Performance Score'].map((chart) => (
                <div
                  key={chart}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md"
                >
                  <p className="text-sm font-bold text-white/60 mb-4">{chart}</p>
                  <div className="h-32 flex items-end gap-2">
                    {bars.map((height, i) => (
                      <div
                        key={i}
                        className="flex-1 bg-gradient-to-t from-purple-500 to-cyan-500 rounded-t opacity-60 hover:opacity-100 transition-opacity"
                        style={{ height: `${height}%` }}
                      />
                    ))}
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
