'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import { GlassCard } from '@/components/ui/GlassCard';

const coachesData = [
  { id: 'mindset', name: 'Mindset Coach', emoji: '🧠', status: 'online', color: 'from-purple-500 to-purple-600' },
  { id: 'fitness', name: 'Fitness Coach', emoji: '💪', status: 'online', color: 'from-red-500 to-red-600' },
  { id: 'money', name: 'Money Coach', emoji: '💰', status: 'online', color: 'from-green-500 to-green-600' },
  { id: 'business', name: 'Business Coach', emoji: '📈', status: 'online', color: 'from-orange-500 to-orange-600' },
  { id: 'study', name: 'Study Coach', emoji: '📚', status: 'online', color: 'from-blue-500 to-blue-600' },
  { id: 'therapist', name: 'Therapist', emoji: '❤️', status: 'online', color: 'from-pink-500 to-pink-600' },
];

export function RightCoachesPanel() {
  const router = useRouter();

  const handleCoachClick = (coachId: string) => {
    router.push(`/chat/${coachId}`);
  };

  return (
    <div className="w-full h-full flex flex-col gap-3 overflow-y-auto">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 px-2">YOUR AI COACHES</h3>

      {coachesData.map((coach) => (
        <div
          key={coach.id}
          onClick={() => handleCoachClick(coach.id)}
          className="group cursor-pointer transition-all duration-300 hover:scale-105"
        >
          <GlassCard glow="purple" className="p-3 hover:border-purple-400/60">
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
              <span className="flex-shrink-0 text-white/40 group-hover:text-white/80 transition-colors">
                💬
              </span>
            </div>
          </GlassCard>
        </div>
      ))}
    </div>
  );
}

