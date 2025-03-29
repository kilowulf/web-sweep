import { getCreditsPack, PackId } from "@/types/billing";
import prisma from "@/lib/prisma";
import { writeFile } from "fs";
import "server-only";
import Stripe from "stripe";

/**
 * HandleCheckoutSessionCompleted
 *
 * Handles the completion of a Stripe checkout session by processing the metadata to update
 * the user's balance and record the purchase in the database.
 *
 * Steps:
 * 1. Verify that metadata is provided in the event.
 * 2. Extract the userId and packId from the event metadata.
 * 3. Validate that both userId and packId are present.
 * 4. Retrieve the purchased credits pack details using the packId.
 * 5. Update or create the user's balance in the database, incrementing by the credits amount.
 * 6. Record the purchase details in the userPurchase table.
 *
 * @param {Stripe.Checkout.Session} event - The Stripe checkout session event.
 * @throws {Error} If metadata, userId, packId, or the pack is not provided/found.
 */
export async function HandleCheckoutSessionCompleted(
  event: Stripe.Checkout.Session
) {
  if (!event.metadata) {
    throw new Error("Metadata not provided");
  }

  const { userId, packId } = event.metadata;

  if (!userId) {
    throw new Error("User ID not provided");
  }

  if (!packId) {
    throw new Error("Pack ID not provided");
  }

  // Retrieve the purchased credits pack details using the provided packId.
  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Pack not found");
  }

  console.log("@@StripeSessionSuccess: ", event.metadata);
  // Upsert the user's balance by adding the purchased credits.
  await prisma.userBalance.upsert({
    where: {
      userId
    },
    create: {
      userId,
      credits: purchasedPack.credits
    },
    update: {
      credits: {
        increment: purchasedPack.credits
      }
    }
  });

  console.log("@@Purchase success: ", purchasedPack);
  // Create a record for the user purchase with details from the Stripe event.
  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!
    }
  });
}
