"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="page">
      <div className="bg" />

      <div className="container">
        <div className="badge">🌌 AI Future System</div>

        <h1 className="title">
          Build Your Future With AI That Thinks With You
        </h1>

        <p className="subtitle">
          A multi-coach AI system for mindset, fitness, money, business,
          learning, and emotional growth — all in one place.
        </p>

        <div className="buttons">
          <button className="primary" onClick={() => router.push("/signup")}>
            Get Started Free
          </button>

          <button className="secondary" onClick={() => router.push("/login")}>
            Login
          </button>
        </div>

        <div className="stats">
          <div className="stat">
            <h3>🤖 6 AI Coaches</h3>
            <p>Personalized guidance in every life area</p>
          </div>

          <div className="stat">
            <h3>⚡ Real-time AI</h3>
            <p>Fast responses powered by your system</p>
          </div>

          <div className="stat">
            <h3>🧠 Memory System</h3>
            <p>AI remembers your progress & goals</p>
          </div>
        </div>

        <div className="pricing">
          <h2>Premium AI Universe</h2>
          <p className="price">$26.99 / month</p>

          <ul>
            <li>🤖 6 AI Coaches — Mindset • Fitness • Money • Business • Therapy • Study</li>
            <li>⚡ Unlimited AI conversations</li>
            <li>🧠 Memory system (remembers your life)</li>
            <li>🚀 Personalized growth tracking</li>
            <li>🔥 Faster premium AI responses</li>
            <li>🌌 Priority access to new features</li>
          </ul>

          <button
            className="cta"
            onClick={() => router.push("/pricing")}
          >
            Upgrade to Premium
          </button>
        </div>

        <p className="footer">
          © {new Date().getFullYear()} AI Future System — built for your growth
        </p>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #020617, #000);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(124,58,237,0.25), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(0,180,255,0.25), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(34,197,94,0.15), transparent 40%);
          filter: blur(60px);
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
        }

        .title {
          font-size: 44px;
          font-weight: bold;
          margin-bottom: 10px;
        }

        .subtitle {
          color: #aaa;
          margin-bottom: 30px;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 12px;
          margin-bottom: 40px;
        }

        .primary {
          padding: 12px 20px;
          border: none;
          border-radius: 10px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .secondary {
          padding: 12px 20px;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.2);
          background: transparent;
          color: white;
          cursor: pointer;
        }

        .stats {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 15px;
          margin-bottom: 50px;
        }

        .stat {
          background: rgba(255,255,255,0.06);
          padding: 15px;
          border-radius: 12px;
        }

        .pricing {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          padding: 30px;
          border-radius: 18px;
          margin-top: 20px;
        }

        .price {
          font-size: 28px;
          margin: 10px 0;
        }

        ul {
          list-style: none;
          padding: 0;
          text-align: left;
          margin: 20px 0;
        }

        li {
          margin: 8px 0;
          color: #ccc;
        }

        .cta {
          margin-top: 15px;
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .footer {
          margin-top: 40px;
          font-size: 12px;
          color: #666;
        }

        @media (max-width: 768px) {
          .stats {
            grid-template-columns: 1fr;
          }

          .title {
            font-size: 32px;
          }
        }
      `}</style>
    </div>
  );
}