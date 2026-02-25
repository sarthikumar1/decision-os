# Label Taxonomy

This document defines the complete label system used in Decision OS. Labels are organized by category and automatically applied by the [PR Quality Gate](.github/workflows/pr-quality-gate.yml) workflow.

## Priority

| Label               | Color        | Description                |
| ------------------- | ------------ | -------------------------- |
| `priority:critical` | 🔴 `#B60205` | Blocking — fix immediately |
| `priority:high`     | 🟡 `#FBCA04` | Next sprint                |
| `priority:medium`   | 🟢 `#0E8A16` | Planned                    |
| `priority:low`      | ⚪ `#E4E669` | Nice to have               |

## Type

| Label                 | Color        | Description                          |
| --------------------- | ------------ | ------------------------------------ |
| `type:feature`        | ✨ `#A2EEEF` | New functionality                    |
| `type:bug`            | 🐛 `#D73A4A` | Something broken                     |
| `type:enhancement`    | 💎 `#A2EEEF` | Improve existing feature             |
| `type:ux`             | 🎨 `#7057FF` | Visual/interaction improvement       |
| `type:logic`          | 🧮 `#0075CA` | Decision algorithms / scoring engine |
| `type:infrastructure` | 🔧 `#CFD3D7` | CI/CD, config, workflows             |
| `type:documentation`  | 📝 `#0075CA` | Documentation changes                |
| `type:testing`        | 🧪 `#BFD4F2` | Test additions or improvements       |

## Area

| Label                 | Color     | Description                                 |
| --------------------- | --------- | ------------------------------------------- |
| `area:ui`             | `#C5DEF5` | UI components (`src/components/`)           |
| `area:logic`          | `#BFDADC` | Decision engine (`src/lib/`, `src/engine/`) |
| `area:infrastructure` | `#D4C5F9` | CI/CD, config (`.github/`)                  |
| `area:documentation`  | `#FEF2C0` | Documentation files (`docs/`)               |
| `area:testing`        | `#BFD4F2` | Test files (`*.test.*`)                     |

## Size

Automatically applied based on lines changed in PRs.

| Label     | Threshold   | Description                            |
| --------- | ----------- | -------------------------------------- |
| `size:XS` | < 10 lines  | Trivial change                         |
| `size:S`  | < 50 lines  | Small change                           |
| `size:M`  | < 150 lines | Medium change                          |
| `size:L`  | < 500 lines | Large change                           |
| `size:XL` | 500+ lines  | Very large change — consider splitting |

## Status

| Label                 | Color     | Description           |
| --------------------- | --------- | --------------------- |
| `status:in-progress`  | `#FBCA04` | Work in progress      |
| `status:blocked`      | `#B60205` | Blocked by dependency |
| `status:needs-review` | `#0E8A16` | Ready for review      |
| `status:ready`        | `#0E8A16` | Ready to merge        |

## Special

| Label          | Color     | Description                           |
| -------------- | --------- | ------------------------------------- |
| `pinned`       | `#006B75` | Exempt from stale bot                 |
| `stale`        | —         | Auto-applied after 30 days inactivity |
| `dependencies` | —         | Dependabot PRs                        |

## Label Application

- **Area labels**: Auto-applied by PR Quality Gate workflow based on changed file paths
- **Size labels**: Auto-applied by PR Quality Gate workflow based on diff size
- **Type labels**: Manually applied by author or triager
- **Priority labels**: Manually applied by maintainers
- **Status labels**: Manually applied to track workflow state
