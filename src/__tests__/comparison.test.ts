/**
 * Unit tests for the decision comparison engine.
 *
 * Tests cover:
 * - compareDecisions() with identical decisions
 * - compareDecisions() with completely different options
 * - compareDecisions() with shared options and different scores
 * - Agreement score calculation (strong / moderate / weak thresholds)
 * - Weight comparison with shared and non-shared criteria
 * - Spearman rank correlation
 * - Divergence color mapping
 * - Edge cases (empty decisions, single option, etc.)
 */

import { describe, it, expect } from "vitest";
import {
  compareDecisions,
  spearmanRankCorrelation,
  getDivergenceColor,
  getAgreementLabel,
} from "@/lib/comparison";
import type { Decision } from "@/lib/types";

// ---------------------------------------------------------------------------
// Helpers — re-usable decision factories
// ---------------------------------------------------------------------------

function makeDecision(overrides: Partial<Decision> & { id: string; title: string }): Decision {
  return {
    options: [],
    criteria: [],
    scores: {},
    createdAt: "2025-01-01T00:00:00Z",
    updatedAt: "2025-01-01T00:00:00Z",
    description: "",
    ...overrides,
  };
}

/** Builds two decisions that share the same options/criteria/scores (identical) */
function makeIdenticalPair() {
  const base: Decision = makeDecision({
    id: "d1",
    title: "Decision A",
    options: [
      { id: "o1", name: "Austin" },
      { id: "o2", name: "Denver" },
      { id: "o3", name: "Raleigh" },
    ],
    criteria: [
      { id: "c1", name: "Cost", weight: 40, type: "cost" },
      { id: "c2", name: "Jobs", weight: 60, type: "benefit" },
    ],
    scores: {
      o1: { c1: 4, c2: 8 },
      o2: { c1: 6, c2: 7 },
      o3: { c1: 3, c2: 5 },
    },
  });

  const clone: Decision = {
    ...base,
    id: "d2",
    title: "Decision B",
    options: base.options.map((o) => ({ ...o })),
    criteria: base.criteria.map((c) => ({ ...c })),
    scores: JSON.parse(JSON.stringify(base.scores)),
  };

  return { decA: base, decB: clone };
}

/** Builds two decisions with completely different options */
function makeDisjointPair() {
  const decA = makeDecision({
    id: "d1",
    title: "Decision A",
    options: [
      { id: "o1", name: "Alpha" },
      { id: "o2", name: "Beta" },
    ],
    criteria: [{ id: "c1", name: "Speed", weight: 100, type: "benefit" }],
    scores: { o1: { c1: 8 }, o2: { c1: 5 } },
  });

  const decB = makeDecision({
    id: "d2",
    title: "Decision B",
    options: [
      { id: "o3", name: "Gamma" },
      { id: "o4", name: "Delta" },
    ],
    criteria: [{ id: "c2", name: "Quality", weight: 100, type: "benefit" }],
    scores: { o3: { c2: 7 }, o4: { c2: 9 } },
  });

  return { decA, decB };
}

/** Builds two decisions with shared options but different scores/weights */
function makeOverlappingPair() {
  const decA = makeDecision({
    id: "d1",
    title: "Decision A",
    options: [
      { id: "o1", name: "Austin" },
      { id: "o2", name: "Denver" },
      { id: "o3", name: "Seattle" },
    ],
    criteria: [
      { id: "c1", name: "Cost", weight: 30, type: "cost" },
      { id: "c2", name: "Jobs", weight: 70, type: "benefit" },
    ],
    scores: {
      o1: { c1: 4, c2: 8 },
      o2: { c1: 6, c2: 7 },
      o3: { c1: 2, c2: 9 },
    },
  });

  const decB = makeDecision({
    id: "d2",
    title: "Decision B",
    options: [
      { id: "o4", name: "Austin" },
      { id: "o5", name: "Denver" },
      { id: "o6", name: "Portland" },
    ],
    criteria: [
      { id: "c3", name: "Cost", weight: 50, type: "cost" },
      { id: "c4", name: "Jobs", weight: 50, type: "benefit" },
      { id: "c5", name: "Climate", weight: 20, type: "benefit" },
    ],
    scores: {
      o4: { c3: 6, c4: 7, c5: 5 },
      o5: { c3: 5, c4: 9, c5: 8 },
      o6: { c3: 3, c4: 6, c5: 9 },
    },
  });

  return { decA, decB };
}

// ---------------------------------------------------------------------------
// spearmanRankCorrelation
// ---------------------------------------------------------------------------

describe("spearmanRankCorrelation", () => {
  it("returns 1 for identical ranks", () => {
    expect(spearmanRankCorrelation([1, 2, 3], [1, 2, 3])).toBe(1);
  });

  it("returns 0 for perfectly reversed ranks (2 items)", () => {
    // For n=2, reversed gives ρ = -1, mapped to 0
    expect(spearmanRankCorrelation([1, 2], [2, 1])).toBe(0);
  });

  it("returns 1 for single item", () => {
    expect(spearmanRankCorrelation([1], [1])).toBe(1);
  });

  it("returns 1 for empty arrays", () => {
    expect(spearmanRankCorrelation([], [])).toBe(1);
  });

  it("returns value between 0 and 1 for partially different ranks", () => {
    const result = spearmanRankCorrelation([1, 2, 3, 4], [1, 3, 2, 4]);
    expect(result).toBeGreaterThan(0);
    expect(result).toBeLessThan(1);
  });
});

// ---------------------------------------------------------------------------
// getDivergenceColor
// ---------------------------------------------------------------------------

describe("getDivergenceColor", () => {
  it("returns green for |delta| <= 1", () => {
    expect(getDivergenceColor(0)).toBe("green");
    expect(getDivergenceColor(1)).toBe("green");
    expect(getDivergenceColor(-1)).toBe("green");
  });

  it("returns yellow for |delta| 2-3", () => {
    expect(getDivergenceColor(2)).toBe("yellow");
    expect(getDivergenceColor(3)).toBe("yellow");
    expect(getDivergenceColor(-2)).toBe("yellow");
    expect(getDivergenceColor(-3)).toBe("yellow");
  });

  it("returns red for |delta| >= 4", () => {
    expect(getDivergenceColor(4)).toBe("red");
    expect(getDivergenceColor(-5)).toBe("red");
    expect(getDivergenceColor(10)).toBe("red");
  });
});

// ---------------------------------------------------------------------------
// getAgreementLabel
// ---------------------------------------------------------------------------

describe("getAgreementLabel", () => {
  it("returns strong for score >= 0.8", () => {
    expect(getAgreementLabel(0.8)).toBe("strong");
    expect(getAgreementLabel(1.0)).toBe("strong");
    expect(getAgreementLabel(0.95)).toBe("strong");
  });

  it("returns moderate for score 0.5-0.79", () => {
    expect(getAgreementLabel(0.5)).toBe("moderate");
    expect(getAgreementLabel(0.79)).toBe("moderate");
    expect(getAgreementLabel(0.65)).toBe("moderate");
  });

  it("returns weak for score < 0.5", () => {
    expect(getAgreementLabel(0.49)).toBe("weak");
    expect(getAgreementLabel(0.0)).toBe("weak");
    expect(getAgreementLabel(0.25)).toBe("weak");
  });
});

// ---------------------------------------------------------------------------
// compareDecisions — identical decisions
// ---------------------------------------------------------------------------

describe("compareDecisions — identical", () => {
  it("returns 100% agreement for identical decisions", () => {
    const { decA, decB } = makeIdenticalPair();
    const result = compareDecisions(decA, decB);

    expect(result.agreementScore).toBe(1);
    expect(result.agreementLabel).toBe("strong");
  });

  it("has all options as shared with zero deltas", () => {
    const { decA, decB } = makeIdenticalPair();
    const result = compareDecisions(decA, decB);

    expect(result.sharedOptions).toHaveLength(3);
    expect(result.onlyInA).toHaveLength(0);
    expect(result.onlyInB).toHaveLength(0);

    for (const opt of result.sharedOptions) {
      expect(opt.rankDelta).toBe(0);
      expect(opt.scoreDelta).toBe(0);
    }
  });

  it("has all criteria as shared with zero weight deltas", () => {
    const { decA, decB } = makeIdenticalPair();
    const result = compareDecisions(decA, decB);

    expect(result.sharedCriteria).toHaveLength(2);
    expect(result.onlyCriteriaInA).toHaveLength(0);
    expect(result.onlyCriteriaInB).toHaveLength(0);

    for (const crit of result.sharedCriteria) {
      expect(crit.weightDelta).toBe(0);
    }
  });

  it("has zero deltas in score matrix", () => {
    const { decA, decB } = makeIdenticalPair();
    const result = compareDecisions(decA, decB);

    expect(result.scoreMatrix.length).toBeGreaterThan(0);
    for (const entry of result.scoreMatrix) {
      expect(entry.delta).toBe(0);
    }
  });

  it("summary says all ranked identically", () => {
    const { decA, decB } = makeIdenticalPair();
    const result = compareDecisions(decA, decB);

    expect(result.summary).toContain("ranked identically");
  });
});

// ---------------------------------------------------------------------------
// compareDecisions — disjoint decisions
// ---------------------------------------------------------------------------

describe("compareDecisions — disjoint", () => {
  it("returns 0 shared options", () => {
    const { decA, decB } = makeDisjointPair();
    const result = compareDecisions(decA, decB);

    expect(result.sharedOptions).toHaveLength(0);
    expect(result.onlyInA).toHaveLength(2);
    expect(result.onlyInB).toHaveLength(2);
  });

  it("returns 0 shared criteria", () => {
    const { decA, decB } = makeDisjointPair();
    const result = compareDecisions(decA, decB);

    expect(result.sharedCriteria).toHaveLength(0);
    expect(result.onlyCriteriaInA).toHaveLength(1);
    expect(result.onlyCriteriaInB).toHaveLength(1);
  });

  it("returns 0 agreement when no shared options", () => {
    const { decA, decB } = makeDisjointPair();
    const result = compareDecisions(decA, decB);

    expect(result.agreementScore).toBe(0);
    expect(result.agreementLabel).toBe("weak");
  });

  it("has empty score matrix", () => {
    const { decA, decB } = makeDisjointPair();
    const result = compareDecisions(decA, decB);

    expect(result.scoreMatrix).toHaveLength(0);
  });

  it("summary says no shared options", () => {
    const { decA, decB } = makeDisjointPair();
    const result = compareDecisions(decA, decB);

    expect(result.summary).toContain("No shared options");
  });
});

// ---------------------------------------------------------------------------
// compareDecisions — overlapping decisions
// ---------------------------------------------------------------------------

describe("compareDecisions — overlapping", () => {
  it("identifies shared and unique options", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    // Austin and Denver are shared
    expect(result.sharedOptions).toHaveLength(2);
    expect(result.sharedOptions.map((o) => o.optionName)).toContain("Austin");
    expect(result.sharedOptions.map((o) => o.optionName)).toContain("Denver");

    // Seattle only in A, Portland only in B
    expect(result.onlyInA).toContain("Seattle");
    expect(result.onlyInB).toContain("Portland");
  });

  it("identifies shared and unique criteria", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    // Cost and Jobs are shared
    expect(result.sharedCriteria).toHaveLength(2);
    expect(result.sharedCriteria.map((c) => c.criterionName)).toContain("Cost");
    expect(result.sharedCriteria.map((c) => c.criterionName)).toContain("Jobs");

    // Climate only in B
    expect(result.onlyCriteriaInA).toHaveLength(0);
    expect(result.onlyCriteriaInB).toContain("Climate");
  });

  it("calculates correct rank deltas", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    // Each shared option should have numeric rank and delta
    for (const opt of result.sharedOptions) {
      expect(typeof opt.rankA).toBe("number");
      expect(typeof opt.rankB).toBe("number");
      expect(opt.rankDelta).toBe(opt.rankB - opt.rankA);
    }
  });

  it("calculates correct score deltas", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    for (const opt of result.sharedOptions) {
      const expectedDelta = parseFloat((opt.scoreB - opt.scoreA).toFixed(2));
      expect(opt.scoreDelta).toBe(expectedDelta);
    }
  });

  it("calculates weight deltas correctly", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    for (const crit of result.sharedCriteria) {
      const expectedDelta = parseFloat((crit.weightB - crit.weightA).toFixed(1));
      expect(crit.weightDelta).toBe(expectedDelta);
    }
  });

  it("builds score matrix for shared options × shared criteria", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    // 2 shared options × 2 shared criteria = 4 entries
    expect(result.scoreMatrix).toHaveLength(4);

    for (const entry of result.scoreMatrix) {
      expect(entry.delta).toBe(entry.scoreB - entry.scoreA);
    }
  });

  it("returns an agreement score between 0 and 1", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    expect(result.agreementScore).toBeGreaterThanOrEqual(0);
    expect(result.agreementScore).toBeLessThanOrEqual(1);
  });
});

// ---------------------------------------------------------------------------
// compareDecisions — case-insensitive matching
// ---------------------------------------------------------------------------

describe("compareDecisions — name matching", () => {
  it("matches options case-insensitively", () => {
    const decA = makeDecision({
      id: "d1",
      title: "A",
      options: [{ id: "o1", name: "Austin" }],
      criteria: [{ id: "c1", name: "Cost", weight: 100, type: "benefit" }],
      scores: { o1: { c1: 5 } },
    });

    const decB = makeDecision({
      id: "d2",
      title: "B",
      options: [{ id: "o2", name: "AUSTIN" }],
      criteria: [{ id: "c2", name: "cost", weight: 100, type: "benefit" }],
      scores: { o2: { c2: 7 } },
    });

    const result = compareDecisions(decA, decB);
    expect(result.sharedOptions).toHaveLength(1);
    expect(result.sharedCriteria).toHaveLength(1);
    expect(result.onlyInA).toHaveLength(0);
    expect(result.onlyInB).toHaveLength(0);
  });

  it("matches options with trimmed whitespace", () => {
    const decA = makeDecision({
      id: "d1",
      title: "A",
      options: [{ id: "o1", name: "  Austin  " }],
      criteria: [{ id: "c1", name: "Cost", weight: 100, type: "benefit" }],
      scores: { o1: { c1: 5 } },
    });

    const decB = makeDecision({
      id: "d2",
      title: "B",
      options: [{ id: "o2", name: "Austin" }],
      criteria: [{ id: "c2", name: "Cost", weight: 100, type: "benefit" }],
      scores: { o2: { c2: 7 } },
    });

    const result = compareDecisions(decA, decB);
    expect(result.sharedOptions).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// compareDecisions — edge cases
// ---------------------------------------------------------------------------

describe("compareDecisions — edge cases", () => {
  it("handles empty decisions gracefully", () => {
    const decA = makeDecision({ id: "d1", title: "Empty A" });
    const decB = makeDecision({ id: "d2", title: "Empty B" });

    const result = compareDecisions(decA, decB);
    expect(result.sharedOptions).toHaveLength(0);
    expect(result.sharedCriteria).toHaveLength(0);
    expect(result.scoreMatrix).toHaveLength(0);
    expect(result.summary).toContain("No shared options");
  });

  it("handles single shared option (agreement = 1)", () => {
    const decA = makeDecision({
      id: "d1",
      title: "A",
      options: [{ id: "o1", name: "Alpha" }],
      criteria: [{ id: "c1", name: "Speed", weight: 100, type: "benefit" }],
      scores: { o1: { c1: 8 } },
    });

    const decB = makeDecision({
      id: "d2",
      title: "B",
      options: [{ id: "o2", name: "Alpha" }],
      criteria: [{ id: "c2", name: "Speed", weight: 100, type: "benefit" }],
      scores: { o2: { c2: 3 } },
    });

    const result = compareDecisions(decA, decB);
    expect(result.sharedOptions).toHaveLength(1);
    expect(result.agreementScore).toBe(1); // single item = perfect agreement
  });

  it("summary includes rank change count", () => {
    const { decA, decB } = makeOverlappingPair();
    const result = compareDecisions(decA, decB);

    // Summary should mention how many ranked differently
    expect(result.summary).toMatch(/\d+ of \d+ options|ranked identically/);
  });
});
