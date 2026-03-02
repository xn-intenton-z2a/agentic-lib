# intentïon `agentic-lib`

**Bootstrap any repository with autonomous code transformation powered by GitHub Copilot.** Install the SDK, run `init`, write a mission statement, and the agentic workflows will generate issues, write code, run tests, and open pull requests -- continuously transforming your repository toward its goal.

## Quick Start

```bash
# In your repository:
npx @xn-intenton-z2a/agentic-lib init

# Write your mission:
echo "# Build a CLI tool that converts CSV to JSON" > MISSION.md

# Commit and push -- the workflows take over from here:
git add -A && git commit -m "Initialise agentic workflows" && git push
```

Or start from the [repository0 template](https://github.com/xn-intenton-z2a/repository0) which comes pre-initialised.

## How It Works

```
MISSION.md           Your project goals in plain English
    |
    v
[agentic-step]       GitHub Action wrapping the Copilot SDK
    |
    v
Issue -> Code -> Test -> PR -> Merge -> Next Issue
    ^                                       |
    +---------------------------------------+
              Autonomous cycle
```

The pipeline runs as GitHub Actions workflows on a schedule. Each step uses the `agentic-step` action to call the Copilot SDK with context from your repository (mission, contributing guidelines, existing code, test results) and produce targeted changes.

## Initialisation

### `npx @xn-intenton-z2a/agentic-lib init`

Populates your repository with the agentic infrastructure. Run it once to set up, or again to update to the latest version.

```bash
npx @xn-intenton-z2a/agentic-lib init           # install/update infrastructure
npx @xn-intenton-z2a/agentic-lib init --purge    # also reset source files to seed state
npx @xn-intenton-z2a/agentic-lib init --dry-run  # preview without writing
npx @xn-intenton-z2a/agentic-lib reset           # alias for init --purge
npx @xn-intenton-z2a/agentic-lib version         # show installed version
```

### What `init` Installs

After running `init`, your repository will contain:

```
your-repo/
├── agentic-lib.toml                          # [INIT] Config (created once, never overwritten)
│
├── .github/
│   ├── workflows/                            # [INIT] 8 workflow files (always overwritten)
│   │   ├── agent-flow-transform.yml          #   Core: transform code toward the mission
│   │   ├── agent-flow-maintain.yml           #   Core: maintain features and library
│   │   ├── agent-flow-review.yml             #   Core: review and close resolved issues
│   │   ├── agent-flow-fix-code.yml           #   Core: fix failing tests
│   │   ├── agent-discussions-bot.yml         #   Bot: respond to GitHub Discussions
│   │   ├── agent-supervisor.yml              #   Supervisor: orchestrate the pipeline
│   │   ├── ci-automerge.yml                  #   CI: auto-merge passing PRs
│   │   └── test.yml                          #   CI: run tests
│   │
│   └── agentic-lib/                          # [INIT] Internal infrastructure (always overwritten)
│       ├── actions/
│       │   ├── agentic-step/                 #   The Copilot SDK action (8 task handlers)
│       │   ├── commit-if-changed/            #   Composite: conditional git commit
│       │   └── setup-npmrc/                  #   Composite: npm registry auth
│       ├── agents/                           #   7 prompt files + config YAML
│       ├── seeds/                            #   Seed files for reset
│       └── scripts/                          #   Utility scripts
│
├── MISSION.md                                # [USER] You write this -- your project goals
├── src/lib/main.js                           # [USER] Your source code (seeded on --purge)
├── tests/unit/main.test.js                   # [USER] Your tests (seeded on --purge)
├── package.json                              # [USER] Your package config (seeded on --purge)
├── README.md                                 # [USER] Your readme (seeded on --purge)
├── intentïon.md                              # [GENERATED] Activity log (cleared on --purge)
└── .github/agentic-lib/features/             # [GENERATED] Feature definitions (cleared on --purge)
```

**Legend:**
- **[INIT]** -- Created or overwritten by `init` every time. You should not edit these.
- **[USER]** -- Your files. `init` never touches these. `init --purge` resets them to seed state.
- **[GENERATED]** -- Created by the agentic workflows during operation.

Your repository should also have an `init.yml` workflow (not distributed — maintained locally) that runs `npx agentic-lib init --purge` on a schedule to keep infrastructure up to date. See [repository0/init.yml](https://github.com/xn-intenton-z2a/repository0/blob/main/.github/workflows/init.yml) for an example.

### What You Need Before Running `init`

| File | Required? | Notes |
|------|-----------|-------|
| `package.json` | Recommended | If missing, `init --purge` creates one from the seed |
| `.gitignore` | Recommended | Standard Node.js gitignore |
| `LICENSE` | Recommended | Your choice of license |
| Git repo | Yes | Must be a git repository with a remote on GitHub |

### GitHub Repository Settings

After `init`, configure these in your GitHub repository:

| Setting | Where | Purpose |
|---------|-------|---------|
| `COPILOT_GITHUB_TOKEN` | Settings > Secrets | Fine-grained PAT with "Copilot Requests" permission |
| GitHub Actions | Settings > Actions | Must be enabled (default) |
| Branch protection | Settings > Branches | Optional: require PR reviews before merge |

## Configuration

Configuration lives in `agentic-lib.toml` at your project root:

```toml
[schedule]
tier = "schedule-1"       # schedule-1 through schedule-4

[paths]
mission = "MISSION.md"
source = "src/lib/"
tests = "tests/unit/"
features = ".github/agentic-lib/features/"
docs = "docs/"
readme = "README.md"
dependencies = "package.json"

[execution]
build = "npm run build"
test = "npm test"
start = "npm run start"

[limits]
feature-issues = 2
maintenance-issues = 1
attempts-per-branch = 3
attempts-per-issue = 2

[bot]
log-file = "intentïon.md"
```

The YAML config at `.github/agentic-lib/agents/agentic-lib.yml` is also supported as a fallback.

## The `agentic-step` Action

The core of the system is a single GitHub Action that handles all autonomous tasks:

| Task | Purpose |
|------|---------|
| `transform` | Transform the codebase toward the mission |
| `resolve-issue` | Read an issue and generate code to resolve it |
| `fix-code` | Fix failing tests or lint errors |
| `maintain-features` | Generate and maintain feature definitions |
| `maintain-library` | Update library documentation and sources |
| `enhance-issue` | Add detail and acceptance criteria to issues |
| `review-issue` | Review and close resolved issues |
| `discussions` | Respond to GitHub Discussions |

Each task calls the GitHub Copilot SDK with context assembled from your repository (mission, code, tests, features) and writes changes back to the working tree.

## CLI Task Commands

Run Copilot SDK transformations locally from the command line. These are the same operations the GitHub Actions workflows perform, but you can run them interactively to see what happens.

```bash
npx @xn-intenton-z2a/agentic-lib transform            # advance code toward the mission
npx @xn-intenton-z2a/agentic-lib maintain-features     # generate feature files from mission
npx @xn-intenton-z2a/agentic-lib maintain-library      # update library docs from SOURCES.md
npx @xn-intenton-z2a/agentic-lib fix-code              # fix failing tests
```

All task commands accept these flags:

| Flag | Default | Purpose |
|------|---------|---------|
| `--dry-run` | off | Show the prompt without calling the Copilot SDK |
| `--target <path>` | current directory | Target repository to transform |
| `--model <name>` | `claude-sonnet-4` | Copilot SDK model |

### Example: Full Walkthrough

```bash
# 1. Start with a fresh repository
mkdir my-project && cd my-project && git init
npx @xn-intenton-z2a/agentic-lib init --purge

# 2. Write your mission
cat > MISSION.md <<'EOF'
# Mission: CSV to JSON Converter
Build a Node.js CLI tool that reads CSV from stdin and outputs JSON to stdout.
EOF

# 3. Install agentic-step dependencies
cd .github/agentic-lib/actions/agentic-step && npm ci && cd -

# 4. Generate features from your mission
npx @xn-intenton-z2a/agentic-lib maintain-features
# Output:
#   === agentic-lib maintain-features ===
#   [config] Loading agentic-lib.toml
#   [context] Mission loaded, features: 0, library: 0
#   [copilot] Creating session...
#   [copilot] Sending prompt...
#   [event] tool.call: write_file({"path":".github/agentic-lib/features/csv-parsing.md",...})
#   === maintain-features completed in 12.3s ===

# 5. Transform code toward the mission
npx @xn-intenton-z2a/agentic-lib transform
# Output:
#   === agentic-lib transform ===
#   [context] Mission: # Mission: CSV to JSON Converter...
#   [context] Features: 2, Source files: 1
#   [copilot] Creating session...
#   [event] tool.call: write_file({"path":"src/lib/main.js",...})
#   [event] tool.call: run_command({"command":"npm test"})
#   === transform completed in 18.7s ===

# 6. Review the changes
git diff

# 7. If happy, commit
git add -A && git commit -m "Initial transform" && git push
```

Use `--dry-run` to see what prompt would be sent without calling the SDK:

```bash
npx @xn-intenton-z2a/agentic-lib transform --dry-run
```

### Environment

| Variable | Required | Purpose |
|----------|----------|---------|
| `COPILOT_GITHUB_TOKEN` | For live runs | Fine-grained PAT with "Copilot Requests" permission |
| (none) | For `--dry-run` | Dry-run shows the prompt without calling the SDK |

If `COPILOT_GITHUB_TOKEN` is not set, the CLI falls back to local `gh` CLI authentication.

## Three Ways to Start

| Method | How | Best for |
|--------|-----|----------|
| **Template** | Use [repository0](https://github.com/xn-intenton-z2a/repository0) as a GitHub template | New projects -- comes pre-initialised |
| **CLI** | `npx @xn-intenton-z2a/agentic-lib init` in any repo | Existing projects -- adds agentic workflows |
| **Website** | [xn--intenton-z2a.com](https://xn--intenton-z2a.com) | Guided setup with a web form |

## Safety

Built-in safety mechanisms:

- **WIP limits** -- maximum concurrent issues to prevent runaway generation
- **Attempt limits** -- maximum retries per branch and per issue
- **Path enforcement** -- writable and read-only path separation
- **TDD mode** -- optionally require tests before implementation
- **Mission protection** -- MISSION.md is read-only to the agent

## Updating

To update to the latest version of the agentic infrastructure:

```bash
npx @xn-intenton-z2a/agentic-lib@latest init
git add -A && git commit -m "Update agentic-lib" && git push
```

This overwrites `.github/workflows/` and `.github/agentic-lib/` with the latest versions. Your source code, tests, mission, and config are never touched.

## Development

This repository is the source for the `@xn-intenton-z2a/agentic-lib` npm package. All distributed content lives in `src/`:

```
src/
├── workflows/     7 GitHub Actions workflow templates
├── actions/       3 composite/SDK actions (agentic-step, commit-if-changed, setup-npmrc)
├── agents/        7 agent prompt files + 1 config
├── seeds/         7 seed files (test.yml + 6 project seed files for --purge reset)
└── scripts/       7 utility scripts distributed to consumers
```

### Testing

236 unit tests across 21 test files, plus system tests:

```bash
npm test                  # Run all tests (vitest)
npm run linting           # ESLint
npm run lint:workflows    # Validate workflow YAML
npm run security          # npm audit
npm run test:smoke        # Connectivity smoke test (needs GITHUB_TOKEN)
npm run test:system       # System test: init/purge cycle
npm run test:system:dry-run  # System test: full flow with --dry-run
npm run test:system:live  # System test: full flow with Copilot SDK (needs COPILOT_GITHUB_TOKEN)
```

### Publishing

Both auto and manual publishing are handled by `release.yml`:

- **Auto-publish**: Pushing to `main` with changes in `src/`, `bin/`, or `package.json` triggers a patch version bump and npm publish.
- **Manual release**: Use `release.yml` workflow dispatch for major/minor/prerelease versions.

## Licensing

- Core SDK: [GPL-3.0](LICENSE) — `SPDX-License-Identifier: GPL-3.0-only`
- Distributed code (workflows, actions, seeds, scripts in `src/`): [MIT](LICENSE-MIT) — `SPDX-License-Identifier: MIT`
- All source files include SPDX license identifiers and copyright notices
- Copyright (C) 2025-2026 Polycode Limited

## Links

- [repository0 template](https://github.com/xn-intenton-z2a/repository0) -- start here
- [Getting Started Guide](https://github.com/xn-intenton-z2a/repository0/blob/main/GETTING-STARTED.md)
- [API Reference](API.md)
- [Website](https://xn--intenton-z2a.com)
