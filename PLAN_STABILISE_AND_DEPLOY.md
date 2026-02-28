# PLAN: Stabilise and Deploy

Getting from the `refresh` branch to a working system on `main` — a single-file experiment looping and resetting in repository0, and the discussions bot taking instruction.

## User Assertions

- Get a single file experiment looping and resetting in repository0
- Get the discussions bot taking instruction
- This is operational stabilisation, not a feature

---

## Refresh → Main Gap Analysis

### agentic-lib (2 commits, 166 files, +4707/-22023)

The big one. Changes:
- **agentic-step action added** (8 task handlers, config-loader, safety, logging)
- **33 legacy workflows deleted** (wfr-completion-*, agent-transformation-*, old agent-flow-*)
- **4 new workflows** (agent-flow-evolve/maintain/review, agent-supervisor)
- **Agent files relocated** (.github/agents/ → .github/agentic-lib/agents/)
- **Developer files relocated** (examples/, maintainers-log/ → _developers/)
- **Docs consolidated** (MVP.md + FEATURES.md → single FEATURES.md, ROADMAP.md deleted)
- **New docs** (FEATURES_ROADMAP.md, API.md, DEMO.md, demo.sh, 4 PLAN_*.md)

### repository0 (3 commits, 106 files, +514/-25187)

Massive deletion — all the old OpenAI workflows and transformation chains removed:
- **16 legacy workflows deleted**
- **3 new workflows** (agent-flow-evolve/maintain/review — call agentic-step from agentic-lib)
- **Files relocated** (agents, features, seeds, scripts → .github/agentic-lib/)
- **Template cleaned** (src/lib/main.js → "Hello World!", intentïon.md deleted, stats pages removed)
- **License fixed** (Apache-2.0 → MIT)
- **GETTING-STARTED.md added**

### xn--intenton-z2a.com (3 commits, 42 files, +1138/-350)

Smaller and self-contained:
- **showcase.html added** (S3-powered experiment stats page)
- **index.html updated** (submission box, tagline, brand messaging)
- **Dev files relocated** (→ _developers/)
- **License changed** (proprietary → AGPL-3.0)
- **README rewritten**

---

## What Will Go Wrong

### 1. `@github/copilot-sdk` doesn't exist yet (or has different API)

**Risk: HIGH.** The `agentic-step` action imports `@github/copilot-sdk` and calls `new CopilotClient()`, `client.createSession()`, `session.sendAndWait()`. This API shape was written speculatively based on the SDK's trajectory. The actual package name, API surface, and authentication mechanism may differ.

**What we need:**
- Verify the real package name and install it (`npm ci` in the agentic-step directory)
- Check authentication — does it use `GITHUB_TOKEN` or a separate Copilot token?
- Check if `createSession()` / `sendAndWait()` are the real method names
- May need to replace with the Copilot Extensions API or the Copilot coding agent REST API

**Mitigation:** If the SDK isn't ready, implement a shim that calls the Copilot REST API directly or the GitHub Models API (which is available now and supports `claude-sonnet-4-5` via `@azure/ai-inference`).

### 2. npm ci will fail for agentic-step

**Risk: HIGH.** There's no `package-lock.json` in the agentic-step directory. The `npm ci` step in every workflow will fail immediately.

**What we need:**
- Run `npm install` (not `npm ci`) in the agentic-step directory to generate a lockfile
- Or change workflows to use `npm install` instead of `npm ci`
- The `@github/copilot-sdk` package must resolve (see #1)

### 3. repository0 workflows reference agentic-lib's `refresh` branch, not `main`

**Risk: MEDIUM.** The repository0 `agent-flow-evolve.yml` does a sparse checkout of `xn-intenton-z2a/agentic-lib` — but it doesn't specify a branch/ref, so it defaults to `main`. The agentic-step action only exists on `refresh`. If we merge repository0 before agentic-lib, all workflows will fail.

**Merge order must be:** agentic-lib first, then repository0.

### 4. MISSION.md has stale content from a previous experiment

**Risk: LOW but annoying.** Currently says "owl-builder" from a previous seeding cycle. The seed file also says "owl-builder". For a clean start, we need a fresh MISSION.md that matches what we want the demo to do.

**What we need:**
- Decide: what should the single-file experiment do? Options:
  - A simple "Hello World" CLI that evolves toward a useful utility
  - Keep the owl-builder mission (it's complex but demonstrates capability)
  - Write a new simple mission (e.g., "A date formatting library")
- Update MISSION.md and the seed mission files accordingly

### 5. Feature files are stale (from the owl-builder era)

**Risk: MEDIUM.** 10 feature files exist in `.github/agentic-lib/features/` (CLI_PARSER, HTTP_SERVER, etc.) — all from the owl-builder experiment. If the mission changes, these will confuse the evolve agent. If the mission stays, they're fine but the experiment will pick up mid-stream rather than starting fresh.

**What we need for a clean loop:**
- Delete all existing feature files
- Let the evolve agent create new ones from the mission
- Or reset the entire sandbox to seed state

### 6. No intentïon.md in repository0

**Risk: LOW.** The activity log file was deleted during template cleanup. The `agentic-lib.yml` config references it at `intentïon.md`. The logging code in `agentic-step` will try to write to it — it should create it, but verify.

### 7. Reseed configuration may not work

**Risk: MEDIUM.** The config has `seeding.repositoryReseed: 'true'` and seed file paths, but no workflow currently triggers a reseed. The old `agent-flow-seed-repository-and-feature-development.yml` was deleted. The new `agent-flow-evolve.yml` doesn't include reseed logic.

**What we need:**
- Either add reseed capability to the `evolve` task handler
- Or create a separate `agent-flow-reseed.yml` workflow
- Or handle reseeding manually for now and add it later

### 8. Discussions bot requires Discussions to be enabled

**Risk: LOW.** GitHub Discussions must be enabled on the repository0 repo. It probably already is, but verify.

### 9. Concurrency groups may block execution

**Risk: LOW.** All agent-flow-* workflows use `concurrency: agentic-lib-main`. If one workflow hangs, all others queue. For initial testing, consider removing or relaxing concurrency.

### 10. Remaining wfr-* workflows reference deleted callers

**Risk: LOW.** The 15 kept `wfr-*` files are reusable workflows. They don't run on their own — they're called by other workflows. If their callers still exist and still reference them correctly, they're fine. Verified during deletion that no broken references exist.

---

## Steps to Get a Single-File Experiment Looping

### Step 1: Merge agentic-lib to main

Open PR from `refresh` → `main`. Review the 166-file diff. Merge.

### Step 2: Resolve the Copilot SDK question

Before merging repository0, verify the agentic-step action works:

```bash
cd .github/agentic-lib/actions/agentic-step
npm install  # Will this resolve @github/copilot-sdk?
```

If it doesn't resolve, implement a fallback:
- Option A: Use `@azure/ai-inference` with the GitHub Models endpoint
- Option B: Use GitHub's REST API for Copilot coding agent (assign issue to Copilot)
- Option C: Use a stub that prints what it would do (for testing the loop mechanics)

### Step 3: Generate lockfile

```bash
cd .github/agentic-lib/actions/agentic-step
npm install
git add package-lock.json
git commit -m "Add package-lock.json for agentic-step"
git push
```

### Step 4: Write a simple MISSION.md

For the single-file experiment, a simple mission:

```markdown
# repository0

A JavaScript utility library that provides string transformation functions (capitalize, slugify, truncate, reverse).
Published to npm. Includes a CLI that demonstrates each function.
```

Something small enough that the evolve agent can make meaningful progress in a single step, but complex enough to demonstrate the loop (multiple features, tests, iterations).

### Step 5: Clean the sandbox

- Delete all existing feature files in `.github/agentic-lib/features/`
- Reset `src/lib/main.js` to "Hello World!" (already done)
- Delete any stale branches

### Step 6: Merge repository0 to main

Open PR from `refresh` → `main`. Merge after agentic-lib is merged.

### Step 7: Trigger the loop

- Manually dispatch `agent-flow-evolve` workflow
- Watch for: Does it run? Does `npm ci` succeed? Does the Copilot SDK authenticate?
- If it produces code, check: Does it commit? Does CI pass? Does auto-merge work?

### Step 8: Verify the loop closes

Watch for the full cycle:
1. `agent-flow-evolve` creates code → commits → pushes
2. `ci-test` runs and passes
3. Auto-merge (if on a PR branch) or direct push
4. `agent-flow-review` closes resolved issues
5. Next scheduled `agent-flow-evolve` picks up the next feature

---

## Steps to Get the Discussions Bot Taking Instruction

### Step 1: Verify Discussions are enabled

On GitHub: repository0 → Settings → Features → Discussions ✓

### Step 2: Verify the bot workflow

`agent-discussions-bot.yml` triggers on `discussion` and `discussion_comment` events. It calls `agentic-step` with task `discussions`. The handler reads the discussion, generates a response, and posts it.

### Step 3: Test with a simple discussion

Create a new Discussion in repository0:
- Category: "General" or "Ideas"
- Title: "Build a string reversal function"
- Body: "Please add a function that reverses strings"

### Step 4: Watch the workflow

- Does the `agent-discussions-bot` workflow trigger?
- Does it successfully call `agentic-step`?
- Does it post a response to the discussion?
- Does the response include an `[ACTION:create-feature]` directive?

### Step 5: Verify action execution

If the bot creates a feature:
- Check `.github/agentic-lib/features/` for a new feature file
- Check if the next `agent-flow-evolve` run picks up the feature
- Check if an issue is created from the feature

---

## Merge Strategy

```
1. agentic-lib: PR refresh → main (merge first — repository0 depends on it)
2. repository0: PR refresh → main (merge second)
3. xn--intenton-z2a.com: PR refresh → main (independent, merge anytime)
```

**Do NOT merge repository0 before agentic-lib** — repository0's workflows do a sparse checkout of agentic-lib's main branch to get the agentic-step action.

---

## Success Criteria

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
