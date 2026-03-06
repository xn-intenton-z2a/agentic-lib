# PLAN: Narrative Alignment with CONCEPT.md

**Status:** Pre-implementation. Vocabulary map defined, no renames executed yet.

**Prerequisite:** PLAN_CONTEXT_QUALITY and PLAN_ITERATOR are now implemented — the `iterate` CLI, transformation budget, `MISSION_COMPLETE.md` signal, enriched intentïon.md logging, and clean/compress/limit pipeline are all live. These new features should use the CONCEPT.md vocabulary when renamed.

Every human-readable artifact across all three repositories must speak the same language as CONCEPT.md. One borrowed taxonomy (manufacturing) for what's in the repo. GitHub is just GitHub. No "transform" or "transformation" anywhere.

---

## The Vocabulary Map

| Kill this                                        | Replace with                                            |
| ------------------------------------------------ | ------------------------------------------------------- |
| "Autonomous code transformation"                 | Navigating from intentïon to realization                |
| "Transform", "transformation", "transforming"    | Navigate, transform, grow, progress (context-dependent) |
| "Pipeline", "cycle", "loop"                      | Navigation + transformation                             |
| "Mission", "mission statement", MISSION.md       | Intentïon, INTENTION.md                                 |
| "Workflows", "actions", "config" (as a category) | Machinery                                               |
| "Agent", "bot", "task handler"                   | Perspective (way of seeing)                             |
| "Task type" (transform, fix, maintain...)        | Transformation (navigate, transform, witness, steward)  |
| "Tests pass / PR merge" as success               | Witness (realization assessment)                        |
| "Activity log"                                   | Record                                                  |
| "Library docs", "SOURCES.md content"             | Materials                                               |
| "Features" (as a category of files)              | Materials (feature specifications)                      |
| "Substrate"                                      | GitHub (just say GitHub)                                |
| "Done", "complete"                               | Realization                                             |
| "Maintenance", "ongoing"                         | Stewardship                                             |
| "agentic" (as adjective)                         | Drop it — the system just IS                            |
| (new concept)                                    | Capability — service interaction description            |
| "agent prompt file"                              | Agent definition — assembled transformation             |
| (new concept)                                    | Constraint solver — finds proceedable actions           |
| (new concept)                                    | Assessment — state snapshot for reasoning               |
| (new concept)                                    | Belief state — assumptions with justifications          |

---

## Structural Renames

These happen everywhere, all at once:

| Current                            | New                   | Scope                                                                         |
| ---------------------------------- | --------------------- | ----------------------------------------------------------------------------- |
| `MISSION.md`                       | `INTENTION.md`        | repository0 template, all seeds, all docs, config-loader, perspective prompts |
| `agents/` directory                | `perspectives/`       | agentic-lib src, repository0 .github/agentic-lib/                             |
| `agent-*.md` files                 | `perspective-*.md`    | All prompt files                                                              |
| `agent-flow-*.yml` workflows       | `transform-*.yml`     | repository0 .github/workflows/                                                |
| `agentic-lib.yml` config keys      | Renamed (see below)   | Config file + config-loader.js                                                |
| `features/` directory              | `materials/features/` | repository0 .github/agentic-lib/                                              |
| `library/` directory               | `materials/library/`  | repository0 .github/agentic-lib/                                              |
| `seeds/` directory                 | `materials/seeds/`    | repository0 .github/agentic-lib/                                              |
| (new directory)                    | `capabilities/`       | .github/agentic-lib/capabilities/ — service interaction descriptions          |
| `intentionBot` config section      | `record`              | agentic-lib.yml                                                               |
| `intentionFilepath`                | `recordFilepath`      | agentic-lib.yml                                                               |
| `missionFilepath`                  | `intentionFilepath`   | agentic-lib.yml                                                               |
| `featureDevelopmentIssuesWipLimit` | `navigationWipLimit`  | agentic-lib.yml                                                               |
| `maintenanceIssuesWipLimit`        | `stewardshipWipLimit` | agentic-lib.yml                                                               |

---

### New Features Added Since Plan Creation

These were added by PLAN_CONTEXT_QUALITY and PLAN_ITERATOR. They use internal code names that should be renamed during the narrative alignment:

| Current Internal Name | Narrative Name | Location |
|---|---|---|
| `iterate` CLI command | "navigation loop" or "iteration" | `bin/agentic-lib.js`, `src/iterate.js` |
| `transformation-budget` | "navigation budget" | `config-loader.js`, `agentic-lib.toml` |
| `MISSION_COMPLETE.md` | `REALIZATION.md` or `INTENTION_REALIZED.md` | `tasks/transform.js`, `tasks/discussions.js`, workflow |
| `cleanSource()` | — (internal, no rename needed) | `copilot.js` |
| `generateOutline()` | — (internal) | `copilot.js` |
| `filterIssues()` | — (internal) | `copilot.js` |
| `transformationCost` log line | "navigation cost" | `logging.js` |
| `intentïon.md` activity log | "intentïon record" | All task handlers, `logging.js` |

## Documents to Rewrite: FEATURES.md and FEATURES_ROADMAP.md

These are the product definition documents. They must be rewritten to use the new vocabulary throughout.

### FEATURES.md — Full Rewrite (HIGH)

**Current title:** "intentïon — Autonomous Code Transformation"
**New title:** "intentïon — Navigating From Intentïon to Realization"

**Current opening:** References "autonomous transformation system", "mission statement", "pipeline"
**New opening:** Uses intentïon vocabulary — product, machinery, record, materials, navigation, transformation, perspectives, witness, realization, stewardship.

**Feature renames:**

| #   | Current                          | New                                  |
| --- | -------------------------------- | ------------------------------------ |
| 1   | Autonomous Code Transformation   | Transformation Engine                |
| 2   | Issue Lifecycle Management       | Navigation via Issues                |
| 3   | Feature Lifecycle Management     | Feature Materials Management         |
| 4   | Code Generation & Fixing         | Builder & Fixer Perspectives         |
| 5   | Auto-Merge & Branch Management   | Branch & Merge Management            |
| 6   | Discussions Bot                  | Narrator Perspective                 |
| 7   | Statistics & Observability       | Record & Observability               |
| 8   | Publishing Pipeline              | Publishing Machinery                 |
| 9   | Website & Brand                  | Website & Brand                      |
| 10  | AWS Infrastructure — agentic-lib | AWS Infrastructure — agentic-lib     |
| 11  | AWS Infrastructure — Website     | AWS Infrastructure — Website         |
| 12  | CI/CD & Code Quality             | Witness Machinery                    |
| 13  | Configuration & Safety           | Machinery Configuration & Boundaries |
| 14  | Template System                  | Template (Machinery-in-a-Box)        |
| 15  | Library & Knowledge Management   | Materials Management                 |
| 16  | Maintenance & Hygiene            | Stewardship                          |
| 17  | Scripts & Utilities              | Utility Machinery                    |
| 18  | Copilot Migration                | Copilot Migration (historical)       |
| 19  | Workflow Hardening               | Machinery Hardening                  |
| 20  | Discussions Bot Intelligence     | Narrator Intelligence                |
| 21  | Onboarding Experience            | Onboarding Experience                |
| 22  | Supervisor                       | Navigation Supervisor                |
| 23  | TDD Workflow                     | TDD Transformation Mode              |
| 24  | Showcase Page                    | Showcase (Record)                    |
| 25  | Submission Box                   | Intentïon Submission                 |
| 26  | Verification & Testing           | Witness Verification                 |
| 27  | Code Reduction & Optimization    | Machinery Reduction                  |
| 28  | Library Demo Repository          | Demo: Utility Library                |
| 29  | Website Demo Repository          | Demo: Website                        |

**All feature descriptions:** Purge "transform/transformation" language. Replace "mission" with "intentïon". Replace "agent" with "perspective" where appropriate. Replace "pipeline" with "machinery" or "navigation."

**Architecture section:** Use manufacturing vocabulary — product, machinery, record, materials.

**Critical Success Criteria:**

- "The Demo Works" → "Realization is Visible"
- "The Loop Closes" → "Navigation Completes Autonomously"
- "Anyone Can Clone It" → "Anyone Can Express an Intentïon"

**Go-to-Market:** All "mission-driven" → "intention-driven". All "self-transforming" → "self-navigating" or "autonomous."

**MVP Demo (#28):** Rewrite to use the devkit scenario from the demo design. The intention is a comprehensive developer utility CLI, not "a library" or "a website."

### FEATURES_ROADMAP.md — Full Rewrite (MEDIUM)

**Current title references:** "Transformation Engine", "Workflow Hardening"

**Feature renames:**

| #   | Current                             | New                                     |
| --- | ----------------------------------- | --------------------------------------- |
| 30  | Workflow Hardening                  | Machinery Hardening                     |
| 31  | UX Journey & Onboarding             | UX Journey & Onboarding                 |
| 32  | Discussions Bot Intelligence        | Narrator Intelligence                   |
| 33  | Transformation Engine               | Navigation Engine                       |
| 34  | Collaboration & Feature Marketplace | Collaboration & Perspective Marketplace |
| 35  | Cost Model & Recycling              | Cost Model & Recycling                  |
| 36  | Supervisor Launch                   | Navigation Supervisor Launch            |
| 37  | Chat-Pro                            | Chat-Pro                                |
| 38  | Repository0-web                     | Repository0-web                         |
| 39  | Brand & Infrastructure              | Brand & Infrastructure                  |
| 40  | CDK Hardening                       | CDK Hardening                           |
| 41  | Additional Workflow Capabilities    | Additional Machinery Capabilities       |

**All descriptions:** Same vocabulary purge as FEATURES.md. "Self-transforming" → "self-navigating." "Transformation engine" → "Navigation engine." "Transform with the project" → "grow with the project."

---

## Repository 1: agentic-lib

### README.md — REWRITE (HIGH)

**Current:** "Autonomous code transformation powered by GitHub Copilot"

**New:**

- Opening: "intentïon — machinery for navigating from intentïon to realization. Write what you want to exist. The system builds it, tests it, and tells you when it's done."
- How It Works: The lifecycle diagram from CONCEPT.md (Navigate → Transform → Witness → Steward)
- Replace task table with perspective table: Builder, Critic, Witness, Narrator, Harvester, Steward
- "Getting Started" → "Express your intentïon"
- "Safety" → "Transformation boundaries"

### API.md — Medium edit (MEDIUM)

- "Autonomous code transformation" → "navigating from intentïon to realization"
- "Task Types" → "Transformation Perspectives"
- "transform" task → "navigate" transformation
- "transformed" outcome → "navigated" or "transformed"
- Each perspective gets its name: builder, critic, witness, narrator, harvester, steward
- "Agent configuration" → "Machinery configuration"
- "Safety Mechanisms" → "Transformation Boundaries"
- "Activity Logging" → "Record Keeping"

### Perspective prompt files — Rename + edit (MEDIUM)

| Current                      | New                                 |
| ---------------------------- | ----------------------------------- |
| `agent-apply-fix.md`         | `perspective-fixer.md`              |
| `agent-discussion-bot.md`    | `perspective-narrator.md`           |
| `agent-issue-resolution.md`  | `perspective-builder.md`            |
| `agent-maintain-features.md` | `perspective-harvester-features.md` |
| `agent-maintain-library.md`  | `perspective-harvester-library.md`  |
| `agent-maintain-sources.md`  | `perspective-harvester-sources.md`  |
| `agent-ready-issue.md`       | `perspective-critic.md`             |
| `agent-review-issue.md`      | `perspective-witness.md`            |
| `agent-update-readme.md`     | `perspective-narrator-readme.md`    |
| `agent-feature-issue.md`     | `perspective-navigator-issue.md`    |
| `agent-maintenance-issue.md` | `perspective-steward-issue.md`      |

Each file gets a perspective header and vocabulary update. Purge "transform", "mission", "agent" (as job title).

### Seed files — Rename (MEDIUM)

| Current                  | New                             |
| ------------------------ | ------------------------------- |
| `zero-MISSION.md`        | `zero-INTENTION.md`             |
| `MISSION-hello-world.md` | `INTENTION-hello-world.md`      |
| `MISSION-ascii-face.md`  | `INTENTION-ascii-face.md`       |
| `MISSION-*.md`           | `INTENTION-*.md` (all variants) |

Content: Remove all "transform" language. "Mission Statement" → "Intentïon."

### CLAUDE.md — Medium edit (MEDIUM)

- "transforming code through branches and issues" → "navigating code through branches and issues"
- "transform workflow" → "navigate workflow"
- Update branch prefix table if workflow names change

### .github/copilot-instructions.md — Light edit (LOW)

- "transform code" → "navigate code toward realization"
- "Core SDK" → "core machinery SDK"

### PLAN_FOCUS_REBOOT.md — Medium edit (MEDIUM)

- All "transform" references → "navigate" or "transform"
- "code transformation" → "code navigation" or "transformation"
- This is an active plan — must stay accurate to the current workflow names until they're renamed

### PLAN_DEMO_REPOS.md — Rewrite (MEDIUM)

- "transforms autonomously" → "navigates autonomously" or "grows autonomously"
- "transformation trail" → "transformation record"
- "Let it transform" → "Let it navigate" or "Let it run"

### PLAN_LAUNCH.md — Light edit (LOW)

- "transforming" → "navigating" or "growing"

### PLAN_VERIFICATION.md — Light edit (LOW)

- "Transform task" → "Navigate transformation"

### CLAUDE_AND_COPILOT.md — Light edit (LOW)

- "transform.js" → reference by new name when renamed

---

## Repository 2: repository0

### README.md — REWRITE (HIGH)

- "Autonomous code transformation" → "Navigating from intentïon to realization"
- "Edit MISSION.md" → "Write your intentïon in INTENTION.md"
- "Agentic workflows" → "Transformation machinery"
- How It Works: CONCEPT lifecycle diagram

### GETTING-STARTED.md — REWRITE (HIGH)

- "Three steps to autonomous code transformation" → "Three steps to realizing your intentïon"
- "Write Your Mission" → "Express Your Intentïon"
- "Edit MISSION.md" → "Edit INTENTION.md"
- Remove all "transform" language

### INTENTION.md (was MISSION.md) — Rename (HIGH)

### CONTRIBUTING.md — Medium edit (MEDIUM)

- Remove all "transform" language
- "Mission of the contributors" → "Intentïon of the contributors"

### intentïon.md — Format update (MEDIUM)

- Header: "intentïon Record" (not "Activity Log")
- Entry format: perspective names, not task names
- Requires code change in `logging.js`

### CLAUDE.md — Medium edit (MEDIUM)

- Purge "transform" language
- Update workflow name references

### .github/copilot-instructions.md — Light edit (LOW)

- "autonomous code transformation" → "autonomous transformation toward realization"

### Workflow files — Rename (HIGH)

| Current                     | New                      |
| --------------------------- | ------------------------ |
| `agent-flow-transform.yml`  | `transform-navigate.yml` |
| `agent-flow-maintain.yml`   | `transform-maintain.yml` |
| `agent-flow-review.yml`     | `transform-witness.yml`  |
| `agent-flow-fix-code.yml`   | `transform-repair.yml`   |
| `agent-discussions-bot.yml` | `transform-narrate.yml`  |

### Config: agentic-lib.yml — Full rename (MEDIUM)

New schema with renamed keys (see CONCEPT.md vocabulary).

### Seed files — Rename + purge (MEDIUM)

All `MISSION-*.md` → `INTENTION-*.md`. Purge "transform" from all content.

### Directory restructure

```
.github/agentic-lib/
  perspectives/              (was agents/)
  materials/                 (new grouping)
    features/
    library/
    seeds/
  scripts/                   (unchanged)
```

---

## Repository 3: xn--intenton-z2a.com

### public/index.html — Medium edit (HIGH)

- Tagline "What is your intentïon?" — KEEP (perfect)
- "Describe your project idea" → "What do you want to exist?"
- Ensure no "transform" language anywhere on page

### public/showcase.html — Medium edit (MEDIUM)

- "Live experiment status from the intentïon autonomous pipeline" → "Live record of transformations in progress"
- "Last activity" → "Last transformation"
- Ensure no "transform" language

### README.md — Light edit (MEDIUM)

- "autonomous code transformation experiments" → "autonomous navigation toward realization"
- "transformation engine" → "transformation machinery"

### CLAUDE.md — Light edit (LOW)

- "autonomous transformation engine" → "transformation machinery"

---

## Execution

Three parallel streams, all at once:

**Stream 1: Structural renames** (scriptable)

- MISSION.md → INTENTION.md
- agents/ → perspectives/
- agent-_.md → perspective-_.md
- agent-flow-_.yml → transform-_.yml
- features/, library/, seeds/ → materials/
- Config key renames
- config-loader.js updates
- distribute.js updates

**Stream 2: Content rewrites**

- FEATURES.md (full rewrite)
- FEATURES_ROADMAP.md (full rewrite)
- Both READMEs
- GETTING-STARTED.md
- Website pages
- All perspective prompt files
- intentïon.md format (logging.js)
- All PLAN\_\*.md files (purge "transform")
- Both CLAUDE.md files
- Both copilot-instructions.md files

**Stream 3: Code alignment**

- config-loader.js (new key names)
- logging.js (new entry format)
- index.js (task map references)
- All task handler files (import paths)
- Tests (update expectations)
- distribute.js (new paths)

---

## Verification

After all changes:

1. `grep -ri "evolv" --include="*.md" --include="*.html" --include="*.yml" --include="*.js"` across all 3 repos should return zero hits outside of `_archive/`, `node_modules/`, and git history
2. `grep -ri "mission" --include="*.md" --include="*.html" --include="*.yml"` should return zero hits outside of `_archive/`, git references, and the word "permission"
3. `grep -r "agent-flow" --include="*.yml"` should return zero hits
4. All tests pass
5. A new reader encounters one consistent vocabulary from homepage through template through docs
