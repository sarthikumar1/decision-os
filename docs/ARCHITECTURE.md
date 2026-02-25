# Architecture

## Overview

Decision OS is a client-side web application built with Next.js (App Router) and TypeScript. It uses a local-first architecture — all data lives in the browser's localStorage with no backend required for the MVP.

## High-Level Diagram

```
┌─────────────────────────────────────────────────────────┐
│                    Browser (Client)                     │
│                                                         │
│  ┌───────────────┐  ┌──────────────┐  ┌──────────────┐ │
│  │ Decision      │  │ Results      │  │ Sensitivity  │ │
│  │ Builder UI    │  │ View         │  │ Analysis     │ │
│  └──────┬────────┘  └──────┬───────┘  └──────┬───────┘ │
│         │                  │                  │         │
│  ┌──────▼──────────────────▼──────────────────▼───────┐ │
│  │           DecisionProvider (React Context)         │ │
│  │         State management + auto-save               │ │
│  └──────┬─────────────────────────────┬───────────────┘ │
│         │                             │                 │
│  ┌──────▼──────────┐  ┌──────────────▼───────────────┐ │
│  │ Scoring Engine  │  │ Storage Layer (localStorage) │ │
│  │ (Pure functions)│  │                              │ │
│  └─────────────────┘  └──────────────────────────────┘ │
│                                                         │
└─────────────────────────────────────────────────────────┘
```

## Module Boundaries

### `/src/lib/` — Core Logic (Pure, testable, no React)

| File | Responsibility |
|------|---------------|
| `types.ts` | TypeScript type definitions for the entire domain |
| `scoring.ts` | Deterministic scoring engine (weighted sum, sensitivity analysis) |
| `validation.ts` | Input validation with structured error messages |
| `storage.ts` | localStorage CRUD operations |
| `demo-data.ts` | Preloaded demo decision |
| `utils.ts` | Utilities (ID generation, cn(), URL encoding) |

### `/src/components/` — React UI Components

| File | Responsibility |
|------|---------------|
| `DecisionProvider.tsx` | React Context for state management, auto-save |
| `Header.tsx` | App header with decision selector, create/delete/reset |
| `DecisionBuilder.tsx` | Title, options, criteria, scores matrix editor |
| `ResultsView.tsx` | Rankings, breakdowns, top drivers, export, share |
| `SensitivityView.tsx` | Weight-swing analysis with interactive slider |

### `/src/app/` — Next.js App Router

| File | Responsibility |
|------|---------------|
| `layout.tsx` | Root layout with metadata, fonts |
| `page.tsx` | Main page with tab navigation |
| `globals.css` | Tailwind imports and CSS variables |

## Design Decisions

1. **Local-first**: No backend for MVP. All state in localStorage. This simplifies deployment and eliminates privacy concerns.

2. **Pure scoring engine**: All scoring functions are pure (no side effects). This makes them easy to test and reason about.

3. **React Context over Redux**: For an app this size, Context + `useState` is simpler and sufficient. No unnecessary abstractions.

4. **No chart library**: Score visualizations use CSS bars. This keeps the bundle small and avoids heavyweight dependencies.

5. **Single-page app**: All functionality on one page with tabs. Reduces complexity and keeps the UX focused.

## Data Flow

```
User Input → DecisionProvider → Scoring Engine → Results
                    │
                    ▼
              localStorage (auto-save, 300ms debounce)
```

## Future Architecture (v0.2+)

- **Supabase backend**: Behind a feature flag for cloud persistence
- **URL state**: Shareable decision links via base64-encoded URL hash
- **Web Workers**: Move scoring to a worker for large decisions
- **PWA**: Offline support via service worker
