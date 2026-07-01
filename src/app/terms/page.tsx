"use client";

export default function TermsPage() {
  return (
    <div className="page">
      <div className="card">
        <h1>Terms of Service</h1>
        <p>By using My Future, you agree to use the service responsibly and respect the rights of other users.</p>
      </div>
      <style jsx>{`
        .page { min-height: 100vh; display: flex; align-items: center; justify-content: center; padding: 24px; background: linear-gradient(135deg, #04030b, #111827 100%); color: white; }
        .card { width: min(760px, 100%); padding: 24px; border-radius: 24px; background: rgba(255,255,255,0.08); border: 1px solid rgba(255,255,255,0.12); backdrop-filter: blur(24px); }
      `}</style>
    </div>
  );
}
