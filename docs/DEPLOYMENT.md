# Deployment Guide

This document covers the full deployment lifecycle for Decision OS, from GitHub repository setup to production deployment on Vercel.

---

## Table of Contents

- [GitHub Repository Setup](#github-repository-setup)
- [Branch Protection Rules](#branch-protection-rules)
- [Vercel Deployment](#vercel-deployment)
- [Release Workflow](#release-workflow)
- [Versioning Policy](#versioning-policy)
- [Environment Variables](#environment-variables)
- [Troubleshooting](#troubleshooting)

---

## GitHub Repository Setup

### 1. Create Repository

```bash
gh repo create decision-os --public \
  --description "Decision OS — Deterministic weighted decision engine with sensitivity analysis."
```

### 2. Set Topics

```bash
gh repo edit ericsocrat/decision-os \
  --add-topic "decision-making,weighted-scoring,nextjs,typescript,deterministic,productivity,analytics,systems-thinking"
```

### 3. Push Code

```bash
git remote add origin https://github.com/ericsocrat/decision-os.git
git branch -M main
git push -u origin main
```

### 4. Verify

- Confirm `.gitignore` excludes `node_modules/`, `.next/`, `.env*`, `.vercel/`
- Confirm no secrets in committed files (`git grep -i "api_key\|secret\|password"`)
- Confirm clean commit history (`git log --oneline`)

---

## Branch Protection Rules

### Via GitHub CLI

```bash
# Create JSON payload
cat <<'EOF' > /tmp/protection.json
{
  "required_status_checks": {
    "strict": true,
    "contexts": ["ci"]
  },
  "enforce_admins": true,
  "required_pull_request_reviews": {
    "dismiss_stale_reviews": true,
    "required_approving_review_count": 1
  },
  "required_linear_history": true,
  "restrictions": null
}
EOF

# Apply protection
gh api repos/ericsocrat/decision-os/branches/main/protection \
  -X PUT --input /tmp/protection.json
```

### Via GitHub Web UI (Manual)

1. Go to **Settings** → **Branches** → **Add rule**
2. Branch name pattern: `main`
3. Enable:
   - ✅ Require a pull request before merging
   - ✅ Require status checks to pass (add `ci`)
   - ✅ Require branches to be up to date before merging
   - ✅ Dismiss stale pull request approvals when new commits are pushed
   - ✅ Require linear history
   - ✅ Include administrators
4. Click **Create**

### Verification

```bash
gh api repos/ericsocrat/decision-os/branches/main/protection \
  | jq '{
    status_checks: .required_status_checks.contexts,
    pr_reviews: .required_pull_request_reviews.required_approving_review_count,
    dismiss_stale: .required_pull_request_reviews.dismiss_stale_reviews,
    linear_history: .required_linear_history.enabled,
    enforce_admins: .enforce_admins.enabled
  }'
```

Expected output:

```json
{
  "status_checks": ["ci"],
  "pr_reviews": 1,
  "dismiss_stale": true,
  "linear_history": true,
  "enforce_admins": true
}
```

---

## Vercel Deployment

### Prerequisites

- Vercel account ([vercel.com](https://vercel.com))
- GitHub repository connected

### Option A: GitHub Integration (Recommended)

1. Go to [vercel.com/new](https://vercel.com/new)
2. Click **Import Git Repository**
3. Select `ericsocrat/decision-os`
4. Verify settings:
   - **Framework Preset**: Next.js (auto-detected)
   - **Build Command**: `next build` (default)
   - **Output Directory**: `.next` (default)
   - **Environment Variables**: None required
5. Click **Deploy**
6. Production URL is assigned automatically

Every push to `main` will trigger automatic redeployment.

### Option B: Vercel CLI

```bash
# Install and authenticate
npx vercel login

# Deploy to production
npx vercel --prod

# Check deployment
npx vercel inspect <deployment-url>
```

### Production URL

- **Primary**: https://decision-os-hazel.vercel.app
- **Inspect**: https://vercel.com/erics-projects-faa226e7/decision-os

### Post-Deployment Checklist

- [ ] Visit production URL — app loads correctly
- [ ] Demo decision is visible on first load
- [ ] Create a new decision — verify CRUD works
- [ ] Switch to Results tab — rankings display correctly
- [ ] Switch to Sensitivity tab — analysis renders
- [ ] Export JSON — file downloads
- [ ] Reload page — data persists in localStorage
- [ ] Visit /nonexistent — 404 page renders correctly

---

## Release Workflow

### Creating a New Release

1. **Update CHANGELOG.md** with the new version and changes
2. **Update package.json** version field
3. **Commit and push** via a PR to `main`
4. **Create tag and release**:

```bash
# After PR is merged to main
git checkout main
git pull origin main
git tag -a v<VERSION> -m "v<VERSION> — <Description>"
git push origin v<VERSION>

# Create GitHub Release
gh release create v<VERSION> \
  --title "v<VERSION> — <Description>" \
  --notes-file RELEASE_NOTES.md
```

### Release Checklist

- [ ] All tests pass (`npm run test`)
- [ ] Lint clean (`npm run lint`)
- [ ] Type check clean (`npm run typecheck`)
- [ ] Production build succeeds (`npm run build`)
- [ ] CHANGELOG.md updated
- [ ] package.json version bumped
- [ ] Git tag created and pushed
- [ ] GitHub Release created with notes
- [ ] Vercel deployment verified

---

## Versioning Policy

Decision OS follows [Semantic Versioning](https://semver.org/):

| Change Type | Version Bump | Example |
|-------------|-------------|---------|
| Bug fix, docs, refactor | PATCH (0.1.x) | Fix score rounding edge case |
| New feature, backward-compatible | MINOR (0.x.0) | Add Monte Carlo sensitivity |
| Breaking change | MAJOR (x.0.0) | Change scoring API signature |

### Current Version

- **v0.1.0** — Initial public release (MVP)

### Pre-1.0 Policy

While in `0.x.y`, minor versions may include breaking changes. After `1.0.0`, strict semver applies.

---

## Environment Variables

Decision OS requires **no environment variables** for core functionality. It is a fully client-side application with localStorage persistence.

If future features require configuration:

| Variable | Required | Description |
|----------|----------|-------------|
| (none currently) | — | — |

---

## Troubleshooting

### Build Fails on Vercel

1. Check that `package-lock.json` is committed
2. Ensure Node.js version matches (18+)
3. Run `npm run build` locally to reproduce
4. Check Vercel build logs at the Inspect URL

### CI Fails

The CI pipeline runs: `lint → typecheck → test → build`

```bash
# Reproduce locally
npm run lint
npm run typecheck
npm run test
npm run build
```

### Branch Protection Blocks Push

Direct pushes to `main` are blocked by design. Always use a PR:

```bash
git checkout -b fix/my-change
# make changes
git add -A && git commit -m "fix: description"
git push origin fix/my-change
gh pr create --fill
```
