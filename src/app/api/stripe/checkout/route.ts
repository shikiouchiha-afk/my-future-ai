import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-05-28.basil",
});

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const userId = body.userId ?? "anonymous";

    const priceId = process.env.STRIPE_PRICE_ID;

    if (!process.env.STRIPE_SECRET_KEY) {
      return NextResponse.json(
        { error: "Missing STRIPE_SECRET_KEY" },
        { status: 500 }
      );
    }

    if (!priceId) {
      return NextResponse.json(
        { error: "Missing STRIPE_PRICE_ID" },
        { status: 500 }
      );
    }

    if (!process.env.NEXT_PUBLIC_URL) {
      return NextResponse.json(
        { error: "Missing NEXT_PUBLIC_URL" },
        { status: 500 }
      );
    }

    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/pricing?success=true`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing?canceled=true`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({
      url: session.url,
    });
  } catch (err: any) {
    console.error(err);

    return NextResponse.json(
      {
        error: err.message || "Internal Server Error",
      },
      {
        status: 500,
      }
    );
  }
}