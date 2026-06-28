"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE CLIENT (SAFE)
========================= */
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            name,
          },
        },
      });

      if (error) {
        setError(error.message);
        setLoading(false);
        return;
      }

      // success → send to login (real SaaS flow)
      router.push("/login");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-bg">
      <div className="overlay" />

      <div className="signup-card">
        <h1>JOIN MY FUTURE</h1>

        <p className="subtitle">
          Create your account and begin your mission.
        </p>

        <form onSubmit={handleSignup}>
          <input
            type="text"
            placeholder="Commander Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            type="email"
            placeholder="Commander Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Create Access Code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && (
            <p style={{ color: "red", fontSize: "12px" }}>{error}</p>
          )}

          <button type="submit" disabled={loading}>
            {loading ? "CREATING..." : "CREATE ACCOUNT"}
          </button>

          <button
            type="button"
            className="back-btn"
            onClick={() => router.push("/login")}
          >
            BACK TO LOGIN
          </button>
        </form>
      </div>

      <style jsx>{`
        .space-bg {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          overflow: hidden;

          background:
            url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000")
            center center/cover no-repeat;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
          backdrop-filter: blur(2px);
        }

        .signup-card {
          position: relative;
          z-index: 10;

          width: 450px;
          padding: 40px;

          border-radius: 24px;

          background: rgba(255,255,255,0.08);

          backdrop-filter: blur(20px);

          border: 1px solid rgba(255,255,255,0.15);

          box-shadow:
            0 0 50px rgba(0,150,255,0.25),
            0 0 120px rgba(0,150,255,0.15);

          text-align: center;
        }

        h1 {
          color: white;
          font-size: 2.8rem;
          margin-bottom: 10px;
          letter-spacing: 3px;
          font-weight: 900;
        }

        .subtitle {
          color: rgba(255,255,255,0.7);
          margin-bottom: 30px;
        }

        input {
          width: 100%;
          padding: 16px;
          margin-bottom: 16px;

          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.15);

          background: rgba(255,255,255,0.08);

          color: white;
          font-size: 1rem;

          outline: none;
        }

        input::placeholder {
          color: rgba(255,255,255,0.5);
        }

        input:focus {
          border-color: #4da6ff;
          box-shadow: 0 0 20px rgba(77,166,255,0.4);
        }

        button {
          width: 100%;
          padding: 16px;

          border: none;
          border-radius: 12px;

          background: linear-gradient(90deg, #008cff, #00c3ff);

          color: white;
          font-size: 1rem;
          font-weight: bold;

          cursor: pointer;

          transition: 0.3s;

          margin-top: 10px;
        }

        button:hover {
          transform: translateY(-2px);
          box-shadow: 0 0 30px rgba(0,195,255,0.7);
        }

        .back-btn {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .back-btn:hover {
          background: rgba(255,255,255,0.08);
        }
      `}</style>
    </div>
  );
}