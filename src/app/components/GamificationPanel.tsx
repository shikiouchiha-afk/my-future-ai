"use client";

export default function GamificationPanel() {
  return (
    <div className="space-y-4">

      {/* STATS */}
      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
        <h3 className="font-semibold mb-3">📊 Stats</h3>

        <div className="space-y-2 text-sm text-white/80">
          <p>💪 Fitness: 72</p>
          <p>💰 Money: 58</p>
          <p>🧠 Discipline: 61</p>
          <p>📚 Study: 66</p>
        </div>
      </div>

      {/* ACHIEVEMENT */}
      <div className="p-4 rounded-2xl bg-white/10 backdrop-blur-md border border-white/10">
        <h3 className="font-semibold mb-2">🏆 Achievement</h3>
        <p className="text-sm text-white/60">
          3-day consistency streak unlocked
        </p>
      </div>

      {/* MOTIVATION LOOP */}
      <div className="p-4 rounded-2xl bg-gradient-to-br from-purple-500/20 to-blue-500/10 border border-white/10">
        <h3 className="font-semibold mb-2">⚡ Momentum</h3>
        <p className="text-sm text-white/70">
          Keep going — your discipline trend is improving this week.
        </p>
      </div>

    </div>
  );
}