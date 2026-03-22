# Plan: Benchmark 018 Fixes

Fixes for findings from BENCHMARK_REPORT_018.md.

---

## Investigation Results

### REC-1: S2 zero-budget (RESOLVED — not a bug)

**Finding**: Report 018 showed string-utils with `transformation-budget = 0/0`.

**Root cause**: The enriched report was generated from a snapshot taken during the init/update phase, before any `agentic-lib-workflow` run had executed. The state file had not yet been written by any agentic-step invocation.

**Current state**: The state file now shows `transformation-budget-used = 1, cap = 128` and `cumulative-transforms = 1`. The config correctly has `profile = "max"` and `[profiles.max].transformation-budget = 128`.

**Action**: None required. The report timing issue is inherent to the flow's architecture — the report runs at the end of the flow, after all iterations, and should capture the final state. The 0/0 snapshot was from an intermediate point.

---

### REC-2: W3 — State file mission-complete not persisted (BUG — fix needed)

**Finding**: `MISSION_COMPLETE.md` exists on main but `agentic-lib-state.toml` on the logs branch shows `mission-complete = false`. Persistent since Report 014.

**Root cause**: Double-write race in `index.js`:

1. `index.js:100` — reads state into memory (`mission-complete = false`)
2. `index.js:103` — calls `direct()` task handler
3. `direct.js:238-242` — re-reads state from disk, sets `mission-complete = true`, writes to disk
4. `index.js:121` — calls `updateStateAfterTask()` with the **stale** state object from step 1
5. `index.js:174` — writes the stale state back to disk, **overwriting** the director's update
6. Workflow pushes the overwritten file to agentic-lib-logs branch

The director correctly writes `mission-complete = true` to disk, but `index.js` immediately overwrites it with the stale copy that still has `mission-complete = false`.

**Fix**: After the task handler returns, re-read state from disk before applying generic updates. This preserves any in-task state mutations.

**File**: `src/actions/agentic-step/index.js`

**Change**:
```javascript
// BEFORE (current — line 100):
const state = readState(".");
const result = await handler(context);

// AFTER:
let state = readState(".");
const result = await handler(context);
// Re-read state after task — task handlers may have written updates
state = readState(".");
```

This is a one-line fix. The `updateStateAfterTask()` call on line 121 then operates on the fresh state that includes the director's `mission-complete = true`.

**Risk**: Low. `readState` is a simple TOML file read. The re-read adds <1ms.

---

### REC-3: PR-less transforms with skipMaintain (RESOLVED — by design)

**Finding**: All benchmark transforms landed as direct commits with no PRs.

**Root cause**: `skipMaintain=true` does NOT bypass the branch→PR→merge cycle. It only skips the `maintain` job (library/feature doc updates). The `dev` job (which creates branches and PRs) runs independently.

The PR-less transforms observed in Report 018 have a different cause: the scenarios completed via the **director** (which writes `MISSION_COMPLETE.md` directly to main) and the **bot** (which responds to discussions and can commit directly). Neither of these goes through the branch→PR→merge cycle — they are status/response commits, not code transforms.

In the benchmark run, the `dev` job DID run but the scenarios were simple enough (7-kyu fizz-buzz, 6-kyu roman-numerals) that the bot/director completed them before the dev job could create PRs.

**Action**: Document this as expected behaviour. Add a note to ITERATION_BENCHMARKS_SIMPLE.md explaining that simple missions may complete via bot/director direct commits rather than dev-job PRs.

---

## Fix Plan

### Fix 1: W3 state file persistence (CRITICAL)

- [x] Edit `src/actions/agentic-step/index.js`: re-read state from disk after task handler returns
- [ ] Add test: verify state mutations from task handlers survive the index.js write cycle
- [ ] Verify: run fizz-buzz scenario and check state file shows `mission-complete = true`

### Fix 2: Generate mission call signature (from earlier investigation)

- [ ] Already fixed in `bin/agentic-lib.js`: `runCopilotSession` call now uses correct params (`workspacePath`, `userPrompt`, `writablePaths`)
- [ ] Verify: the generate fallback to fizz-buzz still works when Copilot SDK is unavailable

### Documentation

- [ ] Add note to ITERATION_BENCHMARKS_SIMPLE.md about bot/director direct commits being expected for simple missions
