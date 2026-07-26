'use client';

import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function Habits() {
  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h1 className="text-3xl font-bold text-white">Habits</h1>
            <p className="text-white/50 mt-2">Build and maintain your daily routines</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {[
                { habit: 'Morning meditation', streak: 42, target: 'Daily', status: '✓' },
                { habit: 'Code for 2 hours', streak: 28, target: 'Weekdays', status: '✓' },
                { habit: 'Exercise', streak: 15, target: 'Daily', status: '✓' },
                { habit: 'Read before bed', streak: 35, target: 'Daily', status: '✓' },
              ].map((item) => (
                <div
                  key={item.habit}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md hover:border-cyan-500/50 transition-all"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      <p className="text-lg font-bold text-white">{item.habit}</p>
                      <p className="text-xs text-white/50 mt-1">{item.target}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-purple-400">🔥 {item.streak}</p>
                      <p className="text-xs text-white/50">day streak</p>
                    </div>
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
