"use client";

import { useMemo } from "react";
import { useRouter } from "next/navigation";

const features = [
  {
    title: "Seven elite coaches",
    copy: "Business, fitness, study, life, mindset, therapist, and productivity designed for real-world progress.",
  },
  {
    title: "Persistent memory",
    copy: "Your plan, habits, strengths, and next steps stay with you across sessions and devices.",
  },
  {
    title: "Premium analytics",
    copy: "Track XP, streaks, progression, wellness, learning, and growth with a polished command center.",
  },
];

const coachPreview = [
  { name: "Business Coach", blurb: "Startup-style guidance for offers, marketing, and growth." },
  { name: "Fitness Coach", blurb: "Discipline-first training and recovery systems." },
  { name: "Study Coach", blurb: "Structured plans that help you learn and retain faster." },
];

const testimonials = [
  {
    quote: "It feels like I finally have a real executive coach in my pocket.",
    author: "Maya, founder",
  },
  {
    quote: "The experience is calm, premium, and incredibly motivating.",
    author: "Jordan, product designer",
  },
];

export default function HomePage() {
  const router = useRouter();
  const featureRows = useMemo(() => [
    ["Daily AI challenges", "Streak system", "Daily rewards"],
    ["Weekly goals", "Progress tracking", "Premium themes"],
  ], [
  ]);

  return (
    <div className="page">
      <div className="orbitalGlow" />
      <div className="neuralGrid" />
      <div className="brainGlow" />
      <div className="particleField" />
      <div className="mistLayer" />
      <div className="scanLine" />

      <main className="container">
        <section className="hero">
          <div className="heroContent">
            <div className="badge">❄ Cold Signal • AI Coaching Platform</div>
            <h1>My Future</h1>
            <p className="subtitle">
              A darker, colder AI coaching system for discipline, focus, and ruthless progress in business, fitness, learning, and life.
            </p>
            <div className="buttons">
              <button className="primary" onClick={() => router.push("/signup")}>
                Start free
              </button>
              <button className="secondary" onClick={() => router.push("/login")}>
                Sign in
              </button>
            </div>
            <div className="trustRow">
              <span>⚡ Fast AI guidance</span>
              <span>🧠 Coach memory</span>
              <span>🌐 Responsive by design</span>
            </div>
          </div>

          <div className="heroVisual" aria-hidden="true">
            <div className="brainShell">
              <div className="orbit orbit1" />
              <div className="orbit orbit2" />
              <div className="orbit orbit3" />
              <div className="brainCore" />
              <div className="neuralNode node1" />
              <div className="neuralNode node2" />
              <div className="neuralNode node3" />
              <div className="neuralNode node4" />
              <div className="neuralNode node5" />
              <div className="neuralNode node6" />
            </div>
          </div>
        </section>

        <section className="welcomePanel">
          <div>
            <p className="eyebrow">Cinematic welcome</p>
            <h2>Turn ambition into structured progress.</h2>
            <p>
              My Future combines luxury interface design with deep coaching intelligence so every session feels meaningful, strategic, and motivating.
            </p>
          </div>
          <div className="panelStats">
            <div>
              <strong>7</strong>
              <span>Specialized coaches</span>
            </div>
            <div>
              <strong>24/7</strong>
              <span>Guidance and accountability</span>
            </div>
            <div>
              <strong>∞</strong>
              <span>Progressive growth</span>
            </div>
          </div>
        </section>

        <section className="featureGrid">
          {features.map((feature) => (
            <article key={feature.title} className="card">
              <h3>{feature.title}</h3>
              <p>{feature.copy}</p>
            </article>
          ))}
        </section>

        <section className="featureRows">
          {featureRows.map((row, index) => (
            <div key={index} className="featureRow">
              {row.map((item) => (
                <div key={item} className="chip">{item}</div>
              ))}
            </div>
          ))}
        </section>

        <section className="coachSection">
          <div className="sectionHeading">
            <p className="eyebrow">Coach previews</p>
            <h2>Choose the coach that fits your next breakthrough.</h2>
          </div>
          <div className="coachList">
            {coachPreview.map((coach) => (
              <div key={coach.name} className="coachCard">
                <h3>{coach.name}</h3>
                <p>{coach.blurb}</p>
              </div>
            ))}
          </div>
        </section>

        <section className="testimonialSection">
          {testimonials.map((item) => (
            <blockquote key={item.author} className="quoteCard">
              <p>“{item.quote}”</p>
              <span>{item.author}</span>
            </blockquote>
          ))}
        </section>

        <section className="premiumCta">
          <div>
            <p className="eyebrow">Upgrade now</p>
            <h2>Enter a more focused, premium era of self-development.</h2>
          </div>
          <button className="primary" onClick={() => router.push("/pricing")}>
            Explore premium
          </button>
        </section>

        <section className="helpCenter">
          <div className="sectionHeading">
            <p className="eyebrow">Help Center</p>
            <h2>Support, answers, and fast help whenever you need it.</h2>
          </div>
          <div className="helpGrid">
            <article className="card">
              <h3>Support</h3>
              <p>Get help with setup, billing, onboarding, and premium access.</p>
            </article>
            <article className="card">
              <h3>FAQ</h3>
              <p>Learn how premium coaches, memory, and streaks work in the app.</p>
            </article>
            <article className="card">
              <h3>Contact</h3>
              <p>Reach the team anytime for product questions or feedback.</p>
            </article>
          </div>
        </section>
      </main>

      <style jsx>{`
        .page {
          min-height: 100vh;
          position: relative;
          overflow: hidden;
          padding: 28px;
          background:
            radial-gradient(circle at top left, rgba(30, 41, 59, 0.65), transparent 36%),
            radial-gradient(circle at bottom right, rgba(14, 165, 233, 0.18), transparent 24%),
            linear-gradient(135deg, #02050b 0%, #050816 45%, #0b1020 100%);
          color: white;
        }

        .orbitalGlow, .neuralGrid, .brainGlow, .particleField, .mistLayer, .scanLine {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .orbitalGlow {
          background: radial-gradient(circle at 20% 20%, rgba(37, 99, 235, 0.22), transparent 34%);
          filter: blur(48px);
        }

        .neuralGrid {
          background-image: linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px);
          background-size: 120px 120px;
          mask-image: linear-gradient(to bottom, rgba(0,0,0,0.9), transparent);
          animation: drift 16s linear infinite;
          opacity: 0.16;
        }

        .brainGlow {
          top: -8%;
          left: 50%;
          width: 760px;
          height: 760px;
          transform: translateX(-50%);
          border-radius: 50%;
          background: radial-gradient(circle, rgba(15, 23, 42, 0.92) 0%, rgba(30, 64, 175, 0.3) 34%, rgba(8, 145, 178, 0.16) 58%, transparent 72%);
          filter: blur(90px);
          animation: pulse 4.5s ease-in-out infinite;
        }

        .particleField {
          background-image: radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px);
          background-size: 120px 120px;
          opacity: 0.12;
          animation: drift 11s linear infinite reverse;
        }

        .mistLayer {
          background: radial-gradient(circle at 50% 0%, rgba(148, 163, 184, 0.1), transparent 32%);
          animation: float 8s ease-in-out infinite alternate;
        }

        .scanLine {
          background: linear-gradient(180deg, transparent, rgba(255,255,255,0.04), transparent);
          mix-blend-mode: screen;
          animation: sweep 7s linear infinite;
        }

        .container {
          position: relative;
          z-index: 1;
          max-width: 1200px;
          margin: 0 auto;
          display: flex;
          flex-direction: column;
          gap: 24px;
        }

        .hero {
          display: grid;
          grid-template-columns: 1.1fr 0.9fr;
          gap: 32px;
          align-items: center;
          padding: 34px;
          border: 1px solid rgba(148, 163, 184, 0.18);
          border-radius: 28px;
          background: rgba(5, 10, 20, 0.82);
          box-shadow: 0 24px 84px rgba(0, 0, 0, 0.7), inset 0 0 30px rgba(14, 165, 233, 0.08);
          backdrop-filter: blur(24px);
          animation: fadeUp 0.7s ease both;
        }

        .badge, .eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(15, 23, 42, 0.86);
          color: #7dd3fc;
          font-size: 0.82rem;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          margin-bottom: 14px;
        }

        h1, h2, h3, p {
          margin: 0;
        }

        h1 {
          font-size: clamp(2.6rem, 4.8vw, 4.4rem);
          line-height: 0.95;
          margin-bottom: 12px;
          font-weight: 800;
          background: linear-gradient(90deg, #f8fafc 0%, #7dd3fc 40%, #1d4ed8 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .subtitle {
          font-size: 1.04rem;
          line-height: 1.7;
          color: #cbd5e1;
          max-width: 680px;
        }

        .buttons {
          display: flex;
          gap: 12px;
          flex-wrap: wrap;
          margin-top: 22px;
        }

        .primary, .secondary {
          border: 0;
          padding: 12px 18px;
          border-radius: 999px;
          cursor: pointer;
          font-weight: 700;
          transition: transform 180ms ease, box-shadow 180ms ease;
        }

        .primary {
          color: white;
          background: linear-gradient(90deg, #0f172a, #2563eb);
          box-shadow: 0 16px 30px rgba(15, 23, 42, 0.45);
        }

        .secondary {
          color: white;
          background: rgba(15, 23, 42, 0.85);
          border: 1px solid rgba(148, 163, 184, 0.18);
        }

        .primary:hover, .secondary:hover {
          transform: translateY(-2px);
        }

        .trustRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
          margin-top: 16px;
          color: #94a3b8;
          font-size: 0.92rem;
        }

        .heroVisual {
          display: flex;
          justify-content: center;
        }

        .brainShell {
          position: relative;
          width: min(420px, 84vw);
          aspect-ratio: 1;
          border-radius: 32px;
          border: 1px solid rgba(148, 163, 184, 0.16);
          background: linear-gradient(145deg, rgba(15, 23, 42, 0.88), rgba(2, 6, 23, 0.65));
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.12), 0 24px 70px rgba(2, 6, 23, 0.7);
          animation: float 6s ease-in-out infinite;
          backdrop-filter: blur(20px);
          overflow: hidden;
        }

        .orbit {
          position: absolute;
          border: 1px solid rgba(125, 211, 252, 0.2);
          border-radius: 50%;
          inset: 8%;
          animation: spin 14s linear infinite;
        }

        .orbit2 { inset: 18%; animation-duration: 18s; animation-direction: reverse; }
        .orbit3 { inset: 28%; animation-duration: 22s; }

        .brainCore {
          position: absolute;
          inset: 18%;
          border-radius: 40% 60% 45% 55%;
          background: radial-gradient(circle at 30% 30%, rgba(147, 197, 253, 0.95), rgba(37, 99, 235, 0.86) 38%, rgba(8, 145, 178, 0.35) 78%, transparent 100%);
          filter: blur(2px);
          animation: float 4s ease-in-out infinite;
        }

        .neuralNode {
          position: absolute;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: rgba(255,255,255,0.95);
          box-shadow: 0 0 18px rgba(34,211,238,0.8);
          animation: pulse 2.4s ease-in-out infinite;
        }

        .node1 { top: 24%; left: 30%; }
        .node2 { top: 38%; right: 24%; }
        .node3 { bottom: 28%; left: 22%; }
        .node4 { bottom: 20%; right: 32%; }
        .node5 { top: 12%; right: 38%; }
        .node6 { bottom: 12%; left: 38%; }

        .welcomePanel, .premiumCta {
          display: flex;
          justify-content: space-between;
          gap: 24px;
          align-items: center;
          padding: 24px 28px;
          border-radius: 24px;
          background: rgba(8, 11, 22, 0.78);
          border: 1px solid rgba(148, 163, 184, 0.16);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
        }

        .welcomePanel p, .premiumCta p {
          color: #cbd5e1;
          line-height: 1.6;
          max-width: 720px;
        }

        .panelStats {
          display: grid;
          gap: 12px;
          min-width: 220px;
        }

        .panelStats div {
          display: flex;
          flex-direction: column;
          gap: 4px;
          padding: 10px 12px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
        }

        .panelStats strong {
          font-size: 1.2rem;
          color: #f5d0fe;
        }

        .featureGrid, .coachList, .testimonialSection, .helpGrid {
          display: grid;
          gap: 16px;
        }

        .featureGrid {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .card, .coachCard, .quoteCard {
          padding: 18px 20px;
          border-radius: 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.08);
        }

        .card h3, .coachCard h3 {
          margin-bottom: 8px;
          color: #f5d0fe;
        }

        .card p, .coachCard p, .quoteCard p {
          color: #cbd5e1;
          line-height: 1.65;
        }

        .coachList {
          grid-template-columns: repeat(3, minmax(0, 1fr));
        }

        .testimonialSection, .helpGrid {
          grid-template-columns: repeat(2, minmax(0, 1fr));
        }

        .quoteCard span {
          display: block;
          margin-top: 10px;
          color: #7dd3fc;
          font-size: 0.92rem;
        }

        @keyframes drift {
          from { transform: translateY(0px); }
          to { transform: translateY(-120px); }
        }

        @keyframes sweep {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }

        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(16px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.95; }
          50% { transform: scale(1.15); opacity: 0.7; }
        }

        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-8px); }
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }

        .featureRows {
          display: grid;
          gap: 12px;
        }

        .featureRow {
          display: flex;
          flex-wrap: wrap;
          gap: 10px;
        }

        .chip {
          padding: 8px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.07);
          border: 1px solid rgba(255,255,255,0.12);
          color: #e0f2fe;
        }

        @media (max-width: 900px) {
          .hero, .welcomePanel, .premiumCta {
            grid-template-columns: 1fr;
            flex-direction: column;
            align-items: flex-start;
          }

          .featureGrid, .coachList, .testimonialSection, .helpGrid {
            grid-template-columns: 1fr;
          }
        }

        @media (max-width: 640px) {
          .page {
            padding: 16px;
          }

          .hero {
            padding: 20px;
          }

          .buttons {
            flex-direction: column;
          }

          .primary, .secondary {
            width: 100%;
          }
        }
      `}</style>
    </div>
  );
}