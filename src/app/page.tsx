"use client";

import Link from "next/link";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { useEffect, useRef } from "react";
import styles from "./page.module.css";

const orbitron = Orbitron({
  subsets: ["latin"],
  weight: ["700", "800"],
  variable: "--font-display",
});

const spaceGrotesk = Space_Grotesk({
  subsets: ["latin"],
  weight: ["400", "500", "700"],
  variable: "--font-body",
});

const coreFeatures = [
  {
    title: "AI Coaching",
    description:
      "Switch between specialized coaches for mindset, productivity, business, and high-performance habits.",
  },
  {
    title: "Goal Tracking",
    description:
      "Set strategic milestones, break them into executable steps, and monitor completion velocity in real time.",
  },
  {
    title: "Habit Building",
    description:
      "Build streaks, reinforce consistency, and lock in routines with daily mission loops and feedback.",
  },
  {
    title: "School Assistance",
    description:
      "Get structured study plans, clarity on difficult topics, and exam readiness support tailored to your level.",
  },
  {
    title: "Fitness Guidance",
    description:
      "Use training logic, recovery pacing, and accountability cues that keep performance steady week after week.",
  },
  {
    title: "Trading Support",
    description:
      "Track discipline, evaluate setups, and improve decision quality with risk-aware, process-focused coaching.",
  },
  {
    title: "Live Analytics",
    description:
      "Visualize progress metrics, trend lines, and behavior patterns to optimize momentum and outcomes.",
  },
  {
    title: "Premium Systems",
    description:
      "Unlock advanced insights, deeper response quality, and custom coaching depth designed for serious growth.",
  },
];

const premiumHighlights = [
  "Adaptive memory that gets sharper every session",
  "Personalized coaching tone based on your goal context",
  "Instant dashboard insights for daily decision quality",
  "Mission-based progression with streak reinforcement",
];

const testimonials = [
  {
    quote:
      "The coaching quality feels elite. It turns overwhelming goals into a crystal-clear execution plan.",
    person: "Arielle N.",
    role: "Founder",
  },
  {
    quote:
      "My routines finally became automatic. The habit system and weekly review flow changed everything.",
    person: "Marcus L.",
    role: "Athlete",
  },
  {
    quote:
      "It feels like a command center for growth, not another chatbot. Premium quality from top to bottom.",
    person: "Rina K.",
    role: "Product Lead",
  },
];

const faqs = [
  {
    question: "How fast can I get started?",
    answer:
      "You can create your account in under a minute and immediately launch your first coaching session.",
  },
  {
    question: "Can I use it for multiple goals?",
    answer:
      "Yes. You can run business, school, fitness, and personal growth tracks at the same time with separate context.",
  },
  {
    question: "What does premium include?",
    answer:
      "Premium unlocks deeper reasoning, richer responses, advanced analytics, and enhanced personalization.",
  },
  {
    question: "Does the app remember my progress?",
    answer:
      "Your memory timeline stores key context so the AI can continue from where you left off.",
  },
  {
    question: "Is this mobile-friendly?",
    answer:
      "Every section is optimized for desktop, tablet, and mobile with smooth, accessible interactions.",
  },
];

export default function HomePage() {
  const sceneRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const scene = sceneRef.current;
    if (!scene) {
      return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reducedMotion) {
      scene.style.setProperty("--pointer-x", "0");
      scene.style.setProperty("--pointer-y", "0");
      return;
    }

    let raf = 0;

    const updateParallax = (x: number, y: number) => {
      cancelAnimationFrame(raf);
      raf = window.requestAnimationFrame(() => {
        scene.style.setProperty("--pointer-x", x.toFixed(3));
        scene.style.setProperty("--pointer-y", y.toFixed(3));
      });
    };

    const onMove = (event: PointerEvent) => {
      const rect = scene.getBoundingClientRect();
      const normalizedX = (event.clientX - rect.left) / rect.width - 0.5;
      const normalizedY = (event.clientY - rect.top) / rect.height - 0.5;
      updateParallax(normalizedX, normalizedY);
    };

    const onLeave = () => {
      updateParallax(0, 0);
    };

    scene.addEventListener("pointermove", onMove, { passive: true });
    scene.addEventListener("pointerleave", onLeave, { passive: true });

    return () => {
      cancelAnimationFrame(raf);
      scene.removeEventListener("pointermove", onMove);
      scene.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div
      ref={sceneRef}
      className={`${styles.page} ${orbitron.variable} ${spaceGrotesk.variable}`}
    >
      <div className={styles.deepSpace} aria-hidden="true" />
      <div className={styles.starField} aria-hidden="true" />
      <div className={styles.nebulaLayer} aria-hidden="true" />
      <div className={styles.particleLayer} aria-hidden="true" />

      <main className={styles.container}>
        <section className={styles.hero}>
          <div className={styles.heroCopy}>
            <p className={styles.kicker}>Cinematic AI Growth Platform</p>
            <h1>MY Future AI</h1>
            <p className={styles.tagline}>
              Design the future you want, then execute it with an intelligent system
              that coaches your goals, habits, and momentum every day.
            </p>
            <div className={styles.heroActions}>
              <Link className={styles.primaryButton} href="/signup">
                Start Free
              </Link>
              <Link className={styles.secondaryButton} href="/dashboard">
                See Demo
              </Link>
            </div>
            <div className={styles.metaRow}>
              <span>Ultra-responsive</span>
              <span>Adaptive coaching memory</span>
              <span>Built for momentum</span>
            </div>
          </div>

          <div className={styles.heroVisual} aria-hidden="true">
            <div className={styles.brainAura} />
            <div className={styles.brainFrame}>
              <div className={`${styles.circuit} ${styles.circuitA}`} />
              <div className={`${styles.circuit} ${styles.circuitB}`} />
              <div className={`${styles.circuit} ${styles.circuitC}`} />
              <div className={styles.brainCore} />
              <div className={styles.neonNode} />
              <div className={styles.neonNode} />
              <div className={styles.neonNode} />
              <div className={styles.neonNode} />
            </div>
          </div>
        </section>

        <section className={styles.metrics}>
          <article className={styles.metricCard}>
            <strong>7+</strong>
            <p>Specialized coaches for business, life, study, and performance.</p>
          </article>
          <article className={styles.metricCard}>
            <strong>24/7</strong>
            <p>Always-on guidance with context-aware recommendations.</p>
          </article>
          <article className={styles.metricCard}>
            <strong>4K Ready</strong>
            <p>Cinematic interface tuned for desktop, tablet, and mobile.</p>
          </article>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <p>Core Experiences</p>
            <h2>Everything you need to build your future in one AI workspace.</h2>
          </div>
          <div className={styles.featureGrid}>
            {coreFeatures.map((item) => (
              <article key={item.title} className={styles.featureCard}>
                <h3>{item.title}</h3>
                <p>{item.description}</p>
              </article>
            ))}
          </div>
        </section>

        <section className={styles.premiumPanel}>
          <div>
            <p className={styles.panelLabel}>Premium Mode</p>
            <h2>Luxury SaaS design meets deep, practical intelligence.</h2>
            <p>
              Every interaction is tuned for clarity, structure, and measurable growth
              so your progress feels intentional, not random.
            </p>
          </div>
          <ul className={styles.highlightList}>
            {premiumHighlights.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <p>Testimonials</p>
            <h2>Trusted by ambitious users building serious momentum.</h2>
          </div>
          <div className={styles.testimonialGrid}>
            {testimonials.map((item) => (
              <blockquote key={item.person} className={styles.quoteCard}>
                <p>{item.quote}</p>
                <footer>
                  <strong>{item.person}</strong>
                  <span>{item.role}</span>
                </footer>
              </blockquote>
            ))}
          </div>
        </section>

        <section className={styles.sectionBlock}>
          <div className={styles.sectionHeading}>
            <p>FAQs</p>
            <h2>Clear answers before you launch into your next chapter.</h2>
          </div>
          <div className={styles.faqGrid}>
            {faqs.map((item) => (
              <article key={item.question} className={styles.faqCard}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </article>
            ))}
          </div>
        </section>
      </main>

      <footer className={styles.footer}>
        <div className={styles.footerInner}>
          <div>
            <p className={styles.footerBrand}>MY Future AI</p>
            <p className={styles.footerCopy}>
              World-class AI coaching and growth systems designed for ambitious builders.
            </p>
          </div>
          <nav className={styles.footerLinks} aria-label="Footer links">
            <Link href="/pricing">Pricing</Link>
            <Link href="/premium">Premium</Link>
            <Link href="/privacy">Privacy</Link>
            <Link href="/terms">Terms</Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
