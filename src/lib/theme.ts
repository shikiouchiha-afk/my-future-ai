export type AppTheme = "dark" | "neon" | "cyber" | "galaxy" | "matrix" | "gold" | "anime" | "minimal" | "nebula";

export const themeTokens: Record<AppTheme, { shell: string; accent: string; card: string; text: string; glow: string }> = {
  dark: { shell: "#04030b", accent: "#8b5cf6", card: "rgba(255,255,255,0.07)", text: "#f8fafc", glow: "rgba(139,92,246,0.24)" },
  neon: { shell: "#060816", accent: "#22d3ee", card: "rgba(34,211,238,0.12)", text: "#ecfeff", glow: "rgba(34,211,238,0.24)" },
  cyber: { shell: "#020617", accent: "#38bdf8", card: "rgba(56,189,248,0.12)", text: "#e0f2fe", glow: "rgba(56,189,248,0.24)" },
  galaxy: { shell: "#09090f", accent: "#a855f7", card: "rgba(168,85,247,0.12)", text: "#f5f3ff", glow: "rgba(168,85,247,0.24)" },
  matrix: { shell: "#030712", accent: "#4ade80", card: "rgba(74,222,128,0.12)", text: "#ecfdf5", glow: "rgba(74,222,128,0.25)" },
  gold: { shell: "#17110b", accent: "#fbbf24", card: "rgba(251,191,36,0.14)", text: "#fff7ed", glow: "rgba(251,191,36,0.24)" },
  anime: { shell: "#140314", accent: "#fb7185", card: "rgba(251,113,133,0.14)", text: "#fff1f2", glow: "rgba(251,113,133,0.25)" },
  minimal: { shell: "#111827", accent: "#f8fafc", card: "rgba(248,250,252,0.08)", text: "#f8fafc", glow: "rgba(248,250,252,0.18)" },
  nebula: { shell: "#050816", accent: "#7c3aed", card: "rgba(124,58,237,0.16)", text: "#f8fafc", glow: "rgba(34,211,238,0.28)" },
};

export function getStoredTheme(): AppTheme {
  if (typeof window === "undefined") return "dark";
  const stored = window.localStorage.getItem("myfuture-theme") as AppTheme | null;
  return stored && stored in themeTokens ? stored : "dark";
}

export function setStoredTheme(theme: AppTheme) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem("myfuture-theme", theme);
}
