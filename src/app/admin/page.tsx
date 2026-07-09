"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type UserProfile = {
  id: string;
  email?: string;
  is_premium: boolean;
  is_admin: boolean;
};

export default function AdminPage() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);

  // =========================
  // CHECK ADMIN ACCESS
  // =========================
  useEffect(() => {
    const checkAdmin = async () => {
      try {
        const { data } = await supabase.auth.getUser();
        const user = data?.user;

        // 🚨 No user = redirect
        if (!user?.id) {
          router.replace("/login");
          return;
        }

        const { data: profile, error } = await supabase
          .from("profiles")
          .select("is_admin")
          .eq("id", user.id)
          .single();

        // 🚨 Not admin = redirect
        if (error || !profile?.is_admin) {
          router.replace("/");
          return;
        }

        loadUsers();
      } catch (err) {
        console.error("Admin check failed:", err);
        router.replace("/");
      }
    };

    checkAdmin();
  }, []);

  // =========================
  // LOAD USERS
  // =========================
  const loadUsers = async () => {
    const { data, error } = await supabase
      .from("profiles")
      .select("*");

    if (!error && data) {
      setUsers(data as UserProfile[]);
    }

    setLoading(false);
  };

  // =========================
  // TOGGLE PREMIUM
  // =========================
  const togglePremium = async (id: string, value: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_premium: value })
      .eq("id", id);

    loadUsers();
  };

  // =========================
  // LOADING SCREEN
  // =========================
  if (loading) {
    return (
      <div className="loadingState">
        Loading admin panel...
        <style jsx>{`
          .loadingState {
            color: white;
            min-height: 100dvh;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: calc(16px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom));
            background: linear-gradient(135deg, #02040b, #000814 70%, #091223 100%);
          }
        `}</style>
      </div>
    );
  }

  return (
    <div className="page">
      <h1>🔥 ADMIN PANEL</h1>

      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card">
            <p><b>ID:</b> {u.id}</p>

            <p>
              <b>Premium:</b>{" "}
              {u.is_premium ? "✅ YES" : "❌ NO"}
            </p>

            <button
              className="button"
              onClick={() => togglePremium(u.id, !u.is_premium)}
            >
              Toggle Premium
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          padding: calc(16px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom));
          background: linear-gradient(135deg, #02040b, #000814 70%, #091223 100%);
          min-height: 100dvh;
          color: white;
        }
        h1 {
          margin: 0;
          font-size: clamp(1.35rem, 4vw, 1.9rem);
          letter-spacing: 0.02em;
        }
        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 12px;
          margin-top: 16px;
        }
        .card {
          padding: 14px;
          border-radius: 12px;
          background: rgba(255,255,255,0.06);
          border: 1px solid rgba(255,255,255,0.12);
          color: white;
          overflow-wrap: anywhere;
        }
        p {
          margin: 0 0 8px;
          color: #dbeafe;
          line-height: 1.5;
          font-size: 0.92rem;
        }
        .button {
          margin-top: 6px;
          padding: 10px 12px;
          min-height: 44px;
          background: linear-gradient(90deg, #0891b2, #2563eb);
          border: none;
          color: white;
          border-radius: 10px;
          cursor: pointer;
          width: 100%;
          font-weight: 700;
        }
      `}</style>
    </div>
  );
}