"use client";

export default function WelcomeCard() {
  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="text-2xl font-bold mb-3">
        Welcome back 👋
      </h2>

      <p className="text-gray-400">
        What's your biggest goal today?
      </p>

      <div className="flex flex-wrap gap-3 mt-5">
        <button>💰 Business</button>
        <button>💪 Fitness</button>
        <button>📚 Study</button>
        <button>🧠 Mindset</button>
        <button>🚀 Career</button>
      </div>
    </div>
  );
}