/**
 * Header component with app branding, decision selector, and dark mode toggle.
 */

"use client";

import { useDecision } from "./DecisionProvider";
import { useTheme } from "./ThemeProvider";
import { Plus, RotateCcw, Trash2, Sun, Moon } from "lucide-react";
import Image from "next/image";

export function Header() {
  const { decision, decisions, loadDecision, createNewDecision, removeDecision, resetDemo } =
    useDecision();
  const { theme, toggleTheme } = useTheme();

  return (
    <header
      className="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 transition-colors"
      role="banner"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <Image
              src="/logo.svg"
              alt="Decision OS logo"
              width={36}
              height={36}
              className="rounded-lg"
              priority
            />
            <div>
              <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
                Decision OS
              </h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Structured decision-making</p>
            </div>
          </div>

          {/* Decision selector + actions */}
          <div className="flex items-center gap-2">
            <select
              value={decision.id}
              onChange={(e) => loadDecision(e.target.value)}
              className="rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 px-3 py-1.5 text-sm text-gray-700 dark:text-gray-200 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
              aria-label="Select decision"
            >
              {decisions.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.title}
                </option>
              ))}
            </select>

            <button
              onClick={createNewDecision}
              className="inline-flex items-center gap-1 rounded-md bg-blue-600 px-3 py-1.5 text-sm font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Create new decision"
            >
              <Plus className="h-4 w-4" />
              <span className="hidden sm:inline">New</span>
            </button>

            {decisions.length > 1 && (
              <button
                onClick={() => {
                  if (window.confirm(`Delete "${decision.title}"? This cannot be undone.`)) {
                    removeDecision(decision.id);
                  }
                }}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
                aria-label="Delete current decision"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={() => {
                if (
                  window.confirm(
                    "Reset all decisions to demo data? This will remove all custom decisions."
                  )
                ) {
                  resetDemo();
                }
              }}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label="Reset to demo data"
              title="Reset to demo"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>

            <button
              onClick={toggleTheme}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors dark:border-gray-600 dark:text-gray-300 dark:hover:bg-gray-700"
              aria-label={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
              title={`Switch to ${theme === "dark" ? "light" : "dark"} mode`}
            >
              {theme === "dark" ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
