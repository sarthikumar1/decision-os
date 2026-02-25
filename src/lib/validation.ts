/**
 * Validation utilities for Decision OS.
 *
 * All user input goes through these validators before being saved.
 * Returns structured error messages for UI display.
 */

import type { Criterion, Decision, Option, ScoreMatrix } from "./types";
import { MAX_SCORE } from "./scoring";

export interface ValidationError {
  field: string;
  message: string;
}

/**
 * Validate an entire decision. Returns an array of errors (empty = valid).
 */
export function validateDecision(decision: Decision): ValidationError[] {
  const errors: ValidationError[] = [];

  // Title
  if (!decision.title.trim()) {
    errors.push({ field: "title", message: "Decision title is required." });
  }

  // Options
  if (decision.options.length < 2) {
    errors.push({
      field: "options",
      message: "At least 2 options are required.",
    });
  }

  decision.options.forEach((opt, i) => {
    const optErrors = validateOption(opt);
    optErrors.forEach((e) => {
      errors.push({ field: `options[${i}].${e.field}`, message: e.message });
    });
  });

  // Check for duplicate option names
  const optionNames = new Set<string>();
  decision.options.forEach((opt, i) => {
    const name = opt.name.trim().toLowerCase();
    if (optionNames.has(name)) {
      errors.push({
        field: `options[${i}].name`,
        message: `Duplicate option name: "${opt.name}".`,
      });
    }
    optionNames.add(name);
  });

  // Criteria
  if (decision.criteria.length < 1) {
    errors.push({
      field: "criteria",
      message: "At least 1 criterion is required.",
    });
  }

  decision.criteria.forEach((crit, i) => {
    const critErrors = validateCriterion(crit);
    critErrors.forEach((e) => {
      errors.push({ field: `criteria[${i}].${e.field}`, message: e.message });
    });
  });

  // Scores
  const scoreErrors = validateScores(
    decision.scores,
    decision.options,
    decision.criteria
  );
  errors.push(...scoreErrors);

  return errors;
}

/**
 * Validate a single option.
 */
export function validateOption(option: Option): ValidationError[] {
  const errors: ValidationError[] = [];
  if (!option.name.trim()) {
    errors.push({ field: "name", message: "Option name is required." });
  }
  return errors;
}

/**
 * Validate a single criterion.
 */
export function validateCriterion(criterion: Criterion): ValidationError[] {
  const errors: ValidationError[] = [];

  if (!criterion.name.trim()) {
    errors.push({ field: "name", message: "Criterion name is required." });
  }

  if (
    !Number.isFinite(criterion.weight) ||
    criterion.weight < 0 ||
    criterion.weight > 100
  ) {
    errors.push({
      field: "weight",
      message: "Weight must be between 0 and 100.",
    });
  }

  if (criterion.type !== "benefit" && criterion.type !== "cost") {
    errors.push({
      field: "type",
      message: 'Type must be "benefit" or "cost".',
    });
  }

  return errors;
}

/**
 * Validate the scores matrix.
 * Ensures all scores are numbers between 0 and MAX_SCORE.
 */
export function validateScores(
  scores: ScoreMatrix,
  options: Option[],
  criteria: Criterion[]
): ValidationError[] {
  const errors: ValidationError[] = [];

  for (const option of options) {
    for (const criterion of criteria) {
      const value = scores[option.id]?.[criterion.id];
      if (value !== undefined && value !== null) {
        if (!Number.isFinite(value) || value < 0 || value > MAX_SCORE) {
          errors.push({
            field: `scores.${option.id}.${criterion.id}`,
            message: `Score for "${option.name}" on "${criterion.name}" must be 0–${MAX_SCORE}.`,
          });
        }
      }
    }
  }

  return errors;
}
