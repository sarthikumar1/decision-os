# Decision OS — Launch Kit

Ready-to-use content for announcing Decision OS on LinkedIn and other platforms.

---

## Short LinkedIn Post (Professional)

```
I built Decision OS — an open-source structured decision-making tool.

The problem: We make high-stakes decisions (relocating, hiring, investing) using gut feelings or messy spreadsheets.

The solution: A deterministic scoring engine that turns subjective choices into transparent, reproducible analysis.

How it works:
→ Define options (A vs B vs C)
→ Set weighted criteria (cost 40%, quality 30%, speed 30%)
→ Score each option per criterion (0–10)
→ Get ranked results with per-criterion breakdowns
→ Run sensitivity analysis to test if small weight changes flip the winner

What I shipped:
• Weighted Sum Model scoring engine — same inputs, same output, always
• Interactive builder with real-time results
• Weight-swing sensitivity analysis (±5% to ±50%)
• JSON export + shareable URLs
• 40 unit tests, TypeScript strict, GitHub Actions CI
• Local-first — no account, no backend, no tracking

Try it live: https://decision-os-hazel.vercel.app
Source: https://github.com/ericsocrat/decision-os

Built with Next.js, TypeScript, Tailwind CSS. Deployed on Vercel.

#OpenSource #DecisionMaking #TypeScript #NextJS #WebDev #ProductEngineering #Analytics
```

---

## Technical Breakdown Thread Version

### Post 1 — Hook

```
I built a deterministic decision engine from scratch. Here's the engineering breakdown:

Decision OS — an open-source MCDA (multi-criteria decision analysis) tool.

Try it: https://decision-os-hazel.vercel.app
Code: https://github.com/ericsocrat/decision-os
```

### Post 2 — Scoring Model

```
The scoring engine uses a Weighted Sum Model:

1. Normalize weights to sum to 1.0
2. For each option: effective_score = benefit scores stay, cost scores invert (10 - raw)
3. Total = Σ(normalized_weight × effective_score)
4. Rank by total, descending

The engine is 100% deterministic — same inputs always produce the same output. Every formula is documented in docs/SCORING_MODEL.md.
```

### Post 3 — Sensitivity Analysis

```
The part I'm most proud of: sensitivity analysis.

The tool tests whether small weight changes (±5% to ±50%) would flip the winning option. For each criterion, it swings the weight up and down and re-scores everything.

If the winner stays consistent across ±25% swings → robust decision.
If it flips at ±5% → your decision is fragile, reconsider your weights.

This is the feature that turns a simple scoring tool into a real decision instrument.
```

### Post 4 — Engineering Quality

```
Engineering standards:
• 40 unit tests covering scoring engine + validation
• TypeScript strict mode — zero type errors
• ESLint — zero warnings
• GitHub Actions CI: lint → typecheck → test → build
• Architecture Decision Records (ADRs)
• Comprehensive docs: scoring model spec, architecture, roadmap
• Branch protection: no direct pushes, PR required, CI must pass

Not just code. A complete engineering artifact.
```

---

## Screenshot Suggestions

Take screenshots of the live app at https://decision-os-hazel.vercel.app:

1. **Hero Screenshot**: Full page showing the Builder tab with the demo decision loaded — shows the complete score matrix with 3 cities and 5 criteria
2. **Results Screenshot**: Results tab showing ranked options with score bars and breakdowns
3. **Sensitivity Screenshot**: Sensitivity tab showing the weight-swing analysis table with robust/sensitive indicators
4. **Mobile Screenshot**: The app on a mobile viewport (use browser dev tools responsive mode)

**Tips:**

- Use browser at 1280×800 for desktop screenshots
- Crop to just the content area (no browser chrome)
- Export as PNG at 2x for retina clarity
- Add a subtle drop shadow in your image editor for visual polish

---

## Suggested Hashtags

```
#OpenSource #DecisionMaking #MCDA #WeightedScoring #TypeScript #NextJS
#WebDev #ProductEngineering #Analytics #SystemsThinking #Vercel
#SoftwareEngineering #BuildInPublic #IndieHacker #Productivity
```

Pick 5-8 most relevant per post.

---

## Short Resume Bullet

```
Built "Decision OS" — open-source multi-criteria decision analysis tool with deterministic scoring engine, sensitivity analysis, and local-first persistence. Next.js, TypeScript strict, 40+ unit tests, CI/CD, deployed on Vercel. github.com/ericsocrat/decision-os
```

---

## One-Liner for Portfolio/Bio

```
Creator of Decision OS — structured decision-making for people who think clearly.
```
