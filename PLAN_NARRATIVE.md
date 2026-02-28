# PLAN: Narrative Alignment with CONCEPT.md

Every human-readable artifact across all three repositories must speak the same language as CONCEPT.md. No hedging, no aliases, no "support both." The vocabulary is: intentïon, substrate, product, machinery, record, materials, transformation, navigation, perspective, witness, realization, stewardship, assembly.

---

## The Vocabulary Map

| Kill this | Replace with |
|-----------|-------------|
| "Autonomous code evolution" | Navigation toward realization |
| "Pipeline", "cycle", "loop" | Navigation + transformation |
| "Mission", "mission statement", MISSION.md | Intentïon, INTENTION.md |
| "Workflows", "actions", "config" (as a category) | Machinery |
| "Agent", "bot", "task handler" | Perspective (way of seeing) |
| "Task type" (evolve, fix, maintain...) | Transformation (navigate, transform, witness, steward) |
| "Tests pass / PR merge" as success | Witness (realization assessment) |
| "Activity log" | Record |
| "Library docs", "SOURCES.md content" | Materials |
| "Features" (as a category of files) | Materials (feature specifications) |
| "GitHub" (when describing the platform) | Substrate |
| "Done", "complete" | Realization |
| "Maintenance", "ongoing" | Stewardship |
| "agentic" (as adjective) | Drop it — the system just IS |

---

## Structural Renames

These happen everywhere, all at once:

| Current | New | Scope |
|---------|-----|-------|
| `MISSION.md` | `INTENTION.md` | repository0 template, all seeds, all docs, config-loader, agent prompts |
| `agents/` directory | `perspectives/` | agentic-lib src, repository0 .github/agentic-lib/ |
| `agent-*.md` files | `perspective-*.md` | All prompt files |
| `agent-flow-*.yml` workflows | `transform-*.yml` | repository0 .github/workflows/ |
| `agentic-lib.yml` config keys | Renamed (see below) | Config file + config-loader.js |
| `features/` directory | `materials/features/` | repository0 .github/agentic-lib/ |
| `library/` directory | `materials/library/` | repository0 .github/agentic-lib/ |
| `seeds/` directory | `materials/seeds/` | repository0 .github/agentic-lib/ |
| `intentionBot` config section | `record` | agentic-lib.yml |
| `intentionFilepath` | `recordFilepath` | agentic-lib.yml |
| `missionFilepath` | `intentionFilepath` | agentic-lib.yml |
| `featureDevelopmentIssuesWipLimit` | `navigationWipLimit` | agentic-lib.yml |
| `maintenanceIssuesWipLimit` | `stewardshipWipLimit` | agentic-lib.yml |

---

## Repository 1: agentic-lib

### README.md — REWRITE (HIGH)

**Current:** "Autonomous code evolution powered by GitHub Copilot"

**New:**
- Opening: "intentïon — machinery for navigating from intention to realization on the GitHub substrate."
- How It Works: The lifecycle diagram from CONCEPT.md (Navigate → Transform → Witness → Steward)
- Replace task table with perspective table: Builder, Critic, Witness, Narrator, Harvester, Steward
- "Getting Started" → "Express your intentïon"
- "Safety" → "Transformation boundaries"
- Link to CONCEPT.md for the full model

### FEATURES.md — REWRITE headings + descriptions (HIGH)

**Title:** "intentïon — Navigating From Intention to Realization"

**Feature renames:**

| # | Current | New |
|---|---------|-----|
| 1 | Autonomous Code Evolution | Transformation Engine |
| 2 | Issue Lifecycle Management | Navigation via Issues |
| 3 | Feature Lifecycle Management | Feature Materials Management |
| 4 | Code Generation & Fixing | Builder & Fixer Perspectives |
| 5 | Auto-Merge & Branch Management | Strata Management |
| 6 | Discussions Bot | Narrator Perspective |
| 7 | Statistics & Observability | Record & Observability |
| 8 | Publishing Pipeline | Publishing Machinery |
| 9 | Website & Brand | Website & Brand |
| 10 | AWS Infrastructure — agentic-lib | Substrate Infrastructure (agentic-lib) |
| 11 | AWS Infrastructure — Website | Substrate Infrastructure (Website) |
| 12 | CI/CD & Code Quality | Witness Machinery |
| 13 | Configuration & Safety | Machinery Configuration & Boundaries |
| 14 | Template System | Template (Machinery-in-a-Box) |
| 15 | Library & Knowledge Management | Materials Management |
| 16 | Maintenance & Hygiene | Stewardship |
| 17 | Scripts & Utilities | Utility Machinery |
| 18 | Copilot Migration | Copilot Migration (historical) |
| 19 | Workflow Hardening | Machinery Hardening |
| 20 | Discussions Bot Intelligence | Narrator Intelligence |
| 21 | Onboarding Experience | Onboarding Experience |
| 22 | Supervisor | Navigation Supervisor |
| 23 | TDD Workflow | TDD Transformation Mode |
| 24 | Showcase Page | Showcase (Record) |
| 25 | Submission Box | Intention Submission |
| 26 | Verification & Testing | Witness Verification |
| 27 | Code Reduction & Optimization | Machinery Reduction |
| 28 | Library Demo Repository | Demo: Materials |
| 29 | Website Demo Repository | Demo: Website |

**Architecture section:** Use CONCEPT vocabulary — substrate, machinery, product, record, materials.

**Critical Success Criteria:**
- "The Demo Works" → "Realization is Visible"
- "The Loop Closes" → "Navigation Completes Autonomously"
- "Anyone Can Clone It" → "Anyone Can Express an Intentïon"

**Go-to-Market:** "mission-driven" → "intention-driven" throughout.

### FEATURES_ROADMAP.md — Light edit (MEDIUM)

Align feature names with FEATURES.md renames. "Evolution Engine" → "Navigation Engine". "Workflow Hardening" → "Machinery Hardening".

### API.md — Medium edit (MEDIUM)

- "Task Types" → "Transformation Perspectives"
- Each perspective gets its name: builder, critic, witness, narrator, harvester, steward
- "Agent configuration" → "Machinery configuration"
- "Safety Mechanisms" → "Transformation Boundaries"
- "Activity Logging" → "Record Keeping"

### Perspective prompt files — Rename + edit (MEDIUM)

Rename all files:

| Current | New |
|---------|-----|
| `agent-apply-fix.md` | `perspective-fixer.md` |
| `agent-discussion-bot.md` | `perspective-narrator.md` |
| `agent-issue-resolution.md` | `perspective-builder.md` |
| `agent-maintain-features.md` | `perspective-harvester-features.md` |
| `agent-maintain-library.md` | `perspective-harvester-library.md` |
| `agent-maintain-sources.md` | `perspective-harvester-sources.md` |
| `agent-ready-issue.md` | `perspective-critic.md` |
| `agent-review-issue.md` | `perspective-witness.md` |
| `agent-update-readme.md` | `perspective-narrator-readme.md` |
| `agent-feature-issue.md` | `perspective-navigator-issue.md` |
| `agent-maintenance-issue.md` | `perspective-steward-issue.md` |

Each file gets a perspective header:
```markdown
# Perspective: Builder
**Sees:** An issue to resolve. Code to write. Tests to pass.
**Goal:** Transform the repository state by producing code that satisfies the issue.
```

Content updated: "mission" → "intentïon", "feature" → "feature material", "library" → "library material".

### Seed files — Rename (MEDIUM)

| Current | New |
|---------|-----|
| `zero-MISSION.md` | `zero-INTENTION.md` |
| `MISSION-hello-world.md` | `INTENTION-hello-world.md` |
| `MISSION-ascii-face.md` | `INTENTION-ascii-face.md` |
| `MISSION-*.md` | `INTENTION-*.md` (all variants) |

Content: "Mission Statement" → "Intentïon" in all seed files.

### .github/copilot-instructions.md — Light edit (LOW)

"Core SDK" → "core machinery SDK". "Autonomous" → "transformation toward realization". "Agent configurations" → "perspective configurations".

---

## Repository 2: repository0

### README.md — REWRITE (HIGH)

**Opening:** "Machinery-in-a-box for the GitHub substrate. Express your intentïon; watch it become real."

- "Edit MISSION.md" → "Write your intentïon in INTENTION.md"
- "Agentic workflows" → "Transformation machinery"
- "Agent configuration" → "Machinery configuration"
- "Safety controls" → "Transformation boundaries"
- "Seed files" → "Seed materials"
- How It Works: CONCEPT lifecycle diagram

### GETTING-STARTED.md — REWRITE (HIGH)

- "Three steps to autonomous code evolution" → "Three steps to realizing your intentïon"
- Step 2: "Write Your Mission" → "Express Your Intentïon"
- "Edit MISSION.md" → "Edit INTENTION.md to express what you want to exist"
- "The machinery begins navigating" instead of "the pipeline starts"
- "The record of all transformations is kept in intentïon.md"

### INTENTION.md (was MISSION.md) — Rename (HIGH)

Rename file. Update content to use "intentïon" framing. This is the file the user writes.

### CONTRIBUTING.md — Medium edit (MEDIUM)

- "Repository template that showcases the GitHub workflows" → "Template with intentïon machinery installed"
- "Mission of the contributors" → "Intentïon of the contributors"
- "Sandbox mode" → "Transformation boundaries"

### intentïon.md — Format update (MEDIUM)

- Header: "intentïon Record" (not "Activity Log")
- Subtitle: "Record of navigation and transformation"
- Entry headers: use perspective names, not task names
- "LLM API Usage" → "Transformation cost"

(Requires code change in `logging.js`)

### Workflow files — Rename (HIGH)

| Current | New |
|---------|-----|
| `agent-flow-evolve.yml` | `transform-navigate.yml` |
| `agent-flow-maintain.yml` | `transform-maintain.yml` |
| `agent-flow-review.yml` | `transform-witness.yml` |
| `agent-flow-fix-code.yml` | `transform-repair.yml` |
| `agent-discussions-bot.yml` | `transform-narrate.yml` |

### Config: agentic-lib.yml — Full rename (MEDIUM)

```yaml
# Intention
intentionFilepath: 'INTENTION.md'

# Materials
materials:
  features:
    path: '.github/agentic-lib/materials/features/'
    permissions: [write]
    limit: 4
  library:
    path: '.github/agentic-lib/materials/library/'
    permissions: [write]
    limit: 32
  seeds:
    path: '.github/agentic-lib/materials/seeds/'
    permissions: [read]

# Product
product:
  sourcePath: 'src/lib/'
  testsPath: 'tests/unit/'

# Machinery
machinery:
  perspectivesPath: '.github/agentic-lib/perspectives/'
  workflowsPath: '.github/workflows/'

# Record
record:
  filepath: 'intentïon.md'
  readmeFilepath: 'README.md'
  contributingFilepath: 'CONTRIBUTING.md'

# Navigation limits
navigationWipLimit: 2
stewardshipWipLimit: 1
attemptsPerBranch: 2
attemptsPerIssue: 1

# Execution
testScript: 'npm test'
buildScript: 'npm run build'
mainScript: 'npm run start'
```

### Perspective files — Rename + redistribute (LOW)

Same renames as agentic-lib source. Distributed via `scripts/distribute.js`.

### Directory restructure

```
.github/agentic-lib/
  perspectives/              (was agents/)
    agentic-lib.yml          (config, renamed keys)
    perspective-builder.md
    perspective-fixer.md
    perspective-narrator.md
    perspective-witness.md
    perspective-critic.md
    perspective-harvester-features.md
    perspective-harvester-library.md
    perspective-navigator-issue.md
    perspective-steward-issue.md
    perspective-narrator-readme.md
  materials/                 (new grouping)
    features/                (was at agentic-lib root)
    library/                 (was at agentic-lib root)
    seeds/                   (was seeds/)
  scripts/                   (unchanged)
```

---

## Repository 3: xn--intenton-z2a.com

### public/index.html — Medium edit (HIGH)

- Tagline "What is your intentïon?" — KEEP (already perfect)
- "Describe your project idea" → "What do you want to exist?"
- Placeholder "A CLI tool that..." → "I want..." or "A library that..."
- Submitted body "## My intentïon" — KEEP
- Consider adding navigation links: "Machinery" → agentic-lib, "Template" → repository0

### public/showcase.html — Medium edit (MEDIUM)

- Subtitle: "Live experiment status from the intentïon autonomous pipeline" → "Live record of transformations in progress"
- Keep GitHub-native stat labels (Issues, PRs, Commits, Branches) but add framing paragraph mapping them to CONCEPT vocabulary
- "Last activity" → "Last transformation"
- Footer: "Record from the intentïon machinery"

### README.md — Light edit (MEDIUM)

- "The feedback loop of innovation" → "Navigating from intentïon to realization"
- "Showcases autonomous code evolution experiments" → "Witnesses the ongoing navigation of repositories toward realizing their intentïons"

### .github/copilot-instructions.md — Light edit (LOW)

- "No agentic workflows" → "No transformation machinery — this is pure substrate infrastructure"

---

## Execution Order

Everything happens together. No phasing by "breaking vs non-breaking." Three parallel streams:

**Stream 1: Structural renames** (can be scripted)
- Rename MISSION.md → INTENTION.md everywhere
- Rename agents/ → perspectives/ everywhere
- Rename agent-*.md → perspective-*.md everywhere
- Rename agent-flow-*.yml → transform-*.yml
- Rename features/, library/, seeds/ under materials/
- Update config keys in agentic-lib.yml
- Update config-loader.js to match
- Update all imports, references, distribute scripts

**Stream 2: Content rewrites**
- agentic-lib README.md
- repository0 README.md
- repository0 GETTING-STARTED.md
- FEATURES.md headings + descriptions
- Website index.html form text
- Website showcase.html framing
- All perspective prompt files (add headers, update vocabulary)
- intentïon.md format (logging.js)

**Stream 3: Code alignment**
- config-loader.js (new key names)
- logging.js (new entry format)
- index.js (task map keys if renamed)
- All task handler files (import paths for renamed perspective files)
- Tests (update expectations for new names, paths, formats)
- distribute.js (new source/target paths)

---

## Verification

After all changes:

1. `grep -r "mission" --include="*.md" --include="*.html" --include="*.yml"` should return zero hits outside of git history references and the word "permission"
2. `grep -r "agent-flow" --include="*.yml"` should return zero hits
3. `grep -r "agent-.*\.md"` in perspectives/ should return zero hits (all renamed)
4. All tests pass
5. A new reader encountering repository0 README → GETTING-STARTED → INTENTION.md → intentïon.md encounters a single consistent vocabulary
6. The website homepage → showcase → GitHub repos tell one coherent story
