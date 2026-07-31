'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { fetchProgressSummary } from '@/lib/progress/client';
import type { ProgressSummary } from '@/lib/progress/types';
import { Sidebar } from '@/components/Sidebar';
import { AiEngineCore } from '@/components/AiEngineCore';
import { StatsPanel } from '@/components/StatsPanel';
import { RightCoachesPanel } from '@/components/RightCoachesPanel';
import { EngineModules } from '@/components/EngineModules';
import { GlassCard } from '@/components/ui/GlassCard';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [userName, setUserName] = useState('User');
  const [progress, setProgress] = useState<ProgressSummary | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    { role: 'assistant', content: 'Welcome back! I am your personal AI engine. What shall we work on today?' },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachingIntensity, setCoachingIntensity] = useState<'supportive' | 'balanced' | 'savage'>('balanced');

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const level = progress?.level ?? 1;
  const streak = progress?.currentStreak ?? 0;
  const focusLevel = progress?.dailyProgress ?? 0;
  const productivity = progress?.completionPercentage ?? 0;
  const growthRate = Math.min(100, streak * 10);

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setUserId(data.session.user.id);

        const [{ data: profile }, progressSummary] = await Promise.all([
          supabase
            .from('profiles')
            .select('coaching_intensity, name')
            .eq('id', data.session.user.id)
            .single(),
          fetchProgressSummary(),
        ]);

        if (profile) {
          if (profile.coaching_intensity) {
            setCoachingIntensity(profile.coaching_intensity);
            localStorage.setItem('coachingIntensity', profile.coaching_intensity);
          }
          if (profile.name) {
            setUserName(profile.name);
          }
        }

        if (progressSummary) {
          setProgress(progressSummary);
        }
      }
    };

    checkUser();
  }, [router]);

  // Auto scroll
  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      setTimeout(() => {
        messagesContainerRef.current?.scrollTo({
          top: messagesContainerRef.current.scrollHeight,
          behavior: 'smooth',
        });
      }, 100);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Send message
  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setInput('');
    setLoading(true);

    try {
      const { data: authData } = await supabase.auth.getSession();
      const accessToken = authData.session?.access_token;

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
        },
        body: JSON.stringify({
          messages: updatedMessages,
          coachingIntensity,
          userId,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.reply || 'Chat request failed');
      }

      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: data.reply || 'I could not formulate a response.',
        },
      ]);

    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'Connection error. Please try again.',
        },
      ]);
      console.error('Chat error:', error);
    }

    setLoading(false);
  };

  return (
    <ErrorBoundary>
      <GalaxyBackground />
      <div className="flex h-screen bg-black text-white overflow-hidden relative z-10">
        {/* Sidebar - Hidden on mobile */}
        <div className="hidden lg:block w-64 flex-shrink-0">
          <Sidebar />
        </div>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          {/* Header */}
          <div className="border-b border-white/10 bg-white/5 backdrop-blur-md p-4 lg:p-6">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-white">THE FUTURE ENGINE</h1>
                <p className="text-xs lg:text-sm text-white/50 mt-1">Welcome back, {userName} 👋</p>
              </div>
              <div className="flex items-center gap-4">
                <GlassCard className="px-4 py-2 text-center">
                  <p className="text-xs text-white/60">Level</p>
                  <p className="text-xl font-bold text-white">{level}</p>
                </GlassCard>
                <GlassCard className="px-4 py-2 text-center">
                  <p className="text-xs text-white/60">Streak</p>
                  <p className="text-xl font-bold text-white">🔥 {streak}</p>
                </GlassCard>
              </div>
            </div>
          </div>

          {/* Main Grid */}
          <div className="flex-1 overflow-y-auto grid grid-cols-1 lg:grid-cols-3 gap-4 p-4 lg:p-6">
            {/* Left - Stats and Engine */}
            <div className="lg:col-span-1 space-y-4">
              <StatsPanel focusLevel={focusLevel} productivity={productivity} growthRate={growthRate} streak={streak} />
            </div>

            {/* Center - AI Engine Core and Chat */}
            <div className="lg:col-span-1 flex flex-col gap-4">
              {/* Engine Core */}
              <GlassCard glow="purple" className="aspect-square flex items-center justify-center p-4">
                <div className="w-full h-full">
                  <AiEngineCore />
                </div>
              </GlassCard>

              {/* Chat Interface */}
              <GlassCard glow="cyan" className="flex-1 flex flex-col min-h-[300px]">
                <h3 className="text-xs font-bold uppercase text-white/60 mb-3">AI Engine Chat</h3>

                {/* Messages */}
                <div
                  ref={messagesContainerRef}
                  className="flex-1 overflow-y-auto space-y-3 mb-3 pr-2"
                >
                  {messages.map((msg, i) => (
                    <div
                      key={i}
                      className={`text-xs p-3 rounded-lg ${
                        msg.role === 'user'
                          ? 'ml-auto bg-purple-500/20 border border-purple-500/30 text-right max-w-xs'
                          : 'mr-auto bg-cyan-500/10 border border-cyan-500/20 max-w-xs'
                      }`}
                    >
                      {msg.content}
                    </div>
                  ))}

                  {loading && (
                    <div className="mr-auto bg-cyan-500/10 border border-cyan-500/20 p-3 rounded-lg animate-pulse">
                      AI is thinking...
                    </div>
                  )}
                </div>

                {/* Input */}
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                    placeholder="Message..."
                    className="flex-1 bg-white/5 border border-white/10 rounded-lg px-3 py-2 text-xs text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                    disabled={loading}
                  />
                  <button
                    onClick={sendMessage}
                    disabled={loading}
                    className="px-3 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-xs font-bold hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 transition-all"
                  >
                    →
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Right - Coaches Panel */}
            <div className="lg:col-span-1 hidden lg:block">
              <GlassCard glow="purple" className="h-full flex flex-col overflow-hidden">
                <RightCoachesPanel />
              </GlassCard>
            </div>
          </div>

          {/* Engine Modules - Bottom */}
          <div className="border-t border-white/10 bg-white/5 backdrop-blur-md p-4 lg:p-6">
            <EngineModules />
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
