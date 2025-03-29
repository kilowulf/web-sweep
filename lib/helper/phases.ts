import { ExecutionPhase } from "@prisma/client";

/**
 * Phase type representing only the credits consumed by an execution phase.
 *
 * @typedef {Pick<ExecutionPhase, "creditsConsumed">} Phase
 */
type Phase = Pick<ExecutionPhase, "creditsConsumed">;

/**
 * Calculates the total cost (credits consumed) for an array of execution phases.
 *
 * Iterates through the array of phases and sums up the credits consumed.
 * If a phase does not have a defined creditsConsumed value, it is treated as 0.
 *
 * @param {Phase[]} phases - An array of execution phases.
 * @returns {number} The total credits consumed across all phases.
 */
export function GetPhasesTotalCost(phases: Phase[]) {
  return phases.reduce((acc, phase) => acc + (phase.creditsConsumed || 0), 0);
}
