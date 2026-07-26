'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

const coachesData = [
  { name: 'Mindset Coach', emoji: '🧠', status: 'online', color: 'from-purple-500 to-purple-600' },
  { name: 'Fitness Coach', emoji: '💪', status: 'online', color: 'from-red-500 to-red-600' },
  { name: 'Money Coach', emoji: '💰', status: 'online', color: 'from-green-500 to-green-600' },
  { name: 'Business Coach', emoji: '📊', status: 'online', color: 'from-orange-500 to-orange-600' },
  { name: 'Study Coach', emoji: '📚', status: 'online', color: 'from-blue-500 to-blue-600' },
  { name: 'Therapist Coach', emoji: '🌿', status: 'online', color: 'from-cyan-500 to-cyan-600' },
];

export function RightCoachesPanel() {
  return (
    <div className="w-full h-full flex flex-col gap-3 overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 px-2">YOUR AI COACHES</h3>

      {coachesData.map((coach) => (
        <div
          key={coach.name}
          className="group cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <GlassCard glow="purple" className="p-3">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <span className="text-lg flex-shrink-0">{coach.emoji}</span>
                <div className="min-w-0">
                  <p className="text-xs font-bold text-white truncate">{coach.name}</p>
                  <p className="text-xs text-white/50">
                    <span className="inline-block w-1.5 h-1.5 rounded-full bg-green-400 mr-1" />
                    {coach.status}
                  </p>
                </div>
              </div>
              <button className="flex-shrink-0 text-white/40 hover:text-white/80 transition-colors">
                💬
              </button>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
}
