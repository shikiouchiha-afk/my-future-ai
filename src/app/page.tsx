'use client';

import Link from 'next/link';
import { useEffect, useRef } from 'react';

export default function Home() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;

    const nodes: Array<{ x: number; y: number; vx: number; vy: number }> = [];
    for (let i = 0; i < 20; i++) {
      nodes.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: (Math.random() - 0.5) * 0.5,
      });
    }

    const animate = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Update and draw nodes
      nodes.forEach((node) => {
        node.x += node.vx;
        node.y += node.vy;

        if (node.x < 0 || node.x > canvas.width) node.vx *= -1;
        if (node.y < 0 || node.y > canvas.height) node.vy *= -1;

        // Draw connections
        nodes.forEach((other) => {
          const dx = other.x - node.x;
          const dy = other.y - node.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 150) {
            ctx.strokeStyle = `rgba(106, 90, 205, ${0.3 * (1 - dist / 150)})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath();
            ctx.moveTo(node.x, node.y);
            ctx.lineTo(other.x, other.y);
            ctx.stroke();
          }
        });

        // Draw node
        const gradient = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, 8);
        gradient.addColorStop(0, 'rgba(0, 180, 255, 0.8)');
        gradient.addColorStop(1, 'rgba(124, 58, 237, 0.2)');
        ctx.fillStyle = gradient;
        ctx.beginPath();
        ctx.arc(node.x, node.y, 4, 0, Math.PI * 2);
        ctx.fill();
      });

      requestAnimationFrame(animate);
    };

    animate();

    const handleResize = () => {
      canvas.width = canvas.offsetWidth;
      canvas.height = canvas.offsetHeight;
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="min-h-screen bg-black text-white overflow-hidden relative">
      {/* Background */}
      <div className="fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-black to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_50%,rgba(124,58,237,0.15)_0%,transparent_50%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,rgba(0,180,255,0.1)_0%,transparent_50%)]" />
      </div>

      {/* Grid pattern */}
      <div className="fixed inset-0 -z-10 opacity-5" style={{ backgroundImage: 'linear-gradient(0deg, transparent 24%, rgba(124,58,237,.1) 25%, rgba(124,58,237,.1) 26%, transparent 27%, transparent 74%, rgba(124,58,237,.1) 75%, rgba(124,58,237,.1) 76%, transparent 77%, transparent), linear-gradient(90deg, transparent 24%, rgba(124,58,237,.1) 25%, rgba(124,58,237,.1) 26%, transparent 27%, transparent 74%, rgba(124,58,237,.1) 75%, rgba(124,58,237,.1) 76%, transparent 77%, transparent)', backgroundSize: '50px 50px' }} />

      {/* Main content */}
      <div className="relative z-10 max-w-7xl mx-auto px-6 py-20 lg:py-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center min-h-[calc(100vh-200px)]">
          {/* Left side - Content */}
          <div className="space-y-8 max-w-lg">
            <div className="space-y-3">
              <div className="inline-block">
                <p className="text-xs font-bold uppercase tracking-widest text-purple-400/80 bg-purple-500/10 border border-purple-500/20 rounded-full px-4 py-2">
                  🔧 COLD SIGNAL • AI COACHING PLATFORM
                </p>
              </div>
              <h1 className="text-5xl lg:text-6xl font-bold text-white leading-tight">
                My Future
              </h1>
              <p className="text-lg text-white/70 leading-relaxed">
                A darker, cooler AI coaching system for discipline, focus, and ruthless progress in business, fitness, learning, and life.
              </p>
            </div>

            <div className="flex gap-4">
              <Link
                href="/signup"
                className="px-8 py-3 bg-gradient-to-r from-purple-600 to-purple-500 rounded-lg font-bold text-white hover:from-purple-700 hover:to-purple-600 transition-all shadow-lg hover:shadow-purple-500/50"
              >
                Start Free
              </Link>
              <Link
                href="/login"
                className="px-8 py-3 bg-white/10 border border-white/20 rounded-lg font-bold text-white hover:bg-white/20 transition-all"
              >
                Sign In
              </Link>
            </div>

            <div className="flex gap-6 text-sm text-white/60">
              <div className="flex items-center gap-2">
                <span>⚡</span>
                <span>Fast AI guidance</span>
              </div>
              <div className="flex items-center gap-2">
                <span>🧠</span>
                <span>Coach memory</span>
              </div>
              <div className="flex items-center gap-2">
                <span>📊</span>
                <span>Responsive</span>
              </div>
            </div>
          </div>

          {/* Right side - Neural Network Visualization */}
          <div className="relative h-full min-h-[500px] hidden lg:flex items-center justify-center">
            <canvas
              ref={canvasRef}
              className="w-full h-full absolute inset-0"
              style={{ filter: 'drop-shadow(0 0 30px rgba(124, 58, 237, 0.3))' }}
            />
            <div className="relative z-10 space-y-4 text-center pointer-events-none">
              <p className="text-xs uppercase tracking-widest text-white/40">Central Cognitive Engine</p>
              <p className="text-sm font-bold text-white/60">Core Cortex</p>
              <div className="space-y-2 text-xs text-white/50">
                <p>⚙️ Active Neural Pathways</p>
                <p>🎯 Optimal Density</p>
              </div>
            </div>
          </div>
        </div>

        {/* Metrics Section */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Specialized Coaches', value: '7+' },
            { label: 'Coach Interactions', value: '1.5K+' },
            { label: 'Active Pathways', value: '847' },
            { label: 'Memory Depth', value: '∞' },
          ].map((metric, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all group"
            >
              <p className="text-2xl lg:text-3xl font-bold text-white group-hover:text-purple-400 transition-colors">
                {metric.value}
              </p>
              <p className="text-xs uppercase tracking-widest text-white/50 mt-2">{metric.label}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 gap-4">
          {[
            {
              title: 'Performance Metrics',
              desc: 'CPU Utilization 98% | Memory Cache 99% | Model Inference Lightning',
              icon: '📊',
            },
            {
              title: 'System Status',
              desc: 'Active coaching engines online | Predictive accuracy trending up',
              icon: '🎯',
            },
            {
              title: 'Coach Agents',
              desc: '7 online coaches. Ready 0/disc. Light-style. Premium available.',
              icon: '💬',
            },
            {
              title: 'Premium Analytics',
              desc: 'Iterative refinement ongoing. Dynamic optimization active.',
              icon: '📈',
            },
          ].map((feature, i) => (
            <div
              key={i}
              className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all"
            >
              <p className="text-2xl mb-2">{feature.icon}</p>
              <p className="font-bold text-white mb-2">{feature.title}</p>
              <p className="text-sm text-white/50">{feature.desc}</p>
            </div>
          ))}
        </div>

        {/* Roadmap Principles */}
        <div className="mt-24 space-y-6">
          <div className="text-center space-y-2">
            <p className="text-xs font-bold uppercase tracking-widest text-purple-400/80">Further Considerations</p>
            <h2 className="text-3xl lg:text-4xl font-bold text-white">Future Roadmap</h2>
            <p className="text-white/60 max-w-3xl mx-auto">
              Build a stable foundation first, then scale analytics, multi-coach intelligence, and enterprise admin capabilities.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all">
              <p className="font-bold text-white mb-2">AI Engine Artwork & Visual System</p>
              <p className="text-sm text-white/50">
                Use a modular futuristic AI core with galaxy context, neon purple-blue lighting, energy effects, smooth animation, and interactive responses so final artwork can replace the placeholder without redesigning the interface.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
              <p className="font-bold text-white mb-2">Analytics Integration (Post-Launch)</p>
              <p className="text-sm text-white/50">
                Add PostHog, Mixpanel, or equivalent tools after growth phase to track retention, DAU, feature usage, coaching engagement, session duration, user journeys, drop-off points, and value-driving features.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-purple-500/30 transition-all">
              <p className="font-bold text-white mb-2">Multi-Coach AI Conversations</p>
              <p className="text-sm text-white/50">
                Expand to simultaneous coach collaboration in one thread, where Business, Money, Mindset, and Productivity coaches provide specialized guidance while sharing relevant user context.
              </p>
            </div>
            <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6 hover:border-cyan-500/30 transition-all">
              <p className="font-bold text-white mb-2">Admin Dashboard Expansion</p>
              <p className="text-sm text-white/50">
                Keep admin separate and scalable with user management, analytics, monitoring, AI usage tracking, feedback, feature flags, announcements, content tooling, and security controls.
              </p>
            </div>
          </div>

          <div className="bg-white/5 backdrop-blur-md border border-white/10 rounded-xl p-6">
            <p className="text-sm font-bold text-white mb-3">Development Priority</p>
            <p className="text-sm text-white/60 leading-relaxed">
              1. Stability and bug-free core experience. 2. Exceptional landing page and onboarding. 3. AI Engine dashboard experience. 4. Personalized AI coaching. 5. User engagement systems. 6. Analytics and growth tools. 7. Advanced AI features. 8. Enterprise/admin capabilities.
            </p>
          </div>
        </div>

        {/* CTA Section */}
        <div className="mt-24 text-center space-y-6">
          <h2 className="text-3xl lg:text-4xl font-bold text-white">Ready to build your future?</h2>
          <p className="text-lg text-white/60 max-w-2xl mx-auto">
            Get access to world-class AI coaching, habit tracking, and accountability systems—all free while we grow.
          </p>
          <Link
            href="/signup"
            className="inline-block px-8 py-4 bg-gradient-to-r from-purple-600 to-cyan-600 rounded-lg font-bold text-white hover:from-purple-700 hover:to-cyan-700 transition-all shadow-lg hover:shadow-purple-500/50"
          >
            Start Building Now →
          </Link>
          <p className="text-sm text-white/40 pt-2">
            Lead Developer: Banks Raphael (Developer Banks)
          </p>
          <p className="text-sm text-white/40">
            Mission: Build the world's leading personal AI mentor with enterprise-grade code quality.
          </p>
        </div>
      </div>
    </div>
  );
}
