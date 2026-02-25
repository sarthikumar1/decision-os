/**
 * Core types for Decision OS.
 *
 * These types define the data model for decisions, options, criteria, and scores.
 * All IDs use nanoid-style strings for uniqueness without external dependencies.
 */

/** Criterion type: benefit means higher is better, cost means lower is better */
export type CriterionType = "benefit" | "cost";

/** A single criterion used to evaluate options */
export interface Criterion {
  id: string;
  name: string;
  weight: number; // 0–100 (raw weight; normalized internally)
  type: CriterionType;
  description?: string;
}

/** A single option being evaluated */
export interface Option {
  id: string;
  name: string;
  description?: string;
}

/**
 * Score matrix entry: maps `optionId -> criterionId -> score (0–10)`.
 * Stored as a flat record for simplicity.
 */
export type ScoreMatrix = Record<string, Record<string, number>>;

/** A complete decision with all its data */
export interface Decision {
  id: string;
  title: string;
  description?: string;
  options: Option[];
  criteria: Criterion[];
  scores: ScoreMatrix;
  createdAt: string; // ISO 8601
  updatedAt: string; // ISO 8601
}

/** Result for a single option after scoring */
export interface OptionResult {
  optionId: string;
  optionName: string;
  totalScore: number;
  rank: number;
  criterionScores: CriterionScore[];
}

/** Score breakdown for one criterion on one option */
export interface CriterionScore {
  criterionId: string;
  criterionName: string;
  rawScore: number;
  normalizedWeight: number;
  effectiveScore: number; // rawScore (or inverted) * normalizedWeight
  criterionType: CriterionType;
}

/** Full results for a decision */
export interface DecisionResults {
  decisionId: string;
  optionResults: OptionResult[];
  topDrivers: TopDriver[];
}

/** A criterion that significantly influenced the outcome */
export interface TopDriver {
  criterionId: string;
  criterionName: string;
  normalizedWeight: number;
  impactDescription: string;
}

/** Sensitivity analysis result for a single criterion weight change */
export interface SensitivityPoint {
  criterionId: string;
  criterionName: string;
  originalWeight: number;
  adjustedWeight: number;
  originalWinner: string;
  newWinner: string;
  winnerChanged: boolean;
}

/** Full sensitivity analysis results */
export interface SensitivityAnalysis {
  decisionId: string;
  points: SensitivityPoint[];
  summary: string;
}
