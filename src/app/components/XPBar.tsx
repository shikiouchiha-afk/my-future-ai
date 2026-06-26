"use client";

export default function XPBar() {
  return (
    <div className="mt-4">
      <div className="flex justify-between text-sm mb-2">
        <span>Level 12</span>
        <span>Goal: Level 300</span>
      </div>

      <div className="h-3 bg-white/10 rounded-full overflow-hidden">
        <div
          className="h-full bg-gradient-to-r from-purple-500 to-cyan-400"
          style={{ width: "35%" }}
        />
      </div>

      <div className="text-center mt-2">
        🚀
      </div>
    </div>
  );
}