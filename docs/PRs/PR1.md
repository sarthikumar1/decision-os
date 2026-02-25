# PR1: Repo Scaffold + Tooling + CI + Base App Shell

## Description

Initial project setup with all engineering infrastructure.

## Changes

- Initialize Next.js 16 with App Router + TypeScript + Tailwind CSS
- Configure ESLint, Prettier, EditorConfig
- Set up Vitest for unit testing
- Create GitHub Actions CI workflow (lint, typecheck, test, build)
- Add GitHub issue templates (bug, feature) and PR template
- Create repo hygiene files: LICENSE (MIT), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, CHANGELOG
- Set up project structure: `src/lib/`, `src/components/`, `src/app/`, `docs/`
- Add copilot-instructions.md for AI agent conventions

## Acceptance Criteria

- [x] `npm install` succeeds
- [x] `npm run dev` starts dev server
- [x] `npm run build` produces production build
- [x] `npm run lint` passes
- [x] `npm run typecheck` passes
- [x] CI workflow YAML is valid
- [x] All repo hygiene files present
