import { HandleCheckoutSessionCompleted } from "@/lib/stripe/HandleCheckoutSessionCompleted";
import { stripe } from "@/lib/stripe/stripe";
import { headers } from "next/headers";
import { NextResponse } from "next/server";

/**
 * POST handler for processing Stripe webhook events.
 *
 * This function receives a POST request from Stripe containing a webhook event.
 * It reads the raw request body and retrieves the Stripe signature from the headers.
 * The event is then constructed and verified using Stripe's webhook utilities.
 * Based on the event type, the corresponding handler function is invoked.
 *
 * @param {Request} request - The incoming request object containing the webhook payload.
 * @returns {Promise<NextResponse>} A response indicating whether the webhook was processed successfully.
 */
export async function POST(request: Request) {
  // Read the raw request body as text
  const body = await request.text();
  // Retrieve the Stripe signature from the request headers
  const signature = headers().get("stripe-signature") as string;

  try {
    // Construct and verify the event using the Stripe webhook secret
    const event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
    // Handle different event types
    switch (event.type) {
      case "checkout.session.completed":
        // Process the completed checkout session
        await HandleCheckoutSessionCompleted(event.data.object);
        break;
      default:
        // Ignore other events
        break;
    }

    // Return a 200 response indicating successful processing
    return new NextResponse(null, { status: 200 });
  } catch (error) {
    // Log the error and return a 400 response if verification or processing fails
    console.error("stripe webhook error", error);
    return new NextResponse(null, { status: 400 });
  }
}
