import { getCreditsPack, PackId } from "@/types/billing";
import prisma from "@/lib/prisma";
import { writeFile } from "fs";
import "server-only";
import Stripe from "stripe";

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

  const purchasedPack = getCreditsPack(packId as PackId);
  if (!purchasedPack) {
    throw new Error("Pack not found");
  }

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

  await prisma.userPurchase.create({
    data: {
      userId,
      stripeId: event.id,
      description: `${purchasedPack.name} - ${purchasedPack.credits} credits`,
      amount: event.amount_total!,
      currency: event.currency!,
    }
  });
}
