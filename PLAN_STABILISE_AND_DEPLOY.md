# PLAN: Stabilise and Deploy

Getting from the `refresh` branch to a working system on `main` — a single-file experiment looping and resetting in repository0, and the discussions bot taking instruction.

## User Assertions

- Get a single file experiment looping and resetting in repository0
- Get the discussions bot taking instruction
- This is operational stabilisation, not a feature

---

## Refresh → Main Gap Analysis

### agentic-lib (5 commits on refresh, ~170 files changed)

- **agentic-step action added** (8 task handlers, config-loader, safety, logging)
- **33 legacy workflows deleted** (wfr-completion-*, agent-transformation-*, old agent-flow-*)
- **4 new workflows** (agent-flow-evolve/maintain/review, agent-supervisor)
- **Agent files relocated** (.github/agents/ → .github/agentic-lib/agents/)
- **Developer files relocated** (examples/, maintainers-log/ → _developers/)
- **Docs consolidated** (MVP.md + FEATURES.md → single FEATURES.md, ROADMAP.md deleted)
- **New docs** (FEATURES_ROADMAP.md, API.md, DEMO.md, demo.sh, 4 PLAN_*.md, 7 backlog plans)
- **SDK API fixed** — systemMessage format, githubToken auth, package-lock.json added
- **Workflow bugs fixed** — output references, stale triggers, string interpolation

### repository0 (4 commits on refresh, ~120 files changed)

- **16 legacy workflows deleted**
- **3 new workflows** (agent-flow-evolve/maintain/review — call agentic-step from agentic-lib)
- **Files relocated** (agents, features, seeds, scripts → .github/agentic-lib/)
- **Template cleaned** (src/lib/main.js → "Hello World!")
- **License fixed** (Apache-2.0 → MIT)
- **GETTING-STARTED.md added**
- **Sandbox cleaned** — fresh MISSION.md, all 10 stale features deleted, intentïon.md created
- **Workflow bugs fixed** — output references, stale triggers, string interpolation, version refs, seed path

### xn--intenton-z2a.com (3 commits on refresh, 42 files changed)

- **showcase.html added** (S3-powered experiment stats page)
- **index.html updated** (submission box, tagline, brand messaging)
- **Dev files relocated** (→ _developers/)
- **License changed** (proprietary → AGPL-3.0)
- **README rewritten**

---

## Risk Register — Status After Stabilisation Work

### 1. `@github/copilot-sdk` — RESOLVED

**Status: FIXED.** The package exists (`@github/copilot-sdk@0.1.29`), installs successfully, and the API matches our usage pattern. Fixed all 10 `createSession()` calls to use the correct `systemMessage: { content }` object format instead of bare strings. Removed invalid `workingDirectory` parameter. Added `githubToken` to `CopilotClient` constructor for Actions auth.

### 2. npm ci will fail — RESOLVED

**Status: FIXED.** Generated `package-lock.json` by running `npm install`. Committed to repo. `npm ci` will now work.

### 3. repository0 workflows reference agentic-lib's main branch — UNDERSTOOD

**Status: ACKNOWLEDGED.** repository0's sparse checkout uses default branch (main). Merge order must be: **agentic-lib first, then repository0**. No code change needed.

### 4. MISSION.md has stale content — RESOLVED

**Status: FIXED.** Replaced owl-builder MISSION.md with string utility library mission. Updated seed file to match.

### 5. Feature files are stale — RESOLVED

**Status: FIXED.** All 10 owl-builder feature files deleted. Features directory is now empty — evolve agent will create fresh features from the new mission.

### 6. No intentïon.md — RESOLVED

**Status: FIXED.** Created `intentïon.md` with header. Logging code will append to it.

### 7. Reseed configuration may not work — PARTIALLY RESOLVED

**Status: CONFIG FIXED.** Fixed seed test path from `zero-tests.js` to `zero-main.test.js`. Reseed trigger mechanism not yet implemented (no workflow calls reseed). Handle manually for now.

### 8. Discussions bot requires Discussions enabled — UNVERIFIED

**Status: NEEDS MANUAL CHECK.** Verify GitHub Discussions are enabled on repository0. Check via: Settings → Features → Discussions.

### 9. Concurrency groups may block execution — ACKNOWLEDGED

**Status: LOW RISK.** All agent-flow-* workflows use `concurrency: agentic-lib-main`. Acceptable for now — prevents race conditions. Relax if blocking becomes a problem.

### 10. Remaining wfr-* workflows reference deleted callers — RESOLVED

**Status: FIXED.** Updated `publish-stats.yml` and `publish-web.yml` in both repos:
- Fixed `needs.select-issue` → `needs.select-next-issue` output references
- Fixed stale `workflow_run` triggers (removed references to deleted workflows)

### 11. ci-formating.yml string interpolation bug — RESOLVED (NEW)

**Status: FIXED.** Fixed `allPaths: allPaths}` → `allPaths: ${allPaths}` in both repos.

### 12. Copilot CLI availability on runners — OPEN QUESTION (NEW)

**Status: NEEDS VERIFICATION.** The SDK requires `copilot` CLI in PATH. Assigned issue #1760 to `copilot-swe-agent` asking for clarification. May need a setup step in workflows.

### 13. Model availability via SDK — OPEN QUESTION (NEW)

**Status: NEEDS VERIFICATION.** Our action defaults to `claude-sonnet-4-5`. Need to confirm this model is available via the Copilot SDK and what rate limits apply.

---

## Steps to Get a Single-File Experiment Looping

### Step 1: Merge agentic-lib to main — PR #1762 OPEN

All code changes committed and pushed. Tests pass locally (49 tests across 4 suites). PR #1762 open. Copilot reviewed (PR #1763) — SDK integration validated, version pinned to 0.1.29.

### Step 2: Resolve the Copilot SDK question — DONE

SDK is real, API matches, authentication via `githubToken` parameter. Remaining questions assigned to Copilot (issue #1760).

### Step 3: Generate lockfile — DONE

`package-lock.json` committed. `npm ci` will work.

### Step 4: Write a simple MISSION.md — DONE

```markdown
# repository0
A JavaScript utility library that provides string transformation functions (capitalize, slugify, truncate, reverse).
Published to npm as `@xn-intenton-z2a/repository0`. Includes a CLI that demonstrates each function.
```

### Step 5: Clean the sandbox — DONE

- All 10 stale feature files deleted
- `src/lib/main.js` is "Hello World!" (already was)
- `intentïon.md` created
- Seed MISSION updated

### Step 6: Merge repository0 to main — PR #2402 OPEN (after agentic-lib)

All changes committed and pushed. Tests, formatting, and linting all pass. PR #2402 open.

### Step 7: Trigger the loop — PENDING

After both PRs are merged:
- Manually dispatch `agent-flow-evolve` workflow
- Watch for: Does `npm ci` succeed? Does the Copilot CLI authenticate? Does the SDK connect?
- If it produces code, check: Does it commit? Does CI pass?

### Step 8: Verify the loop closes — PENDING

Watch for the full cycle:
1. `agent-flow-evolve` creates code → commits → pushes
2. `ci-test` runs and passes
3. `agent-flow-review` closes resolved issues
4. Next scheduled `agent-flow-evolve` picks up the next feature

---

## Steps to Get the Discussions Bot Taking Instruction

### Step 1: Verify Discussions are enabled — DONE

Verified: Discussions enabled on both repository0 and agentic-lib. Discussion #2401 exists and the ChatGPT bot responded.

### Step 2: Verify the bot workflow — DONE (code review)

`agent-discussions-bot.yml` triggers on `discussion` and `discussion_comment` events. It calls `agentic-step` with task `discussions`. The handler reads the discussion, generates a response, and posts it. SDK API calls have been fixed.

### Step 3: Test with a simple discussion — PENDING (after merge)

Create a new Discussion in repository0:
- Category: "General" or "Ideas"
- Title: "Build a string reversal function"
- Body: "Please add a function that reverses strings"

### Step 4: Watch the workflow — PENDING

- Does the `agent-discussions-bot` workflow trigger?
- Does it successfully call `agentic-step`?
- Does it post a response to the discussion?
- Does the response include an `[ACTION:create-feature]` directive?

### Step 5: Verify action execution — PENDING

If the bot creates a feature:
- Check `.github/agentic-lib/features/` for a new feature file
- Check if the next `agent-flow-evolve` run picks up the feature

---

## Claude ↔ Copilot Collaboration

**CLAUDE_AND_COPILOT.md** created with 10 questions for Copilot about SDK usage in this context. Issue #1760 assigned to `copilot-swe-agent` to answer the questions directly on the refresh branch.

This establishes an agent-to-agent communication channel where:
- Claude writes questions in `CLAUDE_AND_COPILOT.md`
- Copilot answers by editing the same file
- Both agents can reference the discussion bot for repository0-specific context

---

## Merge Strategy

```
1. agentic-lib: PR #1762 refresh → main (merge first — repository0 depends on it)
2. repository0: PR #2402 refresh → main (merge second)
3. xn--intenton-z2a.com: PR #42 refresh → main (independent, merge anytime)
```

**Do NOT merge repository0 before agentic-lib** — repository0's workflows do a sparse checkout of agentic-lib's main branch to get the agentic-step action.

### Website (xn--intenton-z2a.com) — PR #42

- License changed to AGPL-3.0
- Showcase page added (`public/showcase.html`)
- Index page updated with submission box linking to repository0 Discussions
- Dev files moved to `_developers/`
- Build fix: removed `--enable-preview` from pom.xml
- Pre-existing issue: JUnit Platform + Java 25 compatibility (affects both main and refresh)

---

## Work Completed This Session

| Item | Status |
|------|--------|
| Verify `@github/copilot-sdk` exists | Done — v0.1.29, installs, API matches |
| Fix `systemMessage` format (10 calls) | Done — `{ content: '...' }` |
| Add `githubToken` to CopilotClient (10 calls) | Done |
| Remove `workingDirectory` param (7 calls) | Done |
| Generate package-lock.json | Done |
| Fix output refs in publish-stats/web (both repos) | Done |
| Fix stale workflow_run triggers (both repos) | Done |
| Fix ci-formating.yml interpolation (both repos) | Done |
| Fix seed test path in config | Done |
| Fix workflow version @main → @6.10.2 | Done |
| Fresh MISSION.md for repository0 | Done |
| Delete 10 stale feature files | Done |
| Create intentïon.md | Done |
| Update seed MISSION | Done |
| Create CLAUDE_AND_COPILOT.md | Done |
| Assign Copilot issue #1760 | Done |
| Run all tests (40 pass) | Done |
| Commit and push both repos | Done |
| Add `defineTool()` file ops (read, write, list, run) | Done — tools.js + 10 tools tests |
| Add `onPermissionRequest: approveAll` to all sessions | Done — required by SDK |
| Re-add `workingDirectory` to all sessions | Done — valid per SDK types |
| Fix `discussions.js` GraphQL content fetch | Done — fetches title, body, comments |
| Fix model name `claude-sonnet-4-5` → `4.5` | Done |
| Pin SDK to exact `0.1.29` | Done — Copilot review recommendation |
| Fix repository0 prettier formatting | Done — double quotes |
| Fix website pom.xml `--enable-preview` | Done |
| Write multi-agent citizenship guidelines | Done — in CLAUDE.md |
| Open PR for agentic-lib (#1762) | Done |
| Open PR for repository0 (#2402) | Done |
| Open PR for website (#42) | Done |
| Copilot SDK review (PR #1763) | Done — all 7 areas validated |
| Agent coordination issue (#1765) | Open — Copilot created WIP PR #1766 |
| Run all tests (49 pass: 46 agentic-step + 3 root) | Done |

---

## Success Criteria

- [x] `@github/copilot-sdk` resolves and installs
- [x] SDK API calls match the real API
- [x] `package-lock.json` committed for `npm ci`
- [x] Fresh mission, clean features, intentïon.md in place
- [x] No broken output references in workflows
- [x] No stale workflow_run triggers
- [x] All tests pass locally (49 tests: 46 agentic-step + 3 root)
- [x] `defineTool()` file operations added to all task handlers
- [x] `onPermissionRequest: approveAll` added (SDK requirement)
- [x] SDK pinned to 0.1.29 (Copilot review)
- [x] Copilot validated SDK integration (PR #1763)
- [x] PRs open for all 3 repos
- [x] Multi-agent citizenship guidelines documented
- [ ] `agent-flow-evolve` runs successfully in repository0
- [ ] Evolve step produces a code change and commits it
- [ ] CI tests pass on the committed change
- [ ] On next scheduled run, evolve makes further progress
- [ ] Discussions bot responds to a posted Discussion
- [ ] Bot can create a feature from a Discussion request
- [ ] A feature created by the bot eventually becomes code via evolve

---

## Related Documents

- **[FEATURES.md](FEATURES.md)** — Feature definitions and acceptance criteria
- **[PLAN_VERIFICATION.md](PLAN_VERIFICATION.md)** — Detailed verification of all acceptance criteria
- **[PLAN_LAUNCH.md](PLAN_LAUNCH.md)** — Publishing and release steps (after stabilisation)
- **[CLAUDE_AND_COPILOT.md](CLAUDE_AND_COPILOT.md)** — Cross-agent questions and answers
