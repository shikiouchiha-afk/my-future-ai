'use client';

import { Sidebar } from '@/components/Sidebar';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

export default function Calendar() {
  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        <div className="flex-1 flex flex-col overflow-hidden">
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-6">
            <h1 className="text-3xl font-bold text-white">Calendar</h1>
            <p className="text-white/50 mt-2">View your scheduled sessions and events</p>
          </div>

          <div className="flex-1 overflow-y-auto p-6">
            <div className="grid grid-cols-7 gap-2 mb-6">
              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((day) => (
                <div key={day} className="text-center text-white/50 font-bold text-sm">
                  {day}
                </div>
              ))}
              {Array.from({ length: 35 }).map((_, i) => {
                const day = i + 1;
                const hasEvent = [5, 12, 19, 26].includes(day);
                return (
                  <div
                    key={i}
                    className={`aspect-square flex items-center justify-center rounded-lg text-sm font-bold transition-all ${
                      hasEvent
                        ? 'bg-gradient-to-br from-purple-500/60 to-cyan-500/60 border border-purple-500/50 text-white'
                        : 'bg-white/5 border border-white/10 text-white/60'
                    }`}
                  >
                    {day <= 31 ? day : ''}
                  </div>
                );
              })}
            </div>

            <div className="space-y-3">
              <h3 className="text-sm font-bold text-white/60">UPCOMING SESSIONS</h3>
              {[
                { time: 'Today 2:00 PM', title: 'Coaching Session', coach: 'Mindset Coach' },
                { time: 'Tomorrow 10:00 AM', title: 'Goal Review', coach: 'Business Coach' },
                { time: 'Friday 6:00 PM', title: 'Weekly Review', coach: 'Life Coach' },
              ].map((event, i) => (
                <div key={i} className="bg-white/5 border border-white/10 rounded-lg p-4 backdrop-blur-md">
                  <p className="text-xs text-white/50">{event.time}</p>
                  <p className="text-white font-bold">{event.title}</p>
                  <p className="text-xs text-purple-400 mt-1">{event.coach}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
