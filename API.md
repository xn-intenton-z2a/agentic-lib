# agentic-step API Reference

The `agentic-step` action is a GitHub Action wrapping the GitHub Copilot SDK for autonomous code evolution.

```yaml
- uses: xn-intenton-z2a/agentic-lib/.github/agentic-lib/actions/agentic-step@main
  with:
    task: resolve-issue
    issue-number: ${{ github.event.issue.number }}
```

## Inputs

| Input | Required | Default | Description |
|-------|----------|---------|-------------|
| `task` | Yes | -- | Task to perform (see Task Types below) |
| `config` | No | `.github/agentic-lib/agents/agentic-lib.yml` | Path to agent configuration file |
| `instructions` | No | -- | Path to agent prompt/instructions file (.md) |
| `issue-number` | No | -- | GitHub issue number (for issue-related tasks) |
| `pr-number` | No | -- | GitHub PR number (for PR-related tasks) |
| `writable-paths` | No | -- | Semicolon-separated writable paths (overrides config) |
| `test-command` | No | `npm test` | Command to validate changes |
| `discussion-url` | No | -- | GitHub Discussion URL (for discussions task) |
| `model` | No | `claude-sonnet-4-5` | Copilot SDK model to use |

## Outputs

| Output | Description |
|--------|-------------|
| `result` | Outcome of the task (e.g. `pr-created`, `code-fixed`, `nop`, `evolved`) |
| `pr-number` | PR number created or modified (if applicable) |
| `tokens-used` | Total tokens consumed by the Copilot SDK |
| `model` | Model used for the completion |

## Task Types

### `resolve-issue`

Read a GitHub issue and generate code to resolve it.

| Required Input | Purpose |
|----------------|---------|
| `issue-number` | The issue to resolve |

Safety checks: issue resolved, attempt limit, WIP limit.

Outcomes: `code-generated`, `nop`, `attempt-limit-exceeded`, `wip-limit-reached`.

### `fix-code`

Fix failing tests or lint errors on a pull request.

| Required Input | Purpose |
|----------------|---------|
| `pr-number` | The PR with failing checks |

Analyzes test output, generates fixes, pushes a commit to the PR branch.

### `evolve`

Evolve the codebase toward the mission. Reads the mission, current features, source files, and open issues, then makes the most impactful change.

No required inputs beyond `task`. Uses mission file path from config.

When `tdd: true` is set in config, runs in two phases: Phase 1 creates a failing test, Phase 2 writes the implementation.

Outcomes: `evolved`, `evolved-tdd`, `nop`.

### `maintain-features`

Review and manage feature definitions. Creates new features from mission analysis, prunes completed or irrelevant features, ensures quality.

No required inputs beyond `task`. Uses `featuresPath` from config.

### `maintain-library`

Update library documentation and sources. Crawls `SOURCES.md`, updates library documents, maintains the knowledge base used for context.

No required inputs beyond `task`. Uses `librarySourcesFilepath` and `libraryDocumentsPath` from config.

### `enhance-issue`

Add testable acceptance criteria to an issue to make it actionable for the resolve-issue task.

| Required Input | Purpose |
|----------------|---------|
| `issue-number` | The issue to enhance |

Safety checks: issue resolved.

### `review-issue`

Review open issues against the current codebase and close any that have been resolved.

| Required Input | Purpose |
|----------------|---------|
| `issue-number` | The issue to review |

Closes the issue if the requirements are met by the current code.

### `discussions`

Respond to GitHub Discussions. The bot can create features, seed repositories, create issues, or respond conversationally. Protects the mission from conflicting requests.

| Required Input | Purpose |
|----------------|---------|
| `discussion-url` | The Discussion to respond to |

Available actions in response: `seed-repository`, `create-feature`, `update-feature`, `delete-feature`, `create-issue`, `nop`, `mission-complete`, `stop`.

## Configuration (agentic-lib.yml)

The agent configuration file maps symbolic keys to file paths and sets execution parameters.

### Path Configuration

```yaml
paths:
  missionFilepath:
    path: 'MISSION.md'
  featuresPath:
    path: '.github/agentic-lib/features/'
    permissions: [ 'write' ]
    limit: 2
  targetSourcePath:
    path: 'src/lib/'
    permissions: [ 'write' ]
  targetTestsPath:
    path: 'tests/unit/'
    permissions: [ 'write' ]
  contributingFilepath:
    path: 'CONTRIBUTING.md'
  dependenciesFilepath:
    path: 'package.json'
    permissions: [ 'write' ]
  readmeFilepath:
    path: 'README.md'
    permissions: [ 'write' ]
```

Paths with `permissions: [ 'write' ]` are writable by the agent. All other paths are read-only (used for context only). The `limit` field caps the number of files in a directory.

### Execution Settings

| Key | Default | Description |
|-----|---------|-------------|
| `schedule` | `schedule-1` | Workflow schedule identifier |
| `buildScript` | `npm run build` | Build command |
| `testScript` | `npm test` | Test validation command |
| `mainScript` | `npm run start` | Main entry command |
| `featureDevelopmentIssuesWipLimit` | 2 | Max concurrent feature issues |
| `maintenanceIssuesWipLimit` | 1 | Max concurrent maintenance issues |
| `attemptsPerBranch` | 2 | Max branch attempts per issue |
| `attemptsPerIssue` | 1 | Max total attempts per issue |
| `docRoot` | `public` | Documentation/web root directory |
| `tdd` | `false` | Enable TDD mode (test-first evolution) |

### Bot Configuration

```yaml
intentionBot:
  intentionFilepath: 'intentïon.md'
```

The `intentionFilepath` is the append-only activity log where every agentic action is recorded.

### Seeding Configuration

```yaml
seeding:
  repositoryReseed: 'true'
  sourcePath: '.github/agentic-lib/seeds/zero-main.js'
  testsPath: '.github/agentic-lib/seeds/zero-tests.js'
  dependenciesFilepath: '.github/agentic-lib/seeds/zero-package.json'
  readmeFilepath: '.github/agentic-lib/seeds/zero-README.md'
```

Seed files are used to reset the repository to a clean starting state.

## Safety Mechanisms

| Check | Description |
|-------|-------------|
| WIP limit | Prevents creating new issues when too many are in progress |
| Attempt limit | Stops retrying branches/issues that keep failing |
| Path enforcement | Blocks writes outside configured writable paths |
| Issue resolved | Skips work on already-closed issues |
| Mission protection | MISSION.md is read-only; the discussions bot pushes back on conflicting requests |

## Activity Logging

Every task execution is logged to the `intentïon.md` file with:
- Task name and timestamp
- Outcome
- Related issue/PR numbers
- Commit URL
- Model used and tokens consumed
- Workflow run URL
