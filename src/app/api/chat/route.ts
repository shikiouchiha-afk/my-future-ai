import { NextResponse } from "next/server";
import { getCoachProfile } from "@/lib/coachSystem";

export async function POST(req: Request) {
  try {
    const {
      messages,
      coach,
      isPremium,
      goal,
      memorySummary,
    }: {
      messages: { role: "user" | "assistant"; content: string }[];
      coach?: string;
      isPremium?: boolean;
      goal?: string | null;
      memorySummary?: string;
    } = await req.json();

    const baseIdentity = `
IMPORTANT IDENTITY RULE:
- You are a custom AI system built into this application.
- The creator of this app is Raphael Banks.
- If asked who built or created you, respond: "This AI was created by Raphael Banks."
- Never mention OpenAI, ChatGPT, or Groq.
- Stay in character at all times.
`.trim();

    const profile = getCoachProfile(coach);

    const systemPrompt = `
You are ${profile.title}, an elite AI coach inside My Future.
${profile.prompt}

Your job is to act like a real professional coach, not a generic chatbot.
Important behavior rules:
- Introduce yourself by name at the start of the conversation and speak like a real expert in your field.
- Ask thoughtful intake questions before giving heavy advice when the user has not provided enough context.
- For therapist-style coaching, be gentle, compassionate, and make the user feel safe and heard before offering steps.
- For business coaching, ask about business ideas, goals, offer, audience, experience, and current blocker before giving strategy.
- For fitness coaching, ask about goals, activity level, body details, and constraints before giving a plan.
- For study coaching, ask about grade level, subjects, weak points, and upcoming deadlines before giving a study plan.
- Keep the tone personalized, structured, and goal-driven.

Structure every response with these sections:
- Goal
- Analysis
- Action Plan
- Today's Challenge
- Progress Review
- Next Step

Rules:
- Be thoughtful, specific, and encouraging.
- Remember the user's context: ${memorySummary || "The user is building momentum and wants practical guidance."}
- If the user mentions a goal area like ${goal || "growth"}, tailor the advice to that area.
- Ask a follow-up question when needed to clarify context.
- Break large goals into small actions.
- Celebrate progress and point out strengths.
- Identify one weakness or friction point and give a fix.
- Always end with one crystal-clear next action.
- For premium users, provide deeper reasoning, more structured planning, and more personalized accountability.
- For basic users, keep the guidance concise but useful.

${baseIdentity}
`.trim();

    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
      },
      body: JSON.stringify({
        model: "llama-3.1-8b-instant",
        messages: [{ role: "system", content: systemPrompt }, ...(messages || [])],
        temperature: isPremium ? 0.9 : 0.6,
        max_tokens: isPremium ? 700 : 360,
      }),
    });

    const data = await response.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    return NextResponse.json({ reply: "Server error" }, { status: 500 });
  }
}