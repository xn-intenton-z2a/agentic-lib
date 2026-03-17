# Plan: Benchmark Report 011 Fixes

**Source**: [BENCHMARK_REPORT_011.md](BENCHMARK_REPORT_011.md)
**Created**: 2026-03-17
**Status**: in progress

---

## User Assertions

1. Fix issues identified in BENCHMARK_REPORT_011.md
2. Use a single branch (`claude/benchmark-011-fixes`) for all fixes
3. Release, then init to have repository0 use the fixes

---

## Analysis of Benchmark 011 Results

### What went well

Both missions (fizz-buzz, hamming-distance) completed successfully with all acceptance criteria passing. Working code delivered in iteration 1 for both. Seed issues accelerated the pipeline start. Dedicated test files were created (10-11 per scenario) — a significant improvement over Reports 006-007 where no dedicated tests were created.

### What went wrong

1. **Budget burn from maintain tasks** — 55-57% of budget consumed by maintain-features/maintain-library, not dev transforms.
2. **State file not updated on mission-complete** — Director writes MISSION_COMPLETE.md but doesn't update agentic-lib-state.toml.
3. **Schedule not disabled after mission-complete** — S3 had 9 wasted schedule runs (~60 min CI) after mission was done.
4. **Duplicate issue churn** — S3 had 5 identical "dedicated tests" issues.
5. **Behaviour test failure churn** — S1 had 3 behaviour failure issues.

---

## Work Items

All fixes target `agentic-lib/` (mastered here, distributed to repository0 via init).

### W1: Exclude maintain transforms from budget (HIGH — FINDING-1)

**Problem**: Maintain-features and maintain-library transforms count against the transformation budget. In S1, 6 of 11 budget units (55%) were maintain overhead. In S3, 4 of 7 (57%).

**Fix**: In the budget increment logic, only increment `transformation-budget-used` when the task type is `transform` (dev), not `maintain-features` or `maintain-library`.

**Files**: `src/actions/agentic-step/index.js` (budget tracking)

**Status**: pending

### W2: Director updates state file on mission-complete (HIGH — FINDING-3)

**Problem**: Director writes `MISSION_COMPLETE.md` but does not set `mission-complete = true` in `agentic-lib-state.toml` on the logs branch. Both S1 and S3 showed this inconsistency.

**Fix**: In the director task handler, after writing MISSION_COMPLETE.md (or MISSION_FAILED.md), also update the state file's `[status]` section.

**Files**: `src/actions/agentic-step/tasks/direct.js`

**Status**: pending

### W3: Director disables schedule on mission-complete (HIGH — FINDING-4)

**Problem**: After mission-complete, the hourly schedule continued running, producing 9 wasted CI runs in S3. The director doesn't disable the schedule.

**Fix**: When the director declares mission-complete or mission-failed, set the schedule to "off" by dispatching the schedule workflow or updating the config.

**Files**: `src/actions/agentic-step/tasks/direct.js`, possibly `.github/workflows/agentic-lib-workflow.yml` (add early exit check)

**Status**: pending

### W4: Workflow-level mission-complete early exit (MEDIUM — FINDING-4)

**Problem**: Even after MISSION_COMPLETE.md exists, workflow runs proceed through all jobs. S1 iteration 6 was only cancelled by concurrency, not by design.

**Fix**: In the workflow's telemetry or params job, check for MISSION_COMPLETE.md or MISSION_FAILED.md. If found, set an output that causes all downstream jobs to be skipped.

**Files**: `.github/workflows/agentic-lib-workflow.yml`

**Status**: pending

### W5: Deduplicate issue creation (MEDIUM — FINDING-5)

**Problem**: S3 had 5 near-identical "dedicated tests" issues (#3070-#3074). The supervisor creates issues without checking for existing duplicates.

**Fix**: Before creating an issue in the supervisor, search for open/recently-closed issues with similar titles. Skip creation if a match exists.

**Files**: `src/actions/agentic-step/tasks/supervise.js`

**Status**: pending

---

## Implementation Order

| # | Work Item | Priority | Dependencies |
|---|-----------|----------|--------------|
| 1 | W1 | HIGH | None |
| 2 | W2 | HIGH | None |
| 3 | W3 | HIGH | W2 (director handles mission-complete) |
| 4 | W4 | MEDIUM | None |
| 5 | W5 | MEDIUM | None |

**Branch**: `claude/benchmark-011-fixes`

---

## Implementation Notes

### W1: Exclude maintain transforms from budget — DONE

Changed `COST_TASKS` in both `src/copilot/telemetry.js` (`computeTransformationCost()`) and `src/actions/agentic-step/index.js` from `["transform", "fix-code", "maintain-features", "maintain-library"]` to `["transform", "fix-code"]`. Maintain tasks no longer count against the mission budget.

### W2: Director updates state file on mission-complete — DONE

Added state update block to `executeMissionComplete()` in `src/actions/agentic-step/tasks/direct.js`. Now sets `state.status["mission-complete"] = true` and `state.schedule["auto-disabled"] = true`. Mirrors the existing logic in `executeMissionFailed()`.

### W3: Director disables schedule on mission-complete — DONE

Added schedule dispatch to `executeMissionComplete()` in `src/actions/agentic-step/tasks/direct.js`. Now dispatches `agentic-lib-schedule.yml` with `frequency: "off"` on mission-complete. Mirrors the pattern in `executeMissionFailed()` but uses "off" instead of "weekly".

### W4: Workflow-level early exit — NOT STARTED

The workflow already has mission-complete checks at multiple points (telemetry, fix-stuck, dev jobs). Investigation showed extensive `mission-complete` gating already exists. The 9 wasted runs in S3 were from maintain jobs that run regardless. Needs further investigation to determine if maintain jobs should also be gated.

### W5: Deduplicate issue creation — NOT STARTED

Needs supervisor code review to understand issue creation flow.
