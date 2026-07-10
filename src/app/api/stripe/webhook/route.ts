import Stripe from "stripe";
import { NextResponse } from "next/server";
import { getServiceRoleSupabaseClient } from "@/lib/supabaseServer";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY as string, {
  apiVersion: "2026-06-24.dahlia",
});

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

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;
    const userId = session.metadata?.userId;
    const supabase = getServiceRoleSupabaseClient();

    if (userId && supabase && session.payment_status === "paid") {
      const { data: existingProfile } = await supabase
        .from("profiles")
        .select("is_premium")
        .eq("id", userId)
        .single();

      const firstPremiumActivation = !existingProfile?.is_premium;

      await supabase
        .from("profiles")
        .update({
          is_premium: true,
          has_seen_premium_animation: firstPremiumActivation ? false : true,
        })
        .eq("id", userId);
    }
  }

  return NextResponse.json({ received: true });
}