import { NextResponse } from "next/server";
import Stripe from "stripe";
import { createClient } from "@supabase/supabase-js";

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-06-20",
});

// ⚠️ SERVER SUPABASE (SERVICE ROLE KEY)
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature")!;

    const event = stripe.webhooks.constructEvent(
      body,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );

    // 🎯 WHEN PAYMENT SUCCEEDS
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;

      if (!userId) {
        console.error("Missing userId in Stripe metadata");
        return NextResponse.json({ ok: false });
      }

      // 💎 UPDATE SUPABASE USER TO PREMIUM
      const { error } = await supabase
        .from("users")
        .update({
          plan: "premium",
        })
        .eq("id", userId);

      if (error) {
        console.error("Supabase update error:", error);
        return NextResponse.json({ ok: false });
      }

      console.log("User upgraded to premium:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err: any) {
    console.error("Webhook error:", err.message);
    return NextResponse.json(
      { error: "Webhook failed" },
      { status: 400 }
    );
  }
}