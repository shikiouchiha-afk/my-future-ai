"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

type UserProfile = {
  id: string;
  xp: number;
  level: number;
  is_premium: boolean;
  is_admin: boolean;
};

export default function AdminPanel() {
  const router = useRouter();

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [me, setMe] = useState<string | null>(null);

  /* =========================
     AUTH + ADMIN CHECK
  ========================= */
  useEffect(() => {
    const load = async () => {
      const { data } = await supabase.auth.getUser();
      const user = data?.user;

      if (!user) {
        router.replace("/login");
        return;
      }

      setMe(user.id);

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_admin")
        .eq("id", user.id)
        .single();

      if (!profile?.is_admin) {
        router.replace("/dashboard");
        return;
      }

      loadUsers();
    };

    const loadUsers = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*");

      setUsers(data || []);
      setLoading(false);
    };

    load();
  }, []);

  /* =========================
     TOGGLE PREMIUM
  ========================= */
  const togglePremium = async (id: string, value: boolean) => {
    await supabase
      .from("profiles")
      .update({ is_premium: value })
      .eq("id", id);

    setUsers((prev) =>
      prev.map((u) =>
        u.id === id ? { ...u, is_premium: value } : u
      )
    );
  };

  /* =========================
     LOADING
  ========================= */
  if (loading) {
    return <div style={{ color: "white", padding: 40 }}>Loading admin panel...</div>;
  }

  /* =========================
     UI
  ========================= */
  return (
    <div className="page">
      <h1>🔥 Admin Panel</h1>

      <div className="stats">
        <div>Total Users: {users.length}</div>
        <div>
          Premium Users:{" "}
          {users.filter((u) => u.is_premium).length}
        </div>
      </div>

      <div className="grid">
        {users.map((u) => (
          <div key={u.id} className="card">
            <p><b>ID:</b> {u.id.slice(0, 8)}...</p>
            <p>XP: {u.xp}</p>
            <p>Level: {u.level}</p>
            <p>
              Premium:{" "}
              {u.is_premium ? "💎 YES" : "❌ NO"}
            </p>

            <button
              onClick={() =>
                togglePremium(u.id, !u.is_premium)
              }
            >
              Toggle Premium
            </button>
          </div>
        ))}
      </div>

      <style jsx>{`
        .page {
          min-height: 100vh;
          background: radial-gradient(circle at top, #0b1020, #000);
          color: white;
          padding: 40px;
        }

        h1 {
          margin-bottom: 20px;
        }

        .stats {
          display: flex;
          gap: 20px;
          margin-bottom: 30px;
        }

        .grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 15px;
        }

        .card {
          background: rgba(255,255,255,0.05);
          padding: 15px;
          border-radius: 12px;
          border: 1px solid rgba(255,255,255,0.1);
        }

        button {
          margin-top: 10px;
          width: 100%;
          padding: 10px;
          background: #00b4ff;
          border: none;
          border-radius: 8px;
          color: white;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}