# PLAN: Implementing the Conceptual Model

Assessment of what code and implementation changes are needed to make the conceptual model (CONCEPT.md) work within the current system. This is a research document -- no code changes.

**Relationship to CONCEPT.md:** This plan translates the Navigate/Transform/Witness/Steward lifecycle, dynamic perspectives, materials fluidity, and machinery-creating-machinery into concrete code changes against the current agentic-step implementation.

**Relationship to PLAN_FOCUS_REBOOT.md:** That plan addresses MVP stabilisation (test suite, API surface, thin adaptors, template styles, website integration). This plan addresses what comes after: the architectural shift from a fixed-task pipeline to the intentional lifecycle described in CONCEPT.md. Some REBOOT work (especially Goal 3: thin adaptors, Goal 4: API surface) creates enabling conditions for this plan.

---

## Current System Inventory

Before assessing changes, here is exactly what exists:

### Core Action (`src/actions/agentic-step/`)

| File | Lines | Responsibility |
|------|-------|----------------|
| `index.js` | 117 | Entry point. Parses inputs, selects handler from hardcoded TASKS map, runs it, logs to intenti\u00f6n.md |
| `config-loader.js` | 103 | Reads `agentic-lib.yml`, resolves paths into writable/readOnly sets, returns config struct |
| `copilot.js` | 105 | Shared SDK lifecycle: `runCopilotTask()`, `readOptionalFile()`, `scanDirectory()`, `formatPathsSection()` |
| `tools.js` | 133 | 4 tools via `defineTool()`: `read_file`, `write_file`, `list_files`, `run_command` |
| `safety.js` | 106 | WIP limits, attempt limits, path writability, issue-resolved checks |
| `logging.js` | 87 | Appends structured entries to intenti\u00f6n.md, safety check logging |

### Task Handlers (`src/actions/agentic-step/tasks/`)

| File | Lines | What it does | Perspective (in concept terms) |
|------|-------|-------------|-------------------------------|
| `resolve-issue.js` | 93 | Issue -> code -> PR | Builder |
| `fix-code.js` | 70 | Fix failing tests on a PR | Builder |
| `evolve.js` | 209 | Mission -> analyze -> implement next step (+ TDD mode) | Navigator + Builder (merged) |
| `maintain-features.js` | 71 | Create/update/prune feature files | Narrator / Steward |
| `maintain-library.js` | 65 | Crawl sources, update library docs | Harvester |
| `enhance-issue.js` | 96 | Add acceptance criteria to issues | Narrator |
| `review-issue.js` | 112 | Check if issues are resolved, close them | Witness |
| `discussions.js` | 137 | Respond to GitHub Discussions with actions | Steward (human interface) |

### Workflows (repository0 `.github/workflows/`)

| Workflow | Trigger | Task(s) invoked |
|----------|---------|-----------------|
| `agent-flow-evolve.yml` | Cron daily 07:23 | `evolve` |
| `agent-flow-maintain.yml` | Cron weekly Monday | `maintain-features` |
| `agent-flow-review.yml` | Cron every 3 days | `review-issue` |
| `agent-flow-fix-code.yml` | `check_suite` completed (failure) | `fix-code` |
| `agent-discussions-bot.yml` | Discussion events + cron 28-day | `discussions` |

### Agent Prompts (repository0 `.github/agentic-lib/agents/`)

10 markdown files providing task-specific instructions. Each is loaded via the `instructions` input and prepended to the Copilot SDK prompt.

### Config (`agentic-lib.yml`)

Fixed path categories: `missionFilepath`, `librarySourcesFilepath`, `libraryDocumentsPath`, `featuresPath`, `targetTestsPath`, `targetSourcePath`, `dependenciesFilepath`, `documentationPath`, etc. Each with path, permissions, and optional limit.

### Tests

307 tests across 22 files. Key constraint: `index.test.js` asserts exactly 8 task entries. All task handler tests mock the Copilot SDK and verify prompt construction and branching logic.

---

## Phase 1: Navigation Engine

### What the concept requires

The Navigate step observes repository state, assesses the gap between current state and realization of the intenti\u00f6n, plans transformations, and assembles the perspectives needed. It replaces the current model where cron schedules blindly trigger fixed tasks.

### What currently exists

The `evolve` task is the closest analog. It reads the mission, scans features and source files, lists open issues, and asks the Copilot SDK to "determine the single most impactful next step." But it conflates navigation (what should happen) with transformation (doing it) in a single SDK session. The TDD mode already demonstrates a two-phase pattern within one task.

### What needs to change

**1.1 Create `navigate.js` -- a new task handler (or standalone module)**

A navigation step that produces a _plan_ but does not execute it. It:
- Reads `MISSION.md` (or `intenti\u00f6n.md` -- the declared intent)
- Reads current features, source files, test files, open issues, recent closed issues, recent commits
- Reads intenti\u00f6n.md (the activity log) for recent outcomes
- Asks the Copilot SDK: "What is the gap between current state and realization? What transformations are needed? What perspectives should be assembled?"
- Outputs a structured navigation plan (JSON or YAML) with:
  - `gap_assessment`: What is missing or wrong
  - `transformations`: Ordered list of transformations to attempt
  - `perspectives`: Which perspectives are needed for each transformation
  - `realization_estimate`: How close we are (0-100%)

**Reusable existing code:**
- `copilot.js` -- `runCopilotTask()`, `readOptionalFile()`, `scanDirectory()` can all be reused directly
- `config-loader.js` -- path resolution works as-is
- `safety.js` -- WIP/attempt checks apply to navigation too

**New code needed:**
- `src/actions/agentic-step/tasks/navigate.js` (~100-150 lines)
- A response parser that extracts structured plan from Copilot SDK output
- Output format definition (schema for navigation plan)

**1.2 New workflow: `agent-navigate.yml`**

Replaces the current cron-triggered `agent-flow-evolve.yml`. The new workflow:
1. Runs Navigate to produce a plan
2. For each transformation in the plan, dispatches the appropriate task (via `workflow_dispatch` on the existing flow workflows, or via a new orchestrator step)
3. After transformations complete, runs Witness (see Phase 4)

This is the "outer loop" that replaces blind cron scheduling.

**1.3 How it wraps the current `evolve` task**

The current `evolve.js` does not need to be deleted. Instead:
- Navigate produces a plan that may include `{ task: "evolve", reason: "..." }` as one of its transformations
- The evolve task becomes one possible transformation among many
- Over time, as perspectives become dynamic (Phase 2), evolve's "analyze + implement" dual role splits into separate navigate + builder steps

**Minimal viable change:**
1. Add `navigate.js` that produces a JSON plan
2. Add `agent-navigate.yml` that runs navigate, then conditionally dispatches existing workflows based on the plan
3. Keep all existing tasks and workflows untouched -- navigate sits above them as an orchestrator

**Risks:**
- Navigation itself costs tokens. If it always recommends the same things, the overhead is wasted.
- The structured output parsing (getting JSON from an LLM) is fragile. Mitigate: use a constrained output schema and retry on parse failure.
- The dispatching mechanism (workflow_dispatch from within a workflow) has latency and concurrency constraints.

**Estimated scope:** Medium. ~200 lines of new code + 1 new workflow + tests.

---

## Phase 2: Dynamic Perspectives

### What the concept requires

Instead of 8 hardcoded task types, perspectives are composable units that can be assembled based on what the navigation step determines is needed. A perspective is defined by "how it sees, not what it does." The system should be able to introduce new perspectives without code changes.

### What currently exists

Each of the 8 task handlers is a JavaScript function that:
1. Gathers context (issue data, source files, features, etc.)
2. Constructs a prompt (system message + user prompt with context)
3. Calls `runCopilotTask()`
4. Parses the response
5. Takes post-processing actions (update issues, create comments, etc.)

The variation between tasks is in: what context they gather, what system message they use, and what post-processing they do. The prompt itself is a concatenation of sections (instructions, context, paths, constraints).

### What needs to change

**2.1 Define perspectives as data, not code**

A perspective definition file (YAML or markdown with YAML front matter) could replace much of the hardcoded logic. For example:

```yaml
# perspectives/builder.yml
name: builder
system_message: |
  You are an autonomous coding agent. Write clean, tested code.
  Only modify files listed under "Writable" paths.
context_sources:
  - mission
  - open_issues
  - source_files
  - test_files
  - contributing
post_actions:
  - commit_changes
  - create_pr
output_format: code_changes
requires_writable: true
```

The current task handlers would be refactored into:
- A **perspective loader** that reads perspective definitions
- A **context assembler** that gathers the context sources listed in the definition
- A **prompt builder** that constructs the prompt from the definition + assembled context
- A **post-processor** that executes the post-actions

**2.2 Context source registry**

The context-gathering logic that is currently scattered across task handlers (read mission, scan features, fetch issues, etc.) becomes a registry of named context sources:

| Context source | Current location | What it returns |
|---------------|-----------------|-----------------|
| `mission` | evolve.js, maintain-features.js, discussions.js | Content of MISSION.md |
| `open_issues` | evolve.js, review-issue.js | List of open issues |
| `closed_issues` | maintain-features.js | Recently closed issues |
| `source_files` | evolve.js, review-issue.js | Scanned source directory |
| `test_files` | review-issue.js | Scanned test directory |
| `features` | evolve.js, maintain-features.js, enhance-issue.js, discussions.js | Feature files |
| `library` | maintain-features.js, maintain-library.js | Library docs |
| `issue_detail` | resolve-issue.js, enhance-issue.js, review-issue.js | Single issue + comments |
| `pr_detail` | fix-code.js | PR + check runs |
| `discussion` | discussions.js | Discussion + comments via GraphQL |
| `contributing` | resolve-issue.js, enhance-issue.js | CONTRIBUTING.md |
| `activity_log` | discussions.js | Recent intenti\u00f6n.md entries |
| `sources` | maintain-library.js | SOURCES.md |

This is a straightforward extraction. Each becomes a function in a `context-sources.js` module:

```javascript
export async function getMission(config) { ... }
export async function getOpenIssues(octokit, repo, limit) { ... }
// etc.
```

**2.3 Assembly: what decides which perspectives are needed**

The navigation step (Phase 1) produces the assembly. It outputs a list like:

```json
{
  "transformations": [
    { "perspective": "builder", "target": "issue #42", "reason": "..." },
    { "perspective": "witness", "target": "issue #38", "reason": "..." }
  ]
}
```

The orchestrator then:
1. Loads the perspective definition for each listed perspective
2. Gathers the context sources it requires
3. Builds and sends the prompt
4. Runs the post-processor

**2.4 Existing agent prompts become perspective modifiers**

The 10 agent markdown files in repository0 currently serve as task-specific instructions. In the new model, they become _perspective overlays_ -- additional instructions that modify how a base perspective operates for this specific repository. The base perspective definition lives in agentic-lib; the overlay lives in the consumer repo.

**Reusable existing code:**
- `copilot.js` -- all utilities reuse directly
- `tools.js` -- the 4 tools are perspective-agnostic
- `safety.js` -- WIP/attempt checks apply to all perspectives
- `logging.js` -- activity logging is perspective-agnostic
- All 10 agent prompt files -- become perspective overlays

**New code needed:**
- `src/actions/agentic-step/context-sources.js` (~150-200 lines, extracted from existing tasks)
- `src/actions/agentic-step/perspective-loader.js` (~80-100 lines)
- `src/actions/agentic-step/prompt-builder.js` (~60-80 lines)
- `src/actions/agentic-step/post-processor.js` (~100-150 lines, extracted from existing tasks)
- Perspective definition files (~6-8 YAML files, one per current task type)

**Migration path:**
1. Extract context sources from existing task handlers into `context-sources.js` without changing behavior
2. Create perspective definitions that reproduce the exact behavior of each current task handler
3. Write a generic `run-perspective.js` that loads a definition and executes it
4. Verify that `run-perspective.js` with `builder.yml` produces identical prompts to `resolve-issue.js` (golden prompt tests!)
5. Once all 8 tasks are reproduced by perspective definitions, the hardcoded task map becomes a perspective registry

**Risks:**
- The post-processing logic (update issue body, add labels, create comments, close issues) varies significantly between tasks. This is the hardest part to generalize.
- Prompt construction is sensitive to ordering and formatting. The golden prompt tests are the safety net here.
- YAML perspective definitions are less flexible than code. Some tasks (like discussions.js with its action parsing) may need escape hatches.

**Estimated scope:** Large. ~500-700 lines of new/refactored code + 6-8 definition files + significant test updates. But much of it is extraction, not invention.

---

## Phase 3: Materials and Machinery Fluidity

### What the concept requires

**Materials fluidity:** The system should be able to create new kinds of materials beyond the current fixed categories (features in `features/`, library docs in `library/`, sources in `SOURCES.md`). The concept says materials are "concrete, countable, disposable" and "exist to make transformations cheaper and more reliable."

**Machinery creating machinery:** The system should be able to create new workflows, new tools, new perspective definitions -- the factory can extend itself. This is the most ambitious part of the concept.

### What currently exists

The current system has a rigid material taxonomy enforced by `agentic-lib.yml`:

| Material type | Path | Created by | Consumed by |
|--------------|------|------------|-------------|
| Features | `features/` or `.github/agentic-lib/features/` | `maintain-features` task | `evolve`, `enhance-issue`, `discussions` |
| Library docs | `library/` | `maintain-library` task | `maintain-features` |
| Sources | `SOURCES.md` | Manual / `maintain-sources` agent | `maintain-library` |
| Activity log | `intenti\u00f6n.md` | `logging.js` (every task) | `discussions`, human |
| Seed files | `.github/agentic-lib/seeds/` | Manual | `seeding` config |

The `write_file` tool already allows writing to any writable path. The constraint is that the _tasks_ only know about specific material types.

### What needs to change

**3.1 Materials registry**

Instead of hardcoded path categories, a materials registry that:
- Tracks what kinds of materials exist (files in designated directories)
- Allows new material types to be declared (a navigator could decide "we need a design-decisions/ directory")
- Provides metadata about each material type: what creates it, what consumes it, how stale is it

This could be as simple as extending `agentic-lib.yml` with a `materials:` section that is dynamic:

```yaml
materials:
  features:
    path: '.github/agentic-lib/features/'
    created_by: [maintain-features, discussions]
    consumed_by: [evolve, enhance-issue]
    limit: 4
    permissions: [write]
  library:
    path: 'library/'
    created_by: [maintain-library]
    consumed_by: [maintain-features]
    limit: 32
    permissions: [write]
  # New material types can be added here by the system
```

**Reusable existing code:**
- `config-loader.js` -- the `paths` section already works this way; extend it
- `tools.js` -- `write_file` already enforces writable paths; if a new material type is declared with write permission, it works automatically
- `scanDirectory()` in `copilot.js` -- already generic

**New code needed:**
- Extension to `config-loader.js` to handle a `materials:` section (~30-50 lines)
- A `materials.js` module that can list, count, and report staleness of materials (~60-80 lines)

**3.2 Machinery creating machinery (self-modification)**

This is the most delicate part. The concept says machinery should be able to create new machinery. In concrete terms, this means the agentic-step action could:

- Create a new perspective definition file (a YAML file in a designated directory)
- Create a new workflow file (a `.yml` file in `.github/workflows/`)
- Create or modify agent prompt files
- Modify `agentic-lib.yml` to add new material types or change parameters

**Safety boundaries (critical):**

| Capability | Safety level | Implementation |
|-----------|-------------|----------------|
| Create new perspective definitions | Medium risk | Allow writes to `.github/agentic-lib/perspectives/` |
| Modify agent prompts | Medium risk | Allow writes to `.github/agentic-lib/agents/` |
| Add material types to config | Medium risk | Config modification with schema validation |
| Create new workflows | High risk | Require navigator approval + human PR review |
| Modify existing workflows | Very high risk | Disallow in automation; human-only |
| Modify safety.js or tools.js | Forbidden | Never writable by the agent |
| Modify index.js or copilot.js | Forbidden | Never writable by the agent |

The key safety principle: **machinery can create new machinery, but not modify its own control plane.** The agent can create a new perspective file or a new workflow, but it cannot modify the code that loads and runs perspectives, and it cannot modify the safety checks.

Implementation approach:
1. Add perspective and workflow directories to the writable paths when a "machinery-maker" perspective is active
2. The navigator decides when machinery creation is needed (e.g., "the intenti\u00f6n requires a deployment pipeline, but no deploy perspective exists -- create one")
3. New machinery goes through the normal PR/review process before being activated
4. Schema validation on any generated YAML (perspective definitions, workflow files)

**3.3 How this relates to current features/, library/, seeds/**

The current structure maps to the concept:

| Current | Concept term |
|---------|-------------|
| `features/` | Materials (specifications used by builders) |
| `library/` | Materials (gathered knowledge) |
| `seeds/` | Machinery (initial state templates) |
| `agents/*.md` | Machinery (perspective instructions) |
| `workflows/*.yml` | Machinery (orchestration) |
| `src/lib/main.js` | Product (the thing being built) |
| `intenti\u00f6n.md` | Record (audit trail) |
| `README.md` | Record (documentation) |
| `tests/` | Record + Product (verification evidence + deliverable) |

No renaming is needed. The concept's taxonomy is a lens for understanding the existing structure, not a mandate to restructure.

**Risks:**
- Self-modification (machinery creating machinery) is inherently risky. The safety boundaries must be implemented BEFORE enabling this capability.
- Generated YAML could be malformed. Schema validation is essential.
- Runaway creation: the system could create dozens of new perspectives or material types. The materials registry needs limits.

**Estimated scope:** Medium for materials registry (extraction + extension). Large for machinery-creating-machinery (new capability with safety constraints).

---

## Phase 4: Witness and Stewardship

### What the concept requires

**Witness:** After each transformation, assess whether the intenti\u00f6n is realized. This is observation, not action. It answers: "Is the thing that was intended now manifest in the repository?"

**Stewardship:** When realization is achieved, the system shifts from building to maintaining. Behavior changes: less aggressive feature creation, more responsive to drift, collaborative rather than directive.

### What currently exists

The `review-issue` task is the closest analog to witness behavior. It checks whether individual issues are resolved by comparing issue acceptance criteria against the current codebase. But it does not assess overall realization of the intenti\u00f6n.

The `discussions` task has some stewardship qualities: it responds to human input, protects the mission, and can declare `[ACTION:mission-complete]`.

There is no mechanism that shifts the system's overall behavior based on a realization assessment.

### What needs to change

**4.1 Witness step**

A witness step that runs after each transformation (or batch of transformations):

```
navigate -> transform -> witness -> (loop or steward)
```

The witness:
1. Reads the intenti\u00f6n (MISSION.md)
2. Reads the current state (source files, tests, test results, features, activity log)
3. Asks the Copilot SDK: "To what degree is this intenti\u00f6n realized? Score 0-100% and explain."
4. Records the assessment in intenti\u00f6n.md
5. Returns a verdict: `{ realized: boolean, score: number, reason: string }`

**Reusable existing code:**
- `review-issue.js` -- the pattern of reading code + tests + comparing against criteria is directly applicable
- `copilot.js` -- `runCopilotTask()` works as-is
- `logging.js` -- the assessment gets recorded as an activity entry

**New code needed:**
- `src/actions/agentic-step/tasks/witness.js` (~80-100 lines)
- A realization model: what constitutes "realized"? Options:
  - Simple: tests pass + all features implemented + no open issues
  - Rich: LLM assessment against the mission statement
  - Hybrid: tests pass as a gate, LLM assessment for the subjective judgment

**4.2 Stewardship mode**

When the witness consistently reports high realization (e.g., score > 80% for 3 consecutive assessments), the system enters stewardship mode. Behavioral changes:

| Aspect | Navigation mode | Stewardship mode |
|--------|----------------|-----------------|
| Schedule frequency | Aggressive (daily or more) | Relaxed (weekly or less) |
| Feature creation | Active -- create new features toward mission | Passive -- only from discussions |
| Issue creation | Proactive | Reactive (only from external triggers) |
| Code changes | Maximize impact | Minimize risk |
| Library maintenance | Active crawling | Occasional refresh |
| Discussions response | Directive | Collaborative |

Implementation approaches:

**Option A: Config-driven mode switch**
Add a `mode: navigate | steward` field to `agentic-lib.yml`. The witness step updates it. The navigator reads it and adjusts behavior accordingly.

**Option B: Schedule-driven mode switch**
The witness step enables/disables workflows. In stewardship mode, `agent-flow-evolve.yml` is disabled and only `agent-discussions-bot.yml` and `agent-flow-review.yml` remain active. The `scripts/activate-schedule.sh` and `scripts/deactivate-schedule.sh` already exist for this.

**Option C: Prompt-driven mode shift**
The mode is communicated to the navigator via the system message. The navigator adjusts its plan based on the mode. No workflow changes needed -- just different instructions.

**Recommended: Option C first, Option A later.** Option C requires zero infrastructure changes and can be implemented as a navigator prompt prefix. Option A provides a persistent, inspectable state that other systems can read.

**4.3 What triggers the shift**

The trigger is the witness assessment, stored in intenti\u00f6n.md or a state file. The navigator reads recent witness assessments and adjusts its behavior:

```
If last 3 witness scores > 80%:
  mode = steward
Else:
  mode = navigate
```

This logic can live in the navigator's prompt, or in a small state-evaluation function that reads recent log entries.

**4.4 How stewardship behavior differs**

In stewardship mode, the navigator's system message changes:

From: "Determine the most impactful next step to advance toward the mission."
To: "The intenti\u00f6n is substantially realized. Monitor for drift, respond to discussions, maintain quality. Only propose changes that protect or refine the realization."

**Risks:**
- Premature stewardship: the witness might declare realization too early. Mitigate: require consecutive high scores, and allow the intender (human) to override.
- The realization score is subjective (LLM-assessed). Different runs may produce different scores. Mitigate: include objective gates (tests pass, no open issues with "feature" label).
- Stewardship mode could make the system too passive. Mitigate: stewardship still responds to discussions and external triggers; it just doesn't proactively create work.

**Estimated scope:** Small for witness step (~100 lines). Small-medium for stewardship mode via prompt-driven approach. Medium for config-driven approach.

---

## Phase 5: The Full Loop

### How all phases connect

```
                   intenti\u00f6n expressed (MISSION.md)
                            |
                            v
          +-------------------------------------+
          |           NAVIGATE                  |
          |                                     |
          |  1. Load intenti\u00f6n (MISSION.md)     |
          |  2. Load state (source, tests,      |
          |     features, issues, activity log) |
          |  3. Check witness history           |
          |  4. If stewardship: use steward     |
          |     navigator prompt                |
          |  5. Assemble perspective plan        |
          |  6. Output: transformation list     |
          |     with perspectives               |
          +-------------------------------------+
                            |
                            v
          +-------------------------------------+
          |           TRANSFORM                 |
          |                                     |
          |  For each transformation:           |
          |  1. Load perspective definition     |
          |  2. Gather context sources          |
          |  3. Build prompt                    |
          |  4. Run Copilot SDK session         |
          |  5. Execute post-processing         |
          |  6. Record activity                 |
          |  (Parallel where independent)       |
          +-------------------------------------+
                            |
                            v
          +-------------------------------------+
          |           WITNESS                   |
          |                                     |
          |  1. Assess realization score        |
          |  2. Record in intenti\u00f6n.md          |
          |  3. If realized: signal stewardship |
          |  4. If not: loop to NAVIGATE        |
          +-------------------------------------+
                            |
                  realized? |
                  +---------+---------+
                  |                   |
               No |                Yes|
                  v                   v
            NAVIGATE            STEWARDSHIP
            (loop)              (relaxed loop)
```

### New workflow topology

**Current (5 workflows, cron-driven):**
```
cron -> agent-flow-evolve.yml   -> evolve task
cron -> agent-flow-maintain.yml -> maintain-features task
cron -> agent-flow-review.yml   -> review-issue task
event -> agent-flow-fix-code.yml -> fix-code task
event -> agent-discussions-bot.yml -> discussions task
```

**New (3 workflows, navigation-driven):**
```
cron/event -> agent-navigate.yml
                |
                +-> dispatches agent-transform.yml (one per transformation)
                |     |
                |     +-> loads perspective definition
                |     +-> runs perspective via agentic-step
                |
                +-> runs witness step
                +-> records realization assessment
                +-> if not realized: schedule next navigation

event -> agent-flow-fix-code.yml (unchanged -- reactive, not navigated)
event -> agent-discussions-bot.yml (unchanged -- human interface)
```

The maintain, evolve, and review workflows are absorbed into the navigate/transform cycle. The fix-code and discussions workflows remain event-driven because they respond to external triggers (CI failures and human discussion), not navigation plans.

### Migration path from current 8-task system to new model

**Step 1: Add navigate + witness as new tasks (additive, no breaking changes)**
- Add `navigate.js` and `witness.js` to the tasks directory
- Add `agent-navigate.yml` workflow that runs navigate, then dispatches existing workflows, then runs witness
- Keep all existing workflows and tasks unchanged
- Update `index.js` TASKS map: 10 entries (8 existing + navigate + witness)
- Update `index.test.js` to expect 10 entries
- Run both old (cron-triggered) and new (navigation-triggered) in parallel to compare outcomes

**Step 2: Extract context sources (refactor, no behavior change)**
- Create `context-sources.js` with extracted functions
- Update existing task handlers to use context sources instead of inline gathering
- Golden prompt tests verify no prompt changes

**Step 3: Create perspective definitions for existing tasks (additive)**
- Write YAML definitions that reproduce current task handler behavior
- Create `run-perspective.js` generic handler
- Verify with golden prompt tests that perspectives produce identical prompts

**Step 4: Switch navigate workflow to use perspectives (behavioral change)**
- Navigator produces plans that reference perspective names instead of task names
- Transform step uses `run-perspective.js` instead of hardcoded task handlers
- Old cron-triggered workflows disabled (but kept in repo for rollback)

**Step 5: Enable materials fluidity (capability expansion)**
- Extend config loader with materials registry
- Navigator can recommend new material types
- Perspectives can declare new material types in their output

**Step 6: Enable machinery creation (capability expansion, guarded)**
- Add perspective/workflow directories to writable paths under guard
- Navigator can recommend creating new perspectives
- New perspectives go through PR review before activation

**Step 7: Enable stewardship mode (capability expansion)**
- Witness assessments feed into navigator's mode selection
- Stewardship prompt replaces navigation prompt when realized

### Summary table

| Phase | What | Reuses | New code | New files | Tests needed | Scope | Dependencies |
|-------|------|--------|----------|-----------|-------------|-------|-------------|
| 1 | Navigation Engine | copilot.js, safety.js, config-loader.js | navigate.js, response parser | agent-navigate.yml | ~10-15 | Medium | None |
| 2 | Dynamic Perspectives | all shared modules, agent prompts | context-sources.js, perspective-loader.js, prompt-builder.js, post-processor.js | 6-8 perspective YAML files | ~30-40 | Large | Phase 1 |
| 3a | Materials Registry | config-loader.js, tools.js, scanDirectory | materials.js, config extension | None | ~10-15 | Small | Phase 2 |
| 3b | Machinery Creation | tools.js, safety.js | machinery-guard.js, schema validator | Perspective/workflow templates | ~15-20 | Medium | Phase 2, 3a |
| 4a | Witness | copilot.js, review-issue.js pattern | witness.js | None | ~8-12 | Small | Phase 1 |
| 4b | Stewardship | navigate.js, witness.js | Mode logic in navigator prompt | None | ~5-8 | Small | Phase 1, 4a |
| 5 | Full Loop | All above | Orchestration in agent-navigate.yml | None | Integration tests | Small | All above |

### What stays the same

- `copilot.js` -- the SDK wrapper does not change
- `tools.js` -- the 4 tools remain (new tools could be added as perspectives need them)
- `safety.js` -- WIP/attempt/path checks remain and apply to all perspectives
- `logging.js` -- activity logging remains and applies to all steps
- `agent-flow-fix-code.yml` -- reactive fix workflow stays event-driven
- `agent-discussions-bot.yml` -- human interface stays event-driven
- `agentic-lib.yml` -- extended but backward compatible
- All 10 agent prompt files -- become perspective overlays, not deleted
- `intenti\u00f6n.md` -- continues as the record, now also records witness assessments

### What the intender (human) still controls

Per the concept, the intender is the only one who can:
- Express the intenti\u00f6n (write MISSION.md)
- Judge realization (override witness assessments)
- Approve machinery changes (PR review)
- Merge to main

The system navigates, transforms, witnesses, and stewards -- but never overwrites MISSION.md, never merges its own PRs, and never modifies its own control plane code.

---

## Risk Register

| Risk | Severity | Mitigation |
|------|----------|------------|
| Navigation overhead (extra token cost per cycle) | Medium | Navigator should be fast/cheap -- use a smaller model or constrained output |
| Structured output parsing fragile | Medium | Schema validation + retry + fallback to current evolve behavior |
| Perspectives produce different prompts than hardcoded tasks | High | Golden prompt tests as the verification gate for Phase 2 migration |
| Self-modification (machinery creating machinery) escapes bounds | High | Forbidden list of files that can never be writable; PR review for all machinery changes |
| Premature stewardship | Medium | Require consecutive high witness scores + human override |
| Workflow dispatch latency | Low | Accept latency; optimize later with parallel dispatch |
| Backward compatibility | Medium | Additive changes first; old and new run in parallel during migration |
| Test suite maintenance burden | Low | Context-source extraction actually reduces test duplication |

---

## Relationship to FEATURES.md and FEATURES_ROADMAP.md

This plan corresponds most closely to:
- **Feature #33 (Evolution Engine)** in FEATURES_ROADMAP.md -- the navigation engine, adaptive strategy, and predictive planning
- **Feature #1 (Autonomous Code Evolution)** -- the core loop is preserved but restructured
- **Feature #22 (Supervisor)** -- the navigator replaces the reactive supervisor with a proactive orchestrator

This plan does NOT create new FEATURES entries. When implementation begins, the relevant features should be updated or new ones created in FEATURES.md.

---

## Recommended Sequencing

**Prerequisites from PLAN_FOCUS_REBOOT.md:**
- Phase 2 (API Surface + Distribution) -- perspective definitions need to be distributable
- Goal 3 (Thin Adaptors) -- repository0 workflows need to be thin enough to replace
- Goal 5 (Testable Core) -- the golden prompt tests are the safety net for Phase 2

**Implementation order:**
1. Phase 1 (Navigate) + Phase 4a (Witness) -- these are small, additive, and immediately valuable
2. Phase 2 (Dynamic Perspectives) -- the largest and most impactful change
3. Phase 3a (Materials Registry) -- small extension, enables 3b
4. Phase 4b (Stewardship) -- small once navigate + witness exist
5. Phase 5 (Full Loop) -- orchestration, mostly workflow configuration
6. Phase 3b (Machinery Creation) -- the most ambitious capability, do last

Total estimated new/refactored code: ~800-1200 lines across 8-12 new files, plus 6-8 YAML perspective definitions and workflow changes. Most of it is extraction and recombination of existing logic, not invention from scratch.
