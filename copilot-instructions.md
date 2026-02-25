# Copilot Instructions for Decision OS

## Project Overview

Decision OS is a structured decision-making web app. Users create decisions with options, criteria (weighted), and scores, then see rankings and sensitivity analysis. It is client-side only (localStorage) with a deterministic scoring engine.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + utility classes (with `dark:` variants)
- **Icons**: lucide-react
- **Charts**: Recharts (bar + stacked breakdown)
- **Compression**: lz-string (URL sharing)
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Linting**: ESLint + Prettier
- **CI**: GitHub Actions (format:check → lint → typecheck → test:coverage → build → E2E)
- **Deployment**: Vercel (auto-deploy on push to main)

## Commands

```bash
npm run dev           # Start dev server on localhost:3000
npm run build         # Production build
npm run test          # Run all unit tests (Vitest)
npm run test:watch    # Watch mode for tests
npm run test:coverage # Run tests with V8 coverage (enforced thresholds)
npm run test:e2e      # Run Playwright E2E tests
npm run lint          # ESLint check
npm run typecheck     # TypeScript type check
npm run format        # Prettier format all files
npm run format:check  # Prettier check (used in CI)
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout (metadata, fonts)
│   ├── page.tsx      # Main page (tab navigation)
│   └── globals.css   # Tailwind imports
├── components/       # React components
│   ├── DecisionProvider.tsx  # State management context + URL share restore
│   ├── DecisionBuilder.tsx   # Decision editor UI
│   ├── Header.tsx            # App header (branding, selector, dark toggle)
│   ├── ResultsView.tsx       # Rankings, chart, export, share
│   ├── SensitivityView.tsx   # Sensitivity analysis
│   ├── ScoreChart.tsx        # Recharts visualization
│   ├── ThemeProvider.tsx     # Dark/light mode context
│   ├── ErrorBoundary.tsx     # Error boundary with recovery UI
│   └── Announcer.tsx         # Live-region announcer for screen readers
├── hooks/            # Custom React hooks
│   └── useValidation.ts     # Memoized validation (errors/warnings/infos)
├── lib/              # Pure logic (no React)
│   ├── types.ts      # TypeScript type definitions
│   ├── scoring.ts    # Scoring engine (CRITICAL - see below)
│   ├── validation.ts # Input validation
│   ├── storage.ts    # localStorage CRUD
│   ├── demo-data.ts  # Demo decision data
│   └── utils.ts      # Utilities
└── __tests__/        # Unit tests
    ├── scoring.test.ts
    └── validation.test.ts
```

## CRITICAL RULES

### 1. Do NOT break the deterministic scoring engine

The scoring engine in `src/lib/scoring.ts` is the core of the app. It MUST be deterministic: identical inputs always produce identical outputs. If you modify any function in this file:

- Update `docs/SCORING_MODEL.md` to match
- Update or add unit tests in `src/__tests__/scoring.test.ts`
- Verify all 40+ tests still pass
- Do NOT introduce randomness (unless using a deterministic seed with documentation)

### 2. Types are mandatory

- All code must be TypeScript with strict mode
- No `any` types unless there's a documented reason
- All public function parameters and returns must be typed
- Domain types live in `src/lib/types.ts`

### 3. Pure functions in /lib

Everything in `src/lib/` must be pure functions with no React dependencies. This makes them easy to test and reuse. React-specific code goes in `src/components/`.

### 4. Testing requirements

- All scoring engine changes need unit tests
- Run `npm run test` before committing
- Test edge cases: empty arrays, zero weights, NaN inputs, boundary values

### 5. Accessibility

- All interactive elements must be keyboard accessible
- Use semantic HTML elements (`<nav>`, `<main>`, `<section>`, etc.)
- Add `aria-label` to buttons without visible text
- Use `role="tablist"`, `role="tab"`, `role="tabpanel"` for tab interfaces
- Use `aria-describedby` on inputs that need range/format hints
- Use `aria-live` regions (via `useAnnounce()`) for dynamic content changes
- Use `aria-invalid` on inputs with validation errors
- Use `useValidation()` hook for inline validation feedback in Builder
- Score matrix grid supports arrow-key navigation (WAI-ARIA grid pattern)

### 6. Styling conventions

- Use Tailwind utility classes with `dark:` variants for all new elements
- No custom CSS unless absolutely necessary
- Mobile-responsive (test on narrow viewports)
- All user-facing elements must support dark mode

### 7. State management

- All decision state flows through `DecisionProvider` (React Context)
- Auto-save to localStorage with 300ms debounce
- Never mutate state directly — always spread/copy

### 8. No external data fetching

- Do NOT scrape websites or call external APIs
- Any external data must be documented in `docs/DATA_SOURCES.md`
- The app must work fully offline (after initial load)

## Code Style

- 2-space indentation
- Double quotes for strings
- Trailing commas (ES5)
- Semicolons always
- Named exports preferred (except page components)
- JSDoc comments on all exported functions

## Before Committing Checklist

1. `npm run test` — all tests pass
2. `npm run lint` — no lint errors
3. `npm run format:check` — formatting correct
4. `npm run typecheck` — no type errors
5. `npm run build` — production build succeeds
6. All `dark:` variants added for any new UI elements
7. Destructive actions have confirmation dialogs
8. `npm run typecheck` — no type errors
9. `npm run build` — production build succeeds
10. Manual check — app works in browser
