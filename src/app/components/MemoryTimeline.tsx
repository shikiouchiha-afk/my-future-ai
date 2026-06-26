"use client";

export default function MemoryTimeline() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="font-bold mb-4">
        Memory Timeline
      </h2>

      <div className="space-y-3">
        <div>📅 Started fitness journey</div>
        <div>📅 Reached Level 10</div>
        <div>📅 Completed first mission</div>
      </div>
    </div>
  );
}