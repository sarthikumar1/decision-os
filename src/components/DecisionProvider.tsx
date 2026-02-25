/**
 * React hook + context for managing Decision OS state.
 *
 * Provides:
 * - Current decision state
 * - CRUD operations
 * - Computed results (memoized)
 * - Persistence to localStorage
 */

"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import type { Criterion, Decision, Option, ScoreMatrix } from "@/lib/types";
import { computeResults, sensitivityAnalysis } from "@/lib/scoring";
import {
  getDecisions,
  getDecision,
  saveDecision,
  deleteDecision,
  resetToDemo,
} from "@/lib/storage";
import { DEMO_DECISION } from "@/lib/demo-data";
import { generateId, decodeDecisionFromUrl } from "@/lib/utils";

interface DecisionContextValue {
  // State
  decision: Decision;
  decisions: Decision[];
  results: ReturnType<typeof computeResults>;
  sensitivity: ReturnType<typeof sensitivityAnalysis>;
  isDirty: boolean;

  // Decision CRUD
  setDecision: (d: Decision) => void;
  loadDecision: (id: string) => void;
  createNewDecision: () => void;
  removeDecision: (id: string) => void;
  resetDemo: () => void;

  // Field updates
  updateTitle: (title: string) => void;
  updateDescription: (desc: string) => void;

  // Options
  addOption: () => void;
  updateOption: (id: string, updates: Partial<Option>) => void;
  removeOption: (id: string) => void;

  // Criteria
  addCriterion: () => void;
  updateCriterion: (id: string, updates: Partial<Criterion>) => void;
  removeCriterion: (id: string) => void;

  // Scores
  updateScore: (optionId: string, criterionId: string, value: number) => void;

  // Sensitivity
  swingPercent: number;
  setSwingPercent: (v: number) => void;
}

const DecisionContext = createContext<DecisionContextValue | null>(null);

export function useDecision() {
  const ctx = useContext(DecisionContext);
  if (!ctx) throw new Error("useDecision must be used within DecisionProvider");
  return ctx;
}

export function DecisionProvider({ children }: { children: ReactNode }) {
  // Check URL hash for shared decision data
  const sharedDecision = (() => {
    if (typeof window === "undefined") return null;
    const hash = window.location.hash;
    if (!hash.startsWith("#data=")) return null;
    const encoded = hash.slice("#data=".length);
    if (!encoded) return null;
    const decoded = decodeDecisionFromUrl<Decision | null>(encoded, null);
    if (decoded && decoded.id && decoded.title && decoded.options && decoded.criteria) {
      saveDecision(decoded);
      // Clean the URL hash without triggering navigation
      window.history.replaceState(null, "", window.location.pathname);
      return decoded;
    }
    return null;
  })();

  // Initialize state from shared link or localStorage via lazy initializer
  const [decision, setDecisionState] = useState<Decision>(() => {
    if (sharedDecision) return sharedDecision;
    if (typeof window === "undefined") return DEMO_DECISION;
    const saved = getDecisions();
    return saved.length > 0 ? saved[0] : DEMO_DECISION;
  });
  const [decisions, setDecisions] = useState<Decision[]>(() => {
    if (typeof window === "undefined") return [DEMO_DECISION];
    return getDecisions();
  });
  const [isDirty, setIsDirty] = useState(false);
  const [swingPercent, setSwingPercent] = useState(20);
  const saveTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Auto-save on decision change (debounced)
  useEffect(() => {
    if (!isDirty) return;
    if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    saveTimerRef.current = setTimeout(() => {
      saveDecision(decision);
      setDecisions(getDecisions());
      setIsDirty(false);
    }, 300);
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
    };
  }, [decision, isDirty]);

  // Memoized results
  const results = useMemo(() => computeResults(decision), [decision]);
  const sensitivity = useMemo(
    () => sensitivityAnalysis(decision, swingPercent),
    [decision, swingPercent]
  );

  const setDecision = useCallback((d: Decision) => {
    setDecisionState(d);
    setIsDirty(true);
  }, []);

  const loadDecision = useCallback((id: string) => {
    const d = getDecision(id);
    if (d) {
      setDecisionState(d);
      setIsDirty(false);
    }
  }, []);

  const createNewDecision = useCallback(() => {
    const now = new Date().toISOString();
    const newDecision: Decision = {
      id: generateId(),
      title: "Untitled Decision",
      description: "",
      options: [
        { id: generateId(), name: "Option A" },
        { id: generateId(), name: "Option B" },
      ],
      criteria: [{ id: generateId(), name: "Criterion 1", weight: 50, type: "benefit" }],
      scores: {},
      createdAt: now,
      updatedAt: now,
    };
    saveDecision(newDecision);
    setDecisionState(newDecision);
    setDecisions(getDecisions());
    setIsDirty(false);
  }, []);

  const removeDecision = useCallback(
    (id: string) => {
      if (deleteDecision(id)) {
        const remaining = getDecisions();
        setDecisions(remaining);
        if (decision.id === id && remaining.length > 0) {
          setDecisionState(remaining[0]);
        }
      }
    },
    [decision.id]
  );

  const resetDemoFn = useCallback(() => {
    resetToDemo();
    const saved = getDecisions();
    setDecisions(saved);
    setDecisionState(saved[0]);
    setIsDirty(false);
  }, []);

  // Field updates
  const updateTitle = useCallback(
    (title: string) => setDecision({ ...decision, title }),
    [decision, setDecision]
  );

  const updateDescription = useCallback(
    (desc: string) => setDecision({ ...decision, description: desc }),
    [decision, setDecision]
  );

  // Options
  const addOption = useCallback(() => {
    const newOpt: Option = {
      id: generateId(),
      name: `Option ${decision.options.length + 1}`,
    };
    setDecision({ ...decision, options: [...decision.options, newOpt] });
  }, [decision, setDecision]);

  const updateOption = useCallback(
    (id: string, updates: Partial<Option>) => {
      setDecision({
        ...decision,
        options: decision.options.map((o) => (o.id === id ? { ...o, ...updates } : o)),
      });
    },
    [decision, setDecision]
  );

  const removeOption = useCallback(
    (id: string) => {
      const newScores = { ...decision.scores };
      delete newScores[id];
      setDecision({
        ...decision,
        options: decision.options.filter((o) => o.id !== id),
        scores: newScores,
      });
    },
    [decision, setDecision]
  );

  // Criteria
  const addCriterion = useCallback(() => {
    const newCrit: Criterion = {
      id: generateId(),
      name: `Criterion ${decision.criteria.length + 1}`,
      weight: 50,
      type: "benefit",
    };
    setDecision({ ...decision, criteria: [...decision.criteria, newCrit] });
  }, [decision, setDecision]);

  const updateCriterion = useCallback(
    (id: string, updates: Partial<Criterion>) => {
      setDecision({
        ...decision,
        criteria: decision.criteria.map((c) => (c.id === id ? { ...c, ...updates } : c)),
      });
    },
    [decision, setDecision]
  );

  const removeCriterion = useCallback(
    (id: string) => {
      const newScores: ScoreMatrix = {};
      for (const optId of Object.keys(decision.scores)) {
        const optScores = { ...decision.scores[optId] };
        delete optScores[id];
        newScores[optId] = optScores;
      }
      setDecision({
        ...decision,
        criteria: decision.criteria.filter((c) => c.id !== id),
        scores: newScores,
      });
    },
    [decision, setDecision]
  );

  // Scores
  const updateScore = useCallback(
    (optionId: string, criterionId: string, value: number) => {
      const newScores = { ...decision.scores };
      if (!newScores[optionId]) newScores[optionId] = {};
      newScores[optionId] = {
        ...newScores[optionId],
        [criterionId]: value,
      };
      setDecision({ ...decision, scores: newScores });
    },
    [decision, setDecision]
  );

  const value: DecisionContextValue = {
    decision,
    decisions,
    results,
    sensitivity,
    isDirty,
    setDecision,
    loadDecision,
    createNewDecision,
    removeDecision,
    resetDemo: resetDemoFn,
    updateTitle,
    updateDescription,
    addOption,
    updateOption,
    removeOption,
    addCriterion,
    updateCriterion,
    removeCriterion,
    updateScore,
    swingPercent,
    setSwingPercent,
  };

  return <DecisionContext.Provider value={value}>{children}</DecisionContext.Provider>;
}
