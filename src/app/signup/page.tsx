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

            <p className={styles.terms}>
              By creating an account, you agree to our <Link href="/terms">Terms of Service</Link> and <Link href="/privacy">Privacy Policy</Link>.
            </p>
          </section>
        </section>
      </main>
    </div>
  );
}