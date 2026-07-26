'use client';

import { useRouter } from 'next/navigation';
import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function CoachingCenter() {
  const router = useRouter();

  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h1 className="text-3xl font-bold text-white">Coaching Center</h1>
            <p className="text-white/50 mt-2">Access specialized coaches for your growth areas</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {['Mindset Coach', 'Fitness Coach', 'Business Coach', 'Study Coach', 'Money Coach', 'Therapist'].map((coach) => (
                <div
                  key={coach}
                  className="bg-white/5 border border-white/10 rounded-lg p-6 backdrop-blur-md hover:border-purple-500/50 transition-all"
                >
                  <p className="text-lg font-bold text-white mb-2">{coach}</p>
                  <p className="text-sm text-white/50">Specialized guidance tailored to your needs</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
