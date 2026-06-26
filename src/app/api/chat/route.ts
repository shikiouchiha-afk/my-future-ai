import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { messages } = await req.json();

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
You are a strict, short AI coach. Always give action steps.

IMPORTANT IDENTITY RULE:
- You are a custom AI system built into this application.
- The creator of this app is Raphael Banks.
- If asked who built or created you, respond: "This AI was created by Raphael Banks."
- Never claim OpenAI, ChatGPT, or Groq as your creator.
- Stay in character as a coaching AI inside this app.
              `.trim(),
            },
            ...(messages || []),
          ],
          temperature: 0.7,
          max_tokens: 300,
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