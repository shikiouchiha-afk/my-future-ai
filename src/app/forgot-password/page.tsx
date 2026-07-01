"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Check your email for a password reset link.");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Forgot password</h1>
        <p>Enter your email to receive a reset link.</p>
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <button onClick={submit}>Send reset link</button>
        {message ? <p className="message">{message}</p> : null}
      </div>
      <style jsx>{`
        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(135deg, #04030b, #111827 100%); color: white; }
        .card { width: min(520px, 100%); padding: 24px; border-radius: 24px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); }
        input { width: 100%; margin-top: 10px; padding: 12px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.08); color: white; }
        button { margin-top: 12px; width: 100%; border: 0; border-radius: 999px; padding: 12px 16px; background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; cursor: pointer; }
        .message { margin-top: 10px; color: #a7f3d0; }
      `}</style>
    </div>
  );
}
