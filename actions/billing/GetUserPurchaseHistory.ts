"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves the purchase history of the authenticated user.
 *
 * @remarks
 * This function is designed to be used as a server-side action in a Next.js application.
 * It retrieves the purchase history of the currently authenticated user from the database.
 *
 * @returns {Promise<UserPurchase[]>} A promise that resolves to an array of {@link UserPurchase} objects representing the user's purchase history.
 *
 * @throws {Error} If the user is not authenticated, an error with the message "User not found" is thrown.
 *
 * @example
 * ```typescript
 * import { GetUserPurchaseHistory } from "@/actions/billing/GetUserPurchaseHistory";
 *
 * const purchaseHistory = await GetUserPurchaseHistory();
 * console.log(purchaseHistory);
 * ```
 */
export async function GetUserPurchaseHistory() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not found");
  }
  return prisma.userPurchase.findMany({
    where: { userId },
    orderBy: {
      date: "desc"
    }
  });
}

