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
        zIndex: 0,
        pointerEvents: "none",
      }}
    />
  );
}

/* =========================
   MAIN SAAS DASHBOARD
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

  const [plan, setPlan] = useState<"basic" | "premium">("basic");

  const prevLevel = useRef(1);

  /* =========================
     LOAD USER + PREMIUM CHECK
  ========================= */

  useEffect(() => {
    const loadUser = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", user.id)
        .single();

      setPlan(profile?.is_premium ? "premium" : "basic");
    };

    loadUser();
  }, []);

  /* =========================
     LEVEL SYSTEM
  ========================= */

  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;

    if (newLevel > prevLevel.current) {
      prevLevel.current = newLevel;
      setLevel(newLevel);
      setShake(true);
      setTimeout(() => setShake(false), 400);
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

    if (plan !== "premium") {
      setMessages((p) => [
        ...p,
        { role: "assistant", content: "💎 Premium locked. Upgrade to unlock." },
      ]);
      return;
    }

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
            color: white;
            background: radial-gradient(circle at 20% 20%, rgba(0,255,255,0.15), transparent 35%),
                        radial-gradient(circle at 80% 30%, rgba(0,120,255,0.18), transparent 40%),
                        linear-gradient(#00111f, #000814);
          }

          .card {
            width: 520px;
            padding: 35px;
            background: rgba(0,30,50,0.45);
            backdrop-filter: blur(25px);
            border-radius: 24px;
            display: flex;
            flex-direction: column;
            gap: 12px;
          }

          button {
            padding: 14px;
            border-radius: 14px;
            background: rgba(0,180,255,0.08);
            border: 1px solid rgba(0,255,255,0.1);
            color: white;
          }
        `}</style>
      </div>
    );
  }

  /* =========================
     MAIN UI (FIXED INPUT Z-INDEX)
  ========================= */

  return (
    <div className={`space ${shake ? "shake" : ""}`}>
      <div className="bg" />
      <ShootingStars />

      <div className="sidebar">
        <p>XP: {xp}</p>
        <p>Level: {level}</p>
        <p>Plan: {plan}</p>
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
          position: relative;
          display: flex;
          height: 100vh;
          color: white;
          background: #000814;
        }

        .bg {
          position: absolute;
          inset: 0;
          z-index: 0;
        }

        .sidebar {
          width: 220px;
          padding: 16px;
          z-index: 2;
          position: relative;
        }

        .main {
          flex: 1;
          display: flex;
          flex-direction: column;
          z-index: 2;
          position: relative;
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
          position: relative;
          z-index: 3;
        }

        input {
          flex: 1;
          padding: 10px;
          background: rgba(255,255,255,0.08);
          border: 1px solid #333;
          color: white;
          position: relative;
          z-index: 3;
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