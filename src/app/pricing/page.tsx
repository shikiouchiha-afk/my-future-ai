"use client";

import { useRouter } from "next/navigation";
import { PREMIUM_MONTHLY_PRICE_LABEL } from "@/lib/premiumAccess";

const features = [
  "Unlimited AI conversations",
  "Unlimited long-term memory",
  "Advanced reasoning and daily action plans",
  "Deep analytics, forecasting, and premium reports",
  "AI coaching for business, fitness, finance, study, career, and relationships",
  "Priority response speed and exclusive themes",
];

export default function PricingPage() {
  const router = useRouter();

  return (
    <div className="page">
      <div className="backgroundGlow" />
      <div className="container">
        <div className="heroCard">
          <div className="eyebrow">My Future AI • Premium Access</div>
          <h1>Elevate your coaching to a private, elite experience.</h1>
          <p>
            Free users can explore the platform with thoughtful limits. Premium unlocks unlimited depth,
            stronger guidance, smarter planning, and a markedly more personal operating system for your goals.
          </p>

          <div className="priceRow">
            <div className="priceCard">
              <div className="label">Premium</div>
              <div className="price">{PREMIUM_MONTHLY_PRICE_LABEL}</div>
              <div className="subtext">billed monthly • cancel anytime</div>
            </div>
            <div className="freeCard">
              <div className="label">Free</div>
              <div className="price">$0</div>
              <div className="subtext">8 daily / 80 monthly messages • 3 advanced coaching sessions</div>
            </div>
          </div>

          <div className="actions">
            <button className="cta" onClick={() => router.push("/premium")}>Unlock Premium</button>
            <button className="secondary" onClick={() => router.push("/dashboard")}>Continue with Free</button>
          </div>
        </div>

        <div className="featureGrid" role="list" aria-label="Premium features">
          {features.map((feature) => (
            <div className="featureCard" key={feature} role="listitem">
              <span className="featureIcon">✦</span>
              <span>{feature}</span>
            </div>
          ))}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100dvh;
          background: linear-gradient(135deg, #fef3c7 0%, #fffaf0 30%, #f4f7ff 100%);
          color: #111827;
          display: flex;
          justify-content: center;
          align-items: center;
          padding: calc(18px + env(safe-area-inset-top)) 16px calc(20px + env(safe-area-inset-bottom));
          position: relative;
          overflow: hidden;
        }
        .backgroundGlow {
          position: absolute;
          inset: auto auto -10% -10%;
          width: 360px;
          height: 360px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(250, 204, 21, 0.28), transparent 70%);
          filter: blur(24px);
          pointer-events: none;
        }
        .container {
          width: 100%;
          max-width: 1080px;
          display: grid;
          gap: 20px;
          position: relative;
          z-index: 1;
        }
        .heroCard {
          padding: clamp(24px, 3vw, 36px);
          border-radius: 28px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(15, 23, 42, 0.08);
          box-shadow: 0 24px 80px rgba(15, 23, 42, 0.12);
          backdrop-filter: blur(22px);
        }
        .eyebrow {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(250, 204, 21, 0.18);
          color: #92400e;
          font-size: 0.82rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 12px;
        }
        h1 {
          font-size: clamp(1.7rem, 4vw, 2.5rem);
          font-weight: 800;
          margin-bottom: 10px;
          color: #111827;
        }
        .heroCard p {
          color: #4b5563;
          line-height: 1.7;
          margin-bottom: 18px;
        }
        .priceRow {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 14px;
          margin-bottom: 18px;
        }
        .priceCard, .freeCard {
          padding: 18px;
          border-radius: 18px;
          border: 1px solid rgba(15, 23, 42, 0.08);
          background: linear-gradient(135deg, rgba(255, 255, 255, 0.95), rgba(249, 250, 251, 0.9));
        }
        .label {
          font-size: 0.82rem;
          font-weight: 700;
          text-transform: uppercase;
          letter-spacing: 0.18em;
          color: #6b7280;
        }
        .price {
          font-size: 1.7rem;
          font-weight: 800;
          color: #111827;
          margin: 6px 0 4px;
        }
        .subtext {
          color: #6b7280;
          font-size: 0.95rem;
        }
        .actions {
          display: flex;
          gap: 10px;
          flex-wrap: wrap;
        }
        .cta, .secondary {
          min-height: 46px;
          padding: 12px 16px;
          border-radius: 999px;
          border: none;
          cursor: pointer;
          font-weight: 700;
        }
        .cta {
          background: linear-gradient(90deg, #a16207, #f59e0b);
          color: white;
          box-shadow: 0 12px 24px rgba(245, 158, 11, 0.2);
        }
        .secondary {
          background: #f3f4f6;
          color: #111827;
        }
        .featureGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 12px;
        }
        .featureCard {
          display: flex;
          align-items: center;
          gap: 10px;
          padding: 14px 16px;
          border-radius: 16px;
          background: rgba(255, 255, 255, 0.86);
          border: 1px solid rgba(15, 23, 42, 0.08);
          color: #111827;
          font-weight: 600;
          box-shadow: 0 10px 25px rgba(15, 23, 42, 0.05);
        }
        .featureIcon {
          color: #d97706;
          font-size: 1rem;
          flex-shrink: 0;
        }
        @media (max-width: 760px) {
          .priceRow, .featureGrid {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </div>
  );
}