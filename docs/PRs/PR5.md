# PR5: Sensitivity Analysis + Tests + Polish

## Description

Add weight-swing sensitivity analysis with interactive controls, detailed results table, and educational explanation.

## Changes

- `src/components/SensitivityView.tsx`: Full sensitivity analysis UI
  - Interactive swing percentage slider (±5% to ±50%)
  - Robust/Sensitive result summary
  - Detailed table showing each weight swing and its effect
  - Educational "How It Works" section
- Sensitivity analysis engine already in `src/lib/scoring.ts` (PR2)
- Unit tests already in `src/__tests__/scoring.test.ts` (PR2)

## Acceptance Criteria

- [x] Slider adjusts swing percentage from 5% to 50%
- [x] Results update reactively when slider changes
- [x] Summary clearly states if result is robust or sensitive
- [x] Table shows each criterion, direction, weight change, and winner status
- [x] Changed winners highlighted in yellow
- [x] Explanation section helps users understand the analysis
