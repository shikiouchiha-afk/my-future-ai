'use client';

import React from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

const navItems = [
  { icon: '🎮', label: 'Engine Dashboard', href: '/dashboard', active: true },
  { icon: '💬', label: 'Coaching Center', href: '/premium', active: false },
  { icon: '🤖', label: 'AI Chat', href: '/dashboard', active: false },
  { icon: '📊', label: 'My Progress', href: '/dashboard', active: false },
  { icon: '📈', label: 'Analytics', href: '/dashboard', active: false },
  { icon: '🎯', label: 'Goals', href: '/dashboard', active: false },
  { icon: '⚙️', label: 'Habits', href: '/dashboard', active: false },
  { icon: '📅', label: 'Calendar', href: '/dashboard', active: false },
];

const bottomItems = [
  { icon: '⭐', label: 'Premium', href: '/premium' },
  { icon: '⚙️', label: 'Settings', href: '/settings' },
];

export function Sidebar() {
  return (
    <div className="h-screen w-64 bg-white/5 backdrop-blur-md border-r border-white/10 flex flex-col overflow-hidden">
      {/* Logo / Header */}
      <div className="p-6 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="text-3xl">🚀</div>
          <div>
            <h1 className="text-sm font-bold text-white">My Future AI</h1>
            <p className="text-xs text-white/50">AI Life Engine</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto p-4 space-y-2">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300
              ${
                item.active
                  ? 'bg-gradient-to-r from-purple-500/30 to-cyan-500/30 border border-purple-500/50 text-white'
                  : 'text-white/60 hover:text-white hover:bg-white/5 border border-transparent hover:border-white/10'
              }
            `}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Bottom Items */}
      <div className="border-t border-white/10 p-4 space-y-2">
        {bottomItems.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className={`
              flex items-center gap-3 px-4 py-3 rounded-xl
              transition-all duration-300
              text-white/60 hover:text-white hover:bg-white/5
              border border-transparent hover:border-white/10
            `}
          >
            <span className="text-lg flex-shrink-0">{item.icon}</span>
            <span className="text-sm font-medium">{item.label}</span>
          </Link>
        ))}
      </div>

      {/* User Profile */}
      <div className="border-t border-white/10 p-4">
        <div className="flex items-center gap-3 px-3 py-2 rounded-lg bg-white/5 hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-purple-500 to-cyan-500 flex items-center justify-center text-white font-bold">
            B
          </div>
          <div className="min-w-0">
            <p className="text-xs font-bold text-white truncate">Bank</p>
            <p className="text-xs text-white/50 truncate">Premium Member</p>
          </div>
        </div>
      </div>
    </div>
  );
}
