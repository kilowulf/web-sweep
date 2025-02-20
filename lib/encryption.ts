import crypto from "crypto";
// ensure code is ran on server side only
import "server-only";

const ALG = "aes-256-cbc"; // encryption standard: 32 bytes key length

// generate random  encrypted value in terminal: openssl rand -hex 32

export const symmetricEncrypt = (data: string) => {
  const key = process.env.ENCRYPTION_KEY; // replace with your encryption key
  if (!key) throw new Error("Encryption key not provided");

  /** initialization vector: is a value used to randomize the encryption process to ensure
   that repeated encryptions of the same data  yield different cipher text.    
   **/
  const initializationVector = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(
    ALG,
    Buffer.from(key, "hex"),
    initializationVector
  );
  let encrypted = cipher.update(data);
  encrypted = Buffer.concat([encrypted, cipher.final()]);

  return initializationVector.toString("hex") + ":" + encrypted.toString("hex");
};

export const symmetricDecrypt = (encrypted: string) => {
  const key = process.env.ENCRYPTION_KEY; // replace with your encryption key
  if (!key) throw new Error("Encryption key not provided");

  const textParts = encrypted.split(":");
  const initializationVector = Buffer.from(textParts.shift() as string, "hex");
  const encryptedText = Buffer.from(textParts.join(":"), "hex");
  const decipher = crypto.createDecipheriv(
    ALG,
    Buffer.from(key, "hex"),
    initializationVector
  );
  let decrypted = decipher.update(encryptedText);
  decrypted = Buffer.concat([decrypted, decipher.final()]);

  return decrypted.toString();
};
