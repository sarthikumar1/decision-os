/**
 * Main app page — Tab-based layout for Decision Builder, Results, and Sensitivity.
 * Includes keyboard shortcuts: 1/2/3 = switch tabs, ? = help.
 */

"use client";

import { useState, useEffect, useCallback, useSyncExternalStore } from "react";
import { DecisionProvider } from "@/components/DecisionProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Header } from "@/components/Header";
import { DecisionBuilder } from "@/components/DecisionBuilder";
import { ResultsView } from "@/components/ResultsView";
import { SensitivityView } from "@/components/SensitivityView";
import { Settings2, BarChart3, Activity, Keyboard, X } from "lucide-react";
import pkg from "../../package.json";

const emptySubscribe = () => () => {};
function useIsMounted() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );
}

type Tab = "builder" | "results" | "sensitivity";

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("builder");
  const [showShortcuts, setShowShortcuts] = useState(false);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    // Ignore when typing in inputs
    const tag = (e.target as HTMLElement)?.tagName;
    if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

    switch (e.key) {
      case "1":
        setActiveTab("builder");
        break;
      case "2":
        setActiveTab("results");
        break;
      case "3":
        setActiveTab("sensitivity");
        break;
      case "?":
        setShowShortcuts((prev) => !prev);
        break;
      case "Escape":
        setShowShortcuts(false);
        break;
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  const tabs: { id: Tab; label: string; icon: React.ReactNode }[] = [
    { id: "builder", label: "Builder", icon: <Settings2 className="h-4 w-4" /> },
    { id: "results", label: "Results", icon: <BarChart3 className="h-4 w-4" /> },
    {
      id: "sensitivity",
      label: "Sensitivity",
      icon: <Activity className="h-4 w-4" />,
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      <Header />

      <main id="main-content" className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <nav
          className="flex border-b border-gray-200 dark:border-gray-700 mb-6"
          role="tablist"
          aria-label="Decision sections"
        >
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}

          {/* Keyboard shortcut hint */}
          <button
            onClick={() => setShowShortcuts(true)}
            className="ml-auto text-xs text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors hidden sm:inline-flex items-center gap-1"
            aria-label="Show keyboard shortcuts"
          >
            <Keyboard className="h-3.5 w-3.5" />
            <kbd className="rounded border border-gray-300 dark:border-gray-600 px-1 py-0.5 text-[10px] font-mono">
              ?
            </kbd>
          </button>
        </nav>

        {/* Tab Panels */}
        <div
          id="panel-builder"
          role="tabpanel"
          aria-labelledby="tab-builder"
          className={activeTab === "builder" ? "" : "hidden"}
        >
          <DecisionBuilder />
        </div>
        <div
          id="panel-results"
          role="tabpanel"
          aria-labelledby="tab-results"
          className={activeTab === "results" ? "" : "hidden"}
        >
          <ResultsView />
        </div>
        <div
          id="panel-sensitivity"
          role="tabpanel"
          aria-labelledby="tab-sensitivity"
          className={activeTab === "sensitivity" ? "" : "hidden"}
        >
          <SensitivityView />
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mt-12 transition-colors">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500 dark:text-gray-400">
          Decision OS v{pkg.version} — Open source structured decision-making tool.{" "}
          <a
            href="https://github.com/ericsocrat/decision-os"
            className="text-blue-600 hover:underline dark:text-blue-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          | MIT License
        </div>
      </footer>

      {/* Keyboard Shortcuts Modal */}
      {showShortcuts && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
          onClick={() => setShowShortcuts(false)}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h2>
              <button
                onClick={() => setShowShortcuts(false)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                aria-label="Close shortcuts"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <dl className="space-y-2 text-sm">
              {[
                ["1", "Builder tab"],
                ["2", "Results tab"],
                ["3", "Sensitivity tab"],
                ["?", "Toggle this dialog"],
                ["Esc", "Close dialog"],
              ].map(([key, desc]) => (
                <div key={key} className="flex items-center justify-between">
                  <dt className="text-gray-600 dark:text-gray-300">{desc}</dt>
                  <dd>
                    <kbd className="rounded border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 px-2 py-0.5 text-xs font-mono text-gray-700 dark:text-gray-300">
                      {key}
                    </kbd>
                  </dd>
                </div>
              ))}
            </dl>
          </div>
        </div>
      )}
    </div>
  );
}

export default function Home() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center transition-colors">
        <div className="text-center">
          <div className="h-9 w-9 rounded-lg bg-blue-600 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-gray-500 dark:text-gray-400">Loading Decision OS...</p>
        </div>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <DecisionProvider>
        <AppContent />
      </DecisionProvider>
    </ErrorBoundary>
  );
}
