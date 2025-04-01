/**
 * Constructs a full application URL by appending the given path to the base URL.
 *
 * The base URL is read from the NEXT_PUBLIC_APP_URL environment variable.
 *
 * @param {string} path - The relative path to append to the base URL.
 * @returns {string} The full URL constructed from the base URL and the provided path.
 */

// old version
// export function getAppUrl(path: string) {
//   const appUrl = process.env.NEXT_PUBLIC_APP_URL;
//   return `${appUrl}/${path}`;
// }

export function getAppUrl(path: string) {
  const appUrl = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
  return `${appUrl}/${path}`.replace(/([^:]\/)\/+/g, "$1");
}
