"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export async function SetupUser() {
  // authenticate
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // check user balance
  const balance = await prisma.userBalance.findUnique({ where: { userId } });
  // if no balance, provide 100 credits for new user
  if (!balance) {
    await prisma.userBalance.create({
      data: {
        userId,
        credits: 100
      }
    });
  }

  redirect("/");
}
