"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";

/* =========================
   SUPABASE CLIENT
========================= */

const supabase =
  typeof window !== "undefined"
    ? createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
      )
    : null;

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
   CORE LOGIC
========================= */

function generateMission(goal: string) {
  const missions = {
    fitness: "Do 10 pushups right now.",
    money: "Write 1 way to make $ today.",
    study: "Study focused for 15 minutes.",
    mindset: "Write 3 goals for your life.",
  };

  return missions[goal as keyof typeof missions];
}

function rewardXP(goal: string) {
  return 10 + (goal === "money" ? 8 : goal === "study" ? 6 : 5);
}

/* =========================
   SHOOTING STARS
========================= */

function ShootingStars() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;

    let w = (canvas.width = window.innerWidth);
    let h = (canvas.height = window.innerHeight);

    const stars = Array.from({ length: 15 }).map(() => ({
      x: Math.random() * w,
      y: Math.random() * h,
      len: Math.random() * 60 + 20,
      speed: Math.random() * 2 + 1,
    }));

    let frame: number;

    const draw = () => {
      ctx.clearRect(0, 0, w, h);

      for (const s of stars) {
        ctx.beginPath();
        ctx.moveTo(s.x, s.y);
        ctx.lineTo(s.x + s.len, s.y + s.len);
        ctx.strokeStyle = "rgba(255,255,255,0.6)";
        ctx.stroke();

        s.x += s.speed;
        s.y += s.speed;

        if (s.x > w || s.y > h) {
          s.x = Math.random() * w;
          s.y = 0;
        }
      }

      frame = requestAnimationFrame(draw);
    };

    draw();
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "absolute",
        inset: 0,
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}

/* =========================
   PAGE
========================= */

export default function Page() {
  const router = useRouter();

  const [step, setStep] = useState<"onboarding" | "app">("onboarding");
  const [goal, setGoal] = useState<Goal>(null);
  const [coach, setCoach] = useState<Coach | null>(null);

  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [shake, setShake] = useState(false);

  const prevLevel = useRef(1);

  /* =========================
     🔐 AUTH GUARD (NEW FIX)
  ========================= */

  useEffect(() => {
    const checkAuth = async () => {
      if (!supabase) return;

      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      }
    };

    checkAuth();
  }, []);

  /* LEVEL SYSTEM */
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;

    if (newLevel > prevLevel.current) {
      prevLevel.current = newLevel;
      setLevel(newLevel);

      setShake(true);
      setTimeout(() => setShake(false), 400);
    }
  }, [xp]);

  /* START */
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

  /* SEND */
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
      }),
    });

    const data = await res.json();

    setMessages((p) => [
      ...p,
      { role: "assistant", content: data.reply },
    ]);

    setXp((p) => p + rewardXP(goal || "mindset"));
  };

  /* ONBOARDING */
  if (step === "onboarding") {
    return (
      <div className="onboard">
        <div className="card">
          <h1>🌊 Choose your mission</h1>

          <button onClick={() => startGoal("fitness")}>💪 Fitness</button>
          <button onClick={() => startGoal("money")}>💰 Money</button>
          <button onClick={() => startGoal("study")}>📚 Study</button>
          <button onClick={() => startGoal("mindset")}>🧠 Mindset</button>

          <button onClick={() => { setCoach("therapist"); setStep("app"); }}>
            🧘 Therapist Mode
          </button>

          <button onClick={() => { setCoach("free"); setStep("app"); }}>
            🆓 Free Mode
          </button>
        </div>

        <style jsx>{`
          .onboard {
            height: 100vh;
            display: flex;
            justify-content: center;
            align-items: center;
            overflow: hidden;
            position: relative;
            color: white;
            background:
              radial-gradient(circle at 20% 20%, rgba(0,255,255,0.15), transparent 35%),
              radial-gradient(circle at 80% 30%, rgba(0,120,255,0.18), transparent 40%),
              radial-gradient(circle at 50% 80%, rgba(0,180,255,0.12), transparent 45%),
              linear-gradient(#00111f, #000814);
          }
        `}</style>
      </div>
    );
  }

  /* MAIN DASHBOARD */
  return (
    <div className={`space ${shake ? "shake" : ""}`}>
      <div className="bg" />
      <ShootingStars />
      <div className="orb" />

      <div className="sidebar">
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
          overflow: hidden;
          background: #000814;
        }
      `}</style>
    </div>
  );
}