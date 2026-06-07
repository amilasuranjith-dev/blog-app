import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { createServerSupabaseClient } from "@/lib/supabase/server";

export async function POST() {
  try {
    // 1. Verify user is authenticated via Supabase getUser()
    const supabase = await createServerSupabaseClient();
    const { data: { user } } = await supabase.auth.getUser();

    // 2. Return 401 if not authenticated
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // 3. Create or retrieve a Stripe customer for the user
    let { data: subscription } = await supabase
      .from("subscriptions")
      .select("stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    let customerId = subscription?.stripe_customer_id;

    if (!customerId) {
      // Create a new Stripe customer using stripe v22.2.0 API syntax
      const customer = await stripe.customers.create({
        email: user.email,
        metadata: {
          supabase_user_id: user.id,
        },
      });

      customerId = customer.id;

      // Store in subscriptions table
      if (subscription) {
        await supabase
          .from("subscriptions")
          .update({ stripe_customer_id: customerId })
          .eq("user_id", user.id);
      } else {
        await supabase.from("subscriptions").insert({
          user_id: user.id,
          stripe_customer_id: customerId,
        });
      }
    }

    // 4. Get the required environment variables
    let priceId = process.env.STRIPE_PRICE_ID || process.env.STRIPE_PREMIUM_PLAN_PRICE_ID;
    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    if (!priceId) {
      console.error("Missing STRIPE_PRICE_ID environment variable.");
      return NextResponse.json({ error: "Server Configuration Error" }, { status: 500 });
    }

    // If a Product ID was provided instead of a Price ID, fetch the associated Price dynamically
    if (priceId.startsWith("prod_")) {
      const prices = await stripe.prices.list({
        product: priceId,
        active: true,
        limit: 1,
      });

      if (prices.data.length === 0) {
        throw new Error(`No active price found for product: ${priceId}`);
      }
      
      // Override with the actual Price ID
      priceId = prices.data[0].id;
    }

    // 5. Create a Stripe Checkout Session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      mode: "subscription",
      payment_method_types: ["card"],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      // 6. Set success and cancel URLs
      success_url: `${siteUrl}/dashboard`,
      cancel_url: `${siteUrl}/subscribe`,
      // Attach the user ID as client_reference_id for webhook safety
      client_reference_id: user.id,
    });

    // 7. Return the checkout session URL
    return NextResponse.json({ url: checkoutSession.url });
  } catch (error: any) {
    console.error("[STRIPE_CHECKOUT_ERROR]", error);
    return NextResponse.json(
      { error: error?.message || "Internal Server Error" },
      { status: 500 }
    );
  }
}
