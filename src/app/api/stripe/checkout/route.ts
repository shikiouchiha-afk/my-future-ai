import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {});

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

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],

      success_url: `${baseUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${baseUrl}/cancel`,

      metadata: {
        userId,
        plan: yearly ? "yearly" : "monthly",
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err: any) {
    return NextResponse.json(
      { error: err.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}