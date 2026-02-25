# Monitoring

## Overview

Decision OS tracks key health metrics automatically via CI workflows. This document explains how to read the auto-generated reports and what thresholds are enforced.

## Bundle Size Tracking

### Strategy

Every merge to `main` triggers a bundle analysis that:

1. Builds the production output
2. Measures every JS chunk in `.next/static/chunks/`
3. Reports raw and gzipped sizes
4. Fails if total gzipped JS exceeds **500KB**

### Reports

- **CI artifact**: `bundle-report` artifact on every CI run
- **Auto-generated doc**: [docs/BUNDLE_REPORT.md](BUNDLE_REPORT.md) — updated on each merge

### Reading the Report

| Column  | Meaning                                    |
| ------- | ------------------------------------------ |
| File    | JS chunk filename (hashed)                 |
| Size    | Raw file size                              |
| Gzipped | Gzip-compressed size (what users download) |

**Key metric**: Total gzipped JS. Keep below **500KB**.

### Investigating Regressions

1. Compare the bundle report with the previous merge
2. Identify which chunk grew
3. Use `next build --debug` locally to see what's in each chunk
4. Common causes: new large dependency, un-tree-shaken import, duplicate code

## Performance Budget

| Metric                   | Target  | Enforced By        |
| ------------------------ | ------- | ------------------ |
| Total gzipped JS         | < 500KB | CI bundle analysis |
| Lighthouse Performance   | ≥ 85    | Lighthouse CI      |
| Lighthouse Accessibility | ≥ 90    | Lighthouse CI      |
| First Contentful Paint   | < 2s    | Lighthouse CI      |
| Time to Interactive      | < 4s    | Lighthouse CI      |

### Adjusting Budgets

Performance budgets are defined in:

- [lighthouserc.json](../lighthouserc.json) — Lighthouse thresholds
- [.github/workflows/ci.yml](../.github/workflows/ci.yml) — bundle size threshold (512000 bytes = 500KB)

## Accessibility Compliance

### Automated Monitoring

- **E2E tests**: `e2e/accessibility.spec.ts` runs axe-core against all major views
- **Lighthouse audit**: Accessibility score ≥ 90
- **CI enforcement**: Both checks must pass before merge

### What's Tested

| View                     | Axe Rules   | Lighthouse |
| ------------------------ | ----------- | ---------- |
| Decision Builder         | WCAG 2.1 AA | ✅         |
| Results View             | WCAG 2.1 AA | ✅         |
| Sensitivity Analysis     | WCAG 2.1 AA | ✅         |
| Keyboard shortcuts modal | WCAG 2.1 AA | ✅         |
| Dark mode                | WCAG 2.1 AA | ✅         |

### Manual Checks

Some accessibility aspects can't be automated:

- Screen reader flow makes logical sense
- Focus management during interactions feels natural
- Color contrast in charts is sufficient
- Touch targets are large enough on mobile

## Test Coverage Trending

### Current Thresholds

Enforced in [vitest.config.ts](../vitest.config.ts):

| Metric     | Threshold |
| ---------- | --------- |
| Statements | 80%       |
| Branches   | 75%       |
| Functions  | 80%       |
| Lines      | 80%       |

### Reports

- **CI artifact**: `coverage-report` artifact on every CI run
- **Auto-generated doc**: [docs/COVERAGE_REPORT.md](COVERAGE_REPORT.md) — updated on each merge
- **Local**: Run `npm run test:coverage` for a detailed report

### Coverage Scope

Coverage is measured for `src/lib/**/*.ts` (core logic). UI components are tested via integration tests but not included in coverage metrics.

## How to Read Auto-Generated Reports

### BUNDLE_REPORT.md

Updated after each merge. Shows every JS chunk with its size. Watch for:

- Single chunks over 100KB gzipped — may need code splitting
- Total approaching the 500KB threshold — time to optimize

### COVERAGE_REPORT.md

Updated after each merge. Shows aggregate coverage percentages. Watch for:

- Any metric dropping below threshold — new untested code
- Branch coverage significantly lower than line coverage — missing edge case tests

### COMPONENT_INDEX.md

Updated after each merge. Lists all React components. Watch for:

- Components without descriptions — needs documentation
- Unusually large component files — may need splitting

## Alerts

Currently, monitoring is passive (check the docs). Future plans:

- GitHub status badges on README for coverage percentage
- Slack/Discord webhook on bundle size regression
- Weekly health digest issue
