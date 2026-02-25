# PR3: Decision Builder UI + Validation + LocalStorage

## Description

Build the decision builder interface with real-time editing, validation, and localStorage persistence.

## Changes

- `src/components/DecisionProvider.tsx`: React Context for state management + auto-save
- `src/components/DecisionBuilder.tsx`: Full decision editor (title, options, criteria, scores matrix)
- `src/components/Header.tsx`: App header with decision selector, create/delete/reset
- `src/lib/storage.ts`: LocalStorage CRUD with auto-initialization
- `src/lib/demo-data.ts`: Preloaded "Best City to Relocate To" demo decision

## Acceptance Criteria

- [x] Users can edit decision title and description
- [x] Users can add/remove/rename options
- [x] Users can add/remove/edit criteria (name, weight, type)
- [x] Scores matrix allows 0–10 input per cell
- [x] Data persists in localStorage with 300ms debounced auto-save
- [x] Demo decision loads on first visit
- [x] Multiple decisions supported
- [x] All inputs have proper labels and validation
