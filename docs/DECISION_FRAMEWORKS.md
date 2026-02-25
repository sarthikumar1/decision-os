# Decision Frameworks

## Overview

Decision OS implements structured decision-making frameworks grounded in decision science and behavioral economics. This document describes every framework implemented or planned, its mathematical foundations, and when to use it.

---

## Implemented Frameworks

### 1. Weighted Sum Model (WSM)

**Status**: ✅ Implemented (v0.1.0)

The core algorithm of Decision OS. WSM is the most widely used multi-criteria decision analysis (MCDA) method.

#### Mathematical Foundation

Given $m$ options and $n$ criteria:

**Weight normalization**:

$$\hat{w}_i = \frac{\max(0, w_i)}{\sum_{k=1}^{n} \max(0, w_k)}$$

**Effective score** (adjusting for criterion type):

$$e_{j,i} = \begin{cases} s_{j,i} & \text{if benefit (higher is better)} \\ 10 - s_{j,i} & \text{if cost (lower is better)} \end{cases}$$

**Total score**:

$$T_j = \sum_{i=1}^{n} \hat{w}_i \times e_{j,i}$$

**Ranking**: Sort by $T_j$ descending.

#### When to Use

- General-purpose decision-making
- When criteria are commensurable (can be compared on a common scale)
- When weights represent relative importance
- Best for: career decisions, purchases, vendor selection, location comparisons

#### Assumptions

- Criteria are preferentially independent (the preference for one criterion doesn't depend on the value of another)
- Linear value function (going from 5 to 6 is as valuable as going from 8 to 9)
- Compensatory model (high performance on one criterion can compensate for low on another)

#### References

- Fishburn, P.C. (1967). "Additive Utilities with Incomplete Product Set." _J. Mathematical Psychology_, 4(1), 105–126.
- Triantaphyllou, E. (2000). _Multi-Criteria Decision Making Methods: A Comparative Study_. Springer.

---

### 2. Sensitivity Analysis (Weight Swing)

**Status**: ✅ Implemented (v0.1.0)

Tests the robustness of the decision by varying criterion weights.

#### Mathematical Foundation

For each criterion $c_i$ and swing percentage $p$:

$$w_i^{+} = w_i \times (1 + p/100)$$
$$w_i^{-} = \max(0, w_i \times (1 - p/100))$$

Re-compute WSM with adjusted weights. If the winner changes, the decision is sensitive to that criterion.

#### When to Use

- After getting WSM results to validate robustness
- When you're unsure about weight assignments
- When stakeholders disagree on weights
- To identify which criteria are "swing factors"

#### References

- Saltelli, A. et al. (2004). _Sensitivity Analysis in Practice_. Wiley.

---

## Planned Frameworks

### 3. TOPSIS (Technique for Order Preference by Similarity to Ideal Solution)

**Status**: 📋 Planned (v0.4.0)

Ranks options by their geometric distance from the ideal and anti-ideal solutions.

#### Mathematical Foundation

**Normalized decision matrix**:

$$r_{ij} = \frac{x_{ij}}{\sqrt{\sum_{j=1}^{m} x_{ij}^2}}$$

**Weighted normalized matrix**:

$$v_{ij} = w_i \times r_{ij}$$

**Ideal solution** $A^+$ and **anti-ideal** $A^-$:

$$A^+ = \{\max_j(v_{ij}) \mid \text{benefit}, \min_j(v_{ij}) \mid \text{cost}\}$$
$$A^- = \{\min_j(v_{ij}) \mid \text{benefit}, \max_j(v_{ij}) \mid \text{cost}\}$$

**Distance to ideal/anti-ideal**:

$$D_j^+ = \sqrt{\sum_{i=1}^{n}(v_{ij} - v_i^+)^2}$$
$$D_j^- = \sqrt{\sum_{i=1}^{n}(v_{ij} - v_i^-)^2}$$

**Closeness coefficient**:

$$C_j = \frac{D_j^-}{D_j^+ + D_j^-}$$

Rank by $C_j$ descending (closer to ideal = better).

#### When to Use

- When you want to account for distance from "worst case" as well as "best case"
- When options cluster closely in WSM and you need a tiebreaker
- More robust than WSM for decisions with extreme values

#### References

- Hwang, C.L. & Yoon, K. (1981). _Multiple Attribute Decision Making_. Springer.

---

### 4. AHP (Analytic Hierarchy Process)

**Status**: 📋 Planned (v0.5.0)

Derives weights from pairwise comparisons rather than direct assignment.

#### Mathematical Foundation

**Pairwise comparison matrix** $A$ where $a_{ij}$ represents how much more important criterion $i$ is than criterion $j$ (1–9 scale):

$$A = \begin{bmatrix} 1 & a_{12} & \cdots & a_{1n} \\ 1/a_{12} & 1 & \cdots & a_{2n} \\ \vdots & \vdots & \ddots & \vdots \\ 1/a_{1n} & 1/a_{2n} & \cdots & 1 \end{bmatrix}$$

**Priority vector** (eigenvector method): Compute the principal eigenvector of $A$ and normalize.

**Consistency ratio** $CR$: Measures how consistent the pairwise judgments are. $CR < 0.1$ is acceptable.

$$CR = \frac{CI}{RI}, \quad CI = \frac{\lambda_{max} - n}{n - 1}$$

Where $RI$ is the Random Index for matrix size $n$.

#### When to Use

- When direct weight assignment is difficult
- When weights need to be derived from relative comparisons
- Group decision-making (aggregate pairwise judgments)
- Highly structured decisions with clear hierarchy

#### References

- Saaty, T.L. (1980). _The Analytic Hierarchy Process_. McGraw-Hill.

---

### 5. Monte Carlo Sensitivity Analysis

**Status**: 📋 Planned (v0.4.0)

Probabilistic sensitivity analysis using random sampling.

#### Mathematical Foundation

Instead of fixed weight swings, sample weights from probability distributions:

$$w_i \sim \text{Normal}(\mu_i, \sigma_i)$$

Run $N$ simulations (e.g., 10,000). For each simulation:

1. Sample weights from distributions
2. Normalize weights
3. Compute WSM scores
4. Record the winner

**Output**: Probability that each option wins across all simulations.

$$P(\text{option } j \text{ wins}) = \frac{\text{count}(j \text{ wins})}{N}$$

#### When to Use

- When there's significant uncertainty in weight values
- To quantify confidence in the decision
- When stakeholders can express uncertainty as ranges rather than point estimates

#### References

- Metropolis, N. & Ulam, S. (1949). "The Monte Carlo Method." _J. American Statistical Association_, 44(247), 335–341.

---

### 6. Regret Minimization

**Status**: 📋 Planned (v0.5.0)

Choose the option that minimizes maximum potential regret.

#### Mathematical Foundation

**Regret matrix**: For each criterion, regret is the difference between the best possible score and the actual score:

$$R_{ji} = \max_k(e_{ki}) - e_{ji}$$

**Weighted regret**:

$$WR_{ji} = \hat{w}_i \times R_{ji}$$

**Minimax regret**: Choose the option that minimizes maximum weighted regret:

$$\text{Best} = \arg\min_j \left( \max_i (WR_{ji}) \right)$$

#### When to Use

- Risk-averse decision-making
- When the worst case matters more than the best case
- When you can't afford to be very wrong on any single criterion

#### References

- Savage, L.J. (1951). "The Theory of Statistical Decision." _J. American Statistical Association_, 46(253), 55–67.

---

## Framework Comparison

| Framework      | Type             | Weights  | Best For                   | Complexity |
| -------------- | ---------------- | -------- | -------------------------- | ---------- |
| WSM            | Compensatory     | Direct   | General use                | Low        |
| TOPSIS         | Compensatory     | Direct   | Close competitions         | Medium     |
| AHP            | Compensatory     | Pairwise | Uncertain weights          | High       |
| Monte Carlo    | Probabilistic    | Sampled  | Uncertainty quantification | Medium     |
| Minimax Regret | Non-compensatory | Direct   | Risk-averse decisions      | Medium     |

## Adding a New Framework

See [CONTRIBUTING.md](../CONTRIBUTING.md) for instructions on adding new decision algorithms. Every new framework must:

1. Have a pure implementation in `src/lib/`
2. Be fully tested with known-answer tests
3. Be documented in this file with mathematical notation
4. Have an entry in the framework comparison table
5. Include academic references
