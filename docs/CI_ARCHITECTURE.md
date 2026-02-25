# CI/CD Architecture

## Overview

Decision OS uses GitHub Actions for continuous integration and delivery. The pipeline is designed for autonomous operation — PRs merge themselves once all checks pass, documentation syncs automatically, and releases are triggered on demand.

## Workflow Diagram

```
┌─────────────────────────────────────────────────────────────────┐
│                         TRIGGERS                                │
│                                                                 │
│  push to main ──┬──→ CI Pipeline (ci.yml)                      │
│                 └──→ Auto-Sync Docs (auto-sync-docs.yml)       │
│                                                                 │
│  pull_request ──┬──→ CI Pipeline (ci.yml)                      │
│                 └──→ PR Quality Gate (pr-quality-gate.yml)      │
│                                                                 │
│  manual dispatch ──→ Release (release.yml)                     │
│  push tag v* ─────→ Release (release.yml)                      │
│                                                                 │
│  schedule (daily) ──→ Stale (stale.yml)                        │
│  schedule (weekly) ──→ Dependabot                              │
└─────────────────────────────────────────────────────────────────┘
```

## CI Pipeline (`ci.yml`)

The core quality gate. All jobs must pass before a PR can merge.

```
┌──────────┐    ┌───────────┐    ┌──────┐    ┌───────┐
│   Lint   │    │ Typecheck │    │ Test │    │ Build │
│          │    │           │    │      │    │       │
│ ESLint   │    │ tsc       │    │Vitest│    │ next  │
│ Prettier │    │ --noEmit  │    │ +cov │    │ build │
└────┬─────┘    └─────┬─────┘    └──┬───┘    └───┬───┘
     │                │             │            │
     └────────────────┴─────────────┴────────────┘
                        │
              ┌─────────┴─────────┐
              ▼                   ▼
        ┌──────────┐       ┌────────────┐
        │   E2E    │       │ Lighthouse │
        │ Playwright│      │    CI      │
        └──────────┘       └────────────┘

     ┌────────────────┐  ┌─────────────────────┐
     │ Bundle Analysis│  │ Accessibility Audit  │
     │ (needs: build) │  │ (needs: build)       │
     └────────────────┘  └─────────────────────┘
```

### Jobs

| Job                     | What It Validates                                 | Failure Means                          |
| ----------------------- | ------------------------------------------------- | -------------------------------------- |
| **lint**                | ESLint (zero warnings) + Prettier                 | Code style violations                  |
| **typecheck**           | `tsc --noEmit` in strict mode                     | Type errors                            |
| **test**                | Vitest with 80%+ coverage thresholds              | Failing tests or insufficient coverage |
| **build**               | `next build` production build                     | Build errors or warnings               |
| **bundle-analysis**     | JS bundle size < 500KB gzipped                    | Performance regression                 |
| **accessibility-audit** | axe-core via Playwright                           | WCAG 2.1 AA violations                 |
| **e2e**                 | Full Playwright suite (Chromium, Firefox, WebKit) | Functional regression                  |
| **lighthouse**          | Performance ≥ 85, Accessibility ≥ 90              | Performance/a11y regression            |

## PR Quality Gate (`pr-quality-gate.yml`)

Enhances PRs with automated metadata and quality feedback.

| Action               | Description                                                        |
| -------------------- | ------------------------------------------------------------------ |
| **Auto-label areas** | Labels based on changed file paths (`area:ui`, `area:logic`, etc.) |
| **Auto-label size**  | Labels based on diff size (`size:XS` through `size:XL`)            |
| **Check PR title**   | Validates conventional commit format                               |
| **PR comment**       | Posts build summary, new components, change statistics             |

## Auto-Sync Docs (`auto-sync-docs.yml`)

Runs after each merge to `main`. Generates/updates:

- `docs/PROJECT_STRUCTURE.md` — file tree
- `docs/COMPONENT_INDEX.md` — component inventory with props
- `docs/COVERAGE_REPORT.md` — test coverage summary
- `docs/BUNDLE_REPORT.md` — bundle size breakdown

Commits with `[skip ci]` to prevent infinite loops.

## Release (`release.yml`)

Triggered manually or by tag push.

```
Manual Dispatch                    Tag Push (v*)
      │                                │
      ▼                                ▼
Determine bump                  Generate notes
(auto/patch/minor/major)        Create release
      │
      ▼
Update package.json
Generate release notes
Commit + Tag + Push
Create GitHub Release
```

## Stale (`stale.yml`)

Daily scheduled job:

- Issues stale after **30 days** → closed after **7 more days**
- PRs stale after **14 days** → closed after **7 more days**
- Exempt: `priority:critical`, `priority:high`, `pinned`, `status:in-progress`, `status:blocked`

## Auto-Merge Flow

```
PR Created
    │
    ▼
CI Pipeline runs ──→ All checks pass?
    │                      │
    No                    Yes
    │                      │
    ▼                      ▼
Fix issues          Auto-merge triggers
                    (squash merge)
                         │
                         ▼
                    Branch deleted
                         │
                         ▼
                    Auto-Sync Docs runs
```

**Prerequisites for auto-merge**:

1. Branch protection requires all status checks to pass
2. At least 1 approving review
3. Conversations resolved
4. Branch is up to date with `main`
5. PR author enables auto-merge on the PR

## Failure Modes & Recovery

| Failure                       | Impact           | Recovery                            |
| ----------------------------- | ---------------- | ----------------------------------- |
| CI flake                      | PR blocked       | Re-run failed job                   |
| Auto-sync commit fails        | Docs out of date | Manually trigger workflow           |
| Release fails mid-way         | Partial release  | Delete tag, fix issue, re-trigger   |
| Stale bot marks wrongly       | Issue/PR closed  | Reopen and add exempt label         |
| Dependabot PR breaks build    | Blocked PR       | Close PR, investigate dependency    |
| Bundle size exceeds threshold | PR blocked       | Optimize bundle or adjust threshold |

## Concurrency

All workflows use concurrency groups to prevent parallel runs:

```yaml
concurrency:
  group: ${{ github.workflow }}-${{ github.ref }}
  cancel-in-progress: true
```

This ensures only the latest commit on a branch triggers checks, cancelling in-progress runs for older commits.
