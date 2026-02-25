# Scoring Model

## Overview

Decision OS uses a **Weighted Sum Model (WSM)** for multi-criteria decision analysis. This document specifies the exact formulas, rules, and examples.

## Definitions

| Symbol | Definition |
|--------|-----------|
| $O$ | Set of options $\{o_1, o_2, \ldots, o_m\}$ |
| $C$ | Set of criteria $\{c_1, c_2, \ldots, c_n\}$ |
| $w_i$ | Raw weight for criterion $c_i$ (0–100) |
| $\hat{w}_i$ | Normalized weight for criterion $c_i$ |
| $s_{j,i}$ | Raw score for option $o_j$ on criterion $c_i$ (0–10) |
| $e_{j,i}$ | Effective score (adjusted for criterion type) |
| $T_j$ | Total weighted score for option $o_j$ |

## Step 1: Normalize Weights

Raw weights can be any value 0–100. They are normalized to sum to 1.0:

$$\hat{w}_i = \frac{\max(0, w_i)}{\sum_{k=1}^{n} \max(0, w_k)}$$

**Edge case**: If all raw weights are 0, each normalized weight = $\frac{1}{n}$ (equal weighting).

**Edge case**: Negative weights are treated as 0.

## Step 2: Compute Effective Scores

Each criterion has a type: **benefit** (higher is better) or **cost** (lower is better).

$$e_{j,i} = \begin{cases} s_{j,i} & \text{if } c_i \text{ is benefit} \\ 10 - s_{j,i} & \text{if } c_i \text{ is cost} \end{cases}$$

Scores are clamped to [0, 10] before the effective score is computed.

## Step 3: Compute Total Score

$$T_j = \sum_{i=1}^{n} \hat{w}_i \times e_{j,i}$$

The maximum possible total score is **10.00** (if all effective scores are 10).

## Step 4: Rank Options

Options are sorted by $T_j$ descending. Ties are broken by insertion order (first added wins).

## Display Rounding

All displayed scores are rounded to **2 decimal places** using JavaScript's `Number.toFixed(2)`.

## Worked Example

### Setup

**Decision**: Which laptop to buy?

| Option | Price (cost, w=40) | Performance (benefit, w=35) | Portability (benefit, w=25) |
|--------|--------------------|-----------------------------|-----------------------------|
| MacBook Pro | 8 | 9 | 7 |
| ThinkPad X1 | 5 | 7 | 8 |

### Step 1: Normalize Weights

Total raw weight = 40 + 35 + 25 = 100

| Criterion | Raw Weight | Normalized |
|-----------|-----------|------------|
| Price | 40 | 0.40 |
| Performance | 35 | 0.35 |
| Portability | 25 | 0.25 |

### Step 2: Effective Scores

| Option | Price (cost: 10-s) | Performance | Portability |
|--------|-------------------|-------------|-------------|
| MacBook Pro | 10 - 8 = **2** | **9** | **7** |
| ThinkPad X1 | 10 - 5 = **5** | **7** | **8** |

### Step 3: Total Scores

**MacBook Pro**: (0.40 × 2) + (0.35 × 9) + (0.25 × 7) = 0.80 + 3.15 + 1.75 = **5.70**

**ThinkPad X1**: (0.40 × 5) + (0.35 × 7) + (0.25 × 8) = 2.00 + 2.45 + 2.00 = **6.45**

### Step 4: Rankings

| Rank | Option | Score |
|------|--------|-------|
| 1 | ThinkPad X1 | 6.45 |
| 2 | MacBook Pro | 5.70 |

**Winner: ThinkPad X1** — it scores higher primarily because of better value on Price (the highest-weighted criterion).

## Sensitivity Analysis

The weight-swing analysis tests robustness by adjusting each criterion's weight by ±N% and recomputing:

1. For each criterion $c_i$:
   - Compute $w_i^{+} = w_i \times (1 + \text{swing}/100)$
   - Compute $w_i^{-} = \max(0, w_i \times (1 - \text{swing}/100))$
   - Recompute results with modified weight
   - Check if winner changes

2. Report: "X out of Y swings change the winner"

A **robust** result means no reasonable weight adjustment flips the outcome.

## Determinism Guarantee

The scoring engine is **deterministic**: identical inputs always produce identical outputs. There is no randomness, no floating-point-dependent branching, and all edge cases produce defined results. This is verified by unit tests.
