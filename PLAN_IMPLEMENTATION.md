# PLAN: Implementing the Conceptual Model

Transform the current 8-task cron-driven system into the model described in CONCEPT.md. The plan is a committed file. Each workflow run reads state, refines the plan, executes, witnesses, and merges. No separate orchestrator. No "evolve" language anywhere.

---

## Current System (What We're Transforming From)

### Core Action (`src/actions/agentic-step/`)

| File | Lines | What it does |
|---|---|---|
| `index.js` | 117 | Entry point. Hardcoded TASKS map of 8 handlers. |
| `config-loader.js` | 103 | Reads `agentic-lib.yml`, fixed path categories. |
| `copilot.js` | 105 | Copilot SDK wrapper. Reusable as-is. |
| `tools.js` | 133 | 4 tools: read_file, write_file, list_files, run_command. Reusable as-is. |
| `safety.js` | 106 | WIP limits, attempt limits, path checks. Reusable as-is. |
| `logging.js` | 87 | Appends to intentïon.md. Update format only. |

### 8 Task Handlers (`src/actions/agentic-step/tasks/`)

| File | Lines | Concept perspective |
|---|---|---|
| `resolve-issue.js` | 93 | Builder |
| `fix-code.js` | 70 | Fixer |
| `evolve.js` | 209 | Navigator + Builder (conflated) |
| `maintain-features.js` | 71 | Harvester |
| `maintain-library.js` | 65 | Harvester |
| `enhance-issue.js` | 96 | Critic |
| `review-issue.js` | 112 | Witness |
| `discussions.js` | 137 | Narrator |
| **Total** | **853** | |

### Key Problem

The current system hardcodes 8 task types in JavaScript, runs them on fixed cron schedules, and has no concept of a plan, realization, or stewardship. The `evolve.js` task conflates planning with execution. There's no persistent planning artifact.

---

## Target System

### Core Insight

Each workflow run is a **transformation** — a budget of compute. Within that budget:

1. Read current state (plan + product + record + materials)
2. Refine the plan (commit the update to the planning artifact)
3. Make multiple Copilot SDK calls, each producing commits on the branch
4. After each call, state has changed — the next call sees the new commits
5. Witness: assess realization, record the score
6. Merge the branch back when goal is met or budget is spent

The **plan is a committed file** in the repository. It persists across workflow runs. Each transformation refines it. The plan accumulates knowledge using partial-order structure (see CONCEPT.md for the planning theory).

### No separate orchestrator

There is no navigator workflow dispatching other workflows. Each workflow run reads the plan, decides what to do, does it, updates the plan. The "navigation" is implicit — it's what every transformation does at the start.

Concurrency is just GitHub running multiple workflow triggers. Each one independently reads state and acts.

### Agents modify the control plane

Agents can modify each other's perspective files, create new ones, restructure materials. The social protocol: no agent modifies its own perspective file in the same run. Capabilities are documented as repo files (like skills). Any agent reads them. Changes go through the normal commit/PR process.

---

## Phase 1: Context Sources Extraction

**What:** Extract the context-gathering logic duplicated across 8 task handlers into a shared module.

**Why first:** Pure refactoring with zero behavior change. Golden prompt tests verify nothing changes. Creates the foundation for everything else.

### context-sources.js (~200 lines, extracted)

```javascript
export async function getIntention(config) { /* read INTENTION.md */ }
export async function getOpenIssues(octokit, repo, label, limit) { /* list open issues */ }
export async function getClosedIssues(octokit, repo, label, since) { /* recent closed */ }
export async function getSourceFiles(config) { /* scan product source */ }
export async function getTestFiles(config) { /* scan product tests */ }
export async function getFeatureMaterials(config) { /* scan materials/features/ */ }
export async function getLibraryMaterials(config) { /* scan materials/library/ */ }
export async function getIssueDetail(octokit, repo, issueNumber) { /* issue + comments */ }
export async function getPRDetail(octokit, repo, prNumber) { /* PR + check runs */ }
export async function getDiscussion(octokit, repo, discussionNumber) { /* GraphQL */ }
export async function getContributing(config) { /* read CONTRIBUTING.md */ }
export async function getActivityRecord(config, limit) { /* recent intentïon.md */ }
export async function getMaterialSources(config) { /* read SOURCES.md */ }
export async function getPlan(config) { /* read PLAN.md — the committed plan */ }
```

**Migration:** Update each task handler to import from context-sources.js. Run golden prompt tests after each. No behavior change.

**Scope:** Medium. ~200 lines extracted, 8 files updated.

---

## Phase 2: The Planning Artifact

**What:** Introduce the committed plan file. Each transformation reads it, refines it, and commits the update.

### PLAN.md (the committed planning artifact)

This file lives in the repo root (alongside INTENTION.md and intentïon.md). It's writable by all perspectives. It uses partial-order structure:

```markdown
## Plan

### Achieved
- [x] (items completed, with issue/commit links and causal reason)

### In Progress
- [ ] (items currently being worked, with assigned perspective)

### Open Conditions
- [ ] (things needed but not yet planned — gaps the system acknowledges)

### Threats
- (potential conflicts between in-progress or planned items)

### Unordered
- (items that can happen in any sequence — independent work)

### Observations
- (what was learned — failed attempts, surprising results, context for future cycles)

### Witness
- Cycle N: score X%, reason: "..."
```

### How it integrates with the current system

Every task handler gets a new step at the start: read the plan. And a new step at the end: update the plan (what was achieved, what's newly open, what was observed) and assess realization.

This is ~30 lines added to each handler:

```javascript
// At start of any task
const plan = await getPlan(config);
const intention = await getIntention(config);

// At end of any task
await updatePlan(config, {
  achieved: [{ description: 'Resolved issue #42', causal: 'core feature', issue: 42 }],
  observations: ['Tests pass but error messages are generic'],
});
await witness(config, intention, plan);
```

### plan-utils.js (~120 lines, new)

```javascript
export async function getPlan(config) { /* parse PLAN.md */ }
export async function updatePlan(config, updates) { /* merge updates, commit */ }
export async function witness(config, intention, plan) {
  // Assess realization: objective gates (tests pass?) + subjective (LLM score)
  // Append witness entry to plan and to intentïon.md
}
```

**Scope:** Small-medium. ~120 lines new module, ~30 lines per handler (240 total), PLAN.md template.

---

## Phase 3: Perspective Definitions as Data

**What:** Define perspectives as YAML + markdown capability files instead of hardcoded JS. Create a generic perspective runner.

### Perspective definition format

```yaml
# perspectives/builder.yml
name: builder
description: "Sees an issue to resolve. Writes code. Runs tests."
capabilities:
  reads: [intention, plan, issues, source, tests, contributing, materials]
  writes: [source, tests, readme, plan]
  actions: [commit, create_pr, update_plan, witness]
  tools: [read_file, write_file, list_files, run_command]
system_message: |
  You are a builder. Your job is to transform the repository by writing
  code that resolves the given issue. Only modify files under writable paths.
  Read the plan (PLAN.md) first to understand context and avoid threats.
context_sources:
  - intention
  - plan
  - issue_detail
  - source_files
  - test_files
  - contributing
  - feature_materials
writable_paths:
  - product.sourcePath
  - product.testsPath
  - record.readmeFilepath
  - plan
post_actions:
  - update_plan
  - witness
  - commit_changes
  - create_pr
  - label_automerge
```

### New modules

- **perspective-loader.js** (~100 lines) — Reads YAML perspective file. Merges with perspective overlay markdown.
- **prompt-builder.js** (~80 lines) — Takes perspective + context + config. Produces prompt.
- **post-processor.js** (~150 lines, extracted) — Post-transformation actions.

### Perspective definitions (one per current task)

| Perspective | Replaces | Key difference from current |
|---|---|---|
| `builder.yml` | resolve-issue.js | Reads plan first, updates plan after |
| `fixer.yml` | fix-code.js | Records observation if fix fails |
| `navigator.yml` | evolve.js | ONLY plans — refines plan, creates issues. Does not write product code. |
| `harvester-features.yml` | maintain-features.js | Updates plan with new open conditions |
| `harvester-library.yml` | maintain-library.js | Records material freshness in plan |
| `critic.yml` | enhance-issue.js | Reads plan, identifies threats |
| `witness.yml` | review-issue.js | Updates plan achieved/observations |
| `narrator.yml` | discussions.js | Reads plan to inform responses |

### Generic transform runner

```javascript
export async function runTransformation(perspectiveName, target, config, octokit) {
  const perspective = await loadPerspective(perspectiveName, config);
  const context = await gatherContext(perspective.context_sources, config, octokit, target);
  const { systemMessage, prompt } = buildPrompt(perspective, context, config);

  // Inner loop: multiple Copilot calls within one transformation
  let budget = perspective.max_calls || 3;
  while (budget > 0) {
    const result = await runCopilotTask({ systemMessage, prompt, writablePaths });
    budget--;
    if (result.complete || budget === 0) break;
    // Re-read context for next call — state has changed
    context = await gatherContext(perspective.context_sources, config, octokit, target);
  }

  await runPostActions(perspective.post_actions, result, config, octokit);
  return result;
}
```

### Migration

1. Create all 8 perspective YAML files
2. Create perspective-loader, prompt-builder, post-processor
3. Create generic transform runner
4. Verify with golden prompt tests
5. Update index.js to route through generic runner
6. Delete the 8 legacy task handler files

**Scope:** Large. ~530 lines new + 8 YAML files. Most is extraction from existing 853 lines.

---

## Phase 4: Inner Loop (Multiple Copilot Calls Per Run)

**What:** Allow a single workflow run to make multiple Copilot SDK calls, each building on the last.

Within one workflow run, on one branch:

```
Call 1: Read plan, refine it, decide what to build
Call 2: Write code for feature A
Call 3: Run tests, fix failures
Call 4: Write code for feature B (if budget remains)
Call 5: Witness — assess realization
```

After each call, the branch has new commits. The next call sees the updated files.

The workflow run orchestrates the inner loop by reading the plan:

```javascript
const plan = await getPlan(config);
const actionableItems = getActionableFromPlan(plan);

for (const item of actionableItems) {
  if (budgetExhausted()) break;
  const perspective = selectPerspective(item);
  await runTransformation(perspective, item.target, config, octokit);
  // Re-read plan — it's been updated by the transformation
  plan = await getPlan(config);
  if (plan.witnessScore > 80) break; // stewardship threshold
}
```

### What this enables

- A single workflow run can create a feature spec, create an issue, write code, fix tests, and update docs
- Fewer workflow runs needed (less cron overhead, less startup cost)
- The plan guides the inner loop: "what's next?" is answered by reading the plan

### What constrains the inner loop

- **Budget**: maximum N Copilot calls per run (configurable, default 5)
- **Time**: GitHub Actions 6-hour timeout per job
- **Tokens**: cost tracking per cycle
- **Reliability**: if a call fails, land what you have

**Scope:** Medium. ~50 lines loop logic, workflow budget parameter.

---

## Phase 5: Capability Files and Cross-Perspective Modification

**What:** Perspectives are documented as capability files. Agents can modify each other's capabilities.

The social protocol in safety.js:

```javascript
export function canModifyPerspective(currentPerspective, targetFile) {
  const targetName = path.basename(targetFile, '.yml');
  return targetName !== currentPerspective; // can't modify self
}
```

This enables:
- The critic can add constraints to the builder's perspective
- The navigator can create a new perspective (e.g., `deployer.yml`)
- The narrator can update how the witness reports realization
- The harvester can refine what materials the builder reads

INTENTION.md remains read-only (hardcoded). The plan and record are writable by all.

**Scope:** Small. Safety check (~20 lines), make perspectives/ writable in config.

---

## Phase 6: Workflow Simplification

### New workflows

```
transform-build.yml       — Cron daily. Reads plan, executes inner loop.
transform-repair.yml      — Event: check_suite failure. Fixer perspective.
transform-narrate.yml     — Event: discussion activity. Narrator perspective.
ci-automerge.yml          — UNCHANGED
ci-test.yml               — UNCHANGED
```

From 5 agentic workflows → 3. The main workflow absorbs daily/weekly/review because the plan tells it what to do.

### What stays identical

- `copilot.js` — No changes.
- `tools.js` — No changes.
- `safety.js` — Extended with perspective self-modification check.
- All CI/CD workflows — unchanged.
- All publish workflows — unchanged.

---

## Integration with FEATURES.md and FEATURES_ROADMAP.md

Both documents must be rewritten as part of the narrative alignment (see PLAN_NARRATIVE.md):

- **FEATURES.md**: new title, new vocabulary, all 29 features renamed, architecture section reframed
- **FEATURES_ROADMAP.md**: same vocabulary treatment, all 12 post-MVP features renamed
- The planning artifact (PLAN.md) becomes part of the template system (Feature #14)
- The witness scoring becomes part of witness machinery (Feature #12)
- The MVP demo (#28) uses the devkit scenario
- The devkit CLI includes `--add "description"` which creates a GitHub issue from the command line, enabling users to request features that the machinery delivers via `npm update`

---

## Migration Sequence

| Step | What | Validates |
|---|---|---|
| 1 | Extract context-sources.js from 8 task handlers | Golden prompt tests |
| 2 | Introduce PLAN.md template + plan-utils.js | Unit tests on plan read/write |
| 3 | Add plan read/update/witness to each task handler | Plan updates correctly |
| 4 | Create 8 perspective YAML definitions | Golden prompt tests |
| 5 | Create perspective-loader, prompt-builder, post-processor | Unit tests |
| 6 | Create generic transform runner with inner loop | Integration tests |
| 7 | Rename files (MISSION→INTENTION, agents→perspectives, agent-flow→transform) | All tests pass |
| 8 | Update config schema (new key names) | Config-loader tests |
| 9 | Rewrite FEATURES.md with new vocabulary | Human review |
| 10 | Rewrite FEATURES_ROADMAP.md with new vocabulary | Human review |
| 11 | Enable cross-perspective modification | Safety tests |
| 12 | Simplify to 3 workflows with plan-driven inner loop | Manual test |
| 13 | Delete legacy task handler files | Tests pass without them |

---

## Estimated Totals

| Category | Lines | Files |
|---|---|---|
| New code (context-sources, plan-utils, perspective-loader, prompt-builder, post-processor, transform runner) | ~880 | 6 |
| New definitions (perspective YAMLs) | ~320 | 8 |
| Plan template (PLAN.md) | ~30 | 1 |
| Deleted code (legacy task handlers) | -853 | 8 |
| Config changes | ~60 | 2 |
| Test updates | ~200 | 10+ |
| **Net change** | **~+437** | |

---

## Risk Register

| Risk | Severity | Mitigation |
|---|---|---|
| Plan file parsing fragile | Medium | Simple markdown format, schema validation, fallback to fresh plan |
| Inner loop consumes too many tokens | Medium | Configurable budget, cost tracking, perspective sees remaining budget |
| Cross-perspective modification creates conflicts | Medium | Social protocol (not self), plan tracks threats, PR review |
| Perspectives produce different prompts than legacy tasks | High | Golden prompt tests are the gate |
| Plan grows unbounded | Low | Archive achieved items to intentïon.md periodically |
| Rename coordination across 3 repos | Medium | Script the renames, one session, branches not main |
