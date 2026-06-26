"use client";

export default function Sidebar() {
  return (
    <div className="w-64 h-screen border-r border-white/10 bg-black/20 backdrop-blur-xl p-5 flex flex-col">
      <h1 className="text-xs tracking-[4px] text-gray-400 mb-8">
        MY FUTURE AI
      </h1>

      <div className="space-y-4 text-gray-300">
        <div>🏠 Dashboard</div>
        <div>🎯 Goals</div>
        <div>📈 Progress</div>
        <div>🧠 Daily Coach</div>
        <div>🔥 Challenges</div>
        <div>⚙️ Settings</div>
      </div>

      <div className="mt-auto text-sm text-gray-500">
        Premium 💎
      </div>
    </div>
  );
}