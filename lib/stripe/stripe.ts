import Stripe from "stripe";

/**
 * Initializes a new instance of the Stripe client using the secret API key.
 *
 * The secret key is retrieved from the environment variable STRIPE_SECRET_KEY.
 * The Stripe API version is explicitly set to "2025-02-24.acacia", and TypeScript types
 * are enabled for enhanced type checking and intellisense.
 *
 * @constant {Stripe} stripe - An instance of the Stripe client.
 */
export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2025-02-24.acacia",
  typescript: true
});
