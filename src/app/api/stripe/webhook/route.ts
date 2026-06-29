import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20" as any,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature")!;

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Webhook error" }, { status: 400 });
  }

  // 🔥 PAYMENT SUCCESS → UNLOCK PREMIUM
  if (event.type === "checkout.session.completed") {
    const session = event.data.object as any;

    const userId = session.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}