/**
 * Live-region announcer for screen readers.
 *
 * Provides an `useAnnounce()` hook that pushes messages to a visually-hidden
 * `aria-live` region so assistive technology can read them. Messages are cleared
 * after 5 seconds to avoid stale content.
 */

"use client";

import { createContext, useCallback, useContext, useRef, useState, type ReactNode } from "react";

interface AnnouncerContextValue {
  announce: (message: string, priority?: "polite" | "assertive") => void;
}

const AnnouncerContext = createContext<AnnouncerContextValue | null>(null);

/**
 * Hook to announce messages to screen readers via a live region.
 * Must be used within an `<AnnouncerProvider>`.
 */
export function useAnnounce() {
  const ctx = useContext(AnnouncerContext);
  if (!ctx) throw new Error("useAnnounce must be used within AnnouncerProvider");
  return ctx.announce;
}

/**
 * Provider that renders two visually-hidden live regions (polite + assertive)
 * and exposes the `announce()` function through context.
 */
export function AnnouncerProvider({ children }: { children: ReactNode }) {
  const [politeMessage, setPoliteMessage] = useState("");
  const [assertiveMessage, setAssertiveMessage] = useState("");
  const politeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const assertiveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const announce = useCallback((message: string, priority: "polite" | "assertive" = "polite") => {
    if (priority === "assertive") {
      // Clear then re-set to ensure the screen reader picks up repeated messages
      setAssertiveMessage("");
      if (assertiveTimerRef.current) clearTimeout(assertiveTimerRef.current);
      requestAnimationFrame(() => {
        setAssertiveMessage(message);
        assertiveTimerRef.current = setTimeout(() => setAssertiveMessage(""), 5000);
      });
    } else {
      setPoliteMessage("");
      if (politeTimerRef.current) clearTimeout(politeTimerRef.current);
      requestAnimationFrame(() => {
        setPoliteMessage(message);
        politeTimerRef.current = setTimeout(() => setPoliteMessage(""), 5000);
      });
    }
  }, []);

  return (
    <AnnouncerContext.Provider value={{ announce }}>
      {children}
      {/* Visually-hidden live regions for screen reader announcements */}
      <div role="status" aria-live="polite" aria-atomic="true" className="sr-only">
        {politeMessage}
      </div>
      <div role="alert" aria-live="assertive" aria-atomic="true" className="sr-only">
        {assertiveMessage}
      </div>
    </AnnouncerContext.Provider>
  );
}
