"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

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
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        clearAuthCookies();
        setError(authError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        clearAuthCookies();
        setError("User creation failed");
        setLoading(false);
        return;
      }

      if (!data.session) {
        clearAuthCookies();
        setError("Account created. Please check your email to confirm before signing in.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        name,
        plan: "basic",
        xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
      });
      if (profileError) {
        console.error(profileError);
      }

      setAuthCookies({ premium: true });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="page">
      <div className="orbitalGlow" />
      <div className="card">
        <div className="brand">My Future</div>
        <h1>Create your account</h1>
        <p>Join the premium AI coaching experience and start building momentum today.</p>

        <div className="featureList">
          <span>✨ Premium onboarding</span>
          <span>🔒 Secure account setup</span>
          <span>📈 Daily growth tracking</span>
        </div>

        <form onSubmit={handleSignup}>
          <input type="text" placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
          <input type="email" placeholder="Email" value={email} onChange={(e) => setEmail(e.target.value)} />
          <input type="password" placeholder="Password" value={password} onChange={(e) => setPassword(e.target.value)} />
          {error ? <div className="error">{error}</div> : null}
          <button disabled={loading}>{loading ? "Creating account..." : "Create account"}</button>
        </form>

        <button type="button" className="ghost" onClick={() => router.push("/login")}>Already have an account?</button>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: grid;
          place-items: center;
          padding: 24px;
          background: radial-gradient(circle at top right, rgba(34,211,238,0.18), transparent 28%), linear-gradient(135deg, #04030b, #0f172a 60%, #111827 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }
        .orbitalGlow { position: absolute; inset: 0; background: radial-gradient(circle at 20% 30%, rgba(168,85,247,0.16), transparent 28%); filter: blur(30px); }
        .card { position: relative; z-index: 1; width: min(470px, 100%); padding: 30px; border-radius: 26px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); backdrop-filter: blur(24px); box-shadow: 0 24px 80px rgba(0,0,0,0.3); }
        .brand { font-size: 0.82rem; letter-spacing: 0.25em; text-transform: uppercase; color: #d8b4fe; margin-bottom: 8px; }
        h1 { margin: 0 0 8px; font-size: 2rem; }
        p { margin: 0 0 14px; color: #cbd5e1; line-height: 1.6; }
        .featureList { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 16px; }
        .featureList span { padding: 7px 10px; border-radius: 999px; background: rgba(255,255,255,0.06); color: #e0f2fe; font-size: 0.84rem; }
        form { display: flex; flex-direction: column; gap: 10px; }
        input { border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; background: rgba(255,255,255,0.08); color: white; padding: 12px 14px; }
        input::placeholder { color: #94a3b8; }
        button { border: 0; border-radius: 999px; padding: 12px 16px; background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; cursor: pointer; font-weight: 700; margin-top: 4px; }
        button:disabled { opacity: 0.7; cursor: not-allowed; }
        .ghost { margin-top: 12px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.14); }
        .error { color: #fda4af; margin: 0; font-size: 0.92rem; }
      `}</style>
    </div>
  );
}