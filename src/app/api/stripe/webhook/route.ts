import Stripe from "stripe";
import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

// ✅ FIX: no apiVersion (avoids TypeScript mismatch)
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

export async function POST(req: Request) {
  try {
    const body = await req.text();
    const sig = req.headers.get("stripe-signature");

    if (!sig) {
      return NextResponse.json({ error: "Missing signature" }, { status: 400 });
    }

    let event: Stripe.Event;

    try {
      event = stripe.webhooks.constructEvent(
        body,
        sig,
        process.env.STRIPE_WEBHOOK_SECRET!
      );
    } catch (err) {
      console.log("Webhook signature error:", err);
      return NextResponse.json({ error: "Webhook error" }, { status: 400 });
    }

    // ✅ SUCCESS PAYMENT
    if (event.type === "checkout.session.completed") {
      const session = event.data.object as Stripe.Checkout.Session;

      const userId = session.metadata?.userId;
      const customerId = session.customer as string;

      if (!userId) {
        return NextResponse.json({ error: "Missing userId" }, { status: 400 });
      }

      const { error } = await supabase
        .from("profiles")
        .update({
          is_premium: true,
          stripe_customer_id: customerId,
        })
        .eq("id", userId);

      if (error) {
        console.log("Supabase error:", error);
        return NextResponse.json({ error: "DB update failed" }, { status: 500 });
      }

      console.log("Premium unlocked for:", userId);
    }

    return NextResponse.json({ received: true });
  } catch (err) {
    console.log("Server error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}