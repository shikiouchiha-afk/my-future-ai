"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Dashboard() {
  const router = useRouter();

  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [plan, setPlan] = useState<"basic" | "premium">("basic");
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "I’m your general My Future coach. Tell me what you want to build today, and I’ll help you turn it into an action plan.",
    },
  ]);
  const [input, setInput] = useState("");
  const [messageCount, setMessageCount] = useState(0);
  const [xpToday, setXpToday] = useState(0);

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      }
    };

    const stored = localStorage.getItem("plan") as "basic" | "premium" | null;
    if (stored) {
      setPlan(stored);
    }

    checkUser();
  }, [router]);

  useEffect(() => {
    const nextLevel = Math.floor(xp / 120) + 1;
    setLevel(nextLevel);
  }, [xp]);

  const calculateXP = (text: string) => {
    const words = text.trim().split(/\s+/).filter(Boolean).length;
    if (words < 8) return 3;
    if (words < 18) return 5;
    return 8;
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input;
    const nextMessages = [...messages, { role: "user" as const, content: userText }];

    setMessages(nextMessages);
    setInput("");
    setMessageCount((value) => value + 1);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: nextMessages.slice(-8),
        coach: "free",
        isPremium: false,
      }),
    });

    const data = await res.json();
    setMessages((current) => [...current, { role: "assistant", content: data.reply }]);

    const gainedXP = calculateXP(userText);
    setXpToday((value) => value + gainedXP);
    setXp((value) => value + gainedXP);
  };

  return (
    <div className="page">
      <div className="ambient" />
      <div className="panel">
        <div className="topBar">
          <div>
            <div className="title">My Future • Daily AI Coach</div>
            <div className="subtitle">Keep it simple, stay consistent, and grow one day at a time.</div>
          </div>
          <div className="statusWrap">
            <div className="pill">Level {level}</div>
            <div className="pill">XP {xp}</div>
            {plan === "premium" ? (
              <div className="premium">Premium</div>
            ) : (
              <button className="upgrade" onClick={() => router.push("/pricing")}>
                Upgrade
              </button>
            )}
          </div>
        </div>

        <div className="progressCard">
          <div>
            <strong>Basic progress</strong>
            <p>Daily coaching and XP keep your momentum alive.</p>
          </div>
          <div className="barTrack">
            <div className="barFill" style={{ width: `${Math.min(100, xp % 120)}%` }} />
          </div>
        </div>

        <div className="messages">
          {messages.map((message, index) => (
            <div key={`${message.role}-${index}`} className={`message ${message.role}`}>
              {message.content}
            </div>
          ))}
        </div>

        <div className="composer">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder="Share your focus for today..."
            onKeyDown={(event) => event.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className="footerInfo">
          <span>Messages {messageCount}</span>
          <span>XP today {xpToday}</span>
          {plan !== "premium" && <span>Unlock premium coaches and memory</span>}
        </div>
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          display: flex;
          align-items: center;
          justify-content: center;
          padding: 24px;
          background: linear-gradient(140deg, #04030b, #12162d 48%, #0f172a 100%);
          color: white;
          position: relative;
          overflow: hidden;
        }

        .ambient {
          position: absolute;
          inset: 0;
          background: radial-gradient(circle at top left, rgba(168, 85, 247, 0.24), transparent 32%), radial-gradient(circle at bottom right, rgba(34, 211, 238, 0.16), transparent 28%);
          filter: blur(12px);
        }

        .panel {
          position: relative;
          z-index: 1;
          width: min(1000px, 100%);
          display: flex;
          flex-direction: column;
          gap: 16px;
          padding: 20px;
          border-radius: 24px;
          background: rgba(255,255,255,0.08);
          border: 1px solid rgba(255,255,255,0.14);
          box-shadow: 0 24px 80px rgba(0,0,0,0.28);
          backdrop-filter: blur(24px);
        }

        .topBar {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
        }

        .title {
          font-size: 1.1rem;
          font-weight: 700;
        }

        .subtitle {
          margin-top: 4px;
          font-size: 0.92rem;
          color: #cbd5e1;
        }

        .statusWrap {
          display: flex;
          gap: 8px;
          align-items: center;
          flex-wrap: wrap;
        }

        .pill, .premium, .upgrade {
          border-radius: 999px;
          padding: 8px 12px;
          font-size: 0.9rem;
        }

        .pill {
          background: rgba(255,255,255,0.08);
        }

        .premium {
          background: linear-gradient(90deg, #f59e0b, #fbbf24);
          color: #111827;
          font-weight: 700;
        }

        .upgrade {
          border: 0;
          cursor: pointer;
          background: linear-gradient(90deg, #8b5cf6, #22d3ee);
          color: white;
        }

        .progressCard {
          display: flex;
          justify-content: space-between;
          gap: 16px;
          align-items: center;
          padding: 14px 16px;
          border-radius: 18px;
          background: rgba(255,255,255,0.05);
        }

        .progressCard p {
          margin-top: 4px;
          color: #cbd5e1;
          font-size: 0.9rem;
        }

        .barTrack {
          width: min(280px, 100%);
          height: 10px;
          border-radius: 999px;
          background: rgba(255,255,255,0.1);
          overflow: hidden;
        }

        .barFill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #8b5cf6, #22d3ee);
        }

        .messages {
          display: flex;
          flex-direction: column;
          gap: 10px;
          max-height: 480px;
          overflow-y: auto;
          padding-right: 4px;
        }

        .message {
          max-width: 78%;
          padding: 12px 14px;
          border-radius: 14px;
          line-height: 1.6;
          white-space: pre-wrap;
        }

        .message.user {
          align-self: flex-end;
          background: rgba(34,211,238,0.18);
        }

        .message.assistant {
          background: rgba(255,255,255,0.08);
        }

        .composer {
          display: flex;
          gap: 10px;
        }

        input {
          flex: 1;
          border: 1px solid rgba(255,255,255,0.16);
          border-radius: 999px;
          background: rgba(255,255,255,0.08);
          color: white;
          padding: 12px 16px;
        }

        button {
          border: 0;
          border-radius: 999px;
          padding: 12px 16px;
          background: linear-gradient(90deg, #8b5cf6, #22d3ee);
          color: white;
          cursor: pointer;
        }

        .footerInfo {
          display: flex;
          justify-content: space-between;
          color: #cbd5e1;
          font-size: 0.9rem;
          flex-wrap: wrap;
          gap: 8px;
        }

        @media (max-width: 720px) {
          .topBar, .progressCard {
            flex-direction: column;
            align-items: flex-start;
          }

          .message {
            max-width: 100%;
          }

          .composer {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}