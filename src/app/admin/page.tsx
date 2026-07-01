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
      <div style={{ color: "white", padding: 20 }}>
        Loading admin panel...
      </div>
    );
  }

  return (
    <div style={styles.page}>
      <h1 style={{ color: "white" }}>🔥 ADMIN PANEL</h1>

      <div style={styles.grid}>
        {users.map((u) => (
          <div key={u.id} style={styles.card}>
            <p><b>ID:</b> {u.id}</p>

            <p>
              <b>Premium:</b>{" "}
              {u.is_premium ? "✅ YES" : "❌ NO"}
            </p>

            <button
              style={styles.button}
              onClick={() => togglePremium(u.id, !u.is_premium)}
            >
              Toggle Premium
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// =========================
// STYLES
// =========================
const styles = {
  page: {
    padding: 30,
    background: "#000814",
    minHeight: "100vh",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))",
    gap: 20,
    marginTop: 20,
  },
  card: {
    padding: 15,
    borderRadius: 12,
    background: "rgba(255,255,255,0.05)",
    color: "white",
  },
  button: {
    marginTop: 10,
    padding: 10,
    background: "#00b4ff",
    border: "none",
    color: "white",
    borderRadius: 8,
    cursor: "pointer",
  },
};