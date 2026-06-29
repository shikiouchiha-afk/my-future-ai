import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    if (!userId) {
      return NextResponse.json({ error: "Missing userId" }, { status: 400 });
    }

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium AI Access",
            },
            unit_amount: 999, // $9.99
            recurring: {
              interval: "month",
            },
          },
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
      metadata: {
        userId,
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}