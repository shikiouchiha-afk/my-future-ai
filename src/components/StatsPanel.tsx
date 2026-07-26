'use client';

import React from 'react';
import { GlassCard } from '@/components/ui/GlassCard';

interface StatsPanelProps {
  focusLevel?: number;
  productivity?: number;
  growthRate?: number;
  streak?: number;
}

export function StatsPanel({ focusLevel = 92, productivity = 88, growthRate = 94, streak = 47 }: StatsPanelProps) {
  return (
    <div className="grid grid-cols-2 gap-3">
      {/* Focus Level */}
      <GlassCard glow="purple" className="group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-white/60">Focus Level</p>
            <p className="text-2xl font-bold text-white mt-1">{focusLevel}%</p>
          </div>
          <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">🎯</div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-purple-500 to-purple-600 rounded-full transition-all duration-500"
            style={{ width: `${focusLevel}%` }}
          />
        </div>
      </GlassCard>

      {/* Productivity */}
      <GlassCard glow="cyan" className="group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-white/60">Productivity</p>
            <p className="text-2xl font-bold text-white mt-1">{productivity}%</p>
          </div>
          <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">⚡</div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full transition-all duration-500"
            style={{ width: `${productivity}%` }}
          />
        </div>
      </GlassCard>

      {/* Growth Rate */}
      <GlassCard glow="blue" className="group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-white/60">Growth Rate</p>
            <p className="text-2xl font-bold text-white mt-1">{growthRate}%</p>
          </div>
          <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">📈</div>
        </div>
        <div className="w-full h-1.5 bg-white/10 rounded-full mt-3 overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-blue-500 to-blue-600 rounded-full transition-all duration-500"
            style={{ width: `${growthRate}%` }}
          />
        </div>
      </GlassCard>

      {/* Day Streak */}
      <GlassCard glow="purple" className="group">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-xs font-bold uppercase text-white/60">Day Streak</p>
            <p className="text-2xl font-bold text-white mt-1">{streak} Days</p>
          </div>
          <div className="text-3xl opacity-50 group-hover:opacity-100 transition-opacity">🔥</div>
        </div>
        <p className="text-xs text-white/50 mt-3">Keep it going!</p>
      </GlassCard>
    </div>
  );
}
