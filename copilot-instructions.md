# Copilot Instructions for Decision OS

## Project Overview

Decision OS is a structured decision-making web app. Users create decisions with options, criteria (weighted), and scores, then see rankings and sensitivity analysis. It is client-side only (localStorage) with a deterministic scoring engine.

## Tech Stack

- **Framework**: Next.js 16 (App Router) + TypeScript (strict mode)
- **Styling**: Tailwind CSS 4 + utility classes
- **Icons**: lucide-react
- **Testing**: Vitest + React Testing Library
- **Linting**: ESLint + Prettier
- **CI**: GitHub Actions

## Commands

```bash
npm run dev        # Start dev server on localhost:3000
npm run build      # Production build
npm run test       # Run all unit tests (Vitest)
npm run test:watch # Watch mode for tests
npm run lint       # ESLint check
npm run typecheck  # TypeScript type check
npm run format     # Prettier format all files
```

## Project Structure

```
src/
├── app/              # Next.js App Router pages
│   ├── layout.tsx    # Root layout (metadata, fonts)
│   ├── page.tsx      # Main page (tab navigation)
│   └── globals.css   # Tailwind imports
├── components/       # React components
│   ├── DecisionProvider.tsx  # State management context
│   ├── DecisionBuilder.tsx   # Decision editor UI
│   ├── Header.tsx            # App header
│   ├── ResultsView.tsx       # Rankings & export
│   └── SensitivityView.tsx   # Sensitivity analysis
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

### 6. Styling conventions

- Use Tailwind utility classes
- No custom CSS unless absolutely necessary
- Use `cn()` from `src/lib/utils.ts` for conditional classes
- Mobile-responsive (test on narrow viewports)

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
3. `npm run typecheck` — no type errors
4. `npm run build` — production build succeeds
5. Manual check — app works in browser
