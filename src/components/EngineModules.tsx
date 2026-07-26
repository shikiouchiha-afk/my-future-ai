'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

const modules = [
  { name: 'AI Chat', emoji: '💬', description: 'Talk to your coaches' },
  { name: 'Goal Engine', emoji: '🎯', description: 'Track your goals' },
  { name: 'Habit System', emoji: '⚙️', description: 'Build daily habits' },
  { name: 'Analytics', emoji: '📊', description: 'Progress insights' },
  { name: 'Memory Core', emoji: '🧠', description: 'Your history' },
  { name: 'Premium Core', emoji: '⭐', description: 'Unlock everything' },
];

export function EngineModules() {
  return (
    <div className="w-full">
      <h3 className="text-xs font-bold uppercase tracking-widest text-white/60 mb-3">ENGINE MODULES</h3>

      <div className="grid grid-cols-3 gap-2 sm:grid-cols-6">
        {modules.map((module) => (
          <div
            key={module.name}
            className="group cursor-pointer transition-all duration-300 hover:scale-110 h-24"
          >
            <GlassCard glow="cyan" className="h-full flex flex-col items-center justify-center p-2">
              <div className="text-2xl mb-1">{module.emoji}</div>
              <p className="text-xs font-bold text-white text-center leading-tight">{module.name}</p>
              <p className="text-xs text-white/40 text-center">{module.description}</p>
            </GlassCard>
          </div>
        ))}
      </div>
    </div>
  );
}
