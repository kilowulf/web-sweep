import crypto from "crypto";
// ensure code is ran on server side only
import "server-only";

const ALG = "aes-256-cbc"; // Encryption standard with a 32-byte key

/**
 * symmetricEncrypt
 *
 * Encrypts the given data string using symmetric encryption (AES-256-CBC).
 * The function generates a random initialization vector (IV) to ensure that
 * repeated encryptions of the same data produce different ciphertexts.
 * The resulting output is a string combining the IV and the encrypted data,
 * separated by a colon.
 *
 * @param {string} data - The plain text data to encrypt.
 * @returns {string} The encrypted data in the format "iv:encryptedData", both in hex format.
 * @throws {Error} If the encryption key is not provided in the environment variables.
 */
export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY; // Encryption key in hex format
  if (!key) throw new Error("Encryption key not provided");

  // Generate a random initialization vector (IV) of 16 bytes.
  const initializationVector = crypto.randomBytes(16);

  // Create a cipher instance using AES-256-CBC with the provided key and IV.
  const cipher = crypto.createCipheriv(
    ALG,
    Buffer.from(key, "hex"),
    initializationVector
  );

  // Encrypt the data.
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  // Return the IV and encrypted data as a single string, separated by a colon.
  return initializationVector.toString("hex") + ":" + encrypted.toString("hex");
};

/**
 * symmetricDecrypt
 *
 * Decrypts data that was encrypted with symmetricEncrypt using AES-256-CBC.
 * The function expects the input to be in the format "iv:encryptedData", where
 * both the IV and the encrypted data are in hexadecimal format.
 *
 * @param {string} encrypted - The encrypted data string in the format "iv:encryptedData".
 * @returns {string} The decrypted plain text.
 * @throws {Error} If the encryption key is not provided in the environment variables.
 */
export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY; // Encryption key in hex format
  if (!key) throw new Error("Encryption key not provided");

  // Split the encrypted string into the initialization vector and the ciphertext.
  const textParts = encrypted.split(":");
  const initializationVector = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");

  // Create a decipher instance using AES-256-CBC with the provided key and IV.
  const decipher = crypto.createDecipheriv(
    ALG,
    Buffer.from(key, "hex"),
    initializationVector
  );

  // Decrypt the ciphertext.
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  // Return the decrypted data as a string.
  return decrypted.toString();
};
