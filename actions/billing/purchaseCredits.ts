"use server";

import { getAppUrl } from "@/lib/helper/appUrl";
import { stripe } from "@/lib/stripe/stripe";
import { getCreditsPack, PackId } from "@/types/billing";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

// timestamp: 14:23:11
export async function PurchaseCredits(packId: PackId) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  const selectedPack = getCreditsPack(packId);
  if (!selectedPack) {
    throw new Error("Invalid pack selected");
  }
  const priceId = selectedPack?.priceId;
  const session = await stripe.checkout.sessions.create({
    mode: "payment",
    invoice_creation: {
      enabled: true
    },
    success_url: getAppUrl("billing"),
    cancel_url: getAppUrl("billing"),
    metadata: {
      userId,
      packId
    },
    line_items: [
      {
        price: selectedPack.priceId,
        quantity: 1
      }
    ]
  });
  if (!session.url) {
    throw new Error("Failed to create checkout session");
  }

  redirect(session.url);
}
