"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import MobileBottomNav from "@/app/components/MobileBottomNav";
import { triggerHaptic } from "@/lib/mobileFeedback";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Dashboard() {
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);
  const [xp, setXp] = useState(0);
  const [level, setLevel] = useState(1);
  const [streak] = useState(0);
  const [messages, setMessages] = useState<Message[]>([
    { role: "assistant", content: "I am My Future 🌌 — let’s build your life." },
  ]);
  const [input, setInput] = useState("");
  const [levelUp, setLevelUp] = useState(false);
  const [messagesCount, setMessagesCount] = useState(0);
  const [xpToday, setXpToday] = useState(0);
  const [coachingIntensity, setCoachingIntensity] = useState<"supportive" | "balanced" | "savage">("balanced");
  const prevLevel = useRef(1);

  // ✅ ADDED SCROLL REFS
  const messagesContainerRef = useRef<HTMLDivElement | null>(null);

  const scrollToBottomSmooth = () => {
    const container = messagesContainerRef.current;
    if (!container) return;

    const distanceFromBottom =
      container.scrollHeight - container.scrollTop - container.clientHeight;

    if (distanceFromBottom < 120) {
      container.scrollTo({
        top: container.scrollHeight,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const checkUser = async () => {
      const { data } = await supabase.auth.getSession();
      if (!data.session) {
        router.replace("/login");
      } else {
        const user = data.session.user;
        setUserId(user.id);

        const { data: profile } = await supabase
          .from("profiles")
          .select("coaching_intensity")
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
      }
    };

    checkUser();
  }, [router]);

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
  }, [xp, level]);

  // ✅ ADDED AUTO SCROLL EFFECT
  useEffect(() => {
    scrollToBottomSmooth();
  }, [messages]);

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

  const getPersonality = () => {
    if (level < 10) return "friendly coach";
    if (level < 25) return "motivational trainer";
    if (level < 50) return "elite AI coach";
    return "god-tier strategist";
  };

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userText = input.trim();
    triggerHaptic(12);
    const newMessages = [...messages, { role: "user" as const, content: userText }] as Message[];
    setMessages(newMessages);
    setInput("");
    setMessagesCount((p) => p + 1);

    const res = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        messages: newMessages.slice(-10),
        personality: getPersonality(),
        userId,
        coachingIntensity,
      }),
    });

    const data = await res.json();
    setMessages((prev) => [...prev, { role: "assistant", content: data.reply }]);

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
            <div className="premiumBadge">Open Access</div>
          </div>
        </div>

        {/* ✅ UPDATED HERE */}
        <div className="messages" ref={messagesContainerRef}>
          {messages.map((m, i) => (
            <div key={`${m.role}-${i}`} className={`msg ${m.role}`}>
              {m.content}
            </div>
          ))}
        </div>

        <div className="inputRow">
          <input
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Message My Future..."
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button onClick={sendMessage}>Send</button>
        </div>

        <div className="analytics">
          📊 Messages: {messagesCount} | ⚡ XP Today: {xpToday} | 🔥 Streak: {streak}
        </div>
      </div>

      <MobileBottomNav />

      <style jsx>{`
        .space {
          min-height: 100dvh;
          overflow: hidden;
          display: flex;
          justify-content: center;
          align-items: center;
          color: white;
          padding: calc(10px + env(safe-area-inset-top)) 10px calc(80px + env(safe-area-inset-bottom));
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
          background: radial-gradient(circle at 30% 30%, #6a5acd33, transparent 60%), radial-gradient(circle at 70% 70%, #00b4ff22, transparent 60%);
        }
        .chatBox {
          width: min(1100px, 100%);
          max-width: 1100px;
          height: min(92dvh, 900px);
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
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
          padding: 12px 18px;
          border-bottom: 1px solid rgba(255,255,255,0.1);
        }
        .topRight {
          display: flex;
          gap: 12px;
          align-items: center;
        }
        .upgradeBtn {
          padding: 8px 14px;
          border: 1px solid rgba(255,255,255,0.2);
          border-radius: 999px;
          font-weight: 700;
          background: linear-gradient(90deg, #7c3aed, #00b4ff);
          color: white;
          cursor: pointer;
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
          max-width: 82%;
          line-height: 1.6;
          white-space: pre-wrap;
          word-break: break-word;
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
          align-items: center;
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
          cursor: pointer;
          min-height: 44px;
          flex-shrink: 0;
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
        @media (max-width: 900px) {
          .space {
            align-items: stretch;
          }
          .chatBox {
            height: calc(var(--mobile-vh, 100dvh) - 102px - env(safe-area-inset-top) - env(safe-area-inset-bottom));
            border-radius: 16px;
          }
          .top {
            padding: 10px 12px;
          }
          .messages {
            padding: 12px;
          }
          .msg {
            max-width: 100%;
            font-size: 0.95rem;
          }
          .inputRow {
            padding: 10px;
          }
          input {
            min-height: 44px;
          }
          .analytics {
            font-size: 11px;
            padding: 8px 10px;
          }
        }
      `}</style>
    </div>
  );
}