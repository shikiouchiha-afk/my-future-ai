"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AiEngineCore } from "@/components/AiEngineCore";
import { setAuthCookies } from "@/lib/authCookies";
import { getPremiumStatus } from "@/lib/premiumAccess";
import styles from "../auth-shell.module.css";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const bootstrapOAuthSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;

      if (!session) return;

      const user = session.user;
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
      router.replace("/dashboard");
    };

    void bootstrapOAuthSession();
  }, [router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) {
        setError(error.message);
        return;
      }
      if (!data?.session) {
        setError("Login failed. Try again.");
        return;
      }

      const user = data.session.user;
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
      router.replace("/dashboard");
    } catch {
      setError("Unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.page}>
      <div className={styles.bgLayer} />
      <div className={styles.gridOverlay} />

      <main className={styles.container}>
        <section className={styles.inner}>
          <aside className={styles.leftPanel}>
            <h1 className={styles.brand}>
              MY FUTURE <span className={styles.brandAccent}>AI</span>
            </h1>
            <p className={styles.brandSub}>Powered by Intelligence. Built for Greatness.</p>

            <div className={styles.engineWrap}>
              <AiEngineCore />
            </div>

            <h2 className={styles.leftTitle}>
              Your AI Mentor.
              <span className={styles.leftTitleStrong}>Your Ultimate Advantage.</span>
            </h2>
            <p className={styles.leftBody}>
              Unlock your potential with world-class coaching, personalized guidance,
              and an AI that truly understands you.
            </p>

            <div className={styles.featureRow}>
              <article className={styles.featureCard}>
                <div className={styles.featureIcon}>A</div>
                <p className={styles.featureText}>AI-Powered Coaching</p>
              </article>
              <article className={styles.featureCard}>
                <div className={styles.featureIcon}>P</div>
                <p className={styles.featureText}>Personalized Roadmaps</p>
              </article>
              <article className={styles.featureCard}>
                <div className={styles.featureIcon}>G</div>
                <p className={styles.featureText}>Track. Improve. Grow.</p>
              </article>
            </div>
          </aside>

          <section className={styles.rightPanel}>
            <h2 className={styles.heading}>
              Welcome <span className={styles.headingAccent}>back</span>
            </h2>
            <p className={styles.subheading}>Sign in to continue your journey</p>

            <div className={styles.tabRow}>
              <Link href="/login" className={`${styles.tabLink} ${styles.tabActive}`}>Sign in</Link>
              <Link href="/signup" className={styles.tabLink}>Create account</Link>
            </div>

            <form onSubmit={handleLogin} className={styles.form}>
              <div>
                <label className={styles.label} htmlFor="email">Email</label>
                <input
                  id="email"
                  type="email"
                  className={styles.input}
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div>
                <label className={styles.label} htmlFor="password">Password</label>
                <div className={styles.passwordWrap}>
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    className={styles.input}
                    placeholder="Enter your password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                  />
                  <button
                    type="button"
                    className={styles.passwordToggle}
                    aria-label={showPassword ? "Hide password" : "Show password"}
                    onClick={() => setShowPassword((prev) => !prev)}
                  >
                    {showPassword ? "🙈" : "👁"}
                  </button>
                </div>
              </div>

              <div className={styles.helperRow}>
                <label className={styles.remember} htmlFor="remember-me">
                  <input
                    id="remember-me"
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                  />
                  Remember me
                </label>
                <Link href="/forgot-password" className={styles.link}>Forgot password?</Link>
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <button type="submit" className={styles.submitBtn} disabled={loading}>
                {loading ? "Signing in..." : "Sign in"}
              </button>
            </form>

            <p className={styles.terms}>
              By signing in, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}