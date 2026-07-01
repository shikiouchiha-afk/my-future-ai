"use client";

import { useState } from "react";
import { supabase } from "@/lib/supabaseClient";

export default function ResetPasswordPage() {
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const submit = async () => {
    const { error } = await supabase.auth.updateUser({ password });
    if (error) {
      setMessage(error.message);
      return;
    }
    setMessage("Password updated successfully.");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Reset password</h1>
        <p>Choose a new password for your account.</p>
        <input value={password} onChange={(event) => setPassword(event.target.value)} placeholder="New password" type="password" />
        <button onClick={submit}>Update password</button>
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
