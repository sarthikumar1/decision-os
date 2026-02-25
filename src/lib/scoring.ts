/**
 * Decision OS — Deterministic Scoring Engine
 *
 * Implements the weighted-sum scoring model:
 *   1. Normalize criterion weights so they sum to 1.0
 *   2. For each option, compute: Σ(normalizedWeight_i × effectiveScore_i)
 *      - benefit criterion: effectiveScore = rawScore
 *      - cost criterion:    effectiveScore = 10 - rawScore
 *   3. Rank options by totalScore descending; ties broken by insertion order.
 *   4. Display scores rounded to 2 decimal places.
 *
 * See docs/SCORING_MODEL.md for full specification and examples.
 */

import type {
  Criterion,
  CriterionScore,
  Decision,
  DecisionResults,
  OptionResult,
  ScoreMatrix,
  SensitivityAnalysis,
  SensitivityPoint,
  TopDriver,
} from "./types";

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Maximum raw score a user can assign */
export const MAX_SCORE = 10;

/** Decimal places for displayed scores */
export const DISPLAY_PRECISION = 2;

// ---------------------------------------------------------------------------
// Weight normalization
// ---------------------------------------------------------------------------

/**
 * Normalize an array of raw weights so they sum to 1.0.
 * If all weights are 0, returns equal weights (1/n each).
 * Guarantees: no NaN, no Infinity, all values ≥ 0.
 */
export function normalizeWeights(weights: number[]): number[] {
  if (weights.length === 0) return [];

  const total = weights.reduce((sum, w) => sum + Math.max(0, w), 0);

  if (total === 0) {
    const equal = 1 / weights.length;
    return weights.map(() => equal);
  }

  return weights.map((w) => Math.max(0, w) / total);
}

// ---------------------------------------------------------------------------
// Effective score
// ---------------------------------------------------------------------------

/**
 * Compute the effective score for a criterion.
 * - benefit: score as-is (clamped 0–10)
 * - cost:    10 - score (inverted so lower cost = higher effective score)
 */
export function effectiveScore(rawScore: number, criterionType: "benefit" | "cost"): number {
  const clamped = Math.max(0, Math.min(MAX_SCORE, rawScore));
  return criterionType === "cost" ? MAX_SCORE - clamped : clamped;
}

// ---------------------------------------------------------------------------
// Core scoring
// ---------------------------------------------------------------------------

/**
 * Score a single option across all criteria.
 * Returns the total weighted score and per-criterion breakdown.
 */
export function scoreOption(
  optionId: string,
  optionName: string,
  criteria: Criterion[],
  scores: ScoreMatrix,
  normalizedWeights: number[]
): OptionResult {
  const criterionScores: CriterionScore[] = criteria.map((criterion, i) => {
    const rawScore = scores[optionId]?.[criterion.id] ?? 0;
    const eff = effectiveScore(rawScore, criterion.type);
    const nw = normalizedWeights[i];

    return {
      criterionId: criterion.id,
      criterionName: criterion.name,
      rawScore,
      normalizedWeight: nw,
      effectiveScore: roundDisplay(eff * nw),
      criterionType: criterion.type,
    };
  });

  // Accumulate from unrounded weighted scores to avoid double-rounding errors
  const totalScore = roundDisplay(
    criteria.reduce((sum, criterion, i) => {
      const rawScore = scores[optionId]?.[criterion.id] ?? 0;
      const eff = effectiveScore(rawScore, criterion.type);
      return sum + eff * normalizedWeights[i];
    }, 0)
  );

  return {
    optionId,
    optionName,
    totalScore,
    rank: 0, // assigned after sorting
    criterionScores,
  };
}

/**
 * Compute full results for a decision.
 * Returns ranked options and top drivers.
 */
export function computeResults(decision: Decision): DecisionResults {
  const { criteria, options, scores } = decision;

  if (criteria.length === 0 || options.length === 0) {
    return {
      decisionId: decision.id,
      optionResults: [],
      topDrivers: [],
    };
  }

  const rawWeights = criteria.map((c) => c.weight);
  const nw = normalizeWeights(rawWeights);

  // Score each option
  const results: OptionResult[] = options.map((opt) =>
    scoreOption(opt.id, opt.name, criteria, scores, nw)
  );

  // Sort descending by totalScore; stable sort preserves insertion order for ties
  results.sort((a, b) => b.totalScore - a.totalScore);

  // Assign ranks (1-based)
  results.forEach((r, i) => {
    r.rank = i + 1;
  });

  // Compute top drivers (criteria sorted by normalized weight descending)
  const topDrivers = computeTopDrivers(criteria, nw);

  return {
    decisionId: decision.id,
    optionResults: results,
    topDrivers,
  };
}

// ---------------------------------------------------------------------------
// Top drivers
// ---------------------------------------------------------------------------

/**
 * Identify the top criteria that most influence the outcome.
 * Returns criteria sorted by weight, with impact descriptions.
 */
export function computeTopDrivers(criteria: Criterion[], normalizedWeights: number[]): TopDriver[] {
  const indexed = criteria.map((c, i) => ({
    criterion: c,
    nw: normalizedWeights[i],
  }));

  indexed.sort((a, b) => b.nw - a.nw);

  return indexed.map(({ criterion, nw }) => ({
    criterionId: criterion.id,
    criterionName: criterion.name,
    normalizedWeight: roundDisplay(nw),
    impactDescription: `${criterion.name} accounts for ${roundDisplay(nw * 100)}% of the total weight (${criterion.type}).`,
  }));
}

// ---------------------------------------------------------------------------
// Sensitivity analysis — weight swing
// ---------------------------------------------------------------------------

/**
 * Perform weight-swing sensitivity analysis.
 *
 * For each criterion, adjust its weight by ±swingPercent (of its current value)
 * and recompute the winner. Reports whether the winner changes.
 *
 * @param decision - The decision to analyze
 * @param swingPercent - Percentage to swing each weight (default: 20 = ±20%)
 * @returns SensitivityAnalysis with points and summary
 */
export function sensitivityAnalysis(
  decision: Decision,
  swingPercent: number = 20
): SensitivityAnalysis {
  const baseResults = computeResults(decision);
  if (baseResults.optionResults.length === 0) {
    return { decisionId: decision.id, points: [], summary: "No options to analyze." };
  }

  const originalWinner = baseResults.optionResults[0].optionName;
  const points: SensitivityPoint[] = [];

  const swingFactor = swingPercent / 100;

  for (const criterion of decision.criteria) {
    // Swing UP
    const upWeight = criterion.weight * (1 + swingFactor);
    const upDecision = applyWeightOverride(decision, criterion.id, upWeight);
    const upResults = computeResults(upDecision);
    const upWinner =
      upResults.optionResults.length > 0 ? upResults.optionResults[0].optionName : originalWinner;

    points.push({
      criterionId: criterion.id,
      criterionName: criterion.name,
      originalWeight: criterion.weight,
      adjustedWeight: roundDisplay(upWeight),
      originalWinner,
      newWinner: upWinner,
      winnerChanged: upWinner !== originalWinner,
    });

    // Swing DOWN
    const downWeight = Math.max(0, criterion.weight * (1 - swingFactor));
    const downDecision = applyWeightOverride(decision, criterion.id, downWeight);
    const downResults = computeResults(downDecision);
    const downWinner =
      downResults.optionResults.length > 0
        ? downResults.optionResults[0].optionName
        : originalWinner;

    points.push({
      criterionId: criterion.id,
      criterionName: criterion.name,
      originalWeight: criterion.weight,
      adjustedWeight: roundDisplay(downWeight),
      originalWinner,
      newWinner: downWinner,
      winnerChanged: downWinner !== originalWinner,
    });
  }

  const changedCount = points.filter((p) => p.winnerChanged).length;
  const summary =
    changedCount === 0
      ? `The current winner "${originalWinner}" is robust — no single weight swing of ±${swingPercent}% changes the outcome.`
      : `${changedCount} weight swing(s) out of ${points.length} would change the winner from "${originalWinner}".`;

  return { decisionId: decision.id, points, summary };
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

/**
 * Create a modified copy of a decision with one criterion's weight overridden.
 * Pure function — does not mutate the original.
 */
export function applyWeightOverride(
  decision: Decision,
  criterionId: string,
  newWeight: number
): Decision {
  return {
    ...decision,
    criteria: decision.criteria.map((c) =>
      c.id === criterionId ? { ...c, weight: newWeight } : c
    ),
  };
}

/**
 * Round a number to DISPLAY_PRECISION decimal places.
 * Uses banker's rounding (round half to even) via toFixed.
 */
export function roundDisplay(value: number): number {
  if (!Number.isFinite(value)) return 0;
  return Number(value.toFixed(DISPLAY_PRECISION));
}
