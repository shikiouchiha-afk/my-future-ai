"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  COACHES,
  buildMemorySummary,
  getCoachProfile,
  type CoachMemory,
} from "@/lib/coachSystem";
import {
  loadCoachMemory,
  saveCoachMemory,
  loadOrCreateStreak,
  updateStreak,
} from "@/lib/coachMemory";
import { getStoredTheme, setStoredTheme, themeTokens, type AppTheme } from "@/lib/theme";
import { getPremiumStatus } from "@/lib/premiumAccess";

type Message = {
  role: "user" | "assistant";
  content: string;
};

type Goal = "fitness" | "money" | "study" | "mindset" | null;

type Coach =
  | "business"
  | "fitness"
  | "study"
  | "life"
  | "mindset"
  | "therapist"
  | "productivity"
  | "free";

const dailyMissions = [
  "Complete one focused work block of 25 minutes.",
  "Write one concrete next step for your biggest goal.",
  "Take a small action that builds momentum today.",
];

const weeklyChallenges = [
  "Finish three meaningful tasks this week.",
  "Protect one hour for deep work.",
  "Stay consistent for five days straight.",
];

const monthlyGoals = [
  "Keep your streak alive all month.",
  "Advance one meaningful project to a completed milestone.",
  "Build one habit that compounds over time.",
];

const rewards = [
  "Unlock premium themes",
  "Claim extra prompts",
  "Earn badges for consistency",
];

function rewardXP(goal: string | null) {
  if (goal === "money") return 16;
  if (goal === "study") return 13;
  if (goal === "fitness") return 14;
  return 11;
}

export default function PremiumPage() {
  const router = useRouter();

  const [step, setStep] = useState<"loading" | "onboarding" | "app">("loading");
  const [goal, setGoal] = useState<Goal>(null);
  const [coach, setCoach] = useState<Coach | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [isPremium, setIsPremium] = useState(false);
  const [userId, setUserId] = useState<string | null>(null);
  const [memory, setMemory] = useState<CoachMemory | null>(null);
  const [streak, setStreak] = useState({ current_streak: 0, longest_streak: 0, last_active_date: null as string | null, completed_missions: [] as string[], total_progress: 0 });
  const [completedMissionCount, setCompletedMissionCount] = useState(0);
  const [coachCount, setCoachCount] = useState(7);
  const [theme, setTheme] = useState<AppTheme>("dark");

  useEffect(() => {
    const checkUser = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data.user;

        if (!user) {
          setIsPremium(true);
          setStep("onboarding");
          setTheme(getStoredTheme());
          localStorage.setItem("plan", "premium");
          return;
        }

        setUserId(user.id);
        localStorage.setItem("plan", "premium");
        setTheme(getStoredTheme());

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
        setIsPremium(premium);

        if (!premium) {
          router.replace("/pricing");
          return;
        }

        const progress = await loadOrCreateStreak(user.id);
        if (progress) {
          setStreak({
            current_streak: progress.current_streak || 0,
            longest_streak: progress.longest_streak || 0,
            last_active_date: progress.last_active_date,
            completed_missions: progress.completed_missions || [],
            total_progress: progress.total_progress || 0,
          });
          setCompletedMissionCount((progress.completed_missions || []).length);
        }

        setStep("onboarding");
      } catch {
        setIsPremium(true);
        setStep("onboarding");
        setTheme(getStoredTheme());
        localStorage.setItem("plan", "premium");
      }
    };

    checkUser();
  }, [router]);

  useEffect(() => {
    const nextLevel = Math.floor(xp / 120) + 1;
    setLevel(nextLevel);
  }, [xp]);

  useEffect(() => {
    if (!userId || !coach) return;
    const loadMemory = async () => {
      const record = await loadCoachMemory(userId, coach);
      if (record) {
        setMemory({
          goals: record.goals || [],
          strengths: record.strengths || [],
          weaknesses: record.weaknesses || [],
          milestones: record.milestones || [],
          habits: record.habits || [],
          achievements: record.achievements || [],
          lastFocus: record.last_focus || undefined,
          plans: record.plans || [],
        });
      }
    };

    loadMemory();
  }, [coach, userId]);

  const startGoal = async (selectedGoal: Goal, selectedCoach: Coach) => {
    setGoal(selectedGoal);
    setCoach(selectedCoach);
    setStep("app");

    const coachProfile = getCoachProfile(selectedCoach);
    const mission = selectedGoal === "fitness"
      ? "Train with focus for 20 minutes today."
      : selectedGoal === "money"
      ? "Create one clear money move today."
      : selectedGoal === "study"
      ? "Study with intention for 20 minutes today."
      : "Define one meaningful action that moves your life forward today.";

    const welcomeMessage = `You are now working with ${coachProfile.title}. ${coachProfile.description} Your first mission is: ${mission}`;
    setMessages([{ role: "assistant", content: welcomeMessage }]);

    if (userId) {
      const existing = await loadCoachMemory(userId, selectedCoach);
      if (!existing) {
        await saveCoachMemory(userId, selectedCoach, {
          goals: selectedGoal ? [selectedGoal] : [],
          strengths: ["Consistency"],
          weaknesses: ["Overwhelm"],
          milestones: [],
          habits: [],
          achievements: [],
          last_focus: mission,
          plans: [mission],
        });
      }
      await updateStreak(userId, []);
    }
  };

  const send = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    const nextMessages = [...messages, { role: "user" as const, content: text }];
    setMessages(nextMessages);

    const memorySummary = buildMemorySummary(memory);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.slice(-10),
        goal,
        coach,
        isPremium,
        memorySummary,
      }),
    });

    const data = await res.json();
    setMessages((current) => [...current, { role: "assistant", content: data.reply }]);

    setXp((current) => current + rewardXP(goal));
    setCompletedMissionCount((current) => current + 1);
    setStreak((current) => ({ ...current, total_progress: current.total_progress + 1 }));

    if (userId) {
      const nextMemory: CoachMemory = {
        goals: [...(memory?.goals || []), text],
        strengths: memory?.strengths || ["Consistency"],
        weaknesses: memory?.weaknesses || ["Overwhelm"],
        milestones: memory?.milestones || [],
        habits: [...(memory?.habits || []), "Responded to coaching prompt"],
        achievements: memory?.achievements || [],
        lastFocus: text,
        plans: [...(memory?.plans || []), text],
      };
      setMemory(nextMemory);
      await saveCoachMemory(userId, coach || "free", {
        goals: nextMemory.goals.slice(0, 6),
        strengths: nextMemory.strengths.slice(0, 3),
        weaknesses: nextMemory.weaknesses.slice(0, 3),
        milestones: nextMemory.milestones.slice(0, 3),
        habits: nextMemory.habits.slice(0, 4),
        achievements: nextMemory.achievements.slice(0, 4),
        last_focus: text,
        plans: nextMemory.plans.slice(0, 6),
      });
      await updateStreak(userId, [...streak.completed_missions, text]);
    }
  };

  const activeCoach = coach ? getCoachProfile(coach) : null;
  const memorySummary = useMemo(() => buildMemorySummary(memory), [memory]);
  const activeTheme = useMemo(() => themeTokens[theme], [theme]);

  if (step === "loading") {
    return <div className="status">Checking premium access...</div>;
  }

  if (step === "onboarding") {
    return (
      <div className="onboardPage" style={{ background: `linear-gradient(135deg, ${activeTheme.shell}, #140c2d 45%, #0f172a 100%)` }}>
        <div className="onboardCard">
          <div className="badge">Premium coaching suite</div>
          <h1>Choose your next growth path</h1>
          <p>Select a coach and a focus area to start your premium experience.</p>

          <div className="goalGrid">
            <button onClick={() => startGoal("fitness", "fitness")}>💪 Fitness</button>
            <button onClick={() => startGoal("money", "business")}>💰 Business</button>
            <button onClick={() => startGoal("study", "study")}>📚 Study</button>
            <button onClick={() => startGoal("mindset", "mindset")}>🧠 Mindset</button>
            <button onClick={() => startGoal(null, "life")}>🌱 Life</button>
            <button onClick={() => startGoal(null, "therapist")}>🧘 Wellness</button>
            <button onClick={() => startGoal(null, "productivity")}>⚡ Productivity</button>
            <button onClick={() => startGoal(null, "free")}>🌌 General</button>
          </div>
        </div>

        <style jsx>{`
          .onboardPage {
            min-height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 24px;
            background: linear-gradient(135deg, #04030b, #140c2d 45%, #0f172a 100%);
            color: white;
          }
          .onboardCard {
            width: min(820px, 100%);
            padding: 28px;
            border-radius: 24px;
            background: rgba(255,255,255,0.08);
            border: 1px solid rgba(255,255,255,0.12);
            box-shadow: 0 24px 80px rgba(0,0,0,0.28);
          }
          .badge {
            display: inline-block;
            padding: 7px 12px;
            border-radius: 999px;
            background: rgba(255,255,255,0.08);
            margin-bottom: 12px;
            color: #d8b4fe;
          }
          .goalGrid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 12px;
            margin-top: 16px;
          }
          button {
            border: 1px solid rgba(255,255,255,0.12);
            border-radius: 14px;
            padding: 12px 14px;
            background: rgba(255,255,255,0.06);
            color: white;
            cursor: pointer;
          }
          @media (max-width: 640px) {
            .goalGrid { grid-template-columns: 1fr; }
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page" style={{ background: `linear-gradient(135deg, ${activeTheme.shell}, #140c2d 55%, #0f172a 100%)` }}>
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">My Future Premium</div>
          <div className="statCard">
            <div className="label">Current level</div>
            <div className="value">{level}</div>
          </div>
          <div className="statCard">
            <div className="label">XP</div>
            <div className="value">{xp}</div>
          </div>
          <div className="statCard">
            <div className="label">Streak</div>
            <div className="value">{streak.current_streak} days</div>
          </div>
          <div className="statCard">
            <div className="label">Completed missions</div>
            <div className="value">{completedMissionCount}</div>
          </div>

          <div className="panel">
            <h3>Coach focus</h3>
            <p>{activeCoach?.title || "General coach"}</p>
            <p className="small">{activeCoach?.personality || "Warm and strategic"}</p>
          </div>

          <div className="panel">
            <h3>Daily mission</h3>
            <p>{dailyMissions[completedMissionCount % dailyMissions.length]}</p>
          </div>

          <div className="panel">
            <h3>Weekly challenge</h3>
            <p>{weeklyChallenges[level % weeklyChallenges.length]}</p>
          </div>
        </aside>

        <main className="mainPanel">
          <div className="topBar">
            <div>
              <div className="title">Premium coaching command center</div>
              <div className="subtitle">Deep reasoning, structured coaching, and progress that remembers your journey.</div>
            </div>
            <div className="toolbar">
              <select
                className="themeSelect"
                value={theme}
                onChange={(event) => {
                  const nextTheme = event.target.value as AppTheme;
                  setTheme(nextTheme);
                  setStoredTheme(nextTheme);
                }}
              >
                {Object.keys(themeTokens).map((key) => (
                  <option key={key} value={key}>{key}</option>
                ))}
              </select>
              <button className="backBtn" onClick={() => router.push("/dashboard")}>Return to basic</button>
            </div>
          </div>

          <div className="heroStrip">
            <div>
              <div className="badge">Live analytics</div>
              <h2>{activeCoach?.title || "General coach"}</h2>
              <p>{activeCoach?.description || "Your premium coach will guide you with structured clarity and clear accountability."}</p>
            </div>
            <div className="metricsGrid">
              <div className="metricCard"><span>Productivity</span><strong>{Math.min(100, 60 + level * 3)}%</strong></div>
              <div className="metricCard"><span>Wellness</span><strong>{Math.min(100, 70 + level)}%</strong></div>
              <div className="metricCard"><span>Learning</span><strong>{Math.min(100, 50 + level * 2)}%</strong></div>
              <div className="metricCard"><span>Business</span><strong>{Math.min(100, 55 + level * 2)}%</strong></div>
            </div>
          </div>

          <div className="coachGrid">
            {COACHES.slice(0, coachCount).map((coachOption) => (
              <button
                key={coachOption.key}
                className={`coachChip ${coach === coachOption.key ? "active" : ""}`}
                onClick={() => startGoal(goal, coachOption.key as Coach)}
              >
                {coachOption.emoji} {coachOption.title}
              </button>
            ))}
          </div>

          <div className="chatCard">
            <div className="messages">
              {messages.map((message, index) => (
                <div key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                  {message.content}
                </div>
              ))}
            </div>

            <div className="composer">
              <input
                value={input}
                onChange={(event) => setInput(event.target.value)}
                placeholder="Ask your coach for a plan, review, or next move..."
                onKeyDown={(event) => event.key === "Enter" && send()}
              />
              <button onClick={send}>Send</button>
            </div>
          </div>

          <div className="insightGrid">
            <div className="panel">
              <h3>Coach memory</h3>
              <p>{memorySummary}</p>
            </div>
            <div className="panel">
              <h3>Monthly goals</h3>
              <p>{monthlyGoals[level % monthlyGoals.length]}</p>
            </div>
            <div className="panel">
              <h3>Daily rewards</h3>
              <p>{rewards[completedMissionCount % rewards.length]}</p>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          padding: 24px;
          background: linear-gradient(135deg, #04030b, #140c2d 55%, #0f172a 100%);
          color: white;
        }
        .shell {
          display: grid;
          grid-template-columns: 280px 1fr;
          gap: 18px;
          max-width: 1400px;
          margin: 0 auto;
        }
        .sidebar, .mainPanel {
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 24px;
          padding: 18px;
          backdrop-filter: blur(24px);
        }
        .brand {
          font-size: 1.12rem;
          font-weight: 700;
          margin-bottom: 14px;
        }
        .statCard, .panel {
          padding: 12px;
          border-radius: 16px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 10px;
        }
        .label { font-size: 0.84rem; color: #cbd5e1; }
        .value { font-size: 1.14rem; font-weight: 700; margin-top: 4px; }
        .small { margin-top: 6px; color: #cbd5e1; font-size: 0.9rem; }
        .topBar {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 16px;
          margin-bottom: 14px;
        }
        .title { font-size: 1.16rem; font-weight: 700; }
        .subtitle { margin-top: 4px; color: #cbd5e1; }
        .toolbar { display: flex; gap: 8px; align-items: center; }
        .backBtn {
          border: 0;
          border-radius: 999px;
          padding: 10px 14px;
          background: rgba(255,255,255,0.08);
          color: white;
          cursor: pointer;
        }
        .themeSelect {
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.08);
          color: white;
        }
        .heroStrip {
          display: flex;
          justify-content: space-between;
          gap: 18px;
          align-items: flex-start;
          padding: 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
          margin-bottom: 14px;
        }
        .badge {
          display: inline-block;
          padding: 7px 12px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: #d8b4fe;
          margin-bottom: 8px;
        }
        .metricsGrid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
          min-width: 260px;
        }
        .metricCard {
          padding: 10px 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.05);
          display: flex;
          flex-direction: column;
          gap: 6px;
        }
        .coachGrid {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 14px;
        }
        .coachChip {
          border: 1px solid rgba(255,255,255,0.12);
          border-radius: 999px;
          padding: 8px 12px;
          background: rgba(255,255,255,0.05);
          color: white;
          cursor: pointer;
        }
        .coachChip.active {
          background: linear-gradient(90deg, #7c3aed, #22d3ee);
        }
        .chatCard {
          padding: 14px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
        }
        .messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 420px;
          overflow-y: auto;
          padding-right: 4px;
          margin-bottom: 12px;
        }
        .bubble {
          max-width: 82%;
          padding: 12px 14px;
          border-radius: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }
        .bubble.user { align-self: flex-end; background: rgba(34,211,238,0.18); }
        .bubble.assistant { background: rgba(255,255,255,0.08); }
        .composer { display: flex; gap: 10px; }
        input { flex: 1; border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; background: rgba(255,255,255,0.08); color: white; padding: 12px 16px; }
        button { border: 0; border-radius: 999px; padding: 12px 16px; background: linear-gradient(90deg, #7c3aed, #22d3ee); color: white; cursor: pointer; }
        .insightGrid { display: grid; grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
        .status { color: white; padding: 40px; }
        @media (max-width: 980px) {
          .shell { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .heroStrip, .topBar, .composer, .insightGrid {
            flex-direction: column;
            align-items: flex-start;
          }
          .metricsGrid { min-width: 0; width: 100%; }
          .bubble { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}