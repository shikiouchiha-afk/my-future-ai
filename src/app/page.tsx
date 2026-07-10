"use client";

import Link from "next/link";
import { Orbitron, Space_Grotesk } from "next/font/google";
import { useEffect, useRef, useState } from "react";
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

const helpCenterSections = [
  {
    title: "Getting Started",
    faqs: [
      {
        question: "How quickly can I start using My Future AI?",
        answer:
          "Most users create an account, choose a coach, and begin their first focused session in under two minutes.",
      },
      {
        question: "What should I do first after signing up?",
        answer:
          "Start by choosing your main growth area, set one clear goal, and let the AI coach turn it into your first action plan.",
      },
      {
        question: "Can I use My Future AI on mobile and desktop?",
        answer:
          "Yes. The platform is built to feel fast and consistent across mobile, tablet, and desktop so your progress follows you everywhere.",
      },
    ],
  },
  {
    title: "Premium",
    faqs: [
      {
        question: "What unlocks with Premium?",
        answer:
          "Premium gives you deeper AI reasoning, advanced memory, richer analytics, specialized coaching modes, and faster response priority.",
      },
      {
        question: "Will I see the Premium activation sequence every time?",
        answer:
          "No. The Premium unlock experience appears only the first time a user activates Premium, then future sessions go directly into the app.",
      },
      {
        question: "What if my Premium access does not appear right away?",
        answer:
          "Billing and entitlement updates are verified securely. If access does not refresh within a moment, sign back in or contact support for a manual check.",
      },
    ],
  },
  {
    title: "AI Coach",
    faqs: [
      {
        question: "How does the AI coach adapt to my energy?",
        answer:
          "The system reads your recent tone and context, then responds with matching intensity while keeping you focused on execution and momentum.",
      },
      {
        question: "Can I change how intense my coach feels?",
        answer:
          "Yes. In Settings you can switch between Supportive, Balanced, and Savage coaching intensity depending on how hard you want the AI to push you.",
      },
      {
        question: "Will the coach keep me from getting distracted?",
        answer:
          "Yes. Every coach is tuned to redirect low-value detours, call out excuse patterns, and bring the conversation back to the highest-impact next step.",
      },
    ],
  },
  {
    title: "Progress & Goals",
    faqs: [
      {
        question: "Does My Future AI remember my goals and habits?",
        answer:
          "Yes. Memory and progress systems preserve the context that matters most so your coaching can build on prior sessions instead of restarting from zero.",
      },
      {
        question: "Can I track multiple goals at the same time?",
        answer:
          "Yes. You can work across fitness, study, productivity, business, and personal growth with coaching that keeps each track organized and actionable.",
      },
      {
        question: "How does the app measure momentum?",
        answer:
          "The platform uses streaks, mission completion, stored context, and goal-based interactions to reflect consistency and forward movement over time.",
      },
    ],
  },
  {
    title: "Account & Security",
    faqs: [
      {
        question: "How is my account protected?",
        answer:
          "Sensitive account and Premium state changes are validated on the server, reducing the risk of client-side spoofing or unauthorized entitlement changes.",
      },
      {
        question: "What if I cannot access my account?",
        answer:
          "Use the login and password recovery flow first. If you still cannot get in, support can help verify and restore access securely.",
      },
      {
        question: "Can I update my profile and coach settings later?",
        answer:
          "Yes. Your Settings page lets you update your account details and coaching intensity so the product stays aligned with how you work best.",
      },
    ],
  },
];

export default function HomePage() {
  const sceneRef = useRef<HTMLDivElement | null>(null);
  const [openFaq, setOpenFaq] = useState("Getting Started-0");

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

      </main>

      <footer className={styles.footer}>
        <div className={styles.footerGlow} aria-hidden="true" />
        <div className={styles.footerInner}>
          <section className={styles.helpFooter} aria-labelledby="help-center-title">
            <div className={styles.helpFooterIntro}>
              <div>
                <p className={styles.footerEyebrow}>Help Center</p>
                <h2 id="help-center-title">Answers built for a real AI growth platform.</h2>
              </div>
              <p className={styles.helpFooterCopy}>
                Explore the most important questions across onboarding, Premium,
                coaching, progress, and account protection. Everything is organized
                to help users move fast and trust the product.
              </p>
            </div>

            <div className={styles.helpCategoryGrid}>
              {helpCenterSections.map((section) => (
                <article key={section.title} className={styles.helpCategoryCard}>
                  <h3>{section.title}</h3>
                  <div className={styles.helpAccordionList}>
                    {section.faqs.map((item, index) => {
                      const faqKey = `${section.title}-${index}`;
                      const isOpen = openFaq === faqKey;

                      return (
                        <div
                          key={item.question}
                          className={`${styles.helpAccordionItem} ${isOpen ? styles.helpAccordionItemOpen : ""}`}
                        >
                          <button
                            type="button"
                            className={styles.helpAccordionTrigger}
                            aria-expanded={isOpen}
                            onClick={() => setOpenFaq(isOpen ? "" : faqKey)}
                          >
                            <span>{item.question}</span>
                            <span className={styles.helpAccordionIcon} aria-hidden="true">
                              +
                            </span>
                          </button>
                          <div className={styles.helpAccordionPanel}>
                            <div className={styles.helpAccordionPanelInner}>
                              <p>{item.answer}</p>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </article>
              ))}
            </div>

            <div className={styles.supportStrip}>
              <div>
                <p className={styles.supportLabel}>Support</p>
                <p className={styles.supportCopy}>
                  Users can contact support at{" "}
                  <a href="mailto:support@myfutureai.com">support@myfutureai.com</a>.
                </p>
              </div>
              <nav className={styles.footerLinks} aria-label="Footer links">
                <Link href="/pricing">Pricing</Link>
                <Link href="/premium">Premium</Link>
                <Link href="/privacy">Privacy</Link>
                <Link href="/terms">Terms</Link>
              </nav>
            </div>

            <div className={styles.footerBrandRow}>
              <div>
                <p className={styles.footerBrand}>MY Future AI</p>
                <p className={styles.footerCopy}>
                  World-class AI coaching and growth systems designed for ambitious builders.
                </p>
              </div>
              <p className={styles.footerTrustNote}>
                Premium guidance, secure account systems, and a product experience built to feel trustworthy at scale.
              </p>
            </div>
          </section>
        </div>
      </footer>
    </div>
  );
}
