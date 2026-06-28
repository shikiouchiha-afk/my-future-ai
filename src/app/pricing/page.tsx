"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [yearly, setYearly] = useState(false);

  const buyPremium = async () => {
    try {
      setLoading(true);

      console.log("🔥 BUTTON CLICKED");

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ yearly }),
      });

      console.log("🔥 RESPONSE STATUS:", res.status);

      const text = await res.text();
      console.log("🔥 RAW RESPONSE:", text);

      let data;
      try {
        data = JSON.parse(text);
      } catch {
        console.error("❌ RESPONSE IS NOT JSON");
        return;
      }

      console.log("🔥 PARSED DATA:", data);

      if (!res.ok) {
        console.error("❌ API ERROR:", data);
        return;
      }

      if (!data?.url) {
        console.error("❌ NO STRIPE URL RETURNED");
        return;
      }

      console.log("🚀 REDIRECTING TO STRIPE:", data.url);

      window.location.href = data.url;
    } catch (err) {
      console.error("❌ REQUEST FAILED:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="orbs" />

      <div className="container">
        <h1 className="title">Unlock Your Future AI System 🌌</h1>

        <p className="subtitle">
          Upgrade to a multi-coach intelligence system built for real growth
        </p>

        {/* VALUE LINE */}
        <div className="valueLine">
          Elite System — Premium AI Universe — $26.99/mo — AI that upgrades mindset, body, money, business, emotions & learning in one system.
        </div>

        {/* TOGGLE */}
        <div className="toggle">
          <button
            className={!yearly ? "active" : ""}
            onClick={() => setYearly(false)}
          >
            Monthly
          </button>

          <button
            className={yearly ? "active" : ""}
            onClick={() => setYearly(true)}
          >
            Yearly (Save 25%)
          </button>
        </div>

        {/* CARDS */}
        <div className="grid">
          {/* BASIC */}
          <div className="card">
            <h2>Basic</h2>
            <p className="price">$0</p>

            <ul>
              <li>Limited AI chat</li>
              <li>Basic responses</li>
              <li>Slow speed</li>
            </ul>

            <button className="basicBtn">Current Plan</button>
          </div>

          {/* PREMIUM */}
          <div className="card premium">
            <div className="badge">🔥 Elite System</div>

            <h2>Premium AI Universe</h2>

            <p className="price">
              {yearly ? "$19.99/mo" : "$26.99/mo"}
            </p>

            <div className="coachBox">
              🤖 6 AI Coaches — Mindset • Fitness • Money • Business • Therapy • Study — all in one system
            </div>

            <ul>
              <li>⚡ Unlimited AI conversations</li>
              <li>🧠 Memory system (remembers your life)</li>
              <li>🚀 Personalized growth tracking</li>
              <li>🔥 Faster premium AI responses</li>
              <li>🌌 Priority access to new features</li>
            </ul>

            <button onClick={buyPremium} className="premiumBtn">
              {loading ? "Processing..." : "Upgrade Now"}
            </button>
          </div>
        </div>
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

        .orbs {
          position: absolute;
          width: 100%;
          height: 100%;
          background:
            radial-gradient(circle at 20% 20%, #7c3aed55, transparent 40%),
            radial-gradient(circle at 80% 30%, #00b4ff55, transparent 40%),
            radial-gradient(circle at 50% 80%, #22c55e33, transparent 40%);
          filter: blur(60px);
        }

        .container {
          width: 100%;
          max-width: 1000px;
          text-align: center;
          z-index: 2;
        }

        .title {
          font-size: 44px;
          font-weight: bold;
        }

        .subtitle {
          color: #aaa;
          margin-bottom: 20px;
        }

        .valueLine {
          margin: 10px auto 25px;
          padding: 12px;
          font-size: 13px;
          color: #ddd;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 12px;
        }

        .toggle {
          display: flex;
          justify-content: center;
          gap: 10px;
          margin-bottom: 30px;
        }

        .toggle button {
          padding: 10px 18px;
          border-radius: 999px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: #aaa;
          cursor: pointer;
        }

        .toggle .active {
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
        }

        .card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          padding: 30px;
        }

        .premium {
          border: 1px solid #7c3aed;
          box-shadow: 0 0 50px rgba(124,58,237,0.4);
        }

        .badge {
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          padding: 5px 12px;
          border-radius: 999px;
          font-size: 12px;
          display: inline-block;
          margin-bottom: 10px;
        }

        .price {
          font-size: 34px;
          margin: 10px 0;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 20px 0;
        }

        li {
          margin: 8px 0;
          color: #ccc;
        }

        .coachBox {
          font-size: 13px;
          background: rgba(0,180,255,0.08);
          padding: 14px;
          border-radius: 12px;
          margin: 15px 0;
          text-align: left;
        }

        .premiumBtn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          font-weight: bold;
          cursor: pointer;
          color: white;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
        }

        .basicBtn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 12px;
          background: rgba(255,255,255,0.1);
          color: #888;
        }

        @media (max-width: 768px) {
          .grid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}