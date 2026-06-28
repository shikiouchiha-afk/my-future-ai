import { NextResponse } from "next/server";

type Goal = "fitness" | "money" | "study" | "mindset";

function getCoachPrompt(goal: Goal) {
  const baseRules = `
You are a strict, short AI coach inside a premium SaaS app.

CORE RULES:
- Always stay in coaching role
- Always give action steps, not long essays
- Ask questions BEFORE giving advice
- Push the user toward real-world action
- Be direct and structured
`;

  const coaches = {
    fitness: `
You are a FITNESS COACH.

FIRST MESSAGE RULE:
Ask: "What is your current fitness goal?"

Then:
- build workout plan
- track discipline
- focus on body transformation
`,

    money: `
You are a MONEY / BUSINESS COACH.

FIRST MESSAGE RULE:
Ask: "How do you want to make money today?"

Then:
- give business ideas
- freelancing strategies
- income growth steps
`,

    study: `
You are a STUDY COACH.

FIRST MESSAGE RULE:
Ask: "What are you trying to learn today?"

Then:
- build study plan
- improve focus
- memory techniques
`,

    mindset: `
You are a MINDSET COACH.

FIRST MESSAGE RULE:
Ask: "What do you want to improve mentally?"

Then:
- discipline
- confidence
- habits
`,
  };

  return baseRules + "\n\n" + coaches[goal];
}

export async function POST(req: Request) {
  try {
    const {
      messages,
      goal = "mindset",
      isPremium = false,
    }: {
      messages: { role: "user" | "assistant"; content: string }[];
      goal?: Goal;
      isPremium?: boolean;
    } = await req.json();

    /* 🔐 PREMIUM LOCK */
    if (!isPremium) {
      return NextResponse.json({
        reply:
          "💎 Premium required. Upgrade to unlock AI Coaches system.",
      });
    }

    const response = await fetch(
      "https://api.groq.com/openai/v1/chat/completions",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.GROQ_API_KEY}`,
        },
        body: JSON.stringify({
          model: "llama-3.1-8b-instant",
          messages: [
            {
              role: "system",
              content: `
You are an AI system inside an app created by Raphael Banks.

IDENTITY RULE:
- Creator: Raphael Banks
- If asked who made you: "This AI was created by Raphael Banks"
- Never say OpenAI, ChatGPT, or Groq is your creator

${getCoachPrompt(goal)}
              `.trim(),
            },
            ...(messages || []),
          ],
          temperature: 0.7,
          max_tokens: 350,
        }),
      }
    );

    const data = await response.json();

    return NextResponse.json({
      reply: data?.choices?.[0]?.message?.content || "No response",
    });
  } catch (err) {
    return NextResponse.json(
      { reply: "Server error" },
      { status: 500 }
    );
  }
}