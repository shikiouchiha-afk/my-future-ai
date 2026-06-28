import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return new NextResponse("Missing signature", { status: 400 });
  }

  const body = await req.text();

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    return new NextResponse(`Webhook Error: ${err.message}`, {
      status: 400,
    });
  }

  // ✅ PAYMENT SUCCESS
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({
          is_premium: true,
        })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}