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
type CoachKey,
} from "@/lib/coachSystem";
import {
  loadCoachMemory,
  saveCoachMemory,
  loadOrCreateStreak,
  updateStreak,
} from "@/lib/coachMemory";
import { getStoredTheme, setStoredTheme, themeTokens, type AppTheme } from "@/lib/theme";
import { getPremiumStatus } from "@/lib/premiumAccess";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import { triggerHaptic } from "@/lib/mobileFeedback";

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

function generateMission(coach: string | null) {
  const missions: Record<string, string> = {
    business: "Create one business action that moves you closer to growth today.",
    fitness: "Complete one workout or health action today.",
    study: "Study one important concept for 15 minutes today.",
    mindset: "Take one action that builds discipline and confidence today.",
    therapist: "Take a moment to reflect on your thoughts and feelings today.",
    productivity: "Complete your most important task today.",
    life: "Take one meaningful step toward improving your life today.",
    free: "Take one action that moves you forward today.",
  };

  return missions[coach || ""] || "Stay consistent today.";
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
  const [coachingIntensity, setCoachingIntensity] = useState<"supportive" | "balanced" | "savage">("balanced");
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
    if (typeof window === "undefined") return;

    const setVh = () => {
      const height = window.visualViewport?.height || window.innerHeight;
      document.documentElement.style.setProperty("--mobile-vh", `${height}px`);
    };

    setVh();
    window.visualViewport?.addEventListener("resize", setVh);
    window.addEventListener("resize", setVh);

    return () => {
      window.visualViewport?.removeEventListener("resize", setVh);
      window.removeEventListener("resize", setVh);
    };
  }, []);

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
          .select("is_premium, is_admin, coaching_intensity")
          .eq("id", user.id)
          .single();

        const intensity = profile?.coaching_intensity;
        if (intensity === "supportive" || intensity === "balanced" || intensity === "savage") {
          setCoachingIntensity(intensity);
          localStorage.setItem("coachingIntensity", intensity);
        } else {
          const storedIntensity = localStorage.getItem("coachingIntensity");
          if (storedIntensity === "supportive" || storedIntensity === "balanced" || storedIntensity === "savage") {
            setCoachingIntensity(storedIntensity);
          }
        }

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
  coachKey: coach as CoachKey,
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

const mission =
  coachProfile.key === "business"
    ? "Create one clear business action today."
    : coachProfile.key === "fitness"
    ? "Complete one fitness action that improves your health today."
    : coachProfile.key === "study"
    ? "Study one important concept for 20 minutes today."
    : coachProfile.key === "therapist"
    ? "Take one moment today to reflect and care for your mental wellbeing."
    : coachProfile.key === "productivity"
    ? "Complete your most important task today."
    : coachProfile.key === "mindset"
    ? "Do one action today that builds discipline and confidence."
    : coachProfile.key === "life"
    ? "Take one meaningful step toward improving your life today."
    : "Complete one action that moves you forward today.";

    const welcomeMessage = `${getCoachOpeningMessage(selectedCoach, selectedGoal)}\n\n🔥 Mission: ${mission}\n🎯 Daily goal: ${generateMission(selectedCoach)}`;
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
    }
  };

  const send = async (overrideText?: string) => {
    const text = (overrideText ?? input).trim();
    if (!text || isTyping || isStreaming) return;

    triggerHaptic(12);

    setInput("");
    setPendingPrompt(text);
    setIsTyping(true);
    setIsStreaming(true);
    setConnectionState("ready");
    setShouldAutoScroll(true);
    setDraftSaved(false);

    const memorySummary = buildMemorySummary(memory);
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
          userId,
          memorySummary,
          coachingIntensity,
        }),
      });

      if (!res.ok) throw new Error("Request failed");

      const data = await res.json();
      const reply = data.reply;

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
          setXp((current) => current + rewardXP(coach));
          setCompletedMissionCount((current) => current + 1);

          if (userId) {
           const nextMemory: CoachMemory = {
  coachKey: (coach || "free") as CoachKey,
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

            const completedMissions = [...streak.completed_missions, text];
            void (async () => {
              const updatedStreak = await updateStreak(userId, completedMissions);
              setStreak((current) => ({
                ...current,
                current_streak: updatedStreak?.current_streak ?? current.current_streak,
                longest_streak: updatedStreak?.longest_streak ?? current.longest_streak,
                last_active_date: updatedStreak?.last_active_date ?? current.last_active_date,
                completed_missions: updatedStreak?.completed_missions ?? completedMissions,
                total_progress: current.total_progress + 1,
              }));
            })();
          } else {
            setStreak((current) => ({ ...current, total_progress: current.total_progress + 1 }));
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
    <div
      className="onboardPage"
      style={{
        background: `
        radial-gradient(circle at top, rgba(34,211,238,.25), transparent 35%),
        linear-gradient(135deg, ${activeTheme.shell}, #082f49 45%, #020617 100%)
        `,
      }}
    >
      <div className="oceanGlow" />

      <div className="onboardCard">
        <div className="badge">🌊 Premium AI Coaching Suite</div>

        <h1>Choose Your AI Coach</h1>

        <p>
          Your future starts with the right guide.
          <br />
          Pick the AI coach that matches your mission.
        </p>

        <div className="coachGrid">
          <button onClick={() => startGoal("fitness", "fitness")}>
            <span>💪</span>
            <h2>Fitness Coach</h2>
            <p>Build strength, nutrition, discipline, and a healthier lifestyle.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal("money", "business")}>
            <span>💰</span>
            <h2>Business Coach</h2>
            <p>Build companies, learn marketing, sales, and grow revenue.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal("study", "study")}>
            <span>📚</span>
            <h2>Study Coach</h2>
            <p>Learn faster, understand concepts, and improve your grades.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal("mindset", "mindset")}>
            <span>🧠</span>
            <h2>Mindset Coach</h2>
            <p>Build confidence, discipline, and mental toughness.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal(null, "life")}>
            <span>🌱</span>
            <h2>Life Coach</h2>
            <p>Improve habits, purpose, decisions, and balance.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal(null, "therapist")}>
  <span>🧘</span>
  <h2>Therapist Coach</h2>
  <p>
    Understand your thoughts, manage emotions, and build a healthier mindset.
  </p>
  <b>Start Coaching →</b>
</button>

          <button onClick={() => startGoal(null, "productivity")}>
            <span>⚡</span>
            <h2>Productivity Coach</h2>
            <p>Plan better, focus deeper, and execute your goals.</p>
            <b>Start Coaching →</b>
          </button>

          <button onClick={() => startGoal(null, "free")}>
            <span>🌌</span>
            <h2>General Coach</h2>
            <p>A balanced AI guide for everyday growth.</p>
            <b>Start Coaching →</b>
          </button>
        </div>
      </div>

      <style jsx>{`
        .onboardPage {
          min-height: 100dvh;
          display:flex;
          align-items:center;
          justify-content:center;
          padding:30px 16px;
          color:white;
          position:relative;
          overflow:hidden;
        }

        .oceanGlow {
          position:absolute;
          width:500px;
          height:500px;
          background:#22d3ee;
          filter:blur(180px);
          opacity:.18;
        }

        .onboardCard {
          position:relative;
          z-index:2;
          width:min(1100px,100%);
          padding:35px;
          border-radius:32px;
          background:rgba(255,255,255,.07);
          backdrop-filter:blur(25px);
          border:1px solid rgba(255,255,255,.15);
          box-shadow:0 30px 100px rgba(0,0,0,.45);
          text-align:center;
        }

        .badge {
          display:inline-block;
          padding:8px 16px;
          border-radius:999px;
          background:rgba(34,211,238,.15);
          color:#67e8f9;
          margin-bottom:15px;
        }

        h1 {
          font-size:clamp(2rem,5vw,3rem);
          margin:10px 0;
        }

        .onboardCard > p {
          color:#cbd5e1;
          line-height:1.6;
        }

        .coachGrid {
          margin-top:30px;
          display:grid;
          grid-template-columns:repeat(auto-fit,minmax(230px,1fr));
          gap:18px;
        }

        button {
          text-align:left;
          padding:22px;
          border-radius:24px;
          border:1px solid rgba(255,255,255,.15);
          background:rgba(255,255,255,.06);
          color:white;
          cursor:pointer;
          transition:.3s;
        }

        button:hover {
          transform:translateY(-8px);
          border-color:#22d3ee;
          box-shadow:0 20px 50px rgba(34,211,238,.25);
        }

        button span {
          font-size:2.5rem;
        }

        h2 {
          margin:12px 0 8px;
        }

        button p {
          color:#cbd5e1;
          line-height:1.5;
        }

        button b {
          color:#67e8f9;
          display:block;
          margin-top:15px;
        }

        @media(max-width:640px){
          .onboardCard {
            padding:20px;
          }
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

              <div className="messages" ref={messagesContainerRef} onScroll={handleScroll}>
                {messages.map((message, index) => (
                  <div key={`${message.role}-${index}`} className={`bubble ${message.role}`}>
                    {message.content}
                  </div>
                ))}
              </div>

              <div className="composer">
                <textarea
                  ref={textareaRef}
                  value={input}
                  onChange={(event) => setInput(event.target.value)}
                  placeholder="Ask your coach for a plan, review, or next move..."
                  onKeyDown={handleKeyDown}
                  rows={1}
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

      <MobileBottomNav />

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100dvh;
          padding: calc(12px + env(safe-area-inset-top)) 12px calc(88px + env(safe-area-inset-bottom));
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
          width: min(1480px, 100%);
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
          padding: clamp(12px, 2vw, 18px);
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
          flex-wrap: wrap;
        }
        .title { font-size: 1.16rem; font-weight: 700; }
        .subtitle { margin-top: 4px; color: #cbd5e1; font-size: 0.95rem; }
        .toolbar { display: flex; gap: 8px; align-items: center; }
        .toolbar { flex-wrap: wrap; }
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
          padding: clamp(12px, 1.8vw, 16px);
          border-radius: 22px;
          background: rgba(255,255,255,0.05);
          box-shadow: inset 0 1px 0 rgba(255,255,255,0.06);
          min-height: clamp(460px, 64dvh, 720px);
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
          min-height: 220px;
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
        .composer { display: flex; gap: 10px; align-items: flex-end; }
        textarea {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 18px;
          background: rgba(255,255,255,0.08);
          color: white;
          padding: 12px 14px;
          min-height: 48px;
          max-height: 160px;
          resize: none;
          font: inherit;
          line-height: 1.45;
        }
        textarea::placeholder { color: #cbd5e1; }
        button {
          border: 0;
          border-radius: 999px;
          padding: 12px 16px;
          min-height: 48px;
          background: linear-gradient(90deg, #7c3aed, #22d3ee);
          color: white;
          cursor: pointer;
          flex-shrink: 0;
        }
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
          .heroStrip, .topBar, .chatHeader, .insightGrid {
            flex-direction: column;
            align-items: flex-start;
          }
          .page {
            padding: calc(10px + env(safe-area-inset-top)) 8px calc(12px + env(safe-area-inset-bottom));
          }
          .shell {
            gap: 10px;
          }
          .sidebar {
            padding: 10px;
          }
          .metricsGrid { min-width: 0; width: 100%; }
          .bubble { max-width: 100%; }
          .chatCard {
            min-height: calc(var(--mobile-vh, 100dvh) - 300px);
            border-radius: 16px;
          }
          .chatHeader {
            align-items: flex-start;
          }
          .composer {
            width: 100%;
            align-items: flex-end;
          }
          .composer button {
            min-width: 84px;
          }
        }
      `}</style>
    </div>
  );
}