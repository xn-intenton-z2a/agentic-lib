# Advanced Iteration Benchmarks

Benchmarks that explore higher complexity missions (Tiers 2-4), elevated profiles, and model comparisons. Builds on ITERATION_BENCHMARKS.md — same procedures, target repository, and conventions apply.

```text
Create a report for ITERATION_BENCHMARKS_ADVANCED.md
```

## Scenario Matrix

| ID | Mission | Model | Profile | Budget | Purpose |
|----|---------|-------|---------|--------|---------|
| A1 | roman-numerals | gpt-5-mini | recommended | 32 | Tier 2 — round-trip conversion, subtractive notation |
| A2 | roman-numerals | gpt-5-mini | max | 128 | Profile comparison: does max produce better tests/convergence? |
| A3 | string-utils | gpt-5-mini | recommended | 32 | Tier 3 — 10 independent functions, bag-of-functions pattern |
| A4 | string-utils | gpt-5-mini | max | 128 | Profile comparison on Tier 3: can max handle 10 functions? |
| A5 | string-utils | claude-sonnet-4 | recommended | 32 | Model comparison: claude-sonnet-4 vs gpt-5-mini on Tier 3 |
| A6 | cron-engine | gpt-5-mini | recommended | 32 | Tier 3 — algorithmic complexity, DST handling |
| A7 | cron-engine | gpt-5-mini | max | 128 | Profile comparison on algorithmic mission |
| A8 | dense-encoding | gpt-5-mini | recommended | 32 | Tier 3 — encode/decode round-trips, multiple schemes |
| A9 | lunar-lander | gpt-5-mini | max | 128 | Tier 4 — physics sim, autopilot algorithm, stress test |

## What We're Testing

1. **Tier scaling** — How does iteration count and success rate change from Tier 2 → Tier 3 → Tier 4?
2. **Profile impact on complex missions** — Does max profile produce meaningfully better results than recommended for harder problems?
3. **Model impact** — Does claude-sonnet-4 outperform gpt-5-mini on multi-function or algorithmic missions?
4. **Test generation** — Report 006 found no dedicated tests were created for hamming-distance. Do harder missions prompt better test coverage?
5. **Convergence behaviour** — Do Tier 3+ missions converge or get stuck in code/test mismatch loops?

## Execution Order

Run scenarios in this order (each builds evidence for the next):

1. **A1** — Roman numerals baseline (Tier 2, familiar complexity level)
2. **A3** — String utils at recommended (Tier 3 baseline)
3. **A6** — Cron engine at recommended (Tier 3 algorithmic)
4. **A2** — Roman numerals at max (compare with A1)
5. **A4** — String utils at max (compare with A3)
6. **A5** — String utils with claude-sonnet-4 (model comparison with A3)
7. **A7** — Cron engine at max (compare with A6)
8. **A8** — Dense encoding (additional Tier 3 data point)
9. **A9** — Lunar lander (Tier 4 stress test)

Stop early if a scenario exceeds 2 hours wall clock or exhausts its budget.

## Notes

- All scenarios use `schedule=off` and manual dispatch (same as ITERATION_BENCHMARKS.md)
- For max profile scenarios, the init workflow does not set the profile in toml — set it manually after init via the GitHub Contents API (see Report 005 FINDING-4)
- Record the same data points as ITERATION_BENCHMARKS.md Step 3
- Use the same report template from ITERATION_BENCHMARKS.md
