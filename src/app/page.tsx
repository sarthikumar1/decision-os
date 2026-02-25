/**
 * Main app page — Tab-based layout for Decision Builder, Results, and Sensitivity.
 */

"use client";

import { useState, useSyncExternalStore } from "react";
import { DecisionProvider } from "@/components/DecisionProvider";
import { Header } from "@/components/Header";
import { DecisionBuilder } from "@/components/DecisionBuilder";
import { ResultsView } from "@/components/ResultsView";
import { SensitivityView } from "@/components/SensitivityView";
import { Settings2, BarChart3, Activity } from "lucide-react";

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
    <div className="min-h-screen bg-gray-50">
      <Header />

      <main className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-6">
        {/* Tabs */}
        <nav className="flex border-b border-gray-200 mb-6" role="tablist" aria-label="Decision sections">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              role="tab"
              aria-selected={activeTab === tab.id}
              aria-controls={`panel-${tab.id}`}
              onClick={() => setActiveTab(tab.id)}
              className={`inline-flex items-center gap-2 px-4 py-3 text-sm font-medium border-b-2 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded-t-md ${
                activeTab === tab.id
                  ? "border-blue-600 text-blue-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              {tab.icon}
              {tab.label}
            </button>
          ))}
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
      <footer className="border-t border-gray-200 bg-white mt-12">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 py-4 text-center text-xs text-gray-500">
          Decision OS v0.1.0 — Open source structured decision-making tool.{" "}
          <a
            href="https://github.com/ericsocrat/decision-os"
            className="text-blue-600 hover:underline"
            target="_blank"
            rel="noopener noreferrer"
          >
            GitHub
          </a>{" "}
          | MIT License
        </div>
      </footer>
    </div>
  );
}

export default function Home() {
  const mounted = useIsMounted();

  if (!mounted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="h-9 w-9 rounded-lg bg-blue-600 mx-auto mb-3 animate-pulse" />
          <p className="text-sm text-gray-500">Loading Decision OS...</p>
        </div>
      </div>
    );
  }

  return (
    <DecisionProvider>
      <AppContent />
    </DecisionProvider>
  );
}
