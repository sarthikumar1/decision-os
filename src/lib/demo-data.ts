/**
 * Demo decision data for Decision OS.
 *
 * This preloaded decision lets visitors explore the app immediately
 * without entering any data. It models a real-world scenario:
 * choosing between three cities to relocate to.
 */

import type { Decision } from "./types";

export const DEMO_DECISION: Decision = {
  id: "demo-relocation-decision",
  title: "Best City to Relocate To",
  description:
    "Evaluating three cities based on cost of living, job opportunities, quality of life, weather, and proximity to family. All scores are subjective assessments on a 0–10 scale.",
  options: [
    { id: "opt-austin", name: "Austin, TX", description: "Tech hub with growing economy" },
    { id: "opt-denver", name: "Denver, CO", description: "Outdoor lifestyle and booming market" },
    { id: "opt-raleigh", name: "Raleigh, NC", description: "Research Triangle with lower costs" },
  ],
  criteria: [
    {
      id: "crit-cost",
      name: "Cost of Living",
      weight: 30,
      type: "cost",
      description: "Monthly expenses including rent, food, transport (lower is better)",
    },
    {
      id: "crit-jobs",
      name: "Job Opportunities",
      weight: 35,
      type: "benefit",
      description: "Availability of roles in tech/engineering",
    },
    {
      id: "crit-qol",
      name: "Quality of Life",
      weight: 20,
      type: "benefit",
      description: "Overall livability: safety, culture, healthcare, recreation",
    },
    {
      id: "crit-weather",
      name: "Weather",
      weight: 10,
      type: "benefit",
      description: "Personal preference for climate",
    },
    {
      id: "crit-family",
      name: "Proximity to Family",
      weight: 5,
      type: "benefit",
      description: "Distance to close family members",
    },
  ],
  scores: {
    "opt-austin": {
      "crit-cost": 6,
      "crit-jobs": 9,
      "crit-qol": 7,
      "crit-weather": 5,
      "crit-family": 3,
    },
    "opt-denver": {
      "crit-cost": 7,
      "crit-jobs": 7,
      "crit-qol": 9,
      "crit-weather": 8,
      "crit-family": 5,
    },
    "opt-raleigh": {
      "crit-cost": 4,
      "crit-jobs": 6,
      "crit-qol": 8,
      "crit-weather": 7,
      "crit-family": 8,
    },
  },
  createdAt: "2026-01-15T10:00:00.000Z",
  updatedAt: "2026-01-15T10:00:00.000Z",
};
