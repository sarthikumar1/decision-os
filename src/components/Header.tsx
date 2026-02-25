/**
 * Header component with app branding and decision selector.
 */

"use client";

import { useDecision } from "./DecisionProvider";
import { Plus, RotateCcw, Trash2 } from "lucide-react";

export function Header() {
  const {
    decision,
    decisions,
    loadDecision,
    createNewDecision,
    removeDecision,
    resetDemo,
  } = useDecision();

  return (
    <header className="border-b border-gray-200 bg-white" role="banner">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-blue-600 text-white font-bold text-sm">
              D
            </div>
            <div>
              <h1 className="text-lg font-semibold text-gray-900">
                Decision OS
              </h1>
              <p className="text-xs text-gray-500">
                Structured decision-making
              </p>
            </div>
          </div>

          {/* Decision selector + actions */}
          <div className="flex items-center gap-2">
            <select
              value={decision.id}
              onChange={(e) => loadDecision(e.target.value)}
              className="rounded-md border border-gray-300 bg-white px-3 py-1.5 text-sm text-gray-700 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
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
                onClick={() => removeDecision(decision.id)}
                className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                aria-label="Delete current decision"
              >
                <Trash2 className="h-4 w-4" />
              </button>
            )}

            <button
              onClick={resetDemo}
              className="inline-flex items-center gap-1 rounded-md border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              aria-label="Reset to demo data"
              title="Reset to demo"
            >
              <RotateCcw className="h-4 w-4" />
              <span className="hidden sm:inline">Reset Demo</span>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
