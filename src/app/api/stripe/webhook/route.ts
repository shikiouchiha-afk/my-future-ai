import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs"; // IMPORTANT for Stripe

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  const body = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "No signature" }, { status: 400 });
  }

  let event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err) {
    return NextResponse.json({ error: "Invalid webhook" }, { status: 400 });
  }

  /* =========================
     PAYMENT SUCCESS
  ========================= */
  if (event.type === "checkout.session.completed") {
    const session: any = event.data.object;

    const userId = session?.metadata?.userId;

    if (userId) {
      await supabase
        .from("profiles")
        .update({ is_premium: true })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}