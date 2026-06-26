"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Dashboard() {
  const [userId, setUserId] = useState<string | null>(null);

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak, setStreak] = useState(0);

  const [plan, setPlan] = useState<"basic" | "premium">("basic");

  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I am My Future 🌌 — let’s build your life." },
  ]);

  const [input, setInput] = useState("");

  const [levelUp, setLevelUp] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [xpToday, setXpToday] = useState(0);

  useEffect(() => {
    const getUser = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        // ✅ FIX: ignore Supabase "missing session" error silently
        if (error) {
          console.log("Auth not ready yet:", error.message);
          setUserId(null);
          return;
        }

        setUserId(data?.user?.id ?? null);
      } catch (err) {
        console.log("Auth session not available yet");
        setUserId(null);
      }
    };

    getUser();
  }, []);

  const xpNeeded = (lvl: number) => Math.floor(100 * Math.pow(lvl, 1.5));

  const calculateXP = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 10) return 2;
    if (words < 25) return 4;
    if (words < 60) return 8;
    return 12;
  };

  const getPersonality = () => {
    if (level < 10) return "friendly coach";
    if (level < 25) return "motivational trainer";
    if (level < 50) return "elite AI coach";
    return "god-tier strategist";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;

    const newMessages: Message[] = [
      ...messages,
      { role: "user", content: userText },
    ];

    setMessages(newMessages);
    setInput("");
    setMessagesCount((p) => p + 1);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          messages: newMessages.slice(-10),
          personality: getPersonality(),
        }),
      });

      const data = await res.json().catch(() => null);

      if (!res.ok || !data?.reply) return;

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
          setTimeout(() => setLevelUp(false), 1500);
        }

        setLevel(newLevel);
        return newXP;
      });
    } catch (err) {
      console.log("Chat error:", err);
    }
  };

  return (
    <div className="space">
      <div className="stars" />
      <div className="nebula" />

      {levelUp && <div className="levelUp">✨ LEVEL UP!</div>}

      <div className="chatBox">

        {/* TOP BAR */}
        <div className="top">
          <div>🌌 My Future AI</div>

          <div className="topRight">
            <div>⭐ Level {level}</div>

            {plan === "premium" ? (
              <div className="premiumBadge">👑 Premium</div>
            ) : (
              <button
                className="upgradeBtn"
                onClick={() => (window.location.href = "/pricing")}
              >
                🚀 Upgrade
              </button>
            )}
          </div>
        </div>

        {/* MESSAGES */}
        <div className="messages">
          {messages.map((m, i) => (
            <div key={i} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>

        {/* INPUT */}
        <div className="inputRow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message My Future..."
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        {/* XP */}
        <div className="analytics">
          📊 Messages: {messagesCount} | ⚡ XP Today: {xpToday}
        </div>
      </div>

      {/* ❗ YOUR ORIGINAL DESIGN IS 100% UNTOUCHED */}
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

        .top {
          display: flex;
          justify-content: space-between;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }

        .topRight {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .upgradeBtn {
          border: none;
          color: white;
          cursor: pointer;
          font-weight: 700;
          padding: 8px 14px;
          border-radius: 999px;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
        }

        .premiumBadge {
          padding: 8px 14px;
          border-radius: 999px;
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          color: black;
          font-weight: 800;
        }

        .messages {
          flex: 1;
          padding: 18px;
          overflow-y: auto;
          display: flex;
          flex-direction: column;
          gap: 10px;
        }

        .msg {
          padding: 12px;
          border-radius: 12px;
          max-width: 70%;
        }

        .user {
          margin-left: auto;
          background: rgba(0,180,255,0.2);
        }

        .assistant {
          background: rgba(255,255,255,0.08);
        }

        .inputRow {
          display: flex;
          padding: 12px;
          gap: 10px;
        }

        input {
          flex: 1;
          padding: 12px;
          border-radius: 10px;
          border: none;
          background: rgba(255,255,255,0.08);
          color: white;
        }

        button {
          padding: 12px 16px;
          border: none;
          border-radius: 10px;
          background: #7c3aed;
          color: white;
        }

        .analytics {
          padding: 8px 12px;
          font-size: 12px;
          opacity: 0.7;
        }

        .levelUp {
          position: absolute;
          top: 20%;
          left: 50%;
          transform: translateX(-50%);
          font-size: 40px;
          text-shadow: 0 0 20px #00b4ff;
        }
      `}</style>
    </div>
  );
}