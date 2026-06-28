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

  // ✅ SAFE: client created only in browser
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

    // safety check (prevents build crash)
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY) {
      setError("Supabase environment variables missing");
      setLoading(false);
      return;
    }

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

          {error && <p style={{ color: "red", fontSize: "12px" }}>{error}</p>}

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

          background: url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000")
            center/cover no-repeat;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.55);
        }

        .signup-card {
          position: relative;
          z-index: 10;
          width: 450px;
          padding: 40px;
          border-radius: 24px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(20px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-align: center;
        }
      `}</style>
    </div>
  );
}