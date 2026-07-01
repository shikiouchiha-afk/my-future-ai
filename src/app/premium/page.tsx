"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import {
  COACHES,
  buildMemorySummary,
  getCoachOpeningMessage,
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

function generateMission(goal: string | null) {
  const missions: Record<string, string> = {
    fitness: "Do 10 pushups right now.",
    money: "Write 1 way to make money today.",
    study: "Study focused for 15 minutes.",
    mindset: "Write 3 goals for your life.",
  };

  return missions[goal || ""] || "Stay consistent today.";
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
  const [activeView, setActiveView] = useState<"home" | "chat" | "history" | "profile">("chat");
  const [isMobile, setIsMobile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);
  const [isStreaming, setIsStreaming] = useState(false);
  const [connectionState, setConnectionState] = useState<"ready" | "reconnecting" | "offline">("ready");
  const [pendingPrompt, setPendingPrompt] = useState<string | null>(null);
  const [draftSaved, setDraftSaved] = useState(false);
  const [shouldAutoScroll, setShouldAutoScroll] = useState(true);
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const syncLayout = () => setIsMobile(window.innerWidth < 900);
    syncLayout();
    window.addEventListener("resize", syncLayout);
    return () => window.removeEventListener("resize", syncLayout);
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    const savedDraft = window.localStorage.getItem("premium-chat-draft");
    if (savedDraft) {
      setInput(savedDraft);
      setDraftSaved(true);
    }
  }, []);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (input.trim()) {
      window.localStorage.setItem("premium-chat-draft", input);
      setDraftSaved(true);
    } else {
      window.localStorage.removeItem("premium-chat-draft");
      setDraftSaved(false);
    }
  }, [input]);

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 160)}px`;
    }
  }, [input]);

  useEffect(() => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    if (shouldAutoScroll || messages.length <= 1) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, isTyping, isStreaming, shouldAutoScroll]);

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
    const nextLevel = Math.floor(xp / 100) + 1;
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

    const welcomeMessage = `${getCoachOpeningMessage(selectedCoach, selectedGoal)}\n\n🔥 Mission: ${mission}\n🎯 Daily goal: ${generateMission(selectedGoal)}`;
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

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping || isStreaming) return;

    setInput("");
    setPendingPrompt(text);
    setIsTyping(true);
    setIsStreaming(true);
    setConnectionState("ready");
    setShouldAutoScroll(true);
    setDraftSaved(false);

    const memorySummary = buildMemorySummary(memory);
    const energeticPrefix = /\b(hype|excited|fire|go|let's go|crazy|winning|strong)\b/i.test(text)
      ? "You’re bringing strong energy, so I’m matching that pace and pushing for action."
      : "I’m staying calm, focused, and grounded while helping you move forward.";

    setMessages((current) => [...current, { role: "user", content: text }, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [...messages, { role: "user", content: text }].slice(-10),
          goal,
          coach,
          isPremium,
          memorySummary,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const reply = `${energeticPrefix}\n\n${data.reply}`;

      let typed = 0;
      const interval = window.setInterval(() => {
        typed += 1;
        const chunk = reply.slice(0, typed);
        setMessages((current) => {
          const updated = [...current];
          updated[updated.length - 1] = { role: "assistant", content: chunk };
          return updated;
        });

        if (typed >= reply.length) {
          window.clearInterval(interval);
          setIsTyping(false);
          setIsStreaming(false);
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
            void saveCoachMemory(userId, coach || "free", {
              goals: nextMemory.goals.slice(0, 6),
              strengths: nextMemory.strengths.slice(0, 3),
              weaknesses: nextMemory.weaknesses.slice(0, 3),
              milestones: nextMemory.milestones.slice(0, 3),
              habits: nextMemory.habits.slice(0, 4),
              achievements: nextMemory.achievements.slice(0, 4),
              last_focus: text,
              plans: nextMemory.plans.slice(0, 6),
            });
            void updateStreak(userId, [...streak.completed_missions, text]);
          }
        }
      }, 18);
    } catch {
      setMessages((current) => {
        const updated = [...current];
        updated[updated.length - 1] = {
          role: "assistant",
          content: "I hit a snag connecting. Tap retry or send your message again.",
        };
        return updated;
      });
      setIsTyping(false);
      setIsStreaming(false);
      setConnectionState("reconnecting");
    }
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void send();
    }
  };

  const handleScroll = () => {
    if (!messagesContainerRef.current) return;
    const container = messagesContainerRef.current;
    const distanceFromBottom = container.scrollHeight - (container.scrollTop + container.clientHeight);
    setShouldAutoScroll(distanceFromBottom < 140);
  };

  const handleRetry = () => {
    if (!pendingPrompt) return;
    setConnectionState("ready");
    void send(pendingPrompt);
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
    <div className="page" style={{ background: `radial-gradient(circle at top, ${activeTheme.glow}, transparent 30%), linear-gradient(135deg, ${activeTheme.shell}, #04030b 55%, #020617 100%)` }}>
      <div className="stars" />
      <div className="nebula" />
      <div className="shell">
        <aside className="sidebar">
          <div className="brand">My Future Premium</div>
          <div className="miniStatsRow">
            <div className="statPill">Lvl {level}</div>
            <div className="statPill">XP {xp}</div>
            <div className="statPill">🔥 {streak.current_streak}</div>
          </div>

          <div className="panel compactPanel">
            <h3>Coach focus</h3>
            <p>{activeCoach?.title || "General coach"}</p>
            <p className="small">{activeCoach?.personality || "Warm and strategic"}</p>
          </div>

          <div className="panel compactPanel">
            <h3>Daily mission</h3>
            <p>{dailyMissions[completedMissionCount % dailyMissions.length]}</p>
          </div>

          <div className="panel compactPanel">
            <h3>Weekly challenge</h3>
            <p>{weeklyChallenges[level % weeklyChallenges.length]}</p>
          </div>
        </aside>

        <main className="mainPanel">
          <div className="topBar">
            <div>
              <div className="title">Premium coaching command center</div>
              <div className="subtitle">A calmer, wider space for deep conversations and clear next steps.</div>
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

          <div className="conversationShell">
            <div className="chatCard">
              <div className="chatHeader">
                <div>
                  <div className="chatTitle">{activeCoach?.title || "General coach"}</div>
                  <div className="chatSubtitle">{activeCoach?.description || "Focused guidance, clear accountability, and thoughtful momentum."}</div>
                </div>
                <div className="miniStats">
                  <span>Lvl {level}</span>
                  <span>XP {xp}</span>
                  <span>🔥 {streak.current_streak}</span>
                </div>
              </div>

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
                <button onClick={() => send()}>Send</button>
              </div>
            </div>
          </div>

          <div className="insightGrid">
            <div className="panel">
              <h3>Coach memory</h3>
              <p>{memorySummary}</p>
            </div>
            <div className="panel">
              <h3>Daily rewards</h3>
              <p>{rewards[completedMissionCount % rewards.length]}</p>
            </div>
            <div className="panel">
              <h3>Monthly goals</h3>
              <p>{monthlyGoals[level % monthlyGoals.length]}</p>
            </div>
          </div>
        </main>
      </div>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100vh;
          padding: 24px;
          overflow: hidden;
          background: linear-gradient(135deg, #04030b, #140c2d 55%, #0f172a 100%);
          color: white;
        }
        .stars, .nebula {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }
        .stars {
          background-image: radial-gradient(rgba(255,255,255,0.85) 1px, transparent 1px);
          background-size: 34px 34px;
          opacity: 0.14;
          animation: drift 12s linear infinite;
        }
        .nebula {
          background: radial-gradient(circle at 20% 20%, rgba(34,211,238,0.22), transparent 28%), radial-gradient(circle at 80% 15%, rgba(139,92,246,0.24), transparent 30%), radial-gradient(circle at 70% 80%, rgba(244,114,182,0.16), transparent 24%);
          mix-blend-mode: screen;
          animation: pulse 8s ease-in-out infinite;
        }
        .shell {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(220px, 260px) minmax(0, 1fr);
          gap: 18px;
          max-width: 1480px;
          margin: 0 auto;
          align-items: start;
        }
        .sidebar {
          background: rgba(255,255,255,0.04);
          border: 1px solid rgba(255,255,255,0.08);
          border-radius: 18px;
          padding: 12px;
          backdrop-filter: blur(18px);
          display: flex;
          flex-direction: column;
          gap: 8px;
        }
        .mainPanel {
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          border-radius: 24px;
          padding: 18px;
          backdrop-filter: blur(24px);
          min-width: 0;
        }
        .brand {
          font-size: 1.05rem;
          font-weight: 700;
          margin-bottom: 4px;
        }
        .miniStatsRow {
          display: flex;
          flex-wrap: wrap;
          gap: 8px;
          margin-bottom: 4px;
        }
        .statPill {
          padding: 6px 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          font-size: 0.8rem;
        }
        .panel {
          padding: 10px;
          border-radius: 14px;
          background: rgba(255,255,255,0.05);
        }
        .compactPanel p {
          font-size: 0.9rem;
          margin-top: 4px;
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
        .subtitle { margin-top: 4px; color: #cbd5e1; font-size: 0.95rem; }
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
        .conversationShell {
          width: 100%;
          display: flex;
          justify-content: center;
        }
        .chatCard {
          width: min(100%, 900px);
          padding: 16px;
          border-radius: 22px;
          background: rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          min-height: 620px;
          display: flex;
          flex-direction: column;
        }
        .chatHeader {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 14px;
          padding-bottom: 10px;
          border-bottom: 1px solid rgba(255,255,255,0.08);
        }
        .chatTitle { font-size: 1rem; font-weight: 700; }
        .chatSubtitle { margin-top: 4px; color: #cbd5e1; font-size: 0.92rem; }
        .miniStats {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
          color: #e2e8f0;
          font-size: 0.85rem;
        }
        .messages {
          display: flex;
          flex-direction: column;
          gap: 12px;
          flex: 1;
          overflow-y: auto;
          padding: 4px 4px 8px;
          margin-bottom: 14px;
        }
        .bubble {
          max-width: 78%;
          padding: 12px 14px;
          border-radius: 16px;
          line-height: 1.65;
          white-space: pre-wrap;
          box-shadow: 0 10px 30px rgba(0,0,0,0.16);
          font-size: 0.97rem;
        }
        .bubble.user { align-self: flex-end; background: linear-gradient(135deg, rgba(34,211,238,0.24), rgba(14,165,233,0.2)); }
        .bubble.assistant { background: rgba(255,255,255,0.09); }
        .composer { display: flex; gap: 10px; align-items: center; }
        input { flex: 1; border: 1px solid rgba(255,255,255,0.16); border-radius: 999px; background: rgba(255,255,255,0.08); color: white; padding: 12px 16px; }
        input::placeholder { color: #cbd5e1; }
        button { border: 0; border-radius: 999px; padding: 12px 16px; background: linear-gradient(90deg, #7c3aed, #22d3ee); color: white; cursor: pointer; }
        .insightGrid { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 12px; }
        .status { color: white; padding: 40px; }
        @keyframes drift {
          from { transform: translateY(0); }
          to { transform: translateY(-34px); }
        }
        @keyframes pulse {
          0%, 100% { transform: scale(1); opacity: 0.9; }
          50% { transform: scale(1.03); opacity: 1; }
        }
        @media (max-width: 1200px) {
          .shell { grid-template-columns: 1fr; }
        }
        @media (max-width: 720px) {
          .heroStrip, .topBar, .chatHeader, .composer, .insightGrid {
            flex-direction: column;
            align-items: flex-start;
          }
          .metricsGrid { min-width: 0; width: 100%; }
          .bubble { max-width: 100%; }
          .chatCard { min-height: 540px; }
        }
      `}</style>
    </div>
  );
}