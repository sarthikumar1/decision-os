# Governance

## Decision-Making Process

Decision OS follows a transparent, community-driven governance model. This document describes how decisions are made about the project itself — appropriately meta for a decision-making tool.

## Roles & Responsibilities

### Contributor

Anyone who submits a pull request, files an issue, or participates in discussions.

**Requirements**: None — all are welcome.

**Privileges**:

- Submit issues and PRs
- Participate in discussions
- Vote on RFCs (non-binding)

### Maintainer

Trusted contributors with merge access and triage rights.

**Requirements**:

- 5+ merged PRs demonstrating quality and understanding of the codebase
- Consistent adherence to project standards
- Nominated by a Core Team member
- Approved by majority Core Team vote

**Privileges**:

- Triage issues (assign labels, milestones)
- Review and approve PRs
- Merge PRs (after CI passes)
- Participate in release decisions

### Core Team

Project leads with full administrative access.

**Current Core Team**:

- [@ericsocrat](https://github.com/ericsocrat) — Creator & Lead

**Privileges**:

- All Maintainer privileges
- Manage repository settings
- Make final decisions on contested RFCs
- Approve or reject Maintainer nominations
- Release authority

## RFC Process

Significant changes require a Request for Comments (RFC):

### What Requires an RFC

- New decision science algorithms
- Breaking changes to the scoring engine
- Architecture changes (new dependencies, data flow modifications)
- New major features
- Changes to governance

### RFC Workflow

1. **Propose**: Create an issue with the `RFC` label using the RFC template
2. **Discuss**: Community discusses for a minimum of 7 days
3. **Revise**: Author addresses feedback and updates the proposal
4. **Decide**: Core Team approves, requests changes, or rejects
5. **Implement**: If approved, an ADR is created in `docs/DECISIONS/` and implementation begins
6. **Record**: The ADR captures the decision rationale for future reference

### Decision Criteria

RFCs are evaluated on:

- **Alignment**: Does it serve the project's mission?
- **Quality**: Is the proposal technically sound?
- **Scope**: Is the change proportionate to its benefits?
- **Maintainability**: Can the team maintain this long-term?

## Code Review Standards

### Every PR Must

1. Pass all CI checks (lint, typecheck, test, build)
2. Follow conventional commit format for the PR title
3. Include tests for new logic
4. Update documentation for behavioral changes
5. Receive at least 1 approval

### Review Expectations

- **Reviewers**: Respond within 48 hours (business days)
- **Authors**: Address all feedback before requesting re-review
- **Tone**: Constructive and respectful — suggest, don't demand

### What Reviewers Check

- Correctness: Does the code do what it claims?
- Tests: Are edge cases covered?
- Performance: Any unnecessary re-renders or heavy computations?
- Accessibility: Keyboard navigable? Screen reader friendly?
- Types: Strict TypeScript, no `any` unless justified
- Documentation: Updated if behavior changed?

## Release Cadence

### Versioning

Decision OS follows [Semantic Versioning](https://semver.org/):

- **Major** (X.0.0): Breaking changes to scoring engine or data format
- **Minor** (0.X.0): New features, new algorithms, new components
- **Patch** (0.0.X): Bug fixes, documentation, dependency updates

### Release Process

1. Maintainer or Core Team triggers the release workflow
2. Version is determined from conventional commits (or manually specified)
3. `package.json` is updated
4. Release notes are auto-generated
5. GitHub Release is created with changelog
6. Tag is pushed

### Release Schedule

- **Patches**: As needed (security fixes within 24 hours)
- **Minor**: Every 2–4 weeks (batched features)
- **Major**: As needed with minimum 2-week RFC period

## Conflict Resolution

1. **Discussion**: Resolve in the issue/PR comments
2. **Mediation**: If unresolved, a Core Team member mediates
3. **Final Decision**: Core Team makes the final call, documented in an ADR

## Amendments

This governance document can be amended via the RFC process. Changes require Core Team approval and a minimum 14-day discussion period.
