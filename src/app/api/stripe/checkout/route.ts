import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  // safer: let Stripe auto-handle API version
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}));

    const userId = body.userId ?? "anonymous";
    const yearly = body.yearly ?? false;

    const priceId = process.env.STRIPE_PRICE_ID;
    const baseUrl = process.env.NEXT_PUBLIC_URL;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json({ error: "Missing STRIPE_SECRET_KEY" }, { status: 500 });
    }

    if (!priceId) {
      return NextResponse.json({ error: "Missing STRIPE_PRICE_ID" }, { status: 500 });
    }

    if (!baseUrl) {
      return NextResponse.json({ error: "Missing NEXT_PUBLIC_URL" }, { status: 500 });
    }

    console.log("Stripe checkout request:", { userId, yearly, priceId });

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${baseUrl}/success`,
      cancel_url: `${baseUrl}/cancel`,
      metadata: {
        userId,
        plan: yearly ? "yearly" : "monthly",
      },
    });

    console.log("Stripe session created:", session.id);

    if (!session.url) {
      console.error("Stripe session missing URL:", session);
      return NextResponse.json(
        { error: "Stripe session failed: no URL returned" },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    console.error("Stripe FULL ERROR:", err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      { status: 500 }
    );
  }
}