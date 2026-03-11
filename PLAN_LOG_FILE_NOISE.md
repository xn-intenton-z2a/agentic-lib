# Plan: Move Noisy Files Off Working Branches

**Created**: 2026-03-11
**Status**: plan — not yet implemented

---

## User Assertions

1. `SCREENSHOT_INDEX.png` and `intentïon.md` are too noisy on working branches and main
2. They should live elsewhere — GitHub Actions artifacts, a detached `.logs` branch, or similar
3. `init --purge` must still be able to clean them up (wherever they are)

---

## Problem

Both files are committed to the working tree on main:

- **`intentïon.md`** — activity log appended by every agentic-step run. Grows continuously. Log rotation keeps 30 entries but still generates frequent commits. `commit-if-changed` already unstages it on non-main branches, but on main it still creates `[skip ci]` commits.
- **`SCREENSHOT_INDEX.png`** — Playwright screenshot updated on every behaviour test run. Binary file causes merge conflicts. The test workflow has a 3-attempt rebase/push strategy specifically for this.

Both create noise: frequent commits on main, merge conflicts on branches, binary diffs in PRs.

---

## Current Write Points

| File | Written by | Committed by | Read by |
|------|-----------|-------------|---------|
| `intentïon.md` | `agentic-step/logging.js:logActivity()` | `commit-if-changed` (main only, unstaged on branches) | `agentic-lib-workflow.yml` supervisor (telemetry), `index.js` (cost sums) |
| `SCREENSHOT_INDEX.png` | `zero-behaviour.test.js` (Playwright) | `agentic-lib-test.yml` (conditional push on main) | GitHub Pages (if served), user review |

---

## Options

### Option A: GitHub Actions Artifacts Only

Store both files as workflow artifacts, never commit them.

**How it works:**
- `logActivity()` writes `intentïon.md` to the workspace as now, but `commit-if-changed` never stages it (already the case on branches; extend to main)
- `agentic-lib-test.yml` uploads `SCREENSHOT_INDEX.png` as artifact (already done) but removes the push-to-main step
- The supervisor reads `intentïon.md` from the workspace (already the case — it reads the file from the checkout, which was written earlier in the same run)
- Cross-run persistence: the workflow downloads the artifact from the previous run at the start

**Pros:**
- Zero commits for log/screenshot files
- No merge conflicts ever
- Artifacts auto-expire (90 days default)

**Cons:**
- Artifact download adds latency to every workflow run
- Artifacts from previous runs require API calls to find and download
- `init --purge` can't clean artifacts (would need a separate API call)
- Cross-run artifact retrieval is fragile (run IDs, retention, artifact names)
- Loss of persistent history — artifacts expire, git commits don't

### Option B: Detached `.logs` Branch

Store both files on an orphan branch (e.g. `.logs`) that has no common history with main.

**How it works:**
- Create orphan branch `.logs` with only `intentïon.md` and `SCREENSHOT_INDEX.png`
- `commit-if-changed` commits these files to `.logs` instead of the working branch
- The supervisor step checks out `.logs` to read `intentïon.md` before running
- `init --purge` deletes and recreates the `.logs` branch

**Pros:**
- Files persist in git but don't pollute main's history
- No merge conflicts (separate branch, no merges)
- `init --purge` can force-push a clean `.logs` branch
- History is preserved (git log on `.logs` shows the activity log over time)
- No API dependency (pure git)

**Cons:**
- Extra checkout step in workflows to read/write `.logs`
- Concurrent workflow runs could race on `.logs` pushes (needs rebase logic, same as now)
- Branch shows up in `git branch -a` (minor clutter)
- Slightly more complex CI logic

### Option C: GitHub Actions Cache

Store both files in the GitHub Actions cache (`actions/cache`).

**Pros:** Fast read/write, no commits, auto-eviction

**Cons:** Cache is best-effort (can be evicted any time), no history, can't be inspected without a workflow run, `init --purge` would need to invalidate cache keys. Not suitable for `intentïon.md` which is the primary activity record.

### Option D: Repository Wiki or Gist

Push to the repo wiki (which is a separate git repo) or a gist.

**Pros:** Completely separate from main repo

**Cons:** Wiki requires enabling, separate auth, different git remote. Gist is external. Both are awkward for automated workflows. Over-engineered.

### Option E: `.gitignore` + Artifact Upload

Add both files to `.gitignore` so they're never committed. Upload as artifacts for cross-run access.

**Pros:** Simplest change — just add to `.gitignore` and remove commit steps

**Cons:** Same artifact fragility as Option A. Loss of persistent `intentïon.md` history. The file would only exist within a single workflow run unless downloaded from artifacts.

### Option F: Hybrid — `.logs` Branch for `intentïon.md`, Artifact for Screenshot

Different files have different needs:
- `intentïon.md` is a **persistent activity record** — it needs to survive across runs and be inspectable. Best fit: `.logs` branch.
- `SCREENSHOT_INDEX.png` is a **transient snapshot** — latest-only is fine, history is noise. Best fit: artifact upload only.

**Pros:** Right tool for each file. Log history preserved, screenshot noise eliminated.

**Cons:** Two different mechanisms to maintain.

---

## Recommendation: Option F (Hybrid)

### `intentïon.md` → `.logs` orphan branch

1. Create orphan branch `.logs` during `init --purge`
2. `logActivity()` still writes to workspace `intentïon.md` (no change)
3. After agentic-step runs, a new step checks out `.logs`, copies `intentïon.md`, commits, pushes
4. Supervisor telemetry step checks out `.logs` to read `intentïon.md` before building the prompt
5. `init --purge` deletes `.logs` branch and recreates it with the init header
6. `commit-if-changed` no longer needs to handle `intentïon.md` at all (remove unstage logic)

### `SCREENSHOT_INDEX.png` → Artifact only

1. Remove the "Push screenshot on main" step from `agentic-lib-test.yml`
2. Keep the "Upload screenshot" artifact step (already exists)
3. Add `SCREENSHOT_INDEX.png` to `.gitignore` seed
4. Behaviour test still writes it to workspace for the artifact upload
5. `init --purge` no longer needs to handle it (it's gitignored)

---

## Work Items

| # | Item | Where | Priority |
|---|------|-------|----------|
| W1 | Create `.logs` orphan branch management in `init --purge` | `bin/agentic-lib.js` | HIGH |
| W2 | Move `intentïon.md` commit from `commit-if-changed` to `.logs` branch push | `commit-if-changed/action.yml`, new step in `agentic-lib-workflow.yml` | HIGH |
| W3 | Update supervisor telemetry to read `intentïon.md` from `.logs` branch | `agentic-lib-workflow.yml` | HIGH |
| W4 | Remove screenshot push-to-main from `agentic-lib-test.yml` | `agentic-lib-test.yml` | MEDIUM |
| W5 | Add `SCREENSHOT_INDEX.png` to `.gitignore` seed | `src/seeds/zero-.gitignore` | MEDIUM |
| W6 | Update `logActivity()` and config-loader docs | `logging.js`, `config-loader.js` | LOW |
| W7 | Handle concurrent `.logs` pushes (rebase/retry) | new step or shared script | MEDIUM |
