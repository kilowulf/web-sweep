/**
 * Retrieves the available credits for the authenticated user.
 *
 * @remarks
 * This function is designed to be used as a server-side action in a Next.js application.
 * It retrieves the user's balance from the database and returns the available credits.
 * If the user is not authenticated, it throws an error.
 *
 * @returns The available credits for the authenticated user. If the user does not have a balance, it returns -1.
 *
 * @throws Will throw an error if the user is not authenticated.
 */
"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
export async function GetAvailableCredits() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  const balance = await prisma.userBalance.findUnique({
    where: { userId }
  });

  if (!balance) return -1;
  return balance.credits;
}

