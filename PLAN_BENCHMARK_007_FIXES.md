# Plan: Benchmark Report 007 Fixes

**Source**: [BENCHMARK_REPORT_007.md](BENCHMARK_REPORT_007.md)
**Created**: 2026-03-10
**Status**: implemented — all 6 work items done

---

## User Assertions

1. Fix all issues identified in BENCHMARK_REPORT_007.md
2. Behaviour test instability is the #1 priority — it's wasting 50-75% of iterations in affected scenarios
3. Mission-complete should require dedicated test files
4. Instability transforms should not consume mission budget

---

## Analysis of Benchmark 007 Results

### What went well

All 3 missions (roman-numerals, string-utils, cron-engine) completed successfully. Every scenario produced correct code on the first transform — the LLM is reliable for Tier 2-3 missions with gpt-5-mini/recommended. String-utils (10 functions) was the fastest at 22 minutes despite being the most complex, showing that "bag-of-functions" missions are easier than algorithmically complex ones.

### What went wrong

**Behaviour test instability consumed most of the pipeline's effort.** In roman-numerals, 2 of 3 transforms (67%) fixed instability. In cron-engine, 4 of 6 transforms (67%) fixed instability. Without instability, roman-numerals would have converged in ~2 iterations (not 6) and cron-engine in ~4 (not 8+1).

**No dedicated test files were created** — the same finding as Report 006 FINDING-3. The supervisor declares mission-complete based on issue closure, not on test quality. This is a systematic gap that has persisted across 4 consecutive benchmark reports.

**DST handling in cron-engine is approximate** — minute-stepping can skip or duplicate runs during DST transitions. Not blocking for MVP but a known quality gap.

**Supervisor annotation parsing** — "Unknown action: Requirements" in A6 iteration 1 was benign but indicates the supervisor prompt can produce output the action parser doesn't handle.

---

## Work Items

All fixes target `agentic-lib/` (mastered here, distributed to repository0 via init).

### W1: Add Playwright retry logic to behaviour tests (HIGH — FINDING-2, Recommendation #1)

**Problem**: Playwright behaviour tests fail intermittently, generating instability issues that consume transforms. Two of three Report 007 scenarios were affected. The failures are infrastructure-related (timing, DOM readiness, network), not caused by the mission code.

**Fix**: Add retry configuration to the behaviour test execution. Three layers:

1. **Playwright config**: Add `retries: 2` to `playwright.config.js` seed so new missions get retries by default
2. **Workflow step**: In `agentic-lib-test.yml` behaviour job, wrap the test command with retry logic: run up to 2 times if the first attempt fails
3. **Pre-commit gate**: In `agentic-lib-workflow.yml` dev job's `pre-commit-behaviour-test` step (added in Report 005 W1), add the same retry logic

**Files**:
- `src/seeds/zero-playwright.config.js` (add `retries: 2`)
- `.github/workflows/agentic-lib-test.yml` (behaviour job retry)
- `.github/workflows/agentic-lib-workflow.yml` (pre-commit-behaviour-test retry)

### W2: Reduce behaviour test flakiness via explicit waits (HIGH — FINDING-2, Recommendation #1)

**Problem**: The behaviour test script (`scripts/run-behaviour.js` or seed equivalent) may assert on DOM elements before they're fully rendered. Timing-sensitive assertions are the most common Playwright failure mode.

**Fix**: Review and update the behaviour test seed to:
1. Use `waitForSelector` or `locator.waitFor()` before assertions
2. Add `networkidle` wait state where applicable
3. Increase default timeout for navigation actions
4. Use `toBeVisible()` instead of element count assertions where appropriate

**Files**:
- `src/seeds/zero-run-behaviour.js` (or equivalent behaviour test seed)
- `src/scripts/run-behaviour.js`

### W3: Add test coverage requirement to mission-complete criteria (HIGH — FINDING-5, Recommendation #2)

**Problem**: Across all 4 scenarios in Reports 006-007, no dedicated test files were created. The supervisor declares mission-complete based on issue closure and "0 open issues" — there's no check for test quality.

**Fix**: Update the `supervise.js` mission-complete evaluation to include a test coverage check:

1. **Detection**: Check if any test file exists that imports from the mission's source files (not just the seed `main.test.js`). Pattern: `tests/*.test.js` or `__tests__/*.test.js` that imports from `src/lib/`.
2. **Metric**: Add "Dedicated test file exists" as a mission-complete criterion in the supervisor's evaluation.
3. **Prompt update**: Update `agent-supervisor.md` to instruct the supervisor: "Before declaring mission-complete, verify that dedicated test files exist for mission-specific functions. If no dedicated test file exists, create an issue requesting test coverage."
4. **Fallback**: If the supervisor would otherwise declare mission-complete but no test file exists, instead create an issue: "feat: add dedicated test coverage for [mission] functions" with `ready` label.

**Files**:
- `src/lib/supervise.js` (add test file detection to mission-complete check)
- `src/agents/agent-supervisor.md` (add test coverage requirement to prompt)

### W4: Separate instability budget from mission budget (MEDIUM — FINDING-2, Recommendation #5)

**Problem**: The `transformation-budget` in `agentic-lib.toml` counts ALL transforms, including instability fixes. A scenario with budget=32 that spends 4 transforms on instability has only 28 left for mission work. Instability fixes address infrastructure issues, not mission code.

**Fix**: Track two counters in the activity log:
1. `mission-transforms`: transforms where the dev job worked on a non-instability issue
2. `instability-transforms`: transforms where the dev job worked on an `instability`-labelled issue

Only `mission-transforms` count against the `transformation-budget`. This means infrastructure fixes don't starve the mission of budget.

**Implementation**:
1. In the dev job's transform step, after selecting the target issue, check if it has the `instability` label
2. If instability, increment `instability-transforms` in the activity log but do NOT increment the budget counter
3. In the supervisor's budget check, only count non-instability transforms

**Files**:
- `.github/workflows/agentic-lib-workflow.yml` (dev job — tag transform type)
- `src/lib/supervise.js` (budget check — exclude instability transforms)
- `src/lib/activity.js` (or equivalent — track separate counters)

### W5: Harden supervisor action parsing (LOW — FINDING-7)

**Problem**: Supervisor output "Unknown action: Requirements" in A6 iteration 1. The supervisor included a "Requirements:" section in its response that the action parser didn't recognise. While benign (the primary action still executed), this generates confusing log output.

**Fix**: Update the action parser to:
1. Ignore unrecognised sections after the primary action has been extracted
2. Log unrecognised sections as `debug` (not `warning`)
3. Only warn if NO recognisable action was found in the response

**Files**:
- `src/lib/supervise.js` (action parsing logic)

### W6: Document auto-dispatch iteration counting (LOW — FINDING-8)

**Problem**: Auto-dispatched fix runs (from `dispatch-fix`) create unexpected extra iterations that make benchmark comparisons inconsistent. In A6, run 22887525625 was auto-dispatched between iterations 3 and 4.

**Fix**: No code change needed. Add a note to the benchmark execution guide and the activity log that:
1. Auto-dispatched runs should be counted separately (e.g. "3a" as done in Report 007)
2. The "Total iterations" metric should note auto-dispatched runs: "8 (+1 auto)"
3. For cross-scenario comparison, use "effective iterations" = total minus auto-dispatched

**Files**:
- Update benchmark execution documentation (if it exists)
- No workflow changes

---

## Implementation Order

| # | Work Item | Priority | Dependencies | Files Changed |
|---|-----------|----------|--------------|---------------|
| 1 | W1 | HIGH | None | `zero-playwright.config.js`, `agentic-lib-test.yml`, `agentic-lib-workflow.yml` |
| 2 | W2 | HIGH | None | `zero-run-behaviour.js`, `run-behaviour.js` |
| 3 | W3 | HIGH | None | `supervise.js`, `agent-supervisor.md` |
| 4 | W4 | MEDIUM | None | `agentic-lib-workflow.yml`, `supervise.js`, `activity.js` |
| 5 | W5 | LOW | None | `supervise.js` |
| 6 | W6 | LOW | None | Documentation only |

**Non-conflicting groups** (can be implemented in parallel):
- Group A: W1 + W3 (different files, except both touch supervise.js — but different sections)
- Group B: W2 (standalone — seed/script files)
- Group C: W4 + W5 (both touch supervise.js — must be sequenced)
- Group D: W6 (documentation only)

---

## Implementation Notes

### W1: Playwright retry logic — DONE
- `zero-playwright.config.js`: Added `retries: 2` so Playwright automatically retries failing tests up to 2 times
- `agentic-lib-test.yml`: Behaviour job now runs `npm run test:behaviour || { sleep 2; npm run test:behaviour }` — retries once on failure
- `agentic-lib-workflow.yml`: Pre-commit behaviour test step now retries once on failure before setting `tests-passed=false`

### W2: Explicit waits in behaviour test seed — DONE
- `zero-behaviour.test.js`: Added `waitUntil: "networkidle"` to `page.goto()`, and `timeout: 10000` to all `toBeVisible()` assertions. This reduces flakiness from DOM-timing races.

### W3: Test coverage requirement in mission-complete — DONE
- `supervise.js` (`gatherContext`): Added `hasDedicatedTests` / `dedicatedTestFiles` detection. Scans `tests/` and `__tests__/` for files that import from `src/lib/`, excluding seed tests (main.test.js, web.test.js, behaviour.test.js).
- `supervise.js` (`buildPrompt`): Added "### Test Coverage" section showing dedicated test file status.
- `supervise.js` (deterministic mission-complete): When `hasDedicatedTests` is false, blocks mission-complete and creates a "feat: add dedicated test coverage" issue with `automated,ready` labels instead.
- `agent-supervisor.md`: Added test coverage check to MANDATORY FIRST CHECK and added condition #4 to Mission Accomplished criteria requiring dedicated test files.

### W4: Separate instability budget — DONE
- `index.js`: After determining `transformationCost`, checks if the target issue has the `instability` label. If so, sets `transformationCost = 0` — instability transforms don't count against the mission budget.
- `supervise.js` (`buildPrompt`): Budget display now notes that instability transforms are excluded.

### W5: Harden action parsing — DONE
- `supervise.js` (`executeAction`): Changed `core.warning("Unknown action: ...")` to `core.debug("Ignoring unrecognised action: ...")`. Only emits debug-level log for benign unrecognised sections.
- `supervise.test.js`: Added `debug: vi.fn()` to the `@actions/core` mock.

### W6: Document auto-dispatch counting — DONE (in PLAN file)
- No code change. Auto-dispatched runs should be counted as "N (+M auto)" in benchmark reports, as done in Report 007 (A6: "8 (+1 auto)"). For comparison, use "effective iterations" = total minus auto-dispatched.

---

## Success Criteria

1. Playwright tests have retry logic — a single transient failure does not generate an instability issue
2. Behaviour test seed uses explicit waits, reducing DOM-timing failures
3. Supervisor requires dedicated test file before declaring mission-complete
4. Instability transforms do not count against the mission transformation budget
5. Supervisor action parser does not warn on benign extra sections
6. All existing tests pass (429+ unit tests in agentic-lib)
7. Workflow lint passes (`npm run lint:workflows`)
8. Re-run roman-numerals or cron-engine benchmark and verify fewer instability iterations (target: 0-1 instability transforms per scenario)
