'use client';

import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function Analytics() {
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
            <p className="text-white/50 mt-2">Deep insights into your performance patterns</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {['Engagement Trend', 'Coach Interactions', 'Goal Progress', 'Habit Consistency', 'Time Allocation', 'Performance Score'].map((chart) => (
                <div
                  key={chart}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md"
                >
                  <p className="text-sm font-bold text-white/60 mb-4">{chart}</p>
                  <div className="h-32 flex items-end gap-2">
                    {[30, 40, 50, 65, 55, 70, 45].map((height, i) => (
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
