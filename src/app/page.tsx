/**
 * Main app page — Tab-based layout for Decision Builder, Results, and Sensitivity.
 * Includes keyboard shortcuts: 1/2/3 = switch tabs, ? = help.
 */

"use client";

import { useState, useEffect, useCallback, useRef, useSyncExternalStore } from "react";
import { AnnouncerProvider, useAnnounce } from "@/components/Announcer";
import { DecisionProvider, useDecision } from "@/components/DecisionProvider";
import { ErrorBoundary } from "@/components/ErrorBoundary";
import { Header } from "@/components/Header";
import { DecisionBuilder } from "@/components/DecisionBuilder";
import { ResultsView } from "@/components/ResultsView";
import { SensitivityView } from "@/components/SensitivityView";
import { DecisionSkeleton } from "@/components/DecisionSkeleton";
import { useValidation } from "@/hooks/useValidation";
import { Settings2, BarChart3, Activity, Keyboard, X } from "lucide-react";
import { ToastProvider } from "@/components/Toast";
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

const tabLabels: Record<Tab, string> = {
  builder: "Builder",
  results: "Results",
  sensitivity: "Sensitivity",
};

const TAB_IDS: Tab[] = ["builder", "results", "sensitivity"];

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>("builder");
  const [showShortcuts, setShowShortcuts] = useState(false);
  const shortcutTriggerRef = useRef<HTMLButtonElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const announce = useAnnounce();
  const { decision, isLoading, undo, redo, canUndo, canRedo } = useDecision();
  const validation = useValidation(decision);

  // Focus the active tab button after tab change via arrow keys
  const activateTab = useCallback(
    (tab: Tab) => {
      setActiveTab(tab);
      announce(`${tabLabels[tab]} tab`);
      document.getElementById(`tab-${tab}`)?.focus();
    },
    [announce]
  );

  // Arrow key navigation within the tablist (WAI-ARIA Tabs Pattern)
  const handleTabKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      const idx = TAB_IDS.indexOf(activeTab);
      switch (e.key) {
        case "ArrowRight":
          e.preventDefault();
          activateTab(TAB_IDS[(idx + 1) % TAB_IDS.length]);
          break;
        case "ArrowLeft":
          e.preventDefault();
          activateTab(TAB_IDS[(idx + TAB_IDS.length - 1) % TAB_IDS.length]);
          break;
        case "Home":
          e.preventDefault();
          activateTab(TAB_IDS[0]);
          break;
        case "End":
          e.preventDefault();
          activateTab(TAB_IDS[TAB_IDS.length - 1]);
          break;
      }
    },
    [activeTab, activateTab]
  );

  // Restore focus to trigger element when modal closes
  const closeModal = useCallback(() => {
    setShowShortcuts(false);
    shortcutTriggerRef.current?.focus();
  }, []);

  // Global keyboard shortcuts (1/2/3/?/Ctrl+Z/Ctrl+Shift+Z)
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      // Undo/Redo — works even in inputs (Ctrl/Cmd + Z/Shift+Z/Y)
      const mod = e.ctrlKey || e.metaKey;
      if (mod && e.key === "z" && !e.shiftKey) {
        e.preventDefault();
        undo();
        return;
      }
      if (mod && ((e.key === "z" && e.shiftKey) || e.key === "y")) {
        e.preventDefault();
        redo();
        return;
      }

      // Ignore remaining shortcuts when typing in inputs
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA" || tag === "SELECT") return;

      switch (e.key) {
        case "1":
          setActiveTab("builder");
          announce("Builder tab");
          break;
        case "2":
          setActiveTab("results");
          announce("Results tab");
          break;
        case "3":
          setActiveTab("sensitivity");
          announce("Sensitivity tab");
          break;
        case "?":
          setShowShortcuts((prev) => !prev);
          break;
        case "Escape":
          closeModal();
          break;
      }
    },
    [closeModal, announce, undo, redo]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  // Modal focus trap: move focus into modal on open, trap Tab, restore on close
  useEffect(() => {
    if (!showShortcuts) return;

    // Focus the close button inside the modal
    const modal = modalRef.current;
    if (!modal) return;
    const closeBtn = modal.querySelector<HTMLElement>("[data-modal-close]");
    closeBtn?.focus();

    const handleTrap = (e: KeyboardEvent) => {
      if (e.key !== "Tab") return;
      const focusable = modal.querySelectorAll<HTMLElement>(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
      );
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", handleTrap);
    return () => document.removeEventListener("keydown", handleTrap);
  }, [showShortcuts]);

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
              id={`tab-${tab.id}`}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              tabIndex={activeTab === tab.id ? 0 : -1}
              onClick={() => setActiveTab(tab.id)}
              onKeyDown={handleTabKeyDown}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-200"
              }`}
            >
              {tab.icon}
              {tab.label}
              {tab.id === "builder" && validation.errorCount > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white px-1">
                  {validation.errorCount}
                </span>
              )}
            </button>
          ))}

          {/* Keyboard shortcut hint */}
          <button
            ref={shortcutTriggerRef}
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
          {isLoading ? <DecisionSkeleton /> : <DecisionBuilder validation={validation} />}
        </div>
        <div
          id="panel-results"
          role="tabpanel"
          aria-labelledby="tab-results"
          className={activeTab === "results" ? "" : "hidden"}
        >
          <ResultsView validation={validation} onSwitchToBuilder={() => setActiveTab("builder")} />
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
          onClick={closeModal}
          role="dialog"
          aria-modal="true"
          aria-label="Keyboard shortcuts"
        >
          <div
            ref={modalRef}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 p-6 max-w-sm w-full mx-4"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                <Keyboard className="h-5 w-5" />
                Keyboard Shortcuts
              </h2>
              <button
                data-modal-close
                onClick={closeModal}
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
                ["←/→", "Navigate tabs"],
                ["Home/End", "First/last tab"],
                ["Ctrl+Z", "Undo"],
                ["Ctrl+Shift+Z", "Redo"],
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
      <AnnouncerProvider>
        <DecisionProvider>
          <ToastProvider>
            <AppContent />
          </ToastProvider>
        </DecisionProvider>
      </AnnouncerProvider>
    </ErrorBoundary>
  );
}
