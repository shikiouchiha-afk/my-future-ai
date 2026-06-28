"use client";

import { useRouter } from "next/navigation";

export default function HomePage() {
  const router = useRouter();

  return (
    <div className="space-bg">
      <div className="overlay" />

      <div className="hero">
        <h1>MY FUTURE</h1>

        <h2>Your Life, Optimized by AI</h2>

        <p>
          Build better habits, track your goals, complete AI missions,
          and unlock your future one day at a time.
        </p>

        <div className="buttons">
          <button onClick={() => router.push("/signup")}>
            START FREE
          </button>

          <button
            className="secondary"
            onClick={() => router.push("/login")}
          >
            LOGIN
          </button>
        </div>
      </div>

      <style jsx>{`
        .space-bg {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          text-align: center;
          position: relative;
          background:
            url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000")
            center/cover no-repeat;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0,0,0,.65);
        }

        .hero {
          position: relative;
          z-index: 2;
          width: 90%;
          max-width: 800px;
          padding: 60px;
          border-radius: 25px;
          background: rgba(255,255,255,.08);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255,255,255,.15);
          box-shadow: 0 0 60px rgba(0,150,255,.25);
        }

        h1 {
          color: white;
          font-size: 4rem;
          margin-bottom: 10px;
          letter-spacing: 4px;
        }

        h2 {
          color: #7dd3fc;
          font-size: 2rem;
          margin-bottom: 20px;
        }

        p {
          color: rgba(255,255,255,.8);
          font-size: 1.15rem;
          line-height: 1.7;
          margin-bottom: 35px;
        }

        .buttons {
          display: flex;
          justify-content: center;
          gap: 20px;
          flex-wrap: wrap;
        }

        button {
          padding: 15px 35px;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: bold;
          color: white;
          background: linear-gradient(90deg,#007cf0,#00dfd8);
          transition: .25s;
        }

        button:hover {
          transform: translateY(-3px);
          box-shadow: 0 0 25px rgba(0,223,216,.5);
        }

        .secondary {
          background: transparent;
          border: 1px solid rgba(255,255,255,.25);
        }
      `}</style>
    </div>
  );
}