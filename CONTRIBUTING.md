# Contributing to Decision OS

Thank you for your interest in contributing! This guide will help you get started.

## Getting Started

1. **Fork** the repository
2. **Clone** your fork: `git clone https://github.com/YOUR_USERNAME/decision-os.git`
3. **Install dependencies**: `npm install`
4. **Create a branch**: `git checkout -b feature/your-feature-name`
5. **Make changes** and commit
6. **Push** and open a Pull Request

## Development

```bash
npm run dev       # Start dev server (http://localhost:3000)
npm run test      # Run unit tests
npm run lint      # Lint code
npm run typecheck # Check TypeScript types
npm run build     # Production build
```

## Code Standards

- **TypeScript** — strict mode, no `any` types unless justified
- **Formatting** — Prettier (run `npm run format` before committing)
- **Linting** — ESLint (run `npm run lint` before committing)
- **Tests** — All scoring engine changes must include unit tests
- **Deterministic engine** — Do NOT change the scoring formulas without updating `docs/SCORING_MODEL.md` and all related tests
- **Accessibility** — All interactive elements must be keyboard-navigable with proper ARIA attributes

## Commit Messages

Use conventional commit format:

```
feat: add Monte Carlo sensitivity analysis
fix: correct weight normalization for edge case
docs: update scoring model documentation
test: add edge case tests for zero weights
chore: update dependencies
```

## Pull Request Process

1. Ensure all tests pass: `npm run test`
2. Ensure lint is clean: `npm run lint`
3. Ensure build succeeds: `npm run build`
4. Update documentation if you changed behavior
5. Fill out the PR template completely
6. Request review from a maintainer

## Architecture

See [docs/ARCHITECTURE.md](docs/ARCHITECTURE.md) for system design.

## Scoring Model

See [docs/SCORING_MODEL.md](docs/SCORING_MODEL.md) for the mathematical model. Any changes to scoring logic must:

- Update the documentation
- Update or add unit tests
- Maintain deterministic behavior (same inputs → same outputs, always)

## Reporting Issues

Use the GitHub issue templates:

- **Bug Report**: For bugs or unexpected behavior
- **Feature Request**: For new features or improvements

## Code of Conduct

This project follows the [Contributor Covenant Code of Conduct](CODE_OF_CONDUCT.md). By participating, you agree to uphold this code.
