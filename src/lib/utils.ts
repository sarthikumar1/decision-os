/**
 * Utility functions for Decision OS.
 */

/**
 * Generate a unique ID (simple, no external dependency).
 * Uses crypto.randomUUID when available, falls back to timestamp + random.
 */
export function generateId(): string {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

/**
 * Merge class names using clsx + tailwind-merge for dedup.
 */
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

/**
 * Safely parse JSON with a fallback value.
 */
export function safeJsonParse<T>(json: string, fallback: T): T {
  try {
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}

/**
 * Compress decision state into a URL-safe base64 string.
 */
export function encodeDecisionToUrl(decision: object): string {
  try {
    const json = JSON.stringify(decision);
    // Use btoa for base64 encoding (works in browser)
    const encoded = btoa(
      encodeURIComponent(json).replace(/%([0-9A-F]{2})/g, (_, p1) =>
        String.fromCharCode(parseInt(p1, 16))
      )
    );
    return encoded;
  } catch {
    return "";
  }
}

/**
 * Decode a decision from a URL-safe base64 string.
 */
export function decodeDecisionFromUrl<T>(encoded: string, fallback: T): T {
  try {
    const json = decodeURIComponent(
      Array.from(atob(encoded))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(json) as T;
  } catch {
    return fallback;
  }
}
