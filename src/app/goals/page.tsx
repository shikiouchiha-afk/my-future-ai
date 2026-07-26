'use client';

import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function Goals() {
  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h1 className="text-3xl font-bold text-white">Goals</h1>
            <p className="text-white/50 mt-2">Create and track your strategic objectives</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="space-y-4">
              {[
                { title: 'Build AI product', progress: 75, category: 'Business' },
                { title: 'Read 12 books', progress: 50, category: 'Learning' },
                { title: 'Consistent fitness routine', progress: 85, category: 'Health' },
                { title: 'Master TypeScript', progress: 60, category: 'Skill' },
              ].map((goal) => (
                <div
                  key={goal.title}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md hover:border-purple-500/50 transition-all"
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <p className="text-lg font-bold text-white">{goal.title}</p>
                      <p className="text-xs text-white/50 mt-1">{goal.category}</p>
                    </div>
                    <span className="text-sm font-bold text-cyan-400">{goal.progress}%</span>
                  </div>
                  <div className="w-full bg-white/10 rounded-full h-2">
                    <div 
                      className="bg-gradient-to-r from-purple-500 to-cyan-500 h-2 rounded-full" 
                      style={{ width: `${goal.progress}%` }} 
                    />
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
