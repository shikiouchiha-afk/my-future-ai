"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

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
  | "mindset"
  | "therapist"
  | "free";

/* =========================
   CORE
========================= */

function generateMission(goal: string) {
  const missions: any = {
    fitness: "Do 10 pushups right now.",
    money: "Write 1 way to make $ today.",
    study: "Study focused for 15 minutes.",
    mindset: "Write 3 goals for your life.",
  };

  return missions[goal] || "Stay consistent today.";
}

function rewardXP(goal: string) {
  return 10 + (goal === "money" ? 8 : goal === "study" ? 6 : 5);
}

/* =========================
   MAIN PAGE
========================= */

export default function Page() {
  const router = useRouter();

  const [step, setStep] = useState<"loading" | "onboarding" | "app">("loading");

  const [goal, setGoal] = useState<Goal>(null);
  const [coach, setCoach] = useState<Coach | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const [isPremium, setIsPremium] = useState(false);

  const prevLevel = useRef(1);

  /* =========================
     🔐 REAL PREMIUM CHECK (SECURE)
  ========================= */
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      const premium = profile?.is_premium === true;

      setIsPremium(premium);

      if (!premium) {
        router.replace("/pricing");
        return;
      }

      setStep("onboarding");
    };

    checkUser();
  }, [router]);

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
     START
  ========================= */
  const startGoal = (g: Goal) => {
    setGoal(g);

    const autoCoach: Coach =
      g === "money"
        ? "business"
        : g === "fitness"
        ? "fitness"
        : g === "study"
        ? "study"
        : "mindset";

    setCoach(autoCoach);
    setStep("app");

    setMessages([
      { role: "assistant", content: `🔥 Coach Activated: ${autoCoach}` },
      { role: "assistant", content: `🎯 Mission: ${generateMission(g!)}` },
    ]);
  };

  /* =========================
     SEND MESSAGE
  ========================= */
  const send = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages.slice(-10),
        goal,
        coach,
        isPremium,
      }),
    });

    const data = await res.json();

    setMessages((p) => [
      ...p,
      { role: "assistant", content: data.reply },
    ]);

    setXp((p) => p + rewardXP(goal || "mindset"));
  };

  /* =========================
     LOADING BLOCK
  ========================= */
  if (step === "loading") {
    return (
      <div style={{ color: "white", padding: 30 }}>
        Checking premium access...
      </div>
    );
  }

  /* =========================
     ONBOARDING
  ========================= */
  if (step === "onboarding") {
    return (
      <div className="onboard">
        <div className="card">
          <h1>🌊 Choose your mission</h1>

          <button onClick={() => startGoal("fitness")}>💪 Fitness</button>
          <button onClick={() => startGoal("money")}>💰 Money</button>
          <button onClick={() => startGoal("study")}>📚 Study</button>
          <button onClick={() => startGoal("mindset")}>🧠 Mindset</button>

          <button onClick={() => setCoach("therapist")}>
            🧘 Therapist Mode
          </button>

          <button onClick={() => setCoach("free")}>
            🆓 Free Mode
          </button>
        </div>

        <style jsx>{`
          .onboard {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            color: white;
            background: #000814;
          }

          .card {
            width: 520px;
            padding: 35px;
            background: rgba(0,30,50,0.45);
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            text-align: center;
          }

          button {
            padding: 14px;
            background: rgba(0,180,255,0.08);
            border: 1px solid rgba(0,255,255,0.1);
            color: white;
            border-radius: 14px;
          }
        `}</style>
      </div>
    );
  }

  /* =========================
     APP
  ========================= */
  return (
    <div className="space">
      <div className="sidebar">
        <p>🔥 PREMIUM ACTIVE</p>
        <p>XP: {xp}</p>
        <p>Level: {level}</p>
        <p>Coach: {coach}</p>
      </div>

      <div className="main">
        <div className="chat">
          {messages.map((m, i) => (
            <div key={i} className={`row ${m.role}`}>
              <div className="bubble">{m.content}</div>
            </div>
          ))}
        </div>

        <div className="bottom">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button onClick={send}>Send</button>
        </div>
      </div>

      <style jsx>{`
        .space {
          display: flex;
          height: 100vh;
          color: white;
          background: #000814;
        }

        .sidebar {
          width: 220px;
          padding: 16px;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
        }

        .chat {
          flex: 1;
          padding: 20px;
          overflow-y: auto;
        }

        .row {
          display: flex;
          margin-bottom: 10px;
        }

        .row.user {
          justify-content: flex-end;
        }

        .bubble {
          padding: 12px;
          border-radius: 12px;
          background: rgba(255,255,255,0.08);
          max-width: 60%;
        }

        .bottom {
          display: flex;
          padding: 12px;
          gap: 10px;
        }

        input {
          flex: 1;
          padding: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid #333;
          color: white;
        }

        button {
          background: #00b4ff;
          border: none;
          color: white;
          padding: 10px 14px;
          border-radius: 10px;
        }
      `}</style>
    </div>
  );
}