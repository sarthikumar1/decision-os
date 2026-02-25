# PR2: Scoring Engine + Unit Tests + Documentation

## Description

Implement the deterministic weighted-sum scoring engine with comprehensive unit tests and full documentation.

## Changes

- `src/lib/types.ts`: All TypeScript type definitions
- `src/lib/scoring.ts`: Scoring engine (normalizeWeights, effectiveScore, computeResults, sensitivityAnalysis)
- `src/lib/validation.ts`: Input validation with structured errors
- `src/lib/utils.ts`: Utilities (ID generation, URL encoding, cn())
- `src/__tests__/scoring.test.ts`: 27 unit tests for scoring engine
- `src/__tests__/validation.test.ts`: 13 unit tests for validation
- `docs/SCORING_MODEL.md`: Full mathematical specification with worked example

## Acceptance Criteria

- [x] 40 unit tests pass
- [x] Scoring is deterministic (same input → same output)
- [x] Cost criteria correctly inverted
- [x] Weight normalization handles edge cases (zeros, negatives)
- [x] Scoring model fully documented with formulas and example
- [x] Sensitivity analysis produces consistent results
