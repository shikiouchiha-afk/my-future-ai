"use client";

import { useState } from "react";

const freeFeatures = [
  "Basic AI guidance",
  "Limited daily conversations",
  "Entry-level progress tracking",
  "Standard response speed",
];

const premiumFeatures = [
  "Unlimited premium coach conversations",
  "Seven specialized coaches and memory",
  "Personalized analytics and streaks",
  "Daily missions, rewards, and badges",
  "Priority support and premium themes",
];

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const buyPremium = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({}),
      });

      const data = await res.json();
      if (data?.url) {
        window.location.href = data.url;
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="glow" />
      <div className="container">
        <div className="hero">
          <p className="eyebrow">Premium plans</p>
          <h1>Choose the version of My Future that fits your ambition.</h1>
          <p className="subtitle">A polished AI coaching platform with premium intelligence, persistent memory, and world-class experience.</p>
        </div>

        <div className="comparisonGrid">
          <div className="card">
            <div className="cardHead">
              <h2>Free</h2>
              <div className="price">$0<span>/mo</span></div>
            </div>
            <p className="cardText">Great for trying the experience and building a foundation.</p>
            <ul>
              {freeFeatures.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <button className="secondaryBtn">Current plan</button>
          </div>

          <div className="card premiumCard">
            <div className="badge">Most popular</div>
            <div className="cardHead">
              <h2>Premium</h2>
              <div className="price">$26.99<span>/mo</span></div>
            </div>
            <p className="cardText">Unlock full coaching depth, memory, analytics, and a premium AI workspace.</p>
            <ul>
              {premiumFeatures.map((feature) => <li key={feature}>{feature}</li>)}
            </ul>
            <button className="premiumBtn" onClick={buyPremium}>
              {loading ? "Preparing checkout..." : "Upgrade to Premium"}
            </button>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 28px;
          background: linear-gradient(135deg, #04030b, #0f172a 45%, #111827 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .glow {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top, rgba(139,92,246,0.24), transparent 32%);
          filter: blur(30px);
        }
        .container { position: relative; z-index: 1; width: min(1120px, 100%); }
        .hero { text-align: center; margin-bottom: 24px; }
        .eyebrow { text-transform: uppercase; letter-spacing: 0.24em; color: #d8b4fe; font-size: 0.8rem; }
        h1 { font-size: clamp(2rem, 3.3vw, 3rem); margin: 8px 0 12px; }
        .subtitle { color: #cbd5e1; max-width: 720px; margin: 0 auto; line-height: 1.7; }
        .comparisonGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 20px; }
        .card { padding: 24px; border-radius: 24px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); }
        .premiumCard { border-color: rgba(34,211,238,0.4); box-shadow: 0 24px 70px rgba(34,211,238,0.14); }
        .badge { display: inline-block; padding: 7px 12px; border-radius: 999px; background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; font-size: 0.8rem; margin-bottom: 10px; }
        .cardHead { display: flex; justify-content: space-between; align-items: baseline; margin-bottom: 8px; }
        .price { font-size: 2rem; font-weight: 700; }
        .price span { font-size: 0.95rem; color: #cbd5e1; }
        .cardText { color: #cbd5e1; margin-bottom: 14px; line-height: 1.6; }
        ul { list-style: none; padding: 0; margin: 0 0 16px; display: grid; gap: 10px; }
        li { padding-left: 18px; position: relative; color: #e2e8f0; }
        li::before { content: "•"; position: absolute; left: 0; color: #22d3ee; }
        button { width: 100%; border: 0; border-radius: 999px; padding: 12px 16px; font-weight: 700; cursor: pointer; }
        .secondaryBtn { background: rgba(255,255,255,0.08); color: white; }
        .premiumBtn { background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; }
        @media (max-width: 760px) { .comparisonGrid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}