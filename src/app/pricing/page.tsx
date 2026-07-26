"use client";

import { useRouter } from "next/navigation";

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="page">
      <div className="container">
        <h1 className="title">All Features Are Free During Growth</h1>
        <p className="subtitle">
          My Future AI is in open-access mode to maximize adoption and feedback.
          You can use every coaching workflow right now with no upgrade step.
        </p>

        <div className="coachGrid" role="list" aria-label="Available coaching systems">
          <div className="coachCard" role="listitem">💪 Fitness Coach</div>
          <div className="coachCard" role="listitem">💼 Business Coach</div>
          <div className="coachCard" role="listitem">📚 Study Coach</div>
          <div className="coachCard" role="listitem">🧠 Mindset Coach</div>
          <div className="coachCard" role="listitem">🧘 Therapist Coach</div>
          <div className="coachCard" role="listitem">⚡ Productivity Coach</div>
        </div>

        <div className="premiumBox">
          <h2>AI Engine Access Enabled</h2>
          <p>
            Your account includes coaching conversations, memory, analytics,
            missions, progress loops, and specialized experts.
          </p>

          <ul>
            <li>Personalized coach memory and context-aware guidance</li>
            <li>Daily missions, streak systems, and XP progression</li>
            <li>Goal tracking and momentum analytics</li>
            <li>Adaptive coaching intensity and theme personalization</li>
          </ul>

          <div className="price">Free</div>

          <button className="cta" onClick={() => router.push("/dashboard")}>Enter Dashboard</button>
          <button className="secondary" onClick={() => router.push("/premium")}>
            Open Coach Command Center
          </button>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100dvh;
          background: radial-gradient(circle at top, #0b1020, #000);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: calc(18px + env(safe-area-inset-top)) 14px calc(20px + env(safe-area-inset-bottom));
        }

        .container {
          width: 100%;
          max-width: 900px;
        }

        .title {
          font-size: clamp(1.8rem, 5vw, 2rem);
          font-weight: 800;
          margin-bottom: 10px;
        }

        .subtitle {
          opacity: 0.7;
          margin-bottom: 30px;
        }

        .coachGrid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 12px;
          margin-bottom: 30px;
        }

        .coachCard {
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.1);
          color: white;
          min-height: 44px;
        }

        .premiumBox {
          padding: 24px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
        }

        .premiumBox h2 {
          margin-bottom: 10px;
        }

        .premiumBox ul {
          margin-top: 10px;
          padding-left: 18px;
          opacity: 0.85;
        }

        .price {
          font-size: 28px;
          font-weight: 800;
          margin: 20px 0;
        }

        .cta {
          width: 100%;
          padding: 14px;
          min-height: 46px;
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }

        .secondary {
          margin-top: 10px;
          width: 100%;
          padding: 14px;
          min-height: 46px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.2);
          background: rgba(255,255,255,0.06);
          color: white;
          font-weight: 600;
          cursor: pointer;
        }

        @media (max-width: 760px) {
          .coachGrid {
            grid-template-columns: 1fr;
          }
          .premiumBox {
            padding: 18px;
          }
          .price {
            font-size: 24px;
          }
        }
      `}</style>
    </div>
  );
}