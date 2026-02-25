# ADR-001: Local-First Architecture for MVP

## Status

Accepted

## Context

Decision OS needs data persistence for user decisions. Options considered:

1. **No persistence**: Ephemeral state (lost on refresh)
2. **LocalStorage**: Client-side persistence, no backend
3. **Supabase**: Cloud database with auth
4. **SQLite (via WASM)**: Client-side SQL database

## Decision

**LocalStorage** for MVP. Supabase will be added behind a feature flag in v0.3.0.

## Rationale

- **Speed**: Zero backend setup = faster to ship
- **Privacy**: User data never leaves the browser
- **Simplicity**: No auth, no API, no infra costs
- **Vercel**: Deploys as a static site (fast, free)
- **Trade-off accepted**: Data is device-bound and limited to ~5MB

## Consequences

- Users cannot share data across devices (until v0.3.0)
- Clearing browser data deletes decisions
- URL sharing uses base64-encoded state (with size limits)
