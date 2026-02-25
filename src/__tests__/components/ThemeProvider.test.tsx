/**
 * Tests for ThemeProvider context.
 */

import { describe, it, expect, beforeEach } from "vitest";
import { renderHook, act } from "@testing-library/react";
import type { ReactNode } from "react";
import { ThemeProvider, useTheme } from "@/components/ThemeProvider";

const STORAGE_KEY = "decision-os:theme";

function wrapper({ children }: { children: ReactNode }) {
  return <ThemeProvider>{children}</ThemeProvider>;
}

beforeEach(() => {
  localStorage.clear();
  document.documentElement.classList.remove("dark");
});

describe("ThemeProvider", () => {
  it("provides a theme string", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    expect(["light", "dark"]).toContain(result.current.theme);
  });

  it("toggleTheme switches between light and dark", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    const initial = result.current.theme;
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(initial === "light" ? "dark" : "light");
    act(() => result.current.toggleTheme());
    expect(result.current.theme).toBe(initial);
  });

  it("setTheme sets a specific theme", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(result.current.theme).toBe("dark");
    act(() => result.current.setTheme("light"));
    expect(result.current.theme).toBe("light");
  });

  it("applies .dark class to documentElement", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(document.documentElement.classList.contains("dark")).toBe(true);
    act(() => result.current.setTheme("light"));
    expect(document.documentElement.classList.contains("dark")).toBe(false);
  });

  it("persists theme to localStorage", () => {
    const { result } = renderHook(() => useTheme(), { wrapper });
    act(() => result.current.setTheme("dark"));
    expect(localStorage.getItem(STORAGE_KEY)).toBe("dark");
  });
});
