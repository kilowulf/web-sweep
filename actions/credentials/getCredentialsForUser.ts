"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

/**
 * Retrieves a list of credentials associated with the authenticated user.
 *
 * @remarks
 * This function is designed to be used as a server-side action in a Next.js application.
 * It retrieves the user's ID from the Clerk authentication context and fetches the corresponding
 * credentials from the database using Prisma. The credentials are sorted in ascending order by name.
 *
 * @throws {Error} If the user is not authenticated.
 *
 * @returns {Promise<import("@prisma/client").Credential[]>} A promise that resolves to an array of credentials.
 */
export async function GetCredentialsForUser() {
  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  return await prisma.credential.findMany({
    where: { userId },
    orderBy: {
      name: "asc"
    }
  });
}

