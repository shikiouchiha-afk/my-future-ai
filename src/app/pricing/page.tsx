"use client";

import { useState } from "react";

export default function PricingPage() {
  const [loading, setLoading] = useState(false);
  const [selectedCoach, setSelectedCoach] = useState<string>("fitness");

  const coaches = [
    { id: "fitness", name: "💪 Fitness" },
    { id: "business", name: "💰 Business" },
    { id: "study", name: "📚 Study" },
    { id: "mindset", name: "🧠 Mindset" },
    { id: "life", name: "🌱 Life" },
    { id: "wellness", name: "🧘 Wellness Coach" },
  ];

  const startCheckout = async () => {
    try {
      setLoading(true);

      const res = await fetch("/api/stripe/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId: "guest",
          coach: selectedCoach,
        }),
      });

      const data = await res.json();

      if (data?.url) {
        window.location.href = data.url;
      } else {
        alert("Checkout failed");
      }
    } catch (err) {
      console.error(err);
      alert("Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="container">

        <h1 className="title">Choose your next growth path</h1>
        <p className="subtitle">
          Select a coach and a focus area to start your premium experience.
        </p>

        <div className="coachGrid">
          {coaches.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCoach(c.id)}
              className={`coachCard ${selectedCoach === c.id ? "active" : ""}`}
            >
              {c.name}
            </button>
          ))}
        </div>

        <div className="premiumBox">
          <h2>👑 Unlock Premium Coaching</h2>
          <p>
            Unlimited premium coach conversations • Memory system • Analytics •
            Daily missions • Badges • Premium AI workspace
          </p>

          <ul>
            <li>Unlimited premium coach conversations</li>
            <li>Seven specialized coaches and memory</li>
            <li>Personalized analytics and streaks</li>
            <li>Daily missions, rewards, and badges</li>
            <li>Priority support and premium themes</li>
          </ul>

          <div className="price">$15.99 / month</div>

          <button
            className="cta"
            onClick={startCheckout}
            disabled={loading}
          >
            {loading ? "Processing..." : "Start My Transformation"}
          </button>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b1020, #000);
          color: white;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 40px;
        }

        .container {
          width: 100%;
          max-width: 900px;
        }

        .title {
          font-size: 32px;
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
          cursor: pointer;
        }

        .coachCard.active {
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
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
          border: none;
          border-radius: 12px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          font-weight: 700;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}