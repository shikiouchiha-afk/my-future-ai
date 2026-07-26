'use client';

import { useEffect, useRef, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { supabase } from '@/lib/supabaseClient';
import { Sidebar } from '@/components/Sidebar';
import { GlassCard } from '@/components/ui/GlassCard';
import { GalaxyBackground } from '@/components/GalaxyBackground';
import { ErrorBoundary } from '@/lib/errorBoundary';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const coachInfo: Record<string, { name: string; emoji: string; title: string; color: string }> = {
  mindset: { name: 'Mindset Coach', emoji: '🧠', title: 'Mental Clarity & Discipline', color: 'purple' },
  fitness: { name: 'Fitness Coach', emoji: '💪', title: 'Training & Recovery', color: 'red' },
  money: { name: 'Money Coach', emoji: '💰', title: 'Finance & Wealth', color: 'green' },
  business: { name: 'Business Coach', emoji: '📈', title: 'Strategy & Growth', color: 'blue' },
  study: { name: 'Study Coach', emoji: '📚', title: 'Learning & Mastery', color: 'yellow' },
  therapist: { name: 'Therapist', emoji: '❤️', title: 'Emotional & Mental Health', color: 'pink' },
};

export default function CoachChat() {
  const router = useRouter();
  const params = useParams();
  const coachId = (params?.coachId as string) || 'mindset';
  const coach = coachInfo[coachId] || coachInfo.mindset;

  const [userId, setUserId] = useState<string | null>(null);
  const [messages, setMessages] = useState<Message[]>([
    {
      role: 'assistant',
      content: `Hey! I'm your ${coach.name}. I'm here to help you with ${coach.title.toLowerCase()}. What's on your mind today?`,
    },
  ]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [coachingIntensity, setCoachingIntensity] = useState<'supportive' | 'balanced' | 'savage'>('balanced');
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const prevLevel = useRef(1);

  // Auth check
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace('/login');
      } else {
        setUserId(data.session.user.id);

        const { data: profile } = await supabase
          .from('profiles')
          .select('coaching_intensity')
          .eq('id', data.session.user.id)
          .single();

        if (profile?.coaching_intensity) {
          setCoachingIntensity(profile.coaching_intensity);
        }
      }
    };

    checkUser();
  }, [router]);

  const xpNeeded = (lvl: number) => Math.floor(100 * Math.pow(lvl, 1.5));
  const calculateXP = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) return 2;
    if (words < 25) return 4;
    if (words < 60) return 8;
    return 12;
  };

  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;
    if (newLevel !== level && prevLevel.current !== newLevel) {
      setLevel(newLevel);
      prevLevel.current = newLevel;
    }
  }, [xp, level]);

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

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
    };

    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    const earnedXp = calculateXP(input);
    setXp((prev) => prev + earnedXp);

    setInput('');
    setLoading(true);

    try {
      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          messages: updatedMessages,
          coachingIntensity,
          userId,
          coach: coachId,
        }),
      });

      const data = await res.json();

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

  const goBack = () => {
    router.back();
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
              <div className="flex items-center gap-4">
                <button
                  onClick={goBack}
                  className="px-4 py-2 bg-white/5 border border-white/10 rounded-lg text-white hover:bg-white/10 transition-all"
                >
                  ← Back
                </button>
                <div>
                  <p className="text-xs text-white/50">Private Chat with</p>
                  <h1 className="text-2xl lg:text-3xl font-bold text-white">
                    {coach.emoji} {coach.name}
                  </h1>
                  <p className="text-xs text-white/50 mt-1">{coach.title}</p>
                </div>
              </div>
              <GlassCard className="px-4 py-2 text-center">
                <p className="text-xs text-white/60">Level</p>
                <p className="text-xl font-bold text-white">{level}</p>
              </GlassCard>
            </div>
          </div>

          {/* Chat Area */}
          <div className="flex-1 overflow-hidden flex flex-col p-4 lg:p-6">
            <GlassCard glow="cyan" className="flex-1 flex flex-col min-h-0">
              <div className="flex-1 overflow-y-auto space-y-3 mb-4 pr-2">
                {messages.map((msg, i) => (
                  <div
                    key={i}
                    className={`text-sm p-4 rounded-lg ${
                      msg.role === 'user'
                        ? 'ml-auto bg-purple-500/20 border border-purple-500/30 text-right max-w-sm'
                        : 'mr-auto bg-cyan-500/10 border border-cyan-500/20 max-w-sm'
                    }`}
                  >
                    {msg.content}
                  </div>
                ))}

                {loading && (
                  <div className="mr-auto bg-cyan-500/10 border border-cyan-500/20 p-4 rounded-lg animate-pulse">
                    {coach.name} is thinking...
                  </div>
                )}
              </div>

              {/* Input */}
              <div className="flex gap-2 pt-4 border-t border-white/10">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
                  placeholder={`Ask ${coach.name}...`}
                  className="flex-1 bg-white/5 border border-white/10 rounded-lg px-4 py-2 text-sm text-white placeholder-white/30 focus:outline-none focus:border-cyan-500/50"
                  disabled={loading}
                />
                <button
                  onClick={sendMessage}
                  disabled={loading}
                  className="px-4 py-2 bg-gradient-to-r from-purple-500 to-cyan-500 rounded-lg text-sm font-bold hover:from-purple-600 hover:to-cyan-600 disabled:opacity-50 transition-all"
                >
                  →
                </button>
              </div>
            </GlassCard>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
