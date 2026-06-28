"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);

  const buyPremium = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
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
      <div className="ocean" />
      <div className="bubbles" />

      <div className="container">
        <h1 className="title">🌊 Dive Into Your Future AI Universe</h1>

        <p className="subtitle">
          One intelligent system. Six AI minds. Infinite personal growth.
        </p>

        <div className="glowLine">
          Premium AI Universe — $26.99/mo — built to upgrade your mindset, body, money, business & life.
        </div>

        {/* CARDS */}
        <div className="grid">

          {/* BASIC */}
          <div className="card">
            <h2>Basic</h2>
            <p className="price">$0</p>

            <ul>
              <li>Limited AI conversations</li>
              <li>Standard response speed</li>
              <li>No memory system</li>
              <li>Basic support</li>
            </ul>

            <button className="basicBtn">Current Plan</button>
          </div>

          {/* PREMIUM */}
          <div className="card premium">
            <div className="badge">🌊 Premium AI Universe</div>

            <h2>Elite Deep Ocean System</h2>

            <p className="price">$26.99/mo</p>

            <div className="coachBox">
              🤖 <b>6 AI Coaches in One System</b><br />
              Mindset • Fitness • Money • Business • Therapy • Study
            </div>

            <ul>
              <li>⚡ Unlimited AI conversations</li>
              <li>🧠 Memory system (remembers your life)</li>
              <li>🚀 Personalized growth tracking</li>
              <li>🔥 Faster premium AI responses</li>
              <li>🌌 Priority access to new features</li>
              <li>💎 Deep personalization across all chats</li>
            </ul>

            <button onClick={buyPremium} className="premiumBtn">
              {loading ? "Entering Ocean..." : "Unlock Premium AI Universe"}
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
          background: radial-gradient(circle at top, #020617, #000814);
          color: white;
          padding: 40px;
          position: relative;
          overflow: hidden;
        }

        /* 🌊 DEEP OCEAN EFFECT */
        .ocean {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(0,180,255,0.25), transparent 45%),
            radial-gradient(circle at 80% 40%, rgba(30,64,175,0.25), transparent 50%),
            radial-gradient(circle at 50% 80%, rgba(124,58,237,0.2), transparent 55%);
          filter: blur(70px);
        }

        /* bubbles animation */
        .bubbles::before {
          content: "";
          position: absolute;
          inset: 0;
          background-image: radial-gradient(circle, rgba(255,255,255,0.08) 2px, transparent 3px);
          background-size: 60px 60px;
          opacity: 0.15;
          animation: float 20s linear infinite;
        }

        @keyframes float {
          from { transform: translateY(0px); }
          to { transform: translateY(-200px); }
        }

        .container {
          width: 100%;
          max-width: 1000px;
          text-align: center;
          z-index: 2;
        }

        .title {
          font-size: 42px;
          font-weight: 800;
        }

        .subtitle {
          color: #a5b4fc;
          margin-bottom: 20px;
        }

        .glowLine {
          margin: 10px auto 30px;
          padding: 14px;
          font-size: 13px;
          color: #dbeafe;
          background: rgba(0,180,255,0.08);
          border: 1px solid rgba(0,180,255,0.2);
          border-radius: 14px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 22px;
        }

        .card {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(18px);
          border-radius: 22px;
          padding: 30px;
          transition: 0.3s;
        }

        .card:hover {
          transform: translateY(-5px);
        }

        .premium {
          border: 1px solid rgba(0,180,255,0.5);
          box-shadow: 0 0 60px rgba(0,180,255,0.25);
        }

        .badge {
          display: inline-block;
          padding: 6px 12px;
          border-radius: 999px;
          font-size: 12px;
          background: linear-gradient(90deg, #00b4ff, #7c3aed);
          margin-bottom: 10px;
        }

        .price {
          font-size: 36px;
          margin: 10px 0;
          font-weight: bold;
        }

        ul {
          list-style: none;
          padding: 0;
          margin: 20px 0;
          text-align: left;
        }

        li {
          margin: 8px 0;
          color: #cbd5e1;
        }

        .coachBox {
          font-size: 13px;
          background: rgba(0,180,255,0.1);
          padding: 14px;
          border-radius: 12px;
          margin: 15px 0;
          text-align: left;
          border: 1px solid rgba(0,180,255,0.15);
        }

        .premiumBtn {
          width: 100%;
          padding: 12px;
          border: none;
          border-radius: 14px;
          font-weight: bold;
          cursor: pointer;
          color: white;
          background: linear-gradient(90deg, #00b4ff, #7c3aed);
        }

        .basicBtn {
          width: 100%;
          padding: 12px;
          border-radius: 14px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: #94a3b8;
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