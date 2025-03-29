"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * Deletes a credential from the database based on the provided name.
 * The function requires authentication to ensure the user's credentials are securely accessed.
 *
 * @param name - The name of the credential to be deleted.
 *
 * @throws Will throw an error if the user is not authenticated.
 *
 * @returns {Promise<void>} - The function does not return any value.
 *
 * @example
 * ```typescript
 * try {
 *   await DeleteCredential("example-credential");
 * } catch (error) {
 *   console.error(error);
 * }
 * ```
 */
export async function DeleteCredential(name: string) {
  const { userId } = auth();
  if (!userId) {
    throw new Error("unauthenticated");
  }

  await prisma.credential.delete({
    where: {
      userId_name: {
        userId,
        name
      }
    }
  });

  revalidatePath("/credentials");
}

