import { PrismaClient } from "@prisma/client";

/**
 * Creates a new instance of PrismaClient.
 *
 * This function is used to initialize a new PrismaClient instance.
 *
 * @returns {PrismaClient} A new instance of PrismaClient.
 */
const prismaClientSingleton = () => {
  return new PrismaClient();
};

// Extend the global scope to hold our PrismaClient singleton.
// This ensures that we reuse the same instance across module reloads in development.
declare const globalThis: {
  prismaGlobal: ReturnType<typeof prismaClientSingleton>;
} & typeof global;

// Use the existing global Prisma instance if available; otherwise, create a new one.
const prisma = globalThis.prismaGlobal ?? prismaClientSingleton();

export default prisma;

// In development mode, assign the Prisma instance to a global variable so that
// hot reloading doesn't create multiple instances of PrismaClient.
if (process.env.NODE_ENV !== "production") globalThis.prismaGlobal = prisma;
