# Plan: Benchmark 007a Fixes

**Source**: Observation of hamming-distance benchmark run on repository0 (2026-03-11)
**Created**: 2026-03-11
**Status**: analysis complete, not yet implemented

---

## User Assertions

1. The web layer (`src/web/index.html`) must not build its own copy of library functions — behaviour tests must test the same code as unit tests
2. The intentïon.md metrics are wrong and need root-cause fixes in agentic-lib

---

## Issue 1: Web Duplicates Library Code

### Problem

`src/web/index.html` (lines 96-131) contains **inline recreations** of `hammingDistance()` and `hammingDistanceBits()` instead of importing from `src/lib/main.js`. The comment on line 94 says:

```js
// For demo purposes, we'll recreate the functions here
```

This means:
- **Unit tests** (`tests/unit/main.test.js`) test the real library
- **Behaviour tests** (`tests/behaviour/*.spec.js`) test the inline copy via Playwright
- The two implementations could diverge silently (e.g. library adds BigInt support, web copy doesn't)
- Behaviour tests pass even if the library is broken, and vice versa

### Why It Happened

The `build:web` script does `cp -r src/web/* docs/` with no bundling. `src/lib/main.js` uses Node APIs (`createRequire`, `process.argv`) so it can't be imported directly in the browser.

### Prevention Strategies

| Strategy | Approach | Pros | Cons |
|----------|----------|------|------|
| **A: Separate browser module** | Extract pure functions to `src/lib/hamming.js`, import in both main.js and web | Single source of truth; no bundler | Agentic workflow may overwrite main.js structure |
| **B: Build-time extraction** | `build:web` generates `docs/lib-functions.js` from main.js | No new source file | Fragile code generation |
| **C: Bundler (esbuild)** | `esbuild src/lib/main.js --bundle --format=esm --platform=browser` | Industry standard | Adds dependency; overkill for two functions |
| **D: CI lint check** | Fail CI if `src/web/index.html` contains `function hammingDistance` | Catches drift immediately | Doesn't fix root cause |
| **E: Parity test** | Unit test that evals both implementations on same vectors | Directly tests the invariant | Fragile HTML parsing |
| **F: Function.toString injection** | Build step serialises functions via `.toString()` | Zero deps | Closures/imports won't survive |

### Recommendation

**Strategy A** (separate browser module) for the fix. **Strategy D** (CI lint) as a guard rail.

The constraint is that the agentic workflow overwrites `src/lib/main.js`. The pure functions should live in a file the workflow understands as part of the module structure — or the agent prompts need to be taught about it.

### Fix in agentic-lib (the root cause)

The web code duplication happens because the **transform agent** generates inline functions when it builds the web layer. The fix belongs in the agent prompts and/or the web seed:

1. **`src/seeds/zero-main.js`**: Structure the seed so pure functions are in a separate file that both Node and browser can import
2. **`src/agents/agent-*` prompts**: Instruct agents to never duplicate library functions in web code — always import from the shared module
3. **`src/seeds/zero-behaviour.test.js`**: Seed behaviour test should import from the library, not rely on inline web copies
4. **CI check**: Add a lint step that greps for function definitions in `src/web/` that match exports from `src/lib/`

---

## Issue 2: intentïon.md Metrics Are Wrong

### Reported vs Actual (latest entry, lines 357-371)

| Metric | Reported | Actual | Verdict |
|--------|----------|--------|---------|
| Open issues | 1 | 2 (#2871, #2872) | **WRONG** — timing issue |
| Issues resolved (review/PR merge) | 0 | 3 closed (#2864, #2865, #2869) | **WRONG** — detection bug |
| Dedicated test files | NO | Files exist with imports but only placeholder assertions | Debatable |

### Root Cause: "Issues resolved: 0"

**Source**: `agentic-lib/src/actions/agentic-step/tasks/supervise.js:181-226`

The metric requires BOTH:
1. Issue has `"automated"` label
2. AND either: "Automated Review Result" comment exists, OR close event has a `commit_id`

**Verified via GitHub API** — all 3 closed issues (#2864, #2865, #2869):
- DO have the `"automated"` label
- Have `referenced` events with commit IDs (commits mentioned them)
- But their `closed` events have `commit_id: null`
- Have **zero comments** (no "Automated Review Result")

The automerge workflow (`ci-automerge.yml`) closes issues programmatically via the API, not via "Closes #N" in a commit message. So neither detection path fires.

**Fix**: The resolution check in `supervise.js` (and `direct.js`) needs a third detection path:
- Check if the issue was closed AND has the `"merged"` label (which the automerge workflow adds)
- OR check if a PR that referenced the issue was merged (via timeline events)

### Root Cause: "Open issues: 1" (actual: 2)

The count only includes issues with the `"automated"` label. Both #2871 and #2872 DO have it. This is a timing issue — #2872 was created after the metric was computed in the same workflow run.

**Fix**: Ensure metrics are computed AFTER all issue-creation steps in the workflow, or accept this as a benign race condition that self-corrects on the next iteration.

### Root Cause: "Dedicated test files: NO"

The check (`supervise.js:308-329`) scans for test files that:
1. Are NOT named `main.test.*`, `web.test.*`, `behaviour.test.*`
2. Contain `from '...src/lib/...'` or `require('...src/lib/...')`

`hammingDistance.test.js` and `hammingDistanceBits.test.js` both import from `../../src/lib/main.js` — so they SHOULD match. But they contain only `expect(true).toBe(true)`.

Two possible explanations:
- The files were created AFTER the metric was computed (timing)
- The regex doesn't match the relative import path `../../src/lib/main.js` (the pattern is `src/lib/` without the leading `../../`)

**Needs verification**: Test the regex `/from\s+['"].*src\/lib\//` against the string `from '../../src/lib/main.js'` — this SHOULD match because `.*` covers `../../`. So this is likely a timing issue.

**Deeper question**: Should placeholder test files (only `expect(true).toBe(true)`) count as "dedicated tests"? Currently they would if the regex matches, but they provide zero actual coverage. Consider adding a minimum assertion count or checking that the imported symbols are actually used.

---

## Work Items

| # | Item | Where | Priority |
|---|------|-------|----------|
| W1 | Fix issue-resolved detection to recognise automerge closures (check `merged` label or PR timeline) | `supervise.js`, `direct.js` | HIGH |
| W2 | Prevent web code duplication: update agent prompts to forbid inline function copies | agent prompts, seeds | HIGH |
| W3 | Add CI lint check: fail if `src/web/` contains function definitions matching `src/lib/` exports | workflow or test | MEDIUM |
| W4 | Consider quality check for "dedicated test files" (not just import presence) | `supervise.js`, `direct.js` | MEDIUM |
| W5 | Seed structure: separate pure functions from Node CLI wrapper | `zero-main.js` or new seed | MEDIUM |
