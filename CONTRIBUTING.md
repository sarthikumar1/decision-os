# Contributing to Decision OS

Thank you for your interest in contributing! Decision OS is an open-source decision intelligence platform, and we welcome contributions of all kinds — code, documentation, bug reports, feature requests, and ideas.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Workflow](#development-workflow)
- [Code Style Guide](#code-style-guide)
- [Commit Message Format](#commit-message-format)
- [Pull Request Requirements](#pull-request-requirements)
- [Adding a New Decision Algorithm](#adding-a-new-decision-algorithm)
- [Adding a New UI Component](#adding-a-new-ui-component)
- [Testing](#testing)
- [Documentation](#documentation)

## Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) 22+ (LTS)
- [Git](https://git-scm.com/)
- A code editor (we recommend [VS Code](https://code.visualstudio.com/) with our [recommended extensions](.vscode/extensions.json))

### Setup

```bash
# 1. Fork the repository on GitHub

# 2. Clone your fork
git clone https://github.com/YOUR_USERNAME/decision-os.git
cd decision-os

# 3. Install dependencies
npm install

# 4. Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — a demo decision loads instantly.

### Verify Everything Works

```bash
npm run lint       # ESLint (must pass with zero warnings)
npm run typecheck  # TypeScript strict mode check
npm run test       # Run unit tests
npm run build      # Production build
```

All four commands must pass before you submit a PR.

## Development Workflow

### 1. Create a Branch

```bash
git checkout -b feat/your-feature-name
# or: fix/bug-description, docs/what-changed, test/what-tested
```

### 2. Make Changes

- Write code following our [style guide](#code-style-guide)
- Add tests for new logic
- Update docs if behavior changes

### 3. Validate Locally

```bash
npm run lint         # Zero warnings
npm run typecheck    # No type errors
npm run test         # All tests pass
npm run build        # Build succeeds
```

### 4. Commit with Conventional Format

```bash
git commit -m "feat: add Monte Carlo sensitivity analysis"
```

### 5. Push and Open a PR

```bash
git push origin feat/your-feature-name
```

Then open a Pull Request on GitHub. The PR template will guide you.

### 6. CI Validates Automatically

Our CI pipeline runs: lint, typecheck, test (with coverage), build, bundle analysis, accessibility audit, E2E tests, and Lighthouse. All must pass.

### 7. Review and Merge

Once approved and all checks pass, the PR auto-merges via squash merge.

## Code Style Guide

### TypeScript

- **Strict mode** — no `any` types unless justified with a comment
- **Explicit return types** on exported functions
- **Interface over type** for object shapes (unless union/intersection needed)
- **Readonly** where possible
- **No non-null assertions** (`!`) — use proper type narrowing

### React

- **Functional components** only (no class components except ErrorBoundary)
- **Named exports** — no default exports
- **Props interfaces** — define and export `ComponentNameProps`
- **Memoization** — use `React.memo` for expensive components, `useMemo`/`useCallback` for expensive computations
- **Accessibility first** — every interactive element needs keyboard support and ARIA labels

### File Organization

```
src/
├── app/           # Next.js pages — minimal logic, compose components
├── components/    # React components — UI rendering + event handling
├── hooks/         # Custom React hooks — reusable stateful logic
└── lib/           # Pure functions — no React, fully testable
    ├── types.ts   # All TypeScript types/interfaces
    ├── scoring.ts # Decision algorithms (MUST be deterministic)
    └── ...
```

### Naming Conventions

| Entity     | Convention                               | Example                         |
| ---------- | ---------------------------------------- | ------------------------------- |
| Components | PascalCase                               | `DecisionBuilder.tsx`           |
| Hooks      | camelCase with `use` prefix              | `useValidation.ts`              |
| Utilities  | camelCase                                | `formatRelativeTime`            |
| Types      | PascalCase                               | `Decision`, `OptionResult`      |
| Constants  | UPPER_SNAKE_CASE                         | `MAX_OPTIONS`                   |
| Files      | PascalCase (components), camelCase (lib) | `ResultsView.tsx`, `scoring.ts` |

## Commit Message Format

We use [Conventional Commits](https://www.conventionalcommits.org/):

```
type(scope): description

[optional body]

[optional footer]
```

### Types

| Type       | Description                             |
| ---------- | --------------------------------------- |
| `feat`     | New feature                             |
| `fix`      | Bug fix                                 |
| `docs`     | Documentation only                      |
| `style`    | Formatting, no code change              |
| `refactor` | Code change that neither fixes nor adds |
| `perf`     | Performance improvement                 |
| `test`     | Adding or updating tests                |
| `build`    | Build system or dependencies            |
| `ci`       | CI/CD changes                           |
| `chore`    | Other changes (configs, scripts)        |
| `revert`   | Revert a previous commit                |

### Examples

```
feat: add TOPSIS algorithm implementation
fix(scoring): correct weight normalization for zero-weight edge case
docs: update architecture diagram with new components
test: add edge case tests for Monte Carlo simulation
chore(deps): update vitest to v4.1.0
feat!: change score matrix format (BREAKING CHANGE)
```

### Breaking Changes

Add `!` after the type or include `BREAKING CHANGE:` in the footer:

```
feat!: change score matrix from nested to flat format

BREAKING CHANGE: ScoreMatrix type changed from Record<string, number> to flat array.
```

## Pull Request Requirements

Every PR must:

1. **Title**: Follow conventional commit format
2. **Description**: Fill out the PR template completely
3. **Tests**: New logic must have tests; existing tests must pass
4. **Types**: `npm run typecheck` passes
5. **Lint**: `npm run lint` passes with zero warnings
6. **Build**: `npm run build` succeeds
7. **Docs**: Updated if behavior changed
8. **Size**: Keep PRs focused — prefer small, reviewable changes
9. **Scoring engine**: Changes to `src/lib/scoring.ts` must update `docs/SCORING_MODEL.md`

## Adding a New Decision Algorithm

1. **Create the implementation** in `src/lib/`:

   ```typescript
   // src/lib/topsis.ts
   export function computeTOPSIS(decision: Decision): DecisionResults {
     // Pure function — no side effects, deterministic
   }
   ```

2. **Write comprehensive tests** in `src/__tests__/`:

   ```typescript
   // src/__tests__/topsis.test.ts
   describe("TOPSIS", () => {
     it("should rank options correctly for known example", () => {
       // Use a worked example from academic literature
     });
   });
   ```

3. **Document the algorithm** in `docs/DECISION_FRAMEWORKS.md`:
   - Mathematical notation (LaTeX)
   - When to use it
   - Academic references

4. **Add types** to `src/lib/types.ts` if needed

5. **Create an ADR** in `docs/DECISIONS/` explaining why this algorithm was added

## Adding a New UI Component

1. **Create the component** in `src/components/`:

   ```typescript
   // src/components/MyComponent.tsx
   export interface MyComponentProps {
     // Define props
   }

   export function MyComponent({ ...props }: MyComponentProps) {
     return (/* JSX */);
   }
   ```

2. **Ensure accessibility**:
   - Keyboard navigable
   - ARIA labels on interactive elements
   - Proper semantic HTML
   - Sufficient color contrast

3. **Write tests** in `src/__tests__/components/`:

   ```typescript
   // src/__tests__/components/MyComponent.test.tsx
   import { renderWithProviders } from "../test-utils";
   ```

4. **Style with Tailwind CSS** — no custom CSS unless absolutely necessary

## Testing

### Running Tests

```bash
npm run test            # All unit tests
npm run test:watch      # Watch mode
npm run test:coverage   # With coverage report
npm run test:e2e        # Playwright E2E tests
```

### Test Philosophy

- **Pure functions**: Test inputs → outputs with known-answer tests
- **Components**: Test user-visible behavior, not implementation details
- **Edge cases**: Empty inputs, maximum values, zero weights, single option/criterion
- **Determinism**: Same inputs MUST produce same outputs, always

### Coverage Requirements

- Statements: ≥ 80%
- Branches: ≥ 75%
- Functions: ≥ 80%
- Lines: ≥ 80%

## Documentation

### When to Update Docs

- New feature → Update README features list
- Algorithm change → Update `docs/SCORING_MODEL.md` and `docs/DECISION_FRAMEWORKS.md`
- Architecture change → Update `docs/ARCHITECTURE.md`
- New component → Auto-indexed by CI, but add JSDoc

### Writing Style

- **Concise**: Say it in fewer words
- **Examples**: Include code samples and worked examples
- **Accurate**: Keep docs in sync with code (CI helps)

## Questions?

- Open a [Discussion](https://github.com/ericsocrat/decision-os/discussions)
- Check existing [Issues](https://github.com/ericsocrat/decision-os/issues)
- Read the [Architecture](docs/ARCHITECTURE.md) and [Governance](docs/GOVERNANCE.md) docs
