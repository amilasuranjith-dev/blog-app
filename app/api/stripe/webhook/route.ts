import { headers } from "next/headers";
import { NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { supabaseAdmin } from "@/lib/supabase/admin";
import Stripe from "stripe";

export async function POST(req: Request) {
  // 1. Read raw request body using req.text() instead of req.json()
  const body = await req.text();
  
  // 2. Get the Stripe signature header
  const headersList = await headers();
  const signature = headersList.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  let event: Stripe.Event;

  // 3. Verify webhook signature
  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (err: any) {
    console.error(`[WEBHOOK_ERROR] Signature verification failed: ${err.message}`);
    return NextResponse.json(
      { error: `Webhook Error: ${err.message}` },
      { status: 400 } // Returns 400 on signature verification failure
    );
  }

  // 4. Handle Stripe events
  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        
        const customerId = session.customer as string;
        const subscriptionId = session.subscription as string;
        const userId = session.client_reference_id; // Attached during checkout

        if (customerId && subscriptionId) {
          // Retrieve the subscription from Stripe to get current_period_end
          const subscription = await stripe.subscriptions.retrieve(subscriptionId);

          // Use the Supabase admin client to bypass RLS and update the subscriptions table
          const { error } = await supabaseAdmin
            .from("subscriptions")
            .update({
              stripe_subscription_id: subscriptionId,
              status: "active",
              current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
            })
            .eq("stripe_customer_id", customerId);
            
          if (error) {
            console.error("[WEBHOOK_DB_ERROR] Failed to update checkout completion:", error);
            throw error;
          }
        }
        break;
      }
      
      case "customer.subscription.updated": {
        const subscription = event.data.object as Stripe.Subscription;
        
        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: subscription.status === "active" ? "active" : "inactive",
            current_period_end: new Date(subscription.current_period_end * 1000).toISOString(),
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw error;
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;

        const { error } = await supabaseAdmin
          .from("subscriptions")
          .update({
            status: "cancelled", // Update status to cancelled
          })
          .eq("stripe_subscription_id", subscription.id);

        if (error) throw error;
        break;
      }

      default:
        console.log(`Unhandled Stripe event type: ${event.type}`);
    }

    // 5. Return Response with status 200 on success
    return new Response(null, { status: 200 });
  } catch (error) {
    console.error("[WEBHOOK_PROCESSING_ERROR]", error);
    return NextResponse.json(
      { error: "Webhook handler failed during database operation" },
      { status: 500 }
    );
  }
}
