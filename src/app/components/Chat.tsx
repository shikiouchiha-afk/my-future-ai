"use client";

import { useState } from "react";

type Message = {
  role: "user" | "assistant";
  content: string;
};

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([
    {
      role: "assistant",
      content:
        "Welcome back! What's your biggest goal today? I'll help you make progress step by step.",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      role: "user",
      content: input,
    };

    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: updatedMessages,
        }),
      });

      const data = await res.json();

      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: data.reply || "AI could not respond.",
        },
      ]);
    } catch (error) {
      setMessages((prev) => [
        ...prev,
        {
          role: "assistant",
          content: "Something went wrong.",
        },
      ]);
    }

    setLoading(false);
  };

  return (
    <div className="flex flex-col h-[700px]">
      {/* MESSAGES */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4">
        {messages.map((m, i) => (
          <div
            key={i}
            className={`max-w-[75%] px-4 py-3 rounded-xl text-sm ${
              m.role === "user"
                ? "ml-auto bg-indigo-500/20 border border-indigo-400/20"
                : "bg-white/5 border border-white/10"
            }`}
          >
            {m.content}
          </div>
        ))}

        {loading && (
          <div className="bg-white/5 border border-white/10 px-4 py-3 rounded-xl w-fit animate-pulse">
            AI is thinking...
          </div>
        )}
      </div>

      {/* INPUT */}
      <div className="border-t border-white/10 p-4 flex gap-3">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message My Future AI..."
          className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 outline-none text-white"
          onKeyDown={(e) => {
            if (e.key === "Enter") sendMessage();
          }}
        />

        <button
          onClick={sendMessage}
          className="px-6 py-3 rounded-xl bg-indigo-500 hover:bg-indigo-600 transition"
        >
          Send
        </button>
      </div>
    </div>
  );
}