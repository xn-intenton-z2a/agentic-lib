# Advanced Iteration Benchmarks

Benchmarks that explore higher complexity missions (5 kyu through 1 kyu), elevated profiles, and kyu-scaling analysis. Builds on `ITERATION_BENCHMARKS_SIMPLE.md` — same 6 target repositories, procedures, report template, and conventions apply.

```text
Please read ITERATION_BENCHMARKS_ADVANCED.md and ask for any permissions that may be required before you start executing the tests so that benchmarks can be gathered without asking for further permissions.
Please perform the exercises in ITERATION_BENCHMARKS_ADVANCED.md and create a report in the project root similar to _developers/archive/BENCHMARK_REPORT_007.md
The session should run hands free but you can start working on a fix plan like _developers/archive/PLAN_BENCHMARK_007_FIXES.md and work on those fixes in a branch test, merge then use your release and init skill to have all 6 repos use it.
Re-use the same branch for multiple fixes as part of the same benchmarking session and keep updating what has been found and/or fixed in the fixes plan document.

```

## Scenario Matrix

6 concurrent scenarios across 6 repos. All use `gpt-5-mini` model. All run simultaneously — follow the concurrent procedure from `ITERATION_BENCHMARKS_SIMPLE.md`.

| ID | Repo | Mission | Profile | Budget | Target Runs | Purpose |
|----|------|---------|---------|--------|-------------|---------|
| A1 | repository0 | 4-kyu-apply-cron-engine | med | 32 | 3 | 4-kyu baseline at med |
| A2 | repository0-string-utils | 5-kyu-apply-string-utils | max | 128 | 3 | Name affinity. Compare with SIMPLE S2 (med) |
| A3 | repository0-dense-encoder | 4-kyu-apply-dense-encoding | max | 128 | 3 | Name affinity. Dense encoding at max |
| A4 | repository0-random | 3-kyu-analyze-lunar-lander | max | 128 | 5 | 3-kyu stress test: physics simulation |
| A5 | repository0-crucible | 2-kyu-create-markdown-compiler | max | 128 | 5 | 2-kyu: parser, XSS safety |
| A6 | repository0-plot-code-lib | 2-kyu-create-plot-code-lib | max | 128 | 5 | Name affinity. Matches Benchmark 016 |

**Built-in comparisons:**
- **A2 vs SIMPLE S2**: String-utils at max vs med — does profile matter for 5-kyu?
- **A1 vs A3**: Two different 4-kyu missions at med vs max — does profile or mission difficulty dominate?
- **A5 vs A6**: Two different 2-kyu missions — which is harder for the LLM?
- **A6 vs Report 016**: Plot-code-lib rerun — regression test against the prior benchmark

## What We're Testing

1. **Kyu scaling** — How does iteration count, token cost, and success rate change from 5 kyu → 4 kyu → 3 kyu → 2 kyu?
2. **Profile impact on complex missions** — Does max profile produce meaningfully better results than med for 4-kyu and harder?
3. **Mission type difficulty** — Which missions are hardest for the LLM: domain-specific algorithms (lunar-lander), parsers (markdown-compiler), or multi-output libraries (plot-code-lib)?
4. **Test generation quality** — Do harder missions prompt better test coverage than simple ones?
5. **Convergence behaviour** — Do 3-2 kyu missions converge or get stuck in code/test mismatch loops?
6. **Regression** — Does A6 (plot-code-lib) match or improve on Benchmark 016 results?

## Init Commands

Follow `ITERATION_BENCHMARKS_SIMPLE.md` Step 0 (Save Original State) first, then dispatch all 6:

```bash
# A1: repository0 — cron-engine / med
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0 \
  -f mode=purge -f mission-seed=4-kyu-apply-cron-engine \
  -f schedule=off -f model=gpt-5-mini -f profile=med -f run-workflow=true

# A2: repository0-string-utils — string-utils / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-string-utils \
  -f mode=purge -f mission-seed=5-kyu-apply-string-utils \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# A3: repository0-dense-encoder — dense-encoding / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-dense-encoder \
  -f mode=purge -f mission-seed=4-kyu-apply-dense-encoding \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# A4: repository0-random — lunar-lander / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-random \
  -f mode=purge -f mission-seed=3-kyu-analyze-lunar-lander \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# A5: repository0-crucible — markdown-compiler / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-crucible \
  -f mode=purge -f mission-seed=2-kyu-create-markdown-compiler \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# A6: repository0-plot-code-lib — plot-code-lib / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mode=purge -f mission-seed=2-kyu-create-plot-code-lib \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true
```

## Monitoring

All monitoring follows `ITERATION_BENCHMARKS_SIMPLE.md` Step 3. Use the same dashboard check, state file reads, and screenshot/website commands.

For advanced scenarios (3-2 kyu), additionally watch for:
- **Multi-file source growth** — Complex missions may produce code across multiple files, not just `src/lib/main.js`. Check for files in `src/lib/` beyond main.js.
- **Convergence stalls** — Harder missions may get stuck in code/test mismatch loops. Watch for rising `cumulative-nop-cycles` in the state file with no corresponding `cumulative-transforms` increase.
- **Token consumption scaling** — Compare `total-tokens` across kyu levels to understand cost scaling. A4-A6 may use 5-10x more tokens than A1-A2.
- **Website complexity** — Do harder missions produce richer front-end experiences? Compare screenshots across repos.
- **Lockfile desync** — Benchmark 016 found that the LLM adding dependencies without lockfile regeneration breaks CI. Watch for `npm ci` failures in post-commit-test jobs, especially on A5 (markdown-compiler) and A6 (plot-code-lib) which may need external dependencies.

## Restore

After benchmarking, follow `ITERATION_BENCHMARKS_SIMPLE.md` Step 6 to restore all repos to their original state.

## Report Template

Use the same report template from `ITERATION_BENCHMARKS_SIMPLE.md`, with these additions:

### Kyu Scaling Analysis

```markdown
## Kyu Scaling

| Metric | A2 (5-kyu) | A1/A3 (4-kyu) | A4 (3-kyu) | A5/A6 (2-kyu) |
|--------|-----------|---------------|-----------|---------------|
| Iterations | N | N / N | N | N / N |
| Transforms | N | N / N | N | N / N |
| Time | Xmin | Xmin / Xmin | Xmin | Xmin / Xmin |
| Tokens | N | N / N | N | N / N |
| Source lines | N | N / N | N | N / N |
| Tests | N | N / N | N | N / N |
| Acceptance | N/M | N/M / N/M | N/M | N/M / N/M |
| Outcome | ... | ... / ... | ... | ... / ... |
```

### Regression Check (A6 vs Report 016)

```markdown
## Regression: plot-code-lib (A6 vs Report 016)

| Metric | Report 016 (v7.4.32) | A6 (vX.Y.Z) |
|--------|---------------------|-------------|
| Transforms to complete | 4 | N |
| Time to complete | ~3h 45m | Xmin |
| Unit tests | 28 | N |
| Acceptance criteria | 8/8 in code, 0 ticked | N/M |
| Lockfile desync | YES (PR #32) | YES / NO |
```

## Comparison Baselines

Compare against these archived reports:
- **BENCHMARK_REPORT_007.md** (v7.2.1) — roman-numerals, string-utils, cron-engine on `recommended`
- **BENCHMARK_REPORT_014.md** (v7.4.31) — fizz-buzz, hamming-distance, roman-numerals on `med`
- **BENCHMARK_REPORT_015.md** (v7.4.32) — hamming, dense-encoding across min/med/max
- **BENCHMARK_REPORT_016.md** (v7.4.32) — plot-code-lib 2-kyu on max (primary regression target)
