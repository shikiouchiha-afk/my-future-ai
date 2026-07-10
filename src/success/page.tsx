"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";
import { getPremiumStatus } from "@/lib/premiumAccess";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();
  const [phase, setPhase] = useState<"loading" | "ready" | "unlocking" | "opened" | "activated">("loading");
  const [authToken, setAuthToken] = useState<string | null>(null);
  const [currentUserId, setCurrentUserId] = useState<string | null>(null);
  const timeoutsRef = useRef<number[]>([]);
  const particleOffsets = useMemo(
    () =>
      Array.from({ length: 24 }, (_, index) => ({
        id: index,
        left: `${(index * 17) % 100}%`,
        delay: `${(index % 12) * 0.4}s`,
        duration: `${6 + (index % 7)}s`,
        size: `${2 + (index % 3)}px`,
      })),
    []
  );

  const clearUnlockTimers = () => {
    timeoutsRef.current.forEach((id) => window.clearTimeout(id));
    timeoutsRef.current = [];
  };

  useEffect(() => {
    if (typeof window === "undefined") return;

    const sessionId = params.get("session_id");

    if (!sessionId) {
      router.replace("/dashboard");
      return;
    }

    const bootstrap = async () => {
      const { data: authData } = await supabase.auth.getSession();
      const token = authData.session?.access_token;
      const user = authData.session?.user;

      if (!token || !user?.id) {
        router.replace("/login");
        return;
      }

      setAuthToken(token);
      setCurrentUserId(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, is_admin, has_seen_premium_animation")
        .eq("id", user.id)
        .single();

      const premium = getPremiumStatus({
        email: user.email,
        profilePremium: profile?.is_premium,
        isAdmin: profile?.is_admin,
      });

      if (!premium) {
        router.replace("/pricing");
        return;
      }

      window.localStorage.setItem("plan", "premium");

      if (profile?.has_seen_premium_animation) {
        router.replace("/dashboard");
        return;
      }

      setPhase("ready");
    };

    bootstrap();

    return () => {
      clearUnlockTimers();
    };
  }, [params, router]);

  const handleUnlock = () => {
    if (phase !== "ready" || !authToken || !currentUserId) return;

    setPhase("unlocking");

    const openTimer = window.setTimeout(() => {
      setPhase("opened");
    }, 1600);

    const activatedTimer = window.setTimeout(() => {
      void fetch("/api/premium/activation", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${authToken}`,
        },
      });
      window.localStorage.setItem(`hasSeenPremiumAnimation:${currentUserId}`, "1");
      setPhase("activated");
    }, 2500);

    timeoutsRef.current.push(openTimer, activatedTimer);
  };

  const continueToDashboard = () => {
    router.replace("/dashboard");
  };

  return (
    <div className="page" aria-live="polite">
      <div className="particles" aria-hidden>
        {particleOffsets.map((particle) => (
          <span
            key={particle.id}
            className="particle"
            style={{
              left: particle.left,
              animationDelay: particle.delay,
              animationDuration: particle.duration,
              width: particle.size,
              height: particle.size,
            }}
          />
        ))}
      </div>

      <div className="aurora" aria-hidden />

      <main className="panel">
        <p className="eyebrow">MY FUTURE AI PREMIUM</p>
        <h1>Welcome to Premium</h1>
        <p className="subtitle">Your next level of growth is unlocking...</p>

        <div className={`vault ${phase}`}>
          <div className="energyHalo" aria-hidden />
          <div className="vaultDoor" aria-hidden>
            <div className="vaultFrame" />
            <div className="vaultCore" />
            <div className="lockPlate">
              <span className="lockShackle" />
              <span className="lockBody" />
            </div>
          </div>
          <div className="oceanGlow" aria-hidden />
        </div>

        {phase === "ready" && (
          <button type="button" className="unlockBtn" onClick={handleUnlock}>
            Unlock Premium
          </button>
        )}

        {(phase === "unlocking" || phase === "opened") && (
          <p className="status">Calibrating aqua energy and opening your premium vault...</p>
        )}

        {phase === "activated" && (
          <section className="activated">
            <h2>Premium Activated 🚀</h2>
            <p className="activatedText">
              Your premium intelligence suite is now online.
            </p>
            <ul className="features">
              <li>Advanced AI Memory</li>
              <li>Goal Analytics</li>
              <li>Personal Growth Tracking</li>
              <li>Premium Coaching Modes</li>
              <li>Priority AI Responses</li>
            </ul>
            <button type="button" className="continueBtn" onClick={continueToDashboard}>
              Enter Dashboard
            </button>
          </section>
        )}

        {phase === "loading" && <p className="status">Preparing your premium environment...</p>}
      </main>

      <style jsx>{`
        .page {
          position: relative;
          min-height: 100dvh;
          display: grid;
          place-items: center;
          overflow: hidden;
          padding: clamp(20px, 4vw, 40px);
          color: #dffcff;
          background:
            radial-gradient(circle at 20% 12%, rgba(4, 150, 188, 0.2), transparent 42%),
            radial-gradient(circle at 80% 76%, rgba(17, 212, 255, 0.14), transparent 40%),
            linear-gradient(180deg, #020b16 0%, #031425 36%, #00101c 100%);
        }

        .particles {
          position: absolute;
          inset: 0;
          pointer-events: none;
        }

        .particle {
          position: absolute;
          bottom: -20px;
          border-radius: 999px;
          background: rgba(141, 247, 255, 0.7);
          box-shadow: 0 0 12px rgba(58, 245, 255, 0.55);
          animation-name: floatParticle;
          animation-timing-function: linear;
          animation-iteration-count: infinite;
        }

        .aurora {
          position: absolute;
          inset: -20% -8%;
          background:
            radial-gradient(circle at 30% 20%, rgba(68, 218, 255, 0.16), transparent 45%),
            radial-gradient(circle at 70% 30%, rgba(7, 129, 170, 0.19), transparent 46%),
            radial-gradient(circle at 50% 95%, rgba(0, 175, 210, 0.2), transparent 35%);
          filter: blur(8px);
          animation: pulseAurora 8s ease-in-out infinite;
        }

        .panel {
          width: min(760px, 100%);
          z-index: 2;
          text-align: center;
          border-radius: 28px;
          padding: clamp(22px, 5vw, 42px);
          background: linear-gradient(180deg, rgba(2, 20, 35, 0.78), rgba(1, 15, 27, 0.84));
          border: 1px solid rgba(122, 238, 255, 0.3);
          box-shadow:
            0 0 0 1px rgba(15, 166, 199, 0.22) inset,
            0 24px 90px rgba(2, 104, 138, 0.35);
          backdrop-filter: blur(14px);
        }

        .eyebrow {
          margin: 0;
          letter-spacing: 0.26em;
          font-size: 0.72rem;
          font-weight: 700;
          color: rgba(161, 247, 255, 0.86);
        }

        h1 {
          margin: 14px 0 8px;
          font-size: clamp(2rem, 4vw, 3.1rem);
          line-height: 1.1;
          color: #f3feff;
          text-shadow: 0 0 22px rgba(68, 224, 255, 0.4);
        }

        .subtitle {
          margin: 0 0 28px;
          color: rgba(199, 251, 255, 0.86);
          font-size: clamp(1rem, 2.2vw, 1.2rem);
        }

        .vault {
          position: relative;
          width: min(420px, 90vw);
          aspect-ratio: 1;
          margin: 0 auto 22px;
          display: grid;
          place-items: center;
        }

        .vaultDoor {
          position: relative;
          width: 62%;
          aspect-ratio: 1;
          border-radius: 24px;
          display: grid;
          place-items: center;
          overflow: hidden;
          transform-origin: left center;
          transition: transform 1s cubic-bezier(0.22, 1, 0.36, 1), opacity 0.65s ease;
        }

        .vaultFrame {
          position: absolute;
          inset: 0;
          border-radius: 24px;
          border: 1px solid rgba(151, 245, 255, 0.62);
          background: linear-gradient(150deg, rgba(6, 117, 149, 0.6), rgba(1, 33, 55, 0.92));
          box-shadow:
            0 0 30px rgba(82, 229, 255, 0.38),
            0 0 0 1px rgba(186, 252, 255, 0.3) inset;
        }

        .vaultCore {
          position: absolute;
          inset: 16%;
          border-radius: 18px;
          border: 1px solid rgba(120, 248, 255, 0.44);
          background: radial-gradient(circle at 30% 20%, rgba(112, 249, 255, 0.34), rgba(2, 29, 50, 0.8));
        }

        .lockPlate {
          position: relative;
          width: 92px;
          height: 116px;
          display: grid;
          place-items: center;
          transform-origin: center;
        }

        .lockShackle {
          position: absolute;
          top: 12px;
          width: 52px;
          height: 42px;
          border: 8px solid #b7faff;
          border-bottom: 0;
          border-radius: 24px 24px 0 0;
          filter: drop-shadow(0 0 8px rgba(95, 241, 255, 0.6));
        }

        .lockBody {
          position: absolute;
          bottom: 4px;
          width: 74px;
          height: 66px;
          border-radius: 15px;
          background: linear-gradient(180deg, #b8feff, #62d6e6);
          box-shadow: 0 0 20px rgba(99, 224, 255, 0.55);
        }

        .energyHalo {
          position: absolute;
          width: 78%;
          aspect-ratio: 1;
          border-radius: 999px;
          border: 1px solid rgba(120, 244, 255, 0.18);
          opacity: 0;
          transform: scale(0.84);
        }

        .oceanGlow {
          position: absolute;
          width: 24%;
          aspect-ratio: 1;
          border-radius: 999px;
          background: radial-gradient(circle, rgba(132, 252, 255, 0.98), rgba(28, 196, 230, 0.5), transparent 72%);
          filter: blur(1px);
          opacity: 0;
          transform: scale(0.4);
          transition: opacity 0.6s ease, transform 0.9s ease;
        }

        .unlockBtn,
        .continueBtn {
          border: 0;
          border-radius: 999px;
          min-height: 50px;
          padding: 0 28px;
          font-size: 1rem;
          font-weight: 700;
          color: #00212f;
          background: linear-gradient(94deg, #57ecff 0%, #95fff6 46%, #7fd2ff 100%);
          box-shadow: 0 8px 28px rgba(84, 237, 255, 0.45);
          cursor: pointer;
          transition: transform 0.24s ease, box-shadow 0.24s ease;
        }

        .unlockBtn:hover,
        .continueBtn:hover {
          transform: translateY(-2px);
          box-shadow: 0 12px 28px rgba(102, 238, 255, 0.55);
        }

        .status {
          margin: 8px 0 0;
          color: rgba(203, 248, 255, 0.87);
        }

        .activated {
          margin-top: 8px;
          animation: fadeRise 0.7s ease both;
        }

        h2 {
          margin: 0;
          font-size: clamp(1.6rem, 3vw, 2.3rem);
          color: #eeffff;
          text-shadow: 0 0 20px rgba(127, 246, 255, 0.42);
        }

        .activatedText {
          margin: 8px 0 14px;
          color: rgba(207, 252, 255, 0.9);
        }

        .features {
          list-style: none;
          margin: 0 auto 18px;
          padding: 0;
          display: grid;
          gap: 10px;
          max-width: 480px;
          text-align: left;
        }

        .features li {
          border-radius: 12px;
          padding: 11px 14px;
          background: rgba(4, 53, 78, 0.55);
          border: 1px solid rgba(122, 240, 255, 0.35);
          box-shadow: 0 6px 20px rgba(8, 88, 121, 0.25);
        }

        .vault.unlocking .lockPlate {
          animation: shakeLock 0.3s ease 4;
        }

        .vault.unlocking .energyHalo,
        .vault.opened .energyHalo,
        .vault.activated .energyHalo {
          opacity: 1;
          animation: energyPulse 1.2s ease-in-out infinite;
        }

        .vault.opened .vaultDoor,
        .vault.activated .vaultDoor {
          transform: perspective(800px) rotateY(-86deg) translateX(-18px);
          opacity: 0.22;
        }

        .vault.opened .oceanGlow,
        .vault.activated .oceanGlow {
          opacity: 1;
          transform: scale(5.6);
          animation: vaultGlow 1.6s ease-in-out infinite;
        }

        @keyframes floatParticle {
          0% {
            transform: translateY(0);
            opacity: 0;
          }
          10% {
            opacity: 0.85;
          }
          80% {
            opacity: 0.4;
          }
          100% {
            transform: translateY(-110dvh);
            opacity: 0;
          }
        }

        @keyframes pulseAurora {
          0%,
          100% {
            opacity: 0.45;
            transform: scale(1);
          }
          50% {
            opacity: 0.68;
            transform: scale(1.05);
          }
        }

        @keyframes shakeLock {
          0%,
          100% {
            transform: translateX(0);
          }
          25% {
            transform: translateX(-6px) rotate(-4deg);
          }
          75% {
            transform: translateX(6px) rotate(4deg);
          }
        }

        @keyframes energyPulse {
          0% {
            transform: scale(0.84);
            box-shadow: 0 0 0 rgba(121, 247, 255, 0.35);
          }
          60% {
            transform: scale(1.08);
            box-shadow: 0 0 42px rgba(121, 247, 255, 0.55);
          }
          100% {
            transform: scale(0.9);
            box-shadow: 0 0 16px rgba(121, 247, 255, 0.24);
          }
        }

        @keyframes vaultGlow {
          0%,
          100% {
            filter: blur(1px) brightness(1);
          }
          50% {
            filter: blur(2px) brightness(1.22);
          }
        }

        @keyframes fadeRise {
          from {
            opacity: 0;
            transform: translateY(14px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @media (max-width: 640px) {
          .panel {
            border-radius: 20px;
            padding: 18px;
          }

          .features {
            max-width: 100%;
          }
        }
      `}</style>
    </div>
  );
}