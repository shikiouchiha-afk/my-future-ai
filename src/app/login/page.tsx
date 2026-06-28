"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

const supabase =
  typeof window !== "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

export default function LoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkSession = async () => {
      if (!supabase) return;

      const { data } = await supabase.auth.getSession();

      if (data.session) {
        router.replace("/dashboard");
      }
    };

    checkSession();
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!supabase) return;

    if (!email || !password) {
      alert("Please enter email and password");
      return;
    }

    try {
      setLoading(true);

      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        alert(error.message);
        return;
      }

      if (data.session) {
        router.replace("/dashboard");
      }
    } catch (err) {
      console.log(err);
      alert("Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-bg">
      <div className="overlay" />

      <div className="card">
        <h1>MY FUTURE</h1>
        <p className="subtitle">AI Mission Control Login</p>

        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Commander Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />

          <input
            type="password"
            placeholder="Access Code"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button type="submit">
            {loading ? "VERIFYING..." : "ENTER SYSTEM"}
          </button>

          <button
            type="button"
            className="secondary"
            onClick={() => router.push("/signup")}
          >
            CREATE ACCOUNT
          </button>
        </form>
      </div>

      <style jsx>{`
        .space-bg {
          height: 100vh;
          display: flex;
          justify-content: center;
          align-items: center;
          position: relative;
          background: url("https://images.unsplash.com/photo-1462331940025-496dfbfc7564?q=80&w=2000")
            center/cover no-repeat;
        }

        .overlay {
          position: absolute;
          inset: 0;
          background: rgba(0, 0, 0, 0.6);
        }

        .card {
          position: relative;
          z-index: 2;
          width: 420px;
          padding: 40px;
          border-radius: 20px;
          background: rgba(255, 255, 255, 0.08);
          backdrop-filter: blur(18px);
          border: 1px solid rgba(255, 255, 255, 0.15);
          text-align: center;
          box-shadow: 0 0 60px rgba(0, 150, 255, 0.2);
        }

        h1 {
          color: white;
          margin-bottom: 10px;
          font-size: 2.5rem;
          letter-spacing: 3px;
        }

        .subtitle {
          color: rgba(255, 255, 255, 0.7);
          margin-bottom: 25px;
        }

        input {
          width: 100%;
          padding: 14px;
          margin-bottom: 12px;
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          background: rgba(255, 255, 255, 0.08);
          color: white;
          outline: none;
        }

        button {
          width: 100%;
          padding: 14px;
          margin-top: 10px;
          border-radius: 10px;
          border: none;
          background: linear-gradient(90deg, #007cf0, #00dfd8);
          color: white;
          font-weight: bold;
          cursor: pointer;
        }

        .secondary {
          background: transparent;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }
      `}</style>
    </div>
  );
}