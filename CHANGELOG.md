# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Fixed

- **ARIA tab-panel linkage**: Tab buttons now have proper `id` attributes matching `aria-labelledby` on panels; roving tabindex with arrow-key + Home/End navigation (#17)
- **Modal focus trap**: Keyboard shortcuts modal traps Tab/Shift+Tab, focuses close button on open, restores focus on close (#17)
- **Runtime schema validation**: Type guard functions (`isDecision`, `isOption`, `isCriterion`, `isDecisionArray`) replace unsafe `as T` casts on localStorage and URL decode (#21)
- **Score clamping**: Score inputs clamped to 0–10 integer range in `updateScore` (#21)
- **E2E assertion mismatch**: New decisions now use "Untitled Decision" matching E2E test expectations (#6)
- **Shared URL restoration**: Visiting a share link now correctly restores the decision state (#5)
- **localStorage safety**: All localStorage calls wrapped in try/catch for private browsing compatibility (#16)
- **Double-rounding in scoring**: Total score now computed from unrounded weighted scores, preventing ranking inversions (#23)
- **Orphaned types**: `SensitivityAnalysis` and `SensitivityPoint` types now used by scoring engine (#31)
- **Dark mode FOUC**: Inline script prevents flash of light mode on dark-mode-enabled browsers (#26)
- **Dark mode coverage**: Full dark mode support across DecisionBuilder, SensitivityView, and ResultsView (#18)
- **Winner badge dark mode**: Winner badge in ResultsView now visible in dark mode
- **Option label overflow**: Options beyond Z now use AA, AB, ... labels (#22)

### Added

- **aria-describedby on inputs**: Score, weight, and sensitivity slider inputs now have screen-reader-visible range descriptions (#41)
- **aria-live announcer**: `AnnouncerProvider` + `useAnnounce()` hook announces CRUD operations, tab switches, and auto-save to screen readers (#29)
- **PWA web app manifest**: `manifest.ts` with app name, icons, standalone display mode, and theme color (#36)
- **Decision timestamps**: Created/updated `<time>` elements with relative formatting (`formatRelativeTime`) in Decision Builder; `updatedAt` auto-set on every edit (#43)
- **Print stylesheet**: Expanded `@media print` rules — all tab panels visible, nav/footer/buttons hidden, light palette forced, page-break-avoid on sections, link URLs shown (#24)
- **Cross-browser E2E**: Playwright config now includes Chromium, Firefox, and WebKit projects; CI installs all three browsers (#37)
- **HTTP security headers**: HSTS, X-Frame-Options, X-Content-Type-Options, Referrer-Policy, Permissions-Policy (#20)
- **CI format:check step**: Prettier formatting enforced in CI pipeline (#30)
- **Dependabot config**: Automated dependency updates for npm and GitHub Actions (#32)
- **Coverage thresholds**: V8 coverage with 80% statement/function/line thresholds (#38)
- **CODEOWNERS file**: Auto-assigns reviewers for PRs (#34)
- **robots.txt + sitemap.xml**: SEO improvements for search engine indexing (#35)
- **Dynamic footer version**: Footer version derived from package.json (#39)
- **Confirmation dialogs**: Delete and reset actions now require user confirmation (#19)
- **Input limits**: maxLength on text inputs to prevent excessive data (#27)

### Changed

- **next/image for logo**: Logo in header now uses Next.js Image component for optimization (#28)
- **Removed dead code**: Removed unused `cn()`, `printRef`, `class-variance-authority`, `clsx`, `tailwind-merge` (#15)

## [0.1.0] - 2026-02-25

### Added

- **Decision Builder**: Create decisions with title, description, options, and criteria
- **Scoring Engine**: Deterministic weighted-sum scoring model with benefit/cost criteria
- **Results View**: Ranked options with score breakdown, top drivers, and explanation
- **Sensitivity Analysis**: Weight-swing analysis showing how robust the winner is
- **Data Persistence**: LocalStorage-based persistence with auto-save
- **Demo Decision**: Preloaded "Best City to Relocate To" example
- **Export**: JSON export of decision data and results
- **Share**: URL-based sharing (base64 encoded state)
- **Accessibility**: Keyboard navigation, ARIA labels, semantic HTML
- **Documentation**: Architecture, scoring model, data sources, roadmap, ADRs
- **CI/CD**: GitHub Actions workflow for lint, test, typecheck, and build
- **Repo Hygiene**: README, LICENSE (MIT), CONTRIBUTING, CODE_OF_CONDUCT, SECURITY, PR/issue templates
