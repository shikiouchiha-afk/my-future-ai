import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { getBearerToken, getServerSupabaseClient } from "@/lib/supabaseServer";

function resolveTrustedOrigin(req: Request) {
  const configuredUrl = process.env.NEXT_PUBLIC_URL;
  const headerOrigin = req.headers.get("origin");

  if (configuredUrl) {
    try {
      const configuredOrigin = new URL(configuredUrl).origin;

      if (!headerOrigin) {
        return configuredOrigin;
      }

      try {
        const incomingOrigin = new URL(headerOrigin).origin;
        return incomingOrigin === configuredOrigin ? incomingOrigin : configuredOrigin;
      } catch {
        return configuredOrigin;
      }
    } catch {
      // Fall through to safer local defaults if NEXT_PUBLIC_URL is invalid.
    }
  }

  if (headerOrigin) {
    try {
      return new URL(headerOrigin).origin;
    } catch {
      return "http://localhost:3000";
    }
  }

  return "http://localhost:3000";
}

export async function POST(req: Request) {
  try {
    const token = getBearerToken(req);
    if (!token) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const supabase = getServerSupabaseClient();
    if (!supabase) {
      return NextResponse.json({ error: "Server is not configured" }, { status: 500 });
    }

    const { data: authData, error: authError } = await supabase.auth.getUser(token);
    if (authError || !authData?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const userId = authData.user.id;

    const origin = resolveTrustedOrigin(req);

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ["card"],
      mode: "subscription",

      line_items: [
        {
          price_data: {
            currency: "usd",
            product_data: {
              name: "My Future Premium",
              description:
                "Premium coaching, memory, analytics, and full AI coach access",
            },
            unit_amount: 1199, // 💰 $11.99
          },
          quantity: 1,
        },
      ],

      success_url: `${origin}/success?session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${origin}/pricing`,

      metadata: {
        userId,
      },

      allow_promotion_codes: true,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    console.error("Stripe checkout error:", err);
    return NextResponse.json({ error: "Checkout failed" }, { status: 500 });
  }
}