"use server";

import prisma from "@/lib/prisma";
import { stripe } from "@/lib/stripe/stripe";
import { auth } from "@clerk/nextjs/server";

/**
 * This function retrieves and returns the hosted invoice URL for a specific user purchase.
 * It first authenticates the user, then fetches the purchase details from the database.
 * After that, it retrieves the corresponding Stripe checkout session and invoice.
 * If any of these steps fail, an error is thrown.
 *
 * @param id - The unique identifier of the user purchase.
 * @returns The hosted invoice URL for the specified purchase.
 * @throws Error - If the user is not authenticated, the purchase is not found, or the invoice is not found.
 */
export async function DownloadInvoice(id: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const purchase = await prisma.userPurchase.findUnique({
    where: {
      id,
      userId
    }
  });

  if (!purchase) {
    throw new Error("Purchase not found");
  }

  const session = await stripe.checkout.sessions.retrieve(purchase.stripeId);
  if (!session.invoice) {
    throw new Error("Invoice not found");
  }

  const invoice = await stripe.invoices.retrieve(session.invoice as string);
  return invoice.hosted_invoice_url;
}

