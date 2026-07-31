"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import { fetchProgressSummary } from "@/lib/progress/client";
import type { ProgressSummary } from "@/lib/progress/types";

export default function SettingsPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [coachingIntensity, setCoachingIntensity] = useState<"supportive" | "balanced" | "savage">("balanced");
  const [message, setMessage] = useState("");
  const [summary, setSummary] = useState<ProgressSummary | null>(null);

  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;
      if (!user) {
        router.replace("/login");
        return;
      }
      setEmail(user.email || "");
      setName(user.user_metadata?.name || "");

      const { data: profile } = await supabase
        .from("profiles")
        .select("coaching_intensity")
        .eq("id", user.id)
        .single();

      const intensity = profile?.coaching_intensity;
      if (intensity === "supportive" || intensity === "balanced" || intensity === "savage") {
        setCoachingIntensity(intensity);
        localStorage.setItem("coachingIntensity", intensity);
      }

      const nextSummary = await fetchProgressSummary();
      if (nextSummary) {
        setSummary(nextSummary);
      }
    };
    load();
  }, [router]);

  const save = async () => {
    const { data } = await supabase.auth.getUser();
    const user = data.user;
    if (!user) return;

    await supabase.auth.updateUser({ email, data: { name } });

    await supabase
      .from("profiles")
      .upsert({
        id: user.id,
        email: user.email,
        coaching_intensity: coachingIntensity,
      });

    localStorage.setItem("coachingIntensity", coachingIntensity);
    setMessage("Settings saved. Coach intensity updated.");
  };

  return (
    <div className="page">
      <div className="card">
        <h1>Settings</h1>
        <p>Fine-tune your account, profile, and premium access.</p>
        <input value={name} onChange={(event) => setName(event.target.value)} placeholder="Display name" />
        <input value={email} onChange={(event) => setEmail(event.target.value)} placeholder="Email" />
        <div className="intensityWrap">
          <div className="intensityLabel">Coach intensity</div>
          <div className="intensityRow">
            {[
              { value: "supportive", label: "Supportive" },
              { value: "balanced", label: "Balanced" },
              { value: "savage", label: "Savage" },
            ].map((option) => (
              <button
                key={option.value}
                type="button"
                className={`intensityBtn ${coachingIntensity === option.value ? "active" : ""}`}
                onClick={() =>
                  setCoachingIntensity(option.value as "supportive" | "balanced" | "savage")
                }
              >
                {option.label}
              </button>
            ))}
          </div>
        </div>
        <div className="progressCard">
          <div>
            <span>Level</span>
            <strong>{summary?.level ?? 1}</strong>
          </div>
          <div>
            <span>XP</span>
            <strong>{summary?.xp ?? 0}</strong>
          </div>
          <div>
            <span>Streak</span>
            <strong>{summary?.currentStreak ?? 0}</strong>
          </div>
          <div>
            <span>Daily</span>
            <strong>{summary?.dailyProgress ?? 0}%</strong>
          </div>
        </div>
        <button onClick={save}>Save account</button>
        {message ? <p className="message">{message}</p> : null}
      </div>
      <MobileBottomNav />
      <style jsx>{`
        .page { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: calc(16px + env(safe-area-inset-top)) 14px calc(90px + env(safe-area-inset-bottom)); background: linear-gradient(135deg, #04030b, #0f172a 55%, #111827 100%); color: white; }
        .card { width: min(560px, 100%); padding: clamp(16px, 3vw, 24px); border-radius: 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); }
        input { width: 100%; margin-top: 10px; padding: 12px 14px; border-radius: 999px; border: 1px solid rgba(255,255,255,0.14); background: rgba(255,255,255,0.08); color: white; }
        .intensityWrap { margin-top: 12px; }
        .intensityLabel { font-size: 0.92rem; color: #bae6fd; margin-bottom: 8px; }
        .intensityRow { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 8px; }
        .intensityBtn { border: 1px solid rgba(255,255,255,0.2); border-radius: 999px; min-height: 40px; padding: 8px 12px; background: rgba(255,255,255,0.05); color: white; cursor: pointer; }
        .intensityBtn.active { background: linear-gradient(90deg, #0891b2, #22d3ee); border-color: transparent; }
        .progressCard { margin-top: 12px; display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 10px; }
        .progressCard div { border: 1px solid rgba(255,255,255,0.12); border-radius: 14px; padding: 10px; background: rgba(255,255,255,0.06); }
        .progressCard span { display: block; font-size: 0.78rem; color: #bae6fd; }
        .progressCard strong { font-size: 1rem; margin-top: 4px; display: block; }
        button { margin-top: 12px; width: 100%; border: 0; border-radius: 999px; padding: 12px 16px; min-height: 44px; background: linear-gradient(90deg, #8b5cf6, #22d3ee); color: white; cursor: pointer; }
        .message { margin-top: 10px; color: #a7f3d0; }
        @media (max-width: 640px) { .intensityRow { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
