import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => ({}));
    const userId = body?.userId ?? "guest";

    const origin =
      req.headers.get("origin") ||
      process.env.NEXT_PUBLIC_URL ||
      "http://localhost:3000";

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "My Future Premium",
              description:
                "Unlock full AI coaching, memory, analytics, and premium workspace access",
            },
            unit_amount: 1599, // 💰 $15.99 (your updated price)
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,

      metadata: {
        userId,
      },

      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}