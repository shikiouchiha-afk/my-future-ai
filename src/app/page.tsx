"use client";

import { useEffect, useRef, useState } from "react";

/* =========================
   TYPES
========================= */

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
  | "mindset";

/* =========================
   STORAGE HELPERS
========================= */

const save = (k: string, v: any) => {
  if (typeof window !== "undefined") {
    localStorage.setItem(k, JSON.stringify(v));
  }
};

const load = (k: string) => {
  if (typeof window === "undefined") return null;
  const v = localStorage.getItem(k);
  return v ? JSON.parse(v) : null;
};

/* =========================
   COACH PERSONALITY SYSTEM
========================= */

function coachStyle(coach: Coach | null) {
  switch (coach) {
    case "business":
      return "Be sharp, direct, focus on money and execution.";
    case "fitness":
      return "Be strict, motivational, push discipline hard.";
    case "study":
      return "Be calm, structured, and educational.";
    case "life":
      return "Be balanced, supportive, reflective.";
    case "mindset":
    default:
      return "Be motivational, disciplined, and focused.";
  }
}

/* =========================
   MAIN PAGE
========================= */

export default function Page() {
  const [step, setStep] = useState<"onboarding" | "app">("onboarding");

  const [goal, setGoal] = useState<Goal>(null);
  const [coach, setCoach] = useState<Coach | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const prevLevel = useRef(1);

  /* =========================
     LOAD MEMORY
  ========================= */

  useEffect(() => {
    const g = load("goal");
    const c = load("coach");

    if (g) {
      setGoal(g);
      setStep("app");
    }

    if (c) setCoach(c);
  }, []);

  /* =========================
     LEVEL SYSTEM
  ========================= */

  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;

    if (newLevel > prevLevel.current) {
      prevLevel.current = newLevel;
      setLevel(newLevel);
    }
  }, [xp]);

  /* =========================
     START FLOW (GOAL + COACH)
  ========================= */

  const startGoal = (g: Goal) => {
    const autoCoach: Coach =
      g === "money"
        ? "business"
        : g === "fitness"
        ? "fitness"
        : g === "study"
        ? "study"
        : "mindset";

    setGoal(g);
    setCoach(autoCoach);

    save("goal", g);
    save("coach", autoCoach);

    setStep("app");

    setMessages([
      {
        role: "assistant",
        content: `🔥 Coach Activated: ${autoCoach}`,
      },
      {
        role: "assistant",
        content: `🎯 Daily Mission: ${g}`,
      },
    ]);
  };

  /* =========================
     SEND MESSAGE
  ========================= */

  const send = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    setMessages((p) => [...p, { role: "user", content: text }]);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: [
            ...messages,
            { role: "user", content: text },
          ].slice(-10),
          goal,
          coach,
          system: coachStyle(coach),
        }),
      });

      const data = await res.json();

      setMessages((p) => [
        ...p,
        { role: "assistant", content: data.reply },
      ]);

      setXp((p) => p + 10);
    } catch (err) {
      setMessages((p) => [
        ...p,
        {
          role: "assistant",
          content: "⚠️ AI error — check backend",
        },
      ]);
    }
  };

  /* =========================
     ONBOARDING SCREEN
  ========================= */

  if (step === "onboarding") {
    return (
      <div className="onboard">
        <div className="card">
          <h1>🌌 Mission Control</h1>
          <p>What do you want to improve?</p>

          <div className="grid">
            <button onClick={() => startGoal("fitness")}>💪 Fitness</button>
            <button onClick={() => startGoal("money")}>💰 Money</button>
            <button onClick={() => startGoal("study")}>📚 Study</button>
            <button onClick={() => startGoal("mindset")}>🧠 Mindset</button>
          </div>
        </div>

        <style jsx>{`
          .onboard {
            height: 100vh;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            background: radial-gradient(circle at top, #050816, #000);
          }

          .card {
            padding: 30px;
            border-radius: 18px;
            background: rgba(255,255,255,0.05);
            backdrop-filter: blur(20px);
            text-align: center;
          }

          .grid {
            display: grid;
            gap: 10px;
            margin-top: 20px;
          }

          button {
            padding: 12px;
            border: none;
            border-radius: 10px;
            background: rgba(255,255,255,0.08);
            color: white;
          }
        `}</style>
      </div>
    );
  }

  /* =========================
     MAIN APP
  ========================= */

  return (
    <div className="space">

      {/* BACKGROUND */}
      <div className="bg" />

      {/* SIDEBAR */}
      <div className="sidebar">
        <h3>XP COACH</h3>
        <p>XP: {xp}</p>
        <p>Level: {level}</p>
        <p>Goal: {goal}</p>
        <p>Coach: {coach}</p>
      </div>

      {/* MAIN CHAT */}
      <div className="main">

        <div className="chat">
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="bottom">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Talk to your coach..."
          />
          <button onClick={send}>Send</button>
        </div>

        {/* XP BAR */}
        <div className="xpBar">
          <div className="fill" style={{ width: `${xp % 100}%` }} />
        </div>
      </div>

      {/* STYLES */}
      <style jsx>{`
        .space {
          display: flex;
          height: 100vh;
          color: white;
          overflow: hidden;
        }

        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(99,102,241,0.25), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(0,180,255,0.2), transparent 40%),
            radial-gradient(circle at 50% 80%, rgba(147,51,234,0.2), transparent 50%),
            #020617;
        }

        .sidebar {
          width: 220px;
          padding: 16px;
          z-index: 2;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
        }

        .chat {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        /* FIXED CHAT SIDES */
        .row {
          display: flex;
          margin-bottom: 10px;
        }

        .row.user {
          justify-content: flex-end;
        }

        .row.assistant {
          justify-content: flex-start;
        }

        .bubble {
          max-width: 70%;
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
        }

        .row.user .bubble {
          background: rgba(79,70,229,0.25);
        }

        .bottom {
          display: flex;
          gap: 10px;
          padding: 12px;
        }

        input {
          flex: 1;
          padding: 10px;
          background: transparent;
          border: 1px solid #333;
          color: white;
        }

        button {
          padding: 10px 14px;
          background: #4f46e5;
          border: none;
          color: white;
        }

        .xpBar {
          height: 6px;
          background: rgba(255,255,255,0.1);
        }

        .fill {
          height: 100%;
          background: linear-gradient(90deg, #4f46e5, #38bdf8);
        }
      `}</style>
    </div>
  );
}