"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

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
