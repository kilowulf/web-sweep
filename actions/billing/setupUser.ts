"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

/**
 * This function is responsible for setting up a new user in the application.
 * It authenticates the user, checks their balance, and provides them with initial credits if necessary.
 *
 * @throws Will throw an error if the user is not authenticated.
 * @returns Redirects the user to the home page after completing the setup process.
 */
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

