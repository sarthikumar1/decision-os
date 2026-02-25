# PR4: Results View + Exports + Share Link

## Description

Add results visualization with ranked options, score breakdowns, top drivers, JSON export, and URL sharing.

## Changes

- `src/components/ResultsView.tsx`: Full results display
  - Ranked options with score bars
  - Per-criterion breakdown for each option
  - Top drivers section (criteria by weight)
  - "Explain This Result" section
  - JSON export button
  - Copy share link button

## Acceptance Criteria

- [x] Options ranked correctly by total score
- [x] Winner highlighted with badge
- [x] Score bars proportional to scores
- [x] Per-criterion breakdown visible for each option
- [x] Top drivers listed with weight percentages
- [x] "Explain This Result" provides clear explanation of scoring method
- [x] JSON export downloads valid JSON file
- [x] Share link copies URL to clipboard (with size limit warning)
