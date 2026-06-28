"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

export default function SignupPage() {
  const router = useRouter();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const getSupabase = () =>
    createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL || "",
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || ""
    );

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const supabase = getSupabase();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { name },
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    router.push("/login");
  };

  return (
    <div className="bg">
      <div className="glow" />

      <div className="card">
        <h1>JOIN MY FUTURE</h1>
        <p>Create your account and unlock your AI system</p>

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

          {error && <div className="error">{error}</div>}

          <button disabled={loading}>
            {loading ? "CREATING ACCOUNT..." : "CREATE ACCOUNT"}
          </button>

          <button
            type="button"
            className="ghost"
            onClick={() => router.push("/login")}
          >
            I already have an account
          </button>
        </form>
      </div>

      <style jsx>{`
        .bg {
          height: 100vh;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top, #0b1220, #000);
          position: relative;
          overflow: hidden;
        }

        .glow {
          position: absolute;
          width: 600px;
          height: 600px;
          background: radial-gradient(circle, rgba(0,180,255,0.25), transparent 60%);
          top: -150px;
          left: -150px;
          filter: blur(40px);
        }

        .card {
          width: 420px;
          padding: 35px;
          border-radius: 18px;

          background: rgba(255, 255, 255, 0.06);
          border: 1px solid rgba(255, 255, 255, 0.12);
          backdrop-filter: blur(20px);

          box-shadow: 0 0 60px rgba(0, 180, 255, 0.15);
          z-index: 2;
          text-align: center;
          color: white;
        }

        h1 {
          font-size: 28px;
          margin-bottom: 6px;
          letter-spacing: 2px;
        }

        p {
          font-size: 13px;
          color: rgba(255,255,255,0.6);
          margin-bottom: 25px;
        }

        input {
          width: 100%;
          padding: 14px;
          margin-bottom: 12px;

          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.12);

          background: rgba(255,255,255,0.05);
          color: white;

          outline: none;
        }

        input:focus {
          border-color: #00b4ff;
          box-shadow: 0 0 15px rgba(0,180,255,0.3);
        }

        button {
          width: 100%;
          padding: 14px;

          margin-top: 10px;

          border: none;
          border-radius: 10px;

          background: linear-gradient(90deg, #00b4ff, #7c3aed);
          color: white;

          font-weight: bold;
          cursor: pointer;

          transition: 0.2s;
        }

        button:hover {
          transform: translateY(-2px);
        }

        .ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .error {
          color: #ff4d4d;
          font-size: 12px;
          margin-top: 8px;
        }
      `}</style>
    </div>
  );
}