/**
 * Returns a promise that resolves after a specified number of milliseconds.
 *
 * This utility function can be used to introduce a delay in asynchronous operations.
 *
 * @param {number} ms - The number of milliseconds to wait.
 * @returns {Promise<void>} A promise that resolves after the specified delay.
 */
export function waitFor(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
