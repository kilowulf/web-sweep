import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

/**
 * cn
 *
 * Utility function for merging and combining CSS class names.
 * It uses `clsx` to conditionally join class names and `twMerge` to intelligently merge Tailwind CSS classes.
 *
 * @param {...ClassValue[]} inputs - A list of class names, arrays, or objects that define CSS classes.
 * @returns {string} The merged class string.
 */
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
