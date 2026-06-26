export default function Page() {
  return (
    <main
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "radial-gradient(circle at top, #1a1a2e, #0f0f1a)",
        color: "white",
        fontFamily: "system-ui, -apple-system, sans-serif",
        textAlign: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          padding: "30px 40px",
          borderRadius: "16px",
          background: "rgba(255,255,255,0.06)",
          boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
          border: "1px solid rgba(255,255,255,0.1)",
          maxWidth: "500px",
        }}
      >
        <div style={{ fontSize: "40px", marginBottom: "10px" }}>🚀</div>

        <h1 style={{ fontSize: "28px", margin: "0 0 10px" }}>
          App is running
        </h1>

        <p style={{ opacity: 0.8, margin: 0 }}>
          Your deployment is live on Vercel
        </p>
      </div>
    </main>
  );
}