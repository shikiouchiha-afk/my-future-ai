"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@supabase/supabase-js";
import { AiEngineCore } from "@/components/AiEngineCore";
import { clearAuthCookies, setAuthCookies } from "@/lib/authCookies";
import styles from "../auth-shell.module.css";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export default function SignupPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [agree, setAgree] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const bootstrapOAuthSession = async () => {
      const { data } = await supabase.auth.getSession();
      const session = data.session;
      if (!session) return;

      setAuthCookies({ premium: false, admin: false });
      router.replace("/dashboard");
    };

    void bootstrapOAuthSession();
  }, [router]);

  const handleOAuthSignIn = async (provider: "google" | "apple" | "discord") => {
    setError("");
    const { error: oauthError } = await supabase.auth.signInWithOAuth({
      provider,
      options: {
        redirectTo: `${window.location.origin}/auth/callback?next=/dashboard`,
      },
    });

    if (oauthError) {
      setError(oauthError.message || `${provider} sign-in is not configured yet.`);
    }
  };

  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const { data, error: authError } = await supabase.auth.signUp({ email, password });
      if (authError) {
        clearAuthCookies();
        setError(authError.message);
        setLoading(false);
        return;
      }

      const user = data.user;
      if (!user) {
        clearAuthCookies();
        setError("User creation failed");
        setLoading(false);
        return;
      }

      if (!data.session) {
        clearAuthCookies();
        setError("Account created. Please check your email to confirm before signing in.");
        setLoading(false);
        return;
      }

      const { error: profileError } = await supabase.from("profiles").insert({
        id: user.id,
        email: user.email,
        name,
        plan: "basic",
        xp: 0,
        level: 1,
        created_at: new Date().toISOString(),
      });
      if (profileError) {
        console.error(profileError);
      }

      setAuthCookies({ premium: false, admin: false });
      router.replace("/dashboard");
    } catch (err: any) {
      setError(err.message || "Signup failed");
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
              Create <span className={styles.headingAccent}>account</span>
            </h2>
            <p className={styles.subheading}>Start your AI-powered growth journey</p>

            <div className={styles.tabRow}>
              <Link href="/login" className={styles.tabLink}>Sign in</Link>
              <Link href="/signup" className={`${styles.tabLink} ${styles.tabActive}`}>Create account</Link>
            </div>

            <form onSubmit={handleSignup} className={styles.form}>
              <div>
                <label className={styles.label} htmlFor="name">Name</label>
                <input
                  id="name"
                  type="text"
                  className={styles.input}
                  placeholder="Enter your name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>

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
                <label className={styles.remember} htmlFor="agree-terms">
                  <input
                    id="agree-terms"
                    type="checkbox"
                    checked={agree}
                    onChange={(e) => setAgree(e.target.checked)}
                  />
                  I agree to the terms
                </label>
                <Link href="/terms" className={styles.link}>Terms</Link>
              </div>

              {error ? <p className={styles.error}>{error}</p> : null}

              <button type="submit" className={styles.submitBtn} disabled={loading || !agree}>
                {loading ? "Creating account..." : "Create account"}
              </button>
            </form>

            <div className={styles.sep}>or continue with</div>

            <div className={styles.socialGrid}>
              <button type="button" className={styles.socialBtn} onClick={() => void handleOAuthSignIn("google")}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#EA4335" d="M12 10.2v3.9h5.5c-.2 1.3-1.6 3.9-5.5 3.9-3.3 0-6-2.8-6-6.2s2.7-6.2 6-6.2c1.9 0 3.2.8 3.9 1.5l2.6-2.6C16.9 2.8 14.7 2 12 2 6.9 2 2.8 6.2 2.8 11.3S6.9 20.6 12 20.6c6.9 0 9.2-4.8 9.2-7.3 0-.5 0-.9-.1-1.3H12z"/>
                </svg>
                Google
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => void handleOAuthSignIn("apple")}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="currentColor" d="M16.7 12.7c0-2.2 1.8-3.3 1.9-3.4-1-1.5-2.6-1.7-3.2-1.8-1.4-.1-2.7.8-3.4.8-.7 0-1.8-.8-2.9-.8-1.5 0-2.9.9-3.7 2.2-1.6 2.8-.4 6.8 1.2 9.1.8 1.1 1.7 2.4 2.9 2.4 1.1 0 1.6-.7 3-.7 1.4 0 1.8.7 3 .7 1.2 0 2-1.1 2.8-2.2.9-1.3 1.3-2.6 1.3-2.7 0-.1-2.9-1.1-2.9-3.6zM14.4 6c.7-.8 1.1-1.9 1-3-.9 0-2 .6-2.6 1.4-.6.7-1.2 1.9-1 3 .9.1 1.9-.5 2.6-1.4z"/>
                </svg>
                Apple
              </button>
              <button type="button" className={styles.socialBtn} onClick={() => void handleOAuthSignIn("discord")}>
                <svg className={styles.socialIcon} viewBox="0 0 24 24" aria-hidden="true">
                  <path fill="#5865F2" d="M20.3 4.4A19.8 19.8 0 0 0 15.4 3l-.2.4c2.3.6 3.4 1.5 3.4 1.5a13 13 0 0 0-13.2 0s1.2-.9 3.5-1.5l-.2-.4a19.8 19.8 0 0 0-4.9 1.4C.7 8.8-.1 13.2.3 17.5a20 20 0 0 0 6 3l.5-.9c-1-.3-2-.8-2.9-1.4.7.5 1.9 1.2 4.1 1.7 2.8.6 5.2.3 7.2-.3a10 10 0 0 0 2.9-1.4c-.8.6-1.8 1.1-2.9 1.4l.5.9a20 20 0 0 0 6-3c.5-5-.9-9.3-3.4-13.1ZM8.1 14.9c-1.2 0-2.1-1.1-2.1-2.5s1-2.5 2.1-2.5c1.2 0 2.1 1.1 2.1 2.5.1 1.4-.9 2.5-2.1 2.5Zm7.8 0c-1.2 0-2.1-1.1-2.1-2.5s1-2.5 2.1-2.5c1.2 0 2.1 1.1 2.1 2.5s-1 2.5-2.1 2.5Z"/>
                </svg>
                Discord
              </button>
            </div>

            <p className={styles.terms}>
              By creating an account, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}