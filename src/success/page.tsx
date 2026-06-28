"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";

export default function SuccessPage() {
  const router = useRouter();
  const params = useSearchParams();

  useEffect(() => {
    const sessionId = params.get("session_id");

    if (!sessionId) return;

    // mark user as premium locally for now
    localStorage.setItem("plan", "premium");

    // redirect to premium dashboard
    router.replace("/dashboard");
  }, []);

  return (
    <div style={{ color: "white", padding: 40 }}>
      Payment successful... redirecting to your dashboard 🚀
    </div>
  );
}