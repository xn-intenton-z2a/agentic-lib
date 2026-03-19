# Advanced Iteration Benchmarks

Benchmarks that explore higher complexity missions (3 kyu through 1 kyu), elevated profiles, and model comparisons. Builds on ITERATION_BENCHMARKS.md — same procedures, target repository, and conventions apply.

```text
Please read ITERATION_BENCHMARKS_ADVANCED.md and ask for any permissions that may be required before you start executing the tests so that benchmarks can be gathered without asking for further permissions.
Please perform the exercises in ITERATION_BENCHMARKS_ADVANCED.md and create a report in the project root similar to _developers/archive/BENCHMARK_REPORT_007.md
The session should run hands free but you can stary working on a fix plan like _developers/archive/PLAN_BENCHMARK_007_FIXES.md and work on those fixes in a branch test, merge then use your release and init skill to have repository0 use it.
Re-use the same branch for multiple fixes as part of the same benchmarking session and keep updating what has been found and/or fixed in the fixes plan document. 

```

## Scenario Matrix

| ID | Mission | Model | Profile | Budget | Purpose |
|----|---------|-------|---------|--------|---------|
| A1 | 3-kyu-analyze-lunar-lander | gpt-5-mini | med | 32 | 3 kyu — physics simulation, autopilot controller |
| A2 | 3-kyu-analyze-lunar-lander | gpt-5-mini | max | 128 | Profile comparison: does max produce better convergence? |
| A3 | 3-kyu-evaluate-time-series-lab | gpt-5-mini | med | 32 | 3 kyu — data science, forecasting, ongoing mission |
| A4 | 3-kyu-evaluate-time-series-lab | gpt-5-mini | max | 128 | Profile comparison on 3 kyu: can max handle domain-specific algorithms? |
| A5 | 4-kyu-apply-owl-ontology | claude-sonnet-4 | med | 32 | Model comparison: claude-sonnet-4 vs gpt-5-mini on ontology |
| A6 | 2-kyu-create-markdown-compiler | gpt-5-mini | med | 32 | 2 kyu — Markdown compiler, XSS safety, structured tests |
| A7 | 2-kyu-create-markdown-compiler | gpt-5-mini | max | 128 | Profile comparison on parser mission |
| A8 | 2-kyu-create-plot-code-lib | gpt-5-mini | med | 32 | 2 kyu — expression parsing, SVG/PNG rendering |
| A9 | 1-kyu-create-ray-tracer | gpt-5-mini | max | 128 | 1 kyu — 3D geometry, optics, stress test |

## What We're Testing

1. **Kyu scaling** — How does iteration count and success rate change from 3 kyu → 2 kyu → 1 kyu?
2. **Profile impact on complex missions** — Does max profile produce meaningfully better results than med for harder problems?
3. **Model impact** — Does claude-sonnet-4 outperform gpt-5-mini on domain-specific or algorithmic missions?
4. **Test generation** — Report 006 found no dedicated tests were created for hamming-distance. Do harder missions prompt better test coverage?
5. **Convergence behaviour** — Do 3-1 kyu missions converge or get stuck in code/test mismatch loops?

## Execution Order

Run scenarios in this order (each builds evidence for the next):

1. **A1** — Lunar lander baseline (3 kyu, physics simulation)
2. **A3** — Time series lab at med (3 kyu, data science)
3. **A6** — Markdown compiler at med (2 kyu, parser)
4. **A2** — Lunar lander at max (compare with A1)
5. **A4** — Time series lab at max (compare with A3)
6. **A5** — Owl ontology with claude-sonnet-4 (model comparison at 3 kyu)
7. **A7** — Markdown compiler at max (compare with A6)
8. **A8** — Plot code lib (additional 2 kyu data point)
9. **A9** — Ray tracer (1 kyu stress test)

Stop early if a scenario exceeds 2 hours wall clock or exhausts its budget.

## Monitoring

All monitoring follows ITERATION_BENCHMARKS_SIMPLE.md Step 3. The primary sources of truth are:

1. **State file** (`agentic-lib-state.toml` on `agentic-lib-logs` branch) — cumulative counters, budget tracking, mission status
2. **Agent log files** (`agent-log-*-NNN.md` on `agentic-lib-logs` branch) — per-task metrics, narratives, sequence numbers
3. **Screenshot** (`SCREENSHOT_INDEX.png` on `agentic-lib-logs` branch) — visual state of the deployed website after each test cycle
4. **Live website** (`https://xn-intenton-z2a.github.io/repository0/`) — front-end assessment: does the page render, does it include mission-specific content

For advanced scenarios (3-1 kyu), additionally watch for:
- **Multi-file source growth** — complex missions may produce code across multiple files, not just `src/lib/main.js`
- **Convergence stalls** — harder missions may get stuck in code/test mismatch loops visible as rising `cumulative-nop-cycles` in the state file
- **Token consumption scaling** — compare `total-tokens` across kyu levels to understand cost scaling
- **Website complexity** — do harder missions produce richer front-end experiences? Compare screenshots across scenarios

## Notes

- All scenarios use `schedule=off` and manual dispatch for subsequent cycles — init auto-dispatches the first `agentic-lib-workflow` run (same as ITERATION_BENCHMARKS_SIMPLE.md). Always pass `-f schedule=off` to init to prevent residual cron schedules from previous runs interfering with benchmark dispatches
- The default distributed profile is **`max`**. To use `min` or `med`, pass `-f profile=min` or `-f profile=med` to the init workflow
- Record the same data points as ITERATION_BENCHMARKS_SIMPLE.md Step 3 (including state file, logs, screenshot, and website)
- Use the same report template from ITERATION_BENCHMARKS_SIMPLE.md
- Include screenshots and website assessment in each scenario's report section
- **Comparison baselines**: Compare against `_developers/archive/BENCHMARK_REPORT_007.md` (v7.2.1, 2026-03-10 — roman-numerals, string-utils, cron-engine on `recommended` profile) and `BENCHMARK_REPORT_014.md` (v7.4.31, 2026-03-19 — fizz-buzz, hamming-distance, roman-numerals on `med` profile). For overlapping missions include a direct comparison table
