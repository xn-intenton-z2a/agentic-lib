# Advanced Iteration Benchmarks

Benchmarks that explore higher complexity missions (3 kyu through 1 kyu), elevated profiles, and model comparisons. Builds on ITERATION_BENCHMARKS.md — same procedures, target repository, and conventions apply.

```text
Create a report for ITERATION_BENCHMARKS_ADVANCED.md
```

## Scenario Matrix

| ID | Mission | Model | Profile | Budget | Purpose |
|----|---------|-------|---------|--------|---------|
| A1 | 3-kyu-analyze-lunar-lander | gpt-5-mini | recommended | 32 | 3 kyu — physics simulation, autopilot controller |
| A2 | 3-kyu-analyze-lunar-lander | gpt-5-mini | max | 128 | Profile comparison: does max produce better convergence? |
| A3 | 3-kyu-evaluate-time-series-lab | gpt-5-mini | recommended | 32 | 3 kyu — data science, forecasting, ongoing mission |
| A4 | 3-kyu-evaluate-time-series-lab | gpt-5-mini | max | 128 | Profile comparison on 3 kyu: can max handle domain-specific algorithms? |
| A5 | 3-kyu-evaluate-owl-ontology | claude-sonnet-4 | recommended | 32 | Model comparison: claude-sonnet-4 vs gpt-5-mini on 3 kyu |
| A6 | 2-kyu-evaluate-markdown-compiler | gpt-5-mini | recommended | 32 | 2 kyu — multi-pass parser, XSS safety, 30+ tests |
| A7 | 2-kyu-evaluate-markdown-compiler | gpt-5-mini | max | 128 | Profile comparison on parser mission |
| A8 | 2-kyu-create-plot-code-lib | gpt-5-mini | recommended | 32 | 2 kyu — expression parsing, SVG/PNG rendering |
| A9 | 1-kyu-create-ray-tracer | gpt-5-mini | max | 128 | 1 kyu — 3D geometry, optics, stress test |

## What We're Testing

1. **Kyu scaling** — How does iteration count and success rate change from 3 kyu → 2 kyu → 1 kyu?
2. **Profile impact on complex missions** — Does max profile produce meaningfully better results than recommended for harder problems?
3. **Model impact** — Does claude-sonnet-4 outperform gpt-5-mini on domain-specific or algorithmic missions?
4. **Test generation** — Report 006 found no dedicated tests were created for hamming-distance. Do harder missions prompt better test coverage?
5. **Convergence behaviour** — Do 3-1 kyu missions converge or get stuck in code/test mismatch loops?

## Execution Order

Run scenarios in this order (each builds evidence for the next):

1. **A1** — Lunar lander baseline (3 kyu, physics simulation)
2. **A3** — Time series lab at recommended (3 kyu, data science)
3. **A6** — Markdown compiler at recommended (2 kyu, parser)
4. **A2** — Lunar lander at max (compare with A1)
5. **A4** — Time series lab at max (compare with A3)
6. **A5** — Owl ontology with claude-sonnet-4 (model comparison at 3 kyu)
7. **A7** — Markdown compiler at max (compare with A6)
8. **A8** — Plot code lib (additional 2 kyu data point)
9. **A9** — Ray tracer (1 kyu stress test)

Stop early if a scenario exceeds 2 hours wall clock or exhausts its budget.

## Notes

- All scenarios use `schedule=off` and manual dispatch (same as ITERATION_BENCHMARKS.md)
- For max profile scenarios, the init workflow does not set the profile in toml — set it manually after init via the GitHub Contents API (see Report 005 FINDING-4)
- Record the same data points as ITERATION_BENCHMARKS.md Step 3
- Use the same report template from ITERATION_BENCHMARKS.md
