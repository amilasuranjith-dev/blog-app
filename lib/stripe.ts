import Stripe from "stripe";

if (!process.env.STRIPE_SECRET_KEY) {
  throw new Error("STRIPE_SECRET_KEY is missing in environment variables");
}

// Initialize the Stripe instance using the secret key
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  // Updated for Stripe SDK v22.2.0
  apiVersion: "2025-02-24.acacia" as any,
  appInfo: {
    name: "Next.js Blog Premium App",
    version: "0.1.0",
  },
});
