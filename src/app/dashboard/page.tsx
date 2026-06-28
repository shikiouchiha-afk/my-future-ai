"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabaseClient";

export default function Dashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);

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

    const { data: listener } = supabase.auth.onAuthStateChange(
      (_event, session) => {
        if (!session) router.replace("/login");
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  if (loading) {
    return (
      <div style={{ color: "white", padding: 30 }}>
        Loading dashboard...
      </div>
    );
  }

  return (
    <div style={{ color: "white", padding: 30 }}>
      <h1>🔥 Premium Dashboard</h1>
      <p>You are logged in successfully.</p>

      <button
        onClick={async () => {
          await supabase.auth.signOut();
          router.push("/login");
        }}
      >
        Logout
      </button>
    </div>
  );
}