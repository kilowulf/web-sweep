/**
 * PackId enum
 *
 * Represents the available pack identifiers for credit packs.
 */
export enum PackId {
  SMALL = "SMALL",
  MEDIUM = "MEDIUM",
  LARGE = "LARGE"
}

/**
 * CreditsPack type.
 *
 * Defines the structure of a credit pack, including its id, name, label, credit amount, price (in cents),
 * and the associated Stripe price identifier.
 *
 * @property {PackId} id - Unique identifier of the pack.
 * @property {string} name - The name of the pack.
 * @property {string} label - A human-readable label for the pack.
 * @property {number} credits - The number of credits provided by the pack.
 * @property {number} price - The price in cents.
 * @property {string} priceId - The Stripe price identifier.
 */
export type CreditsPack = {
  id: PackId;
  name: string;
  label: string;
  credits: number;
  price: number;
  priceId: string;
};

/**
 * CreditsPack array.
 *
 * Defines the available credit packs. Each pack includes an id, name, label, credits,
 * price (in cents), and the corresponding Stripe price identifier retrieved from environment variables.
 */
export const CreditsPack: CreditsPack[] = [
  {
    id: PackId.SMALL,
    name: "Small Pack",
    label: "1,000 credits",
    credits: 1000,
    price: 999, // $9.99
    priceId: process.env.STRIPE_SMALL_PACK_PRICE_ID!
  },
  {
    id: PackId.MEDIUM,
    name: "Medium Pack",
    label: "5,000 credits",
    credits: 5000,
    price: 3999, // $39.99
    priceId: process.env.STRIPE_MEDIUM_PACK_PRICE_ID!
  },
  {
    id: PackId.LARGE,
    name: "Large Pack",
    label: "10,000 credits",
    credits: 10000,
    price: 6999, // $69.99
    priceId: process.env.STRIPE_LARGE_PACK_PRICE_ID!
  }
];

/**
 * Retrieves a credit pack based on its id.
 *
 * @param {PackId} id - The unique identifier of the pack.
 * @returns {CreditsPack | undefined} The matching credit pack, or undefined if not found.
 */
export const getCreditsPack = (id: PackId) =>
  CreditsPack.find((pack) => pack.id === id);
