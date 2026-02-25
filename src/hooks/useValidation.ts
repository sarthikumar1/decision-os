/**
 * useValidation hook — real-time validation feedback for Decision Builder UI.
 *
 * Wraps the existing `validateDecision()` logic and adds UI-specific checks
 * (duplicate names, zero-weight warnings, informational hints).
 *
 * Returns structured errors/warnings/infos keyed by field + entity ID
 * so components can display inline feedback without blocking save.
 *
 * @see https://github.com/ericsocrat/decision-os/issues/9
 */

import { useMemo } from "react";
import type { Decision } from "@/lib/types";

export type IssueSeverity = "error" | "warning" | "info";

export interface ValidationIssue {
  field: "title" | "option" | "criterion" | "score" | "weights";
  id?: string; // Option/criterion ID for inline targeting
  severity: IssueSeverity;
  message: string;
}

export interface ValidationResult {
  issues: ValidationIssue[];
  errors: ValidationIssue[];
  warnings: ValidationIssue[];
  infos: ValidationIssue[];
  errorCount: number;
  isValid: boolean; // true when zero blocking errors exist
  /** Map of entity id → issues for fast inline lookup */
  byId: Map<string, ValidationIssue[]>;
  /** Issues keyed by field name (e.g. "title", "weights") */
  byField: Map<string, ValidationIssue[]>;
}

/**
 * Compute all validation issues for a Decision.
 * Pure function — memoized by the hook below.
 */
function computeValidation(decision: Decision): ValidationResult {
  const issues: ValidationIssue[] = [];

  // ─── Title ────────────────────────────────────────────
  if (!decision.title.trim()) {
    issues.push({
      field: "title",
      severity: "error",
      message: "Decision title is required",
    });
  }

  // ─── Options ──────────────────────────────────────────
  if (decision.options.length < 2) {
    issues.push({
      field: "option",
      severity: "error",
      message: `Add at least 2 options (currently: ${decision.options.length})`,
    });
  }

  const optionNames = new Map<string, string>(); // lowercase name → first id
  for (const opt of decision.options) {
    // Empty name
    if (!opt.name.trim()) {
      issues.push({
        field: "option",
        id: opt.id,
        severity: "warning",
        message: "Option needs a name",
      });
    }

    // Duplicate names (case-insensitive, trimmed)
    const normalized = opt.name.trim().toLowerCase();
    if (normalized && optionNames.has(normalized)) {
      issues.push({
        field: "option",
        id: opt.id,
        severity: "warning",
        message: "Option name already exists",
      });
    } else if (normalized) {
      optionNames.set(normalized, opt.id);
    }
  }

  // ─── Criteria ─────────────────────────────────────────
  if (decision.criteria.length < 1) {
    issues.push({
      field: "criterion",
      severity: "error",
      message: "At least 1 criterion is required",
    });
  }

  const allWeightsZero =
    decision.criteria.length > 0 && decision.criteria.every((c) => c.weight === 0);

  if (allWeightsZero) {
    issues.push({
      field: "weights",
      severity: "error",
      message: "All criteria weights are zero — results cannot be calculated",
    });
  }

  for (const crit of decision.criteria) {
    if (!crit.name.trim()) {
      issues.push({
        field: "criterion",
        id: crit.id,
        severity: "warning",
        message: "Criterion needs a name",
      });
    }

    if (crit.weight === 0 && !allWeightsZero) {
      issues.push({
        field: "criterion",
        id: crit.id,
        severity: "info",
        message: "This criterion has zero weight and won't affect results",
      });
    }
  }

  // ─── Partition & index ────────────────────────────────
  const errors = issues.filter((i) => i.severity === "error");
  const warnings = issues.filter((i) => i.severity === "warning");
  const infos = issues.filter((i) => i.severity === "info");

  const byId = new Map<string, ValidationIssue[]>();
  const byField = new Map<string, ValidationIssue[]>();

  for (const issue of issues) {
    if (issue.id) {
      const arr = byId.get(issue.id) ?? [];
      arr.push(issue);
      byId.set(issue.id, arr);
    }
    const fArr = byField.get(issue.field) ?? [];
    fArr.push(issue);
    byField.set(issue.field, fArr);
  }

  return {
    issues,
    errors,
    warnings,
    infos,
    errorCount: errors.length,
    isValid: errors.length === 0,
    byId,
    byField,
  };
}

/**
 * React hook that memoizes validation for the current decision.
 * Re-computes only when the decision reference changes.
 */
export function useValidation(decision: Decision): ValidationResult {
  return useMemo(() => computeValidation(decision), [decision]);
}
