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
import {
  compressToEncodedURIComponent,
  decompressFromEncodedURIComponent,
} from "lz-string";

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
 * Compress decision state into a URL-safe string using lz-string.
 * Produces shorter URLs than raw base64 for typical decision payloads.
 */
export function encodeDecisionToUrl(decision: object): string {
  try {
    const json = JSON.stringify(decision);
    return compressToEncodedURIComponent(json);
  } catch {
    return "";
  }
}

/**
 * Decode a decision from an lz-string compressed URL component.
 * Falls back to legacy base64 decoding for backward compatibility.
 */
export function decodeDecisionFromUrl<T>(encoded: string, fallback: T): T {
  try {
    // Try lz-string first
    const json = decompressFromEncodedURIComponent(encoded);
    if (json) return JSON.parse(json) as T;
    // Fall back to legacy base64
    const legacyJson = decodeURIComponent(
      Array.from(atob(encoded))
        .map((c) => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
        .join("")
    );
    return JSON.parse(legacyJson) as T;
  } catch {
    return fallback;
  }
}
