'use client';

import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function Progress() {
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
            <p className="text-white/50 mt-2">Track your growth and achievements</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-6">
              {['Level Progress', 'Streaks & Habits', 'Goal Completion', 'Time Invested'].map((metric) => (
                <div
                  key={metric}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md"
                >
                  <p className="text-lg font-bold text-white mb-4">{metric}</p>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full" style={{ width: '65%' }} />
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
