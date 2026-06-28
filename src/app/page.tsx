"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="page">
      <div className="bg" />
      <div className="neuralGrid" />
      <div className="brainGlow" />

      <div className="container">
        {/* HERO */}
        <div className="badge">🌌 AI Future System</div>

        <h1 className="title">
          Build Your Future With An AI That Learns, Guides & Grows With You
        </h1>

        <p className="subtitle">
          A powerful multi-coach AI system designed for mindset, fitness, money,
          business, learning, and personal transformation — all in one place.
        </p>

        <div className="buttons">
          <button className="primary" onClick={() => router.push("/signup")}>
            🚀 Get Started Free
          </button>

          <button className="secondary" onClick={() => router.push("/login")}>
            🔑 Login
          </button>
        </div>

        {/* VALUE CARDS */}
        <div className="grid">
          <div className="card">
            <h3>🤖 AI Coaches</h3>
            <p>6 specialized AI mentors guiding your life decisions</p>
          </div>

          <div className="card">
            <h3>🧠 Memory System</h3>
            <p>AI remembers your goals, habits & progress</p>
          </div>

          <div className="card">
            <h3>⚡ Real-Time AI</h3>
            <p>Fast, intelligent responses built for action</p>
          </div>
        </div>

        {/* PREMIUM */}
        <div className="premium">
          <div className="badge2">🔥 Premium AI Universe</div>

          <h2>Unlock Your Full AI System</h2>

          <p className="hint">
            Everything you need to upgrade your life — powered by 6 AI specialists working together.
          </p>

          <ul>
            <li>🤖 6 AI Coaches — Mindset • Fitness • Money • Business • Therapy • Study</li>
            <li>⚡ Unlimited AI conversations</li>
            <li>🧠 Memory system that learns your behavior</li>
            <li>🚀 Personalized growth tracking system</li>
            <li>🔥 Priority AI response speed</li>
            <li>🌌 Early access to new features</li>
          </ul>

          <button className="cta" onClick={() => router.push("/pricing")}>
            View Premium Plan
          </button>
        </div>

        <p className="footer">
          © {new Date().getFullYear()} AI Future System — Built for transformation
        </p>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top, #020617, #000);
          color: white;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        /* background glow */
        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(124,58,237,0.25), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(0,180,255,0.25), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(34,197,94,0.15), transparent 40%);
          filter: blur(70px);
        }

        /* neural moving grid */
        .neuralGrid {
          position: absolute;
          inset: 0;
          background-image:
            radial-gradient(circle at 20% 30%, rgba(255,255,255,0.05) 1px, transparent 1px),
            radial-gradient(circle at 70% 60%, rgba(255,255,255,0.05) 1px, transparent 1px),
            radial-gradient(circle at 40% 80%, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 200px 200px;
          animation: gridMove 12s linear infinite;
          opacity: 0.4;
        }

        @keyframes gridMove {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-200px); }
        }

        /* BIG ANIMATED AI BRAIN */
        .brainGlow {
          position: absolute;
          top: 8%;
          left: 50%;
          transform: translateX(-50%);
          width: 700px;
          height: 700px;
          border-radius: 50%;

          background:
            radial-gradient(circle at 30% 30%, rgba(168,85,247,0.7), transparent 40%),
            radial-gradient(circle at 70% 60%, rgba(34,211,238,0.5), transparent 45%),
            radial-gradient(circle at 50% 50%, rgba(99,102,241,0.4), transparent 60%);

          filter: blur(80px);
          animation: brainPulse 4s ease-in-out infinite;
          opacity: 0.9;
        }

        @keyframes brainPulse {
          0%, 100% {
            transform: translateX(-50%) scale(1);
            filter: blur(80px);
          }
          50% {
            transform: translateX(-50%) scale(1.1);
            filter: blur(100px);
          }
        }

        .container {
          max-width: 1000px;
          text-align: center;
          z-index: 2;
        }

        .badge {
          display: inline-block;
          padding: 6px 14px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          margin-bottom: 20px;
          font-size: 12px;
          backdrop-filter: blur(10px);
        }

        .title {
          font-size: 46px;
          font-weight: bold;
          margin-bottom: 12px;
          background: linear-gradient(90deg, #a855f7, #22d3ee, #60a5fa);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          color: #aaa;
          margin-bottom: 30px;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 50px;
          flex-wrap: wrap;
        }

        .primary {
          padding: 12px 22px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: bold;
          cursor: pointer;
          transition: 0.3s;
        }

        .secondary {
          padding: 12px 22px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: white;
          cursor: pointer;
          transition: 0.3s;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 25px rgba(124,58,237,0.4);
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 50px;
        }

        .card {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 18px;
          border-radius: 14px;
          text-align: left;
          backdrop-filter: blur(12px);
        }

        .premium {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(124,58,237,0.4);
          padding: 30px;
          border-radius: 18px;
          text-align: left;
          box-shadow: 0 0 60px rgba(124,58,237,0.25);
          backdrop-filter: blur(14px);
        }

        .badge2 {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          font-size: 12px;
          margin-bottom: 10px;
        }

        .hint {
          color: #aaa;
          margin-bottom: 15px;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 15px 0;
        }

        li {
          margin: 8px 0;
          color: #ccc;
        }

        .cta {
          width: 100%;
          padding: 14px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: bold;
          cursor: pointer;
          margin-top: 10px;
        }

        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }

          .title {
            font-size: 32px;
          }

          .brainGlow {
            width: 350px;
            height: 350px;
          }
        }
      `}</style>
    </div>
  );
}