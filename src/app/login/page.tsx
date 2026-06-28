"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    if (data.session) {
      router.push("/dashboard");
    }
  };

  return (
    <div className="bg">
      <div className="card">
        <h1>WELCOME BACK</h1>
        <p>Login to continue your AI mission</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {error && <div className="error">{error}</div>}

          <button disabled={loading}>
            {loading ? "LOGGING IN..." : "LOGIN"}
          </button>

          <button
            type="button"
            className="ghost"
            onClick={() => router.push("/signup")}
          >
            Create account
          </button>
        </form>
      </div>

      <style jsx>{`
        .bg {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          background: radial-gradient(circle at top, #0b1220, #000);
          color: white;
        }

        .card {
          width: 420px;
          padding: 35px;
          border-radius: 18px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          backdrop-filter: blur(20px);
          text-align: center;
        }

        input {
          width: 100%;
          padding: 14px;
          margin: 10px 0;
          border-radius: 10px;
          border: 1px solid rgba(255,255,255,0.15);
          background: rgba(255,255,255,0.05);
          color: white;
        }

        button {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #00b4ff, #7c3aed);
          color: white;
          font-weight: bold;
        }

        .ghost {
          background: transparent;
          border: 1px solid rgba(255,255,255,0.2);
        }

        .error {
          color: red;
          font-size: 12px;
        }
      `}</style>
    </div>
  );
}