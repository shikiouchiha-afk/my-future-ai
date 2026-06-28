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
   MAIN
========================= */

export default function Dashboard() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);

  const prevLevel = useRef(1);

  /* AUTH CHECK */
  useEffect(() => {
    const check = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setLoading(false);
      }
    };

    check();
  }, []);

  /* LEVEL SYSTEM */
  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;

    if (newLevel > prevLevel.current) {
      prevLevel.current = newLevel;
      setLevel(newLevel);
    }
  }, [xp]);

  /* CHAT */
  const send = async () => {
    if (!input.trim()) return;

    const text = input;
    setInput("");

    const newMessages = [
      ...messages,
      { role: "user", content: text },
    ];

    setMessages(newMessages);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages.slice(-10),
      }),
    });

    const data = await res.json();

    setMessages((p) => [
      ...p,
      { role: "assistant", content: data.reply },
    ]);

    setXp((p) => p + 10);
  };

  /* LOADING */
  if (loading) {
    return (
      <div style={{ color: "white", padding: 30 }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div className="space">
      <div className="bg" />
      <ShootingStars />

      <div className="sidebar">
        <h2>🔥 Dashboard</h2>
        <p>XP: {xp}</p>
        <p>Level: {level}</p>

        <button
          onClick={() => router.push("/pricing")}
          style={{
            marginTop: 10,
            padding: 10,
            background: "#00b4ff",
            border: "none",
            color: "white",
            borderRadius: 8,
          }}
        >
          Upgrade
        </button>

        <button
          onClick={async () => {
            await supabase.auth.signOut();
            router.push("/login");
          }}
        >
          Logout
        </button>
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

        .bg {
          position: absolute;
          inset: 0;
          background:
            radial-gradient(circle at 20% 20%, rgba(99,102,241,0.3), transparent 40%),
            radial-gradient(circle at 80% 30%, rgba(0,180,255,0.2), transparent 40%);
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