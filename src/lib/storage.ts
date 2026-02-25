/**
 * LocalStorage persistence layer for Decision OS.
 *
 * All decisions are stored in localStorage under a single key
 * as a JSON array. This keeps the MVP simple with no backend.
 */

import type { Decision } from "./types";
import { DEMO_DECISION } from "./demo-data";
import { safeJsonParse } from "./utils";

const STORAGE_KEY = "decision-os:decisions";

/**
 * Get all saved decisions from localStorage.
 * Returns the demo decision if no decisions exist.
 */
export function getDecisions(): Decision[] {
  if (typeof window === "undefined") return [DEMO_DECISION];

  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    // Initialize with demo
    const initial = [DEMO_DECISION];
    localStorage.setItem(STORAGE_KEY, JSON.stringify(initial));
    return initial;
  }

  const decisions = safeJsonParse<Decision[]>(raw, [DEMO_DECISION]);
  return decisions.length === 0 ? [DEMO_DECISION] : decisions;
}

/**
 * Get a single decision by ID.
 */
export function getDecision(id: string): Decision | undefined {
  return getDecisions().find((d) => d.id === id);
}

/**
 * Save a decision (create or update).
 */
export function saveDecision(decision: Decision): void {
  if (typeof window === "undefined") return;

  const decisions = getDecisions();
  const index = decisions.findIndex((d) => d.id === decision.id);

  const updated = {
    ...decision,
    updatedAt: new Date().toISOString(),
  };

  if (index >= 0) {
    decisions[index] = updated;
  } else {
    decisions.push(updated);
  }

  localStorage.setItem(STORAGE_KEY, JSON.stringify(decisions));
}

/**
 * Delete a decision by ID.
 * Will not delete the last remaining decision.
 */
export function deleteDecision(id: string): boolean {
  if (typeof window === "undefined") return false;

  const decisions = getDecisions();
  if (decisions.length <= 1) return false;

  const filtered = decisions.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(filtered));
  return true;
}

/**
 * Reset all decisions back to demo data only.
 */
export function resetToDemo(): void {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify([DEMO_DECISION]));
}
