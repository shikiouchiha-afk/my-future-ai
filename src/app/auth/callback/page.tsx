"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { setAuthCookies } from "@/lib/authCookies";
import { getPremiumStatus } from "@/lib/premiumAccess";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

function normalizeNextPath(nextPath: string | null) {
  if (!nextPath || !nextPath.startsWith("/")) {
    return "/dashboard";
  }
  return nextPath;
}

export default function AuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    const completeOAuth = async () => {
      const search = new URLSearchParams(window.location.search);
      const code = search.get("code");
      const nextPath = normalizeNextPath(search.get("next"));

      if (code) {
        const { error } = await supabase.auth.exchangeCodeForSession(code);
        if (error) {
          router.replace(`/login?oauth_error=${encodeURIComponent(error.message)}`);
          return;
        }
      }

      const { data: sessionData } = await supabase.auth.getSession();
      const session = sessionData.session;

      if (!session) {
        router.replace("/login");
        return;
      }

      const user = session.user;
      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        user.email?.split("@")[0] ||
        "User";

      await supabase.from("profiles").upsert(
        {
          id: user.id,
          email: user.email,
          name: fullName,
          plan: "basic",
          xp: 0,
          level: 1,
        },
        { onConflict: "id" }
      );

      const { data: profile } = await supabase
        .from("profiles")
        .select("is_premium, is_admin")
        .eq("id", user.id)
        .single();

      const premium = getPremiumStatus({
        email: user.email,
        profilePremium: profile?.is_premium,
        isAdmin: profile?.is_admin,
      });

      setAuthCookies({ premium, admin: Boolean(profile?.is_admin) });
      router.replace(nextPath);
    };

    void completeOAuth();
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050918] text-white px-4">
      <div className="w-full max-w-md rounded-2xl border border-white/15 bg-white/5 p-8 backdrop-blur-md text-center">
        <p className="text-sm uppercase tracking-[0.2em] text-cyan-300/80">My Future AI</p>
        <h1 className="mt-3 text-2xl font-bold">Completing sign in...</h1>
        <p className="mt-2 text-white/60">Please wait while we securely connect your account.</p>
      </div>
    </div>
  );
}
