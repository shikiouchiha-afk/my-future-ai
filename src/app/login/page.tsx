"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { setAuthCookies } from "@/lib/authCookies";
import { getPremiumStatus } from "@/lib/premiumAccess";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      if (!data?.session) {
        setError("Login failed. Try again.");
        return;
      }

      const user = data.session.user;
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, is_admin")
        .eq("id", user.id)
        .single();

      const premium = getPremiumStatus({
        email: user.email,
        profilePremium: profile?.is_premium,
        isAdmin: profile?.is_admin,
      });

      setAuthCookies({ premium, admin: Boolean(profile?.is_admin) });
      router.replace("/dashboard");
    } catch {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="orbitalGlow" />
      <div className="card">
        <div className="brand">My Future</div>
        <h1>Welcome back</h1>
        <p className="subtitle">Pick up your plan, your streak, and your next breakthrough.</p>

        <div className="featureList">
          <span>⚡ Daily AI challenges</span>
          <span>🧠 Coach memory</span>
          <span>🎯 Personalized momentum</span>
        </div>

        <form onSubmit={handleLogin}>
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <p className="error">{error}</p> : null}
          <button type="submit" disabled={loading}>{loading ? "Signing in..." : "Sign in"}</button>
        </form>

        <div className="footerLinks">
          <button type="button" className="secondary" onClick={() => router.push("/signup")}>Create account</button>
          <button type="button" className="linkBtn" onClick={() => router.push("/forgot-password")}>Forgot password?</button>
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100dvh;
          display: grid;
          place-items: center;
          padding: calc(16px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom));
          background: radial-gradient(circle at top left, rgba(124,58,237,0.28), transparent 30%), linear-gradient(135deg, #04030b, #0f172a 60%, #111827 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .orbitalGlow {
          position: absolute; inset: 0; background: radial-gradient(circle at 80% 20%, rgba(34,211,238,0.16), transparent 28%); filter: blur(30px);
        }
        .card {
          position: relative; z-index: 1; width: min(470px, 100%); padding: clamp(18px, 3vw, 30px); border-radius: 22px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(24px); box-shadow: 0 24px 80px rgba(0,0,0,0.3);
        }
        .brand { font-size: 0.82rem; letter-spacing: 0.25em; text-transform: uppercase; color: #d8b4fe; margin-bottom: 8px; }
        h1 { margin: 0 0 8px; font-size: 2rem; }
        .subtitle { margin: 0 0 14px; color: #cbd5e1; line-height: 1.6; }
        .featureList { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .featureList span { padding: 7px 10px; border-radius: 999px; background: rgba(255,255,255,0.06); color: #e0f2fe; font-size: 0.84rem; }
        form { display: flex; flex-direction: column; gap: 10px; }
        input { border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; background: rgba(255,255,255,0.08); color: white; padding: 12px 14px; }
        input::placeholder { color: #94a3b8; }
        button { border: 0; border-radius: 999px; padding: 12px 16px; min-height: 44px; background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; cursor: pointer; font-weight: 700; }
        button:disabled { opacity: 0.7; cursor: not-allowed; }
        .error { color: #fda4af; margin: 0; font-size: 0.92rem; }
        .footerLinks { display: flex; gap: 10px; margin-top: 12px; align-items: center; justify-content: space-between; }
        .secondary { background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); }
        .linkBtn { background: transparent; padding: 0; color: #cbd5e1; }
        @media (max-width: 640px) {
          .footerLinks {
            flex-direction: column;
            align-items: stretch;
          }
          .linkBtn,
          .secondary {
            width: 100%;
            text-align: center;
          }
        }
      `}</style>
    </div>
  );
}