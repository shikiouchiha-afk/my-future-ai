"use client";

export default function TermsPage() {
  return (
    <div className="page">
      <div className="card">
        <h1>Terms of Service</h1>
        <p>By using My Future, you agree to use the service responsibly and respect the rights of other users.</p>
      </div>
      <style jsx>{`
        .page { min-height: 100dvh; display: flex; align-items: center; justify-content: center; padding: calc(16px + env(safe-area-inset-top)) 14px calc(18px + env(safe-area-inset-bottom)); background: linear-gradient(135deg, #04030b, #111827 100%); color: white; }
        .card { width: min(760px, 100%); padding: clamp(16px, 3vw, 24px); border-radius: 20px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); }
        h1 { margin: 0 0 10px; font-size: clamp(1.5rem, 4vw, 2rem); }
        p { margin: 0; color: #cbd5e1; line-height: 1.75; font-size: clamp(0.95rem, 2.8vw, 1rem); }
      `}</style>
    </div>
  );
}
