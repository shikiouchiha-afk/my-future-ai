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
   MAIN DASHBOARD
========================= */

export default function Dashboard() {
  const router = useRouter();

  const [userId, setUserId] = useState<string | null>(null);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak] = useState(0);

  const [plan, setPlan] = useState<"basic" | "premium">("basic");

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I am My Future 🌌 — let’s build your life." },
  ]);

  const [input, setInput] = useState("");

  const [levelUp, setLevelUp] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [xpToday, setXpToday] = useState(0);

  const prevLevel = useRef(1);

  /* AUTH CHECK */
  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();

      if (!data.session) {
        router.replace("/login");
      } else {
        setUserId(data.session.user.id);
      }
    };

    checkUser();
  }, []);

  /* LOAD PLAN */
  useEffect(() => {
    const stored = localStorage.getItem("plan") as
      | "basic"
      | "premium"
      | null;

    if (stored) setPlan(stored);
  }, []);

  /* XP SYSTEM */
  const xpNeeded = (lvl: number) => Math.floor(100 * Math.pow(lvl, 1.5));

  const calculateXP = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) return 2;
    if (words < 25) return 4;
    if (words < 60) return 8;
    return 12;
  };

  useEffect(() => {
    const newLevel = Math.floor(xp / 100) + 1;

    if (newLevel !== level) {
      setLevel(newLevel);

      setLevelUp(true);
      setTimeout(() => setLevelUp(false), 1200);

      prevLevel.current = newLevel;
    }
  }, [xp]);

  /* PERSONALITY */
  const getPersonality = () => {
    if (level < 10) return "friendly coach";
    if (level < 25) return "motivational trainer";
    if (level < 50) return "elite AI coach";
    return "god-tier strategist";
  };

  /* =========================
     FIXED SEND MESSAGE (ONLY CHANGE WAS TYPES)
  ========================= */
  const sendMessage = async () => {
    if (!input.trim()) return;

    if (plan === "basic" && level >= 50) {
      alert("🔒 Upgrade to Premium to continue leveling.");
      return;
    }

    const userText = input;

    // ✅ FIXED TYPE ERROR HERE
    const newMessages: Message[] = [
      ...messages,
      { role: "user" as const, content: userText },
    ];

    setMessages(newMessages);
    setInput("");
    setMessagesCount((p) => p + 1);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages.slice(-10),
        personality: getPersonality(),
      }),
    });

    const data = await res.json();

    setMessages((prev) => [
      ...prev,
      { role: "assistant", content: data.reply },
    ]);

    const gainedXP = calculateXP(userText);

    setXpToday((p) => p + gainedXP);

    setXp((prev) => {
      let newXP = prev + gainedXP;
      let newLevel = level;

      while (newXP >= xpNeeded(newLevel)) {
        newXP -= xpNeeded(newLevel);
        newLevel += 1;

        setLevelUp(true);
        setTimeout(() => setLevelUp(false), 1200);
      }

      return newXP;
    });
  };

  /* =========================
     UI (UNCHANGED)
  ========================= */
  return (
    <div className="space">
      <div className="stars" />
      <div className="nebula" />

      {levelUp && <div className="levelUp">✨ LEVEL UP!</div>}

      <div className="chatBox">
        <div className="top">
          <div>🌌 My Future AI</div>

          <div className="topRight">
            <div>⭐ Level {level}</div>

            {plan === "premium" ? (
              <div className="premiumBadge">👑 Premium</div>
            ) : (
              <button
                className="upgradeBtn"
                onClick={() => router.push("/pricing")}
              >
                🚀 Upgrade
              </button>
            )}
          </div>
        </div>

        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>

        <div className="inputRow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message My Future..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className="analytics">
          📊 Messages: {messagesCount} | ⚡ XP Today: {xpToday}
        </div>
      </div>

      <style jsx>{`
        .space {
          height: 100vh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          background: radial-gradient(circle at top, #050816, #000);
        }

        .stars {
          position: absolute;
          width: 200%;
          height: 200%;
          background-image: radial-gradient(white 1px, transparent 1px);
          background-size: 50px 50px;
          opacity: 0.12;
        }

        .nebula {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at 30% 30%, #6a5acd33, transparent 60%),
                      radial-gradient(circle at 70% 70%, #00b4ff22, transparent 60%);
        }

        .chatBox {
          width: 92%;
          max-width: 1100px;
          height: 92vh;
          display: flex;
          flex-direction: column;
          background: rgba(255,255,255,0.05);
          border: 1px solid rgba(255,255,255,0.1);
          backdrop-filter: blur(20px);
          border-radius: 20px;
          z-index: 2;
        }
      `}</style>
    </div>
  );
}