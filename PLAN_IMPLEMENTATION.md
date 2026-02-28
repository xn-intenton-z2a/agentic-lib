# PLAN: Implementing the Conceptual Model

Transform the current 8-task cron-driven pipeline into the Navigate → Transform → Witness → Steward lifecycle described in CONCEPT.md. No backward compatibility constraints. Three repositories, full control. No "evolve" language anywhere.

---

## Current System (What We're Transforming From)

### Core Action (`src/actions/agentic-step/`)

| File               | Lines | What it does                                                             |
| ------------------ | ----- | ------------------------------------------------------------------------ |
| `index.js`         | 117   | Entry point. Hardcoded TASKS map of 8 handlers.                          |
| `config-loader.js` | 103   | Reads `agentic-lib.yml`, fixed path categories.                          |
| `copilot.js`       | 105   | Copilot SDK wrapper. Reusable as-is.                                     |
| `tools.js`         | 133   | 4 tools: read_file, write_file, list_files, run_command. Reusable as-is. |
| `safety.js`        | 106   | WIP limits, attempt limits, path checks. Reusable as-is.                 |
| `logging.js`       | 87    | Appends to intentïon.md. Update format only.                             |

### 8 Task Handlers (`src/actions/agentic-step/tasks/`)

| File                   | Lines   | Concept perspective                          |
| ---------------------- | ------- | -------------------------------------------- |
| `resolve-issue.js`     | 93      | Builder                                      |
| `fix-code.js`          | 70      | Fixer (Builder variant)                      |
| `evolve.js`            | 209     | Navigator + Builder (conflated — must split) |
| `maintain-features.js` | 71      | Harvester                                    |
| `maintain-library.js`  | 65      | Harvester                                    |
| `enhance-issue.js`     | 96      | Critic                                       |
| `review-issue.js`      | 112     | Witness                                      |
| `discussions.js`       | 137     | Narrator                                     |
| **Total**              | **853** |                                              |

### 5 Workflow Files (repository0)

| Workflow                    | Trigger             | Perspective invoked           |
| --------------------------- | ------------------- | ----------------------------- |
| `agent-flow-evolve.yml`     | Cron daily          | navigator+builder (conflated) |
| `agent-flow-maintain.yml`   | Cron weekly         | harvester                     |
| `agent-flow-review.yml`     | Cron 3-day          | witness                       |
| `agent-flow-fix-code.yml`   | check_suite failure | fixer                         |
| `agent-discussions-bot.yml` | discussion event    | narrator                      |

---

## Target System (What We're Transforming To)

### The Lifecycle

```
INTENTION.md (expressed once by human)
        │
        ▼
   ┌─────────┐
   │NAVIGATE │ Observe state, assess gap, plan transformations,
   │         │ assemble perspectives. Output: a plan.
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │TRANSFORM│ For each planned step: load perspective,
   │         │ gather context, build prompt, run Copilot SDK,
   │         │ post-process. Parallel where independent.
   └────┬────┘
        │
        ▼
   ┌─────────┐
   │ WITNESS │ Assess realization. Score 0-100%.
   │         │ Record assessment. Decide: loop or steward.
   └────┬────┘
        │
   ┌────┴────┐
   │         │
   No       Yes
   │         │
   ▼         ▼
NAVIGATE  STEWARDSHIP
(loop)    (relaxed, responsive, protective)
```

### New File Structure

```
src/actions/agentic-step/
  index.js              — Entry point. Routes to lifecycle phases.
  config-loader.js      — Reads agentic-lib.yml (new schema).
  copilot.js            — Copilot SDK wrapper. UNCHANGED.
  tools.js              — 4 agent tools. UNCHANGED.
  safety.js             — Boundaries. UNCHANGED.
  logging.js            — Record keeping. Updated format.
  context-sources.js    — NEW. Registry of named context gatherers.
  perspective-loader.js — NEW. Loads perspective YAML + prompt overlay.
  prompt-builder.js     — NEW. Assembles prompt from perspective + context.
  post-processor.js     — NEW. Executes post-transformation actions.
  phases/
    navigate.js         — NEW. The navigation phase.
    transform.js        — NEW. The transformation phase (generic).
    witness.js          — NEW. The witness phase.
  tasks/
    (legacy — kept during migration, then deleted)
```

### New Workflow Topology (repository0)

```
transform-navigate.yml     — Cron/event → Navigate → dispatch transforms → Witness
transform-operate.yml      — Dispatched by navigator. Runs one perspective.
transform-repair.yml       — check_suite failure → Fixer perspective.
transform-narrate.yml      — Discussion event → Narrator perspective.
ci-automerge.yml           — UNCHANGED
ci-test.yml                — UNCHANGED
```

From 5 agentic workflows → 4. The maintain and review workflows are absorbed into navigation.

---

## Phase 1: Context Sources Extraction

**What:** Extract the context-gathering logic duplicated across 8 task handlers into a shared module.

**Why first:** Pure refactoring with zero behavior change. Golden prompt tests verify nothing changes. Creates the foundation for everything else.

### context-sources.js (~200 lines, extracted)

```javascript
export async function getIntention(config) {
  /* read INTENTION.md */
}
export async function getOpenIssues(octokit, repo, label, limit) {
  /* list open issues */
}
export async function getClosedIssues(octokit, repo, label, since) {
  /* recent closed */
}
export async function getSourceFiles(config) {
  /* scan product source */
}
export async function getTestFiles(config) {
  /* scan product tests */
}
export async function getFeatureMaterials(config) {
  /* scan materials/features/ */
}
export async function getLibraryMaterials(config) {
  /* scan materials/library/ */
}
export async function getIssueDetail(octokit, repo, issueNumber) {
  /* issue + comments */
}
export async function getPRDetail(octokit, repo, prNumber) {
  /* PR + check runs */
}
export async function getDiscussion(octokit, repo, discussionNumber) {
  /* GraphQL */
}
export async function getContributing(config) {
  /* read CONTRIBUTING.md */
}
export async function getActivityRecord(config, limit) {
  /* recent intentïon.md */
}
export async function getMaterialSources(config) {
  /* read SOURCES.md */
}
```

**Migration:** Update each task handler to import from context-sources.js instead of inline gathering. Run golden prompt tests after each. No behavior change.

**Scope:** Medium. ~200 lines extracted, 8 files updated, 0 behavior change.

---

## Phase 2: Perspective Definitions

**What:** Define perspectives as data (YAML) instead of code (JS). Create a generic perspective runner.

### Perspective definition format

```yaml
# perspectives/builder.yml
name: builder
description: "Sees an issue to resolve. Writes code. Runs tests."
system_message: |
  You are a builder. Your job is to transform the repository by writing
  code that resolves the given issue. Only modify files under writable paths.
context_sources:
  - intention
  - issue_detail
  - source_files
  - test_files
  - contributing
  - feature_materials
writable_paths:
  - product.sourcePath
  - product.testsPath
  - record.readmeFilepath
post_actions:
  - commit_changes
  - create_pr
  - label_automerge
```

### New modules

- **perspective-loader.js** (~100 lines) — Reads YAML perspective file. Merges with perspective overlay markdown from repo's `perspectives/` directory.
- **prompt-builder.js** (~80 lines) — Takes perspective + context + config. Produces system message and user prompt.
- **post-processor.js** (~150 lines, extracted) — Post-transformation actions: commit, create PR, update issue, create issue, update materials, record activity.

### Perspective definitions (one per current task)

| Perspective              | Replaces                      | Context sources                                                                      | Post-actions                     |
| ------------------------ | ----------------------------- | ------------------------------------------------------------------------------------ | -------------------------------- |
| `builder.yml`            | resolve-issue.js              | intention, issue_detail, source_files, test_files, contributing                      | commit, create_pr                |
| `fixer.yml`              | fix-code.js                   | pr_detail, source_files, test_files                                                  | commit (to PR branch)            |
| `navigator.yml`          | evolve.js (the planning half) | intention, open_issues, source_files, test_files, feature_materials, activity_record | create_issue, update_materials   |
| `harvester-features.yml` | maintain-features.js          | intention, feature_materials, library_materials, source_files                        | update_materials                 |
| `harvester-library.yml`  | maintain-library.js           | material_sources, library_materials                                                  | update_materials                 |
| `critic.yml`             | enhance-issue.js              | intention, issue_detail, feature_materials, contributing                             | update_issue                     |
| `witness.yml`            | review-issue.js               | intention, issue_detail, source_files, test_files                                    | update_issue (close if resolved) |
| `narrator.yml`           | discussions.js                | intention, discussion, feature_materials, activity_record                            | update_materials, create_issue   |

### Generic transform runner

```javascript
// phases/transform.js
export async function runTransformation(perspectiveName, target, config, octokit) {
  const perspective = await loadPerspective(perspectiveName, config);
  const context = await gatherContext(perspective.context_sources, config, octokit, target);
  const { systemMessage, prompt } = buildPrompt(perspective, context, config);
  const result = await runCopilotTask({ systemMessage, prompt, writablePaths: perspective.writable_paths });
  await runPostActions(perspective.post_actions, result, config, octokit);
  return result;
}
```

### Migration

1. Create all 8 perspective YAML files
2. Create perspective-loader, prompt-builder, post-processor
3. Create generic transform runner
4. Verify with golden prompt tests: `runTransformation('builder', issue42)` produces identical prompt to `resolveIssue(issue42)`
5. Once all 8 match, update index.js to route through the generic runner
6. Delete the 8 task handler files

**Scope:** Large. ~530 lines new code + 8 YAML files. Most is extraction from existing 853 lines.

---

## Phase 3: Navigation Engine

**What:** The navigator observes state, assesses the gap to realization, and produces a plan of transformations to execute. This replaces the current `evolve.js` which conflates planning with doing.

### phases/navigate.js (~150 lines)

```javascript
export async function navigate(config, octokit) {
  // 1. Gather full state
  const intention = await getIntention(config);
  const openIssues = await getOpenIssues(octokit, repo, null, 20);
  const sourceFiles = await getSourceFiles(config);
  const testFiles = await getTestFiles(config);
  const featureMaterials = await getFeatureMaterials(config);
  const recentRecord = await getActivityRecord(config, 10);
  const recentWitness = await getRecentWitnessScores(config);

  // 2. Determine mode
  const mode = recentWitness.every(s => s > 80) ? 'stewardship' : 'navigation';

  // 3. Ask Copilot SDK to plan
  const plan = await runCopilotTask({
    systemMessage: mode === 'stewardship' ? STEWARD_SYSTEM : NAVIGATE_SYSTEM,
    prompt: buildNavigationPrompt(intention, openIssues, sourceFiles, ...),
    writablePaths: [] // Navigator doesn't write — it plans
  });

  // 4. Parse structured plan
  return parseNavigationPlan(plan);
}
```

The navigation plan output:

```json
{
  "gap": "No test coverage for edge cases. Two features unimplemented.",
  "realizationEstimate": 45,
  "transformations": [
    { "perspective": "builder", "target": "issue #42", "reason": "Core feature missing" },
    { "perspective": "builder", "target": "issue #43", "reason": "Independent, can parallel" },
    { "perspective": "harvester-features", "target": null, "reason": "Feature materials stale" }
  ],
  "parallel": [[0, 1], [2]]
}
```

### transform-navigate.yml (the orchestrator workflow)

```yaml
name: Navigate
on:
  schedule:
    - cron: "23 7 * * *"
  workflow_dispatch:

jobs:
  navigate:
    runs-on: ubuntu-latest
    steps:
      - uses: xn-intenton-z2a/agentic-lib/actions/agentic-step@main
        with:
          phase: navigate

  transform:
    needs: navigate
    strategy:
      matrix:
        transformation: ${{ fromJSON(needs.navigate.outputs.plan).transformations }}
      max-parallel: 2
    runs-on: ubuntu-latest
    steps:
      - uses: xn-intenton-z2a/agentic-lib/actions/agentic-step@main
        with:
          phase: transform
          perspective: ${{ matrix.transformation.perspective }}
          target: ${{ matrix.transformation.target }}

  witness:
    needs: transform
    runs-on: ubuntu-latest
    steps:
      - uses: xn-intenton-z2a/agentic-lib/actions/agentic-step@main
        with:
          phase: witness
```

One workflow does the entire lifecycle loop. Matrix strategy gives parallelism for free.

**Scope:** Medium. ~150 lines navigate.js + workflow file + response parsing.

---

## Phase 4: Witness & Realization

**What:** After transformations, assess whether the intentïon is realized.

### phases/witness.js (~100 lines)

```javascript
export async function witness(config, octokit) {
  const intention = await getIntention(config);
  const sourceFiles = await getSourceFiles(config);
  const testFiles = await getTestFiles(config);
  const testResults = await runTests(config);
  const openIssues = await getOpenIssues(octokit, repo);

  const assessment = await runCopilotTask({
    systemMessage: WITNESS_SYSTEM,
    prompt: buildWitnessPrompt(intention, sourceFiles, testFiles, testResults, openIssues),
    writablePaths: [], // Witness observes, doesn't act
  });

  const score = parseRealizationScore(assessment);

  await appendToRecord(config, {
    phase: "witness",
    realizationScore: score.value,
    assessment: score.reason,
    testsPass: testResults.success,
    openIssueCount: openIssues.length,
  });

  return score;
}
```

### Realization model

Two axes:

1. **Objective gates** (must all pass): Tests pass, no build errors, no open `bug` issues
2. **Subjective assessment** (LLM-scored 0-100): Does the product match the stated intentïon?

Final score: `0` if any objective gate fails, otherwise the subjective score.

### Stewardship mode

When witness reports `score > 80` for 3 consecutive assessments:

- Navigator receives stewardship system prompt: "The intentïon is substantially realized. Monitor for drift, respond to discussions, maintain quality. Only propose transformations that protect or refine the realization."
- Navigation frequency decreases (navigator returns empty or minimal plans)
- System still responds to events (discussion comments, failing tests)

Mode is determined by reading recent witness scores from intentïon.md. The record IS the state.

**Scope:** Small. ~100 lines witness.js + prompt modifications in navigate.js.

---

## Phase 5: Materials & Machinery Fluidity

**What:** The system can create new kinds of materials and new perspectives. The factory extends itself.

### Materials registry

The `agentic-lib.yml` `materials:` section (see PLAN_NARRATIVE.md) is read by config-loader. The navigator can recommend new material types:

```json
{
  "transformations": [
    {
      "action": "create_material_type",
      "definition": {
        "name": "design-decisions",
        "path": ".github/agentic-lib/materials/design-decisions/",
        "permissions": ["write"],
        "limit": 10
      }
    }
  ]
}
```

### Machinery creating machinery

The navigator can create new perspectives:

```json
{
  "transformations": [
    {
      "action": "create_perspective",
      "definition": {
        "name": "deployer",
        "system_message": "You deploy the product...",
        "context_sources": ["intention", "source_files"],
        "writable_paths": ["machinery.workflowsPath"],
        "post_actions": ["commit_changes", "create_pr"]
      }
    }
  ]
}
```

### Safety boundaries

| Action                                           | Allowed?        | Mechanism                                   |
| ------------------------------------------------ | --------------- | ------------------------------------------- |
| Create new perspective YAML                      | Yes             | Written to perspectives/ directory          |
| Create new material type                         | Yes             | Validated against schema, written to config |
| Create new workflow YAML                         | Yes, through PR | Human review required                       |
| Modify index.js, copilot.js, tools.js, safety.js | NEVER           | Hardcoded in safety.js forbidden list       |
| Modify INTENTION.md                              | NEVER           | Hardcoded read-only                         |
| Push to main                                     | NEVER           | Branch protection                           |

**Key principle: machinery can create new machinery, but cannot modify its own control plane.**

**Scope:** Medium. Config-loader extension (~50 lines), materials module (~80 lines), perspective creation handler (~60 lines), safety updates (~20 lines).

---

## Phase 6: Full Loop Integration

### Updated index.js

```javascript
const PHASES = {
  navigate: navigate,
  transform: runTransformation,
  witness: witness,
};
```

The `phase` input replaces the `task` input.

### Updated agentic-step action.yml

```yaml
inputs:
  phase:
    description: "Lifecycle phase: navigate, transform, witness"
    required: false
  perspective:
    description: "Perspective to use (for transform phase)"
    required: false
  target:
    description: "Target for transformation (issue number, PR number, etc.)"
    required: false
```

### What stays identical

- `copilot.js` — No changes.
- `tools.js` — No changes.
- `safety.js` — Extended with forbidden list, not rewritten.
- All CI/CD workflows — unchanged.
- All publish workflows — unchanged.
- intentïon.md as the record — format updated, concept unchanged.

---

## Planning: How Navigation Works

This is the most important part of the new system. The navigator must be good at planning — it's what separates intentïon from a fixed pipeline.

### What the navigator sees

On each cycle, the navigator reads:

1. **The intentïon** — INTENTION.md. What does the user want to exist?
2. **The product** — source files, test files, package.json. What exists now?
3. **The materials** — feature specifications, library docs. What's been prepared?
4. **The record** — recent intentïon.md entries, recent witness scores. What happened recently?
5. **The terrain** — open issues, open PRs, recent commits. What's in flight?

### What the navigator decides

From this state, the navigator answers:

1. **Gap assessment** — What's the distance between the intentïon and the current product? (qualitative + quantitative)
2. **Next transformations** — What specific transformations will close the gap most effectively? (ordered list with perspectives and targets)
3. **Parallelism** — Which transformations are independent and can run concurrently?
4. **Mode** — Are we still navigating or have we reached stewardship?

### How the navigator plans well

The navigator's system prompt should include:

- **The manufacturing model** — "The repository contains product (src/), machinery (workflows, perspectives), record (docs, intentïon.md), and materials (feature specs, library docs). Your job is to plan transformations that move the product toward realizing the intentïon."
- **Perspective catalog** — "Available perspectives: builder (writes code for an issue), fixer (repairs failing tests), harvester-features (creates/updates feature materials), harvester-library (gathers library materials), critic (reviews issues for quality), witness (assesses realization), narrator (responds to discussions)."
- **Constraints** — "Maximum 3 transformations per cycle. Prefer fewer, larger transformations over many small ones. Each transformation must be independently landable."
- **Mode awareness** — "If recent witness scores are consistently high (>80%), shift to stewardship mode: protect what's built, respond to drift, minimize risk."

### What makes this better than the current system

| Current (fixed pipeline)                                         | New (navigator-driven)                                                  |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Cron runs the same tasks on a fixed schedule regardless of state | Navigator assesses state and only plans transformations that are needed |
| All intentions get the same treatment                            | Navigator adapts the plan to the specific intentïon                     |
| No concept of "done" — keeps running forever                     | Witness detects realization, navigator shifts to stewardship            |
| Sequential: one task per cron trigger                            | Parallel: independent transformations run concurrently via matrix       |
| 8 fixed perspectives, always the same                            | Navigator assembles only the perspectives needed for this cycle         |
| No gap assessment — just "do the next thing"                     | Navigator explicitly assesses the gap and prioritizes                   |

### The planning loop in detail

```
Cycle 1 (day 1):
  Navigate: "Intentïon is a developer utility CLI. Product is empty.
             Gap is 100%. Need feature materials first."
  Plan: [harvester-features] → creates 4 feature specs
  Witness: "Score 5%. Feature materials exist but no product code."

Cycle 2 (day 1, triggered by cycle 1 completion):
  Navigate: "4 feature materials exist. No issues. Create issues."
  Plan: [navigator creates 2 issues from feature materials]
  Witness: "Score 5%. Issues exist, still no product code."

Cycle 3 (day 2):
  Navigate: "2 open issues. Product is empty. Build."
  Plan: [builder(issue #1), builder(issue #2)] — parallel
  Witness: "Score 20%. Two features implemented. Tests pass."

Cycle 4 (day 2):
  Navigate: "2 features done, 2 remaining. Build more."
  Plan: [harvester-features, builder(issue #3)] — parallel
  Witness: "Score 35%."

...

Cycle 12 (day 7):
  Navigate: "All major features built. Edge cases remain."
  Plan: [critic(issue #8), builder(issue #9)]
  Witness: "Score 82%."

Cycle 13 (day 8):
  Navigate: "Score >80% for 3 cycles. Entering stewardship."
  Plan: [] — no transformations needed
  Witness: "Score 85%. Stewardship mode."

Cycle 14+ (weekly):
  Navigate (stewardship): "Intentïon is realized. Monitoring."
  Plan: [] or [fixer] if tests broke
```

---

## Migration Sequence

Each step is independently deployable and testable.

| Step | What                                                                        | Validates                                                   |
| ---- | --------------------------------------------------------------------------- | ----------------------------------------------------------- |
| 1    | Extract context-sources.js from 8 task handlers                             | Golden prompt tests — prompts identical                     |
| 2    | Create 8 perspective YAML definitions                                       | Golden prompt tests — definitions produce identical prompts |
| 3    | Create perspective-loader, prompt-builder, post-processor                   | Unit tests on new modules                                   |
| 4    | Create generic transform runner                                             | Integration test: perspectives match legacy tasks           |
| 5    | Create navigate.js and witness.js                                           | Unit tests + manual trigger                                 |
| 6    | Create transform-navigate.yml workflow                                      | Manual workflow_dispatch test                               |
| 7    | Rename files (MISSION→INTENTION, agents→perspectives, agent-flow→transform) | All tests pass                                              |
| 8    | Update config schema (new key names)                                        | Config-loader tests                                         |
| 9    | Rewrite FEATURES.md with new vocabulary                                     | Human review                                                |
| 10   | Rewrite FEATURES_ROADMAP.md with new vocabulary                             | Human review                                                |
| 11   | Run new navigate workflow alongside old workflows                           | Compare outcomes                                            |
| 12   | Disable old workflows                                                       | Monitor                                                     |
| 13   | Delete legacy task handler files                                            | Tests pass without them                                     |
| 14   | Enable materials fluidity                                                   | Navigator creates material types                            |
| 15   | Enable machinery creation                                                   | Navigator creates perspectives                              |

---

## Estimated Totals

| Category                            | Lines     | Files |
| ----------------------------------- | --------- | ----- |
| New code                            | ~840      | 7     |
| New definitions (perspective YAMLs) | ~320      | 8     |
| New workflows                       | ~120      | 1     |
| Renamed workflows                   | ~0        | 4     |
| Deleted code (legacy task handlers) | -853      | 8     |
| Config changes                      | ~60       | 2     |
| Test updates                        | ~200      | 10+   |
| **Net change**                      | **~+387** |       |

---

## Risk Register

| Risk                                                     | Severity | Mitigation                                                                                |
| -------------------------------------------------------- | -------- | ----------------------------------------------------------------------------------------- |
| Navigation adds token cost per cycle                     | Medium   | Navigator uses constrained output; cost offset by not running unnecessary transformations |
| Structured output parsing fragile                        | Medium   | Schema validation + retry + fallback to single transformation                             |
| Perspectives produce different prompts than legacy tasks | High     | Golden prompt tests are the gate                                                          |
| Self-modification escapes bounds                         | High     | Forbidden file list in safety.js. INTENTION.md and control plane never writable.          |
| Premature stewardship                                    | Medium   | Require 3 consecutive high scores. Human can re-trigger navigation manually.              |
| Rename coordination across 3 repos                       | Medium   | Script the renames. All 3 repos in one session. Branches, not main.                       |
