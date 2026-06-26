"use client";

import { useState } from "react";

export default function CoachSelector() {
  const [coach, setCoach] = useState("Business");

  return (
    <div className="bg-white/5 border border-white/10 rounded-2xl p-6">
      <h2 className="font-bold text-xl mb-4">
        Choose Your Coach
      </h2>

      <div className="flex flex-wrap gap-3">
        {[
          "Business",
          "Fitness",
          "Study",
          "Life",
          "Mindset",
        ].map((c) => (
          <button
            key={c}
            onClick={() => setCoach(c)}
            className={`px-4 py-2 rounded-xl ${
              coach === c
                ? "bg-purple-600"
                : "bg-white/10"
            }`}
          >
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}