import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";

export async function POST(req: Request) {
  try {
    const { userId } = await req.json();

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "payment",
      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "Premium Access",
            },
            unit_amount: 999,
          },
          quantity: 1,
        },
      ],
      success_url: `${process.env.NEXT_PUBLIC_URL}/dashboard`,
      cancel_url: `${process.env.NEXT_PUBLIC_URL}/pricing`,
      metadata: {
        userId, // IMPORTANT (you said you didn't have this)
      },
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}