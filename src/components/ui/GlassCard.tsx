'use client';

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  title?: string;
  icon?: React.ReactNode;
  glow?: 'purple' | 'cyan' | 'blue' | 'none';
}

export function GlassCard({ children, className = '', title, icon, glow = 'none' }: GlassCardProps) {
  const glowColor = {
    purple: 'shadow-[0_0_20px_rgba(168,85,247,0.3)]',
    cyan: 'shadow-[0_0_20px_rgba(34,211,238,0.3)]',
    blue: 'shadow-[0_0_20px_rgba(59,130,246,0.3)]',
    none: '',
  }[glow];

  return (
    <div
      className={`
        rounded-2xl p-6
        bg-white/5 backdrop-blur-md
        border border-white/10 hover:border-white/20
        transition-all duration-300
        ${glowColor}
        ${className}
      `}
    >
      {title && (
        <div className="flex items-center gap-3 mb-4">
          {icon && <div className="text-xl">{icon}</div>}
          <h3 className="text-sm font-bold uppercase tracking-widest text-white/80">{title}</h3>
        </div>
      )}
      {children}
    </div>
  );
}
