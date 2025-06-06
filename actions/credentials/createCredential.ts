"use server";

import { symmetricEncrypt } from "@/lib/encryption";
import prisma from "@/lib/prisma";
import {
  createCredentialSchema,
  createCredentialSchemaType
} from "@/schema/credential";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

/**
 * This function is responsible for creating a new credential in the database.
 * It takes a form object as input, validates it, encrypts the value, and saves it to the database.
 *
 * @param form - The form object containing the credential data.
 * @throws Will throw an error if the form data is invalid or the user is not authenticated.
 * @returns Nothing.
 */
export async function CreateCredential(form: createCredentialSchemaType) {
  const { success, data } = createCredentialSchema.safeParse(form);
  if (!success) {
    throw new Error("Invalid form data");
  }

  const { userId } = auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }

  // Encrypt value
  const encryptedValue = symmetricEncrypt(data.value);
  //   console.log("@@TEST ENCRYPTION", {
  //     plain: data.value,
  //     value: encryptedValue
  //   });
  const result = await prisma.credential.create({
    data: {
      userId,
      name: data.name,
      value: encryptedValue
    }
  });

  if (!result) {
    throw new Error("Failed to create credential");
  }

  revalidatePath("/credentials");
}

