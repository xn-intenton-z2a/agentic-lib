# FEATURES — intenti\u00efn Project Ecosystem

A complete inventory of features and capabilities across all three active repositories, mapped to the Option E (Copilot SDK) implementation.

---

## Table of Contents

1. [Autonomous Code Evolution](#1-autonomous-code-evolution)
2. [Issue Lifecycle Management](#2-issue-lifecycle-management)
3. [Feature Lifecycle Management](#3-feature-lifecycle-management)
4. [Code Generation & Fixing](#4-code-generation--fixing)
5. [Auto-Merge & Branch Management](#5-auto-merge--branch-management)
6. [Discussions Bot](#6-discussions-bot)
7. [Statistics & Observability](#7-statistics--observability)
8. [Publishing Pipeline](#8-publishing-pipeline)
9. [Website & Brand](#9-website--brand)
10. [AWS Infrastructure — agentic-lib](#10-aws-infrastructure--agentic-lib)
11. [AWS Infrastructure — Website](#11-aws-infrastructure--website)
12. [CI/CD & Code Quality](#12-cicd--code-quality)
13. [Configuration & Safety](#13-configuration--safety)
14. [Template System](#14-template-system)
15. [Library & Knowledge Management](#15-library--knowledge-management)
16. [Maintenance & Hygiene](#16-maintenance--hygiene)
17. [Scripts & Utilities](#17-scripts--utilities)

---

## 1. Autonomous Code Evolution

The core proposition: repositories evolve their own code through an AI-driven feedback loop.

| Aspect | Detail |
|--------|--------|
| **What it does** | Converts a mission statement into working, tested, deployed code through a chain of automated transformations, without human intervention. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer) |
| **Current implementation** | 10 transformation workflows chained via `workflow_run` triggers and schedules. Each step uses OpenAI o4-mini for LLM completions. The chain runs on a configurable schedule (7-28 day cycles). |
| **Pipeline** | Mission → Sources → Library → Features → Issues → Code → PR → Merge → Close |
| **Key workflows** | `agent-transformation-mission-to-source.yml`, `agent-transformation-source-to-library.yml`, `agent-transformation-library-to-feature.yml`, `agent-transformation-feature-to-issue.yml`, `agent-transformation-issue-to-code.yml`, `agent-transformation-merged-issue-to-closed-issue.yml` |
| **Scheduling** | 10 different cron schedules from daily to every 28 days |
| **Recovery** | Each workflow also runs on a schedule independently, so failures at any step self-recover on the next cycle |

### Option E Implementation

Replace the entire transformation chain with a **Copilot SDK-powered GitHub Action** (`agentic-step`):

```yaml
# Simplified transformation — one action replaces 10 workflows
- uses: ./.github/actions/agentic-step
  with:
    task: "transform-mission-to-code"
    context: |
      Mission: ${{ steps.read-mission.outputs.content }}
      Features: ${{ steps.list-features.outputs.files }}
    copilot-model: "claude-sonnet-4-5"   # or whichever model Copilot routes to
```

The SDK's built-in planning loop handles multi-step reasoning internally. The 10 transformation workflows collapse into ~3 orchestration workflows:
1. `agent-flow-evolve.yml` — Runs the full mission→code pipeline via Copilot SDK
2. `agent-flow-maintain.yml` — Feature and library maintenance
3. `agent-flow-review.yml` — Issue review and closure

---

## 2. Issue Lifecycle Management

Automated creation, enhancement, assignment, resolution, and closure of GitHub issues.

| Aspect | Detail |
|--------|--------|
| **What it does** | Creates issues from features/linting/maintenance, enhances them with testable criteria, assigns them for resolution, generates code, creates PRs, merges, and closes issues when done. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer) |
| **Issue states** | Created → Enhanced (ready label) → In-progress → Code generated → PR created → Merged → Closed |
| **Key workflows** | `wfr-github-create-issue.yml`, `wfr-github-select-issue.yml`, `wfr-completion-enhance-issue.yml`, `wfr-completion-review-issue.yml`, `agent-transformation-issue-to-ready-issue.yml`, `agent-transformation-issue-to-code.yml`, `agent-transformation-merged-issue-to-closed-issue.yml` |
| **Labels** | `automated`, `ready`, `in-progress`, `feature`, `maintenance`, `automerge` |
| **Attempt limits** | 3 per branch, 2 per issue (configurable in agentic-lib.yml) |
| **WIP limits** | 2 feature issues, 1 maintenance issue concurrently |

### Option E Implementation

Copilot coding agent **natively supports issue → PR**. The `agentic-step` action orchestrates the lifecycle:

- **Issue creation**: `agentic-step` with task `create-issue` (uses Copilot SDK to generate issue text)
- **Issue enhancement**: Copilot custom agent `.github/agents/enhancer.md` + Copilot SDK call
- **Issue → code**: Assign issue to Copilot coding agent directly (native capability)
- **PR review**: `@copilot` comment for iterative fixes
- **Merge + close**: Keep existing auto-merge workflow, extend to `copilot/*` branches

WIP limits and attempt tracking move into the orchestration layer of `agentic-step`.

---

## 3. Feature Lifecycle Management

Features are defined as specification files, created from library analysis, maintained, pruned, and used to generate issues.

| Aspect | Detail |
|--------|--------|
| **What it does** | Maintains a set of feature specification files (markdown) in `sandbox/features/` or `features/`. Features are created from library analysis, refined, used to generate issues, and pruned when complete or irrelevant. |
| **Repositories** | agentic-lib (workflows + sandbox features), repository0 (consumer features) |
| **agentic-lib features** | MCP_SERVER, CORS_SUPPORT, RATE_LIMITING, REQUEST_VALIDATION, STATS_ENDPOINT |
| **repository0 features** | SIMPLE_CLI_PARSER, CLI_PARSER, COMMAND_ECHO, CLI_ECHO, HTTP_SERVER, CONFIG_VALIDATION, BOOKMARK_EXPORT, FILE_WATCH_MODE, CLI_ERROR_HANDLING, DATA_VISUALIZATION |
| **Key workflows** | `agent-flow-feature-development.yml`, `agent-flow-feature-maintenance.yml`, `wfr-completion-maintain-features.yml`, `agent-transformation-feature-to-issue.yml`, `agent-transformation-library-to-feature.yml` |
| **Limits** | Max 4-8 features at a time (configurable) |

### Option E Implementation

Feature management becomes a task for the `agentic-step` action:

```yaml
- uses: ./.github/actions/agentic-step
  with:
    task: "maintain-features"
    instructions: ".github/agents/agent-maintain-features.md"
    writable-paths: "sandbox/features/"
    max-files: 4
```

The Copilot SDK's tool-use capability handles reading library docs, creating/updating feature files, and pruning completed features — all within one execution.

---

## 4. Code Generation & Fixing

AI-powered code writing and bug fixing for issues and failing tests.

| Aspect | Detail |
|--------|--------|
| **What it does** | Given an issue or a failing test, generates code changes (source, tests, docs), validates they pass tests, and creates a PR. Also fixes failing PRs by analyzing test output and applying corrections. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer) |
| **Key workflows** | `wfr-completion-generate-issue-resolution-in-code.yml`, `wfr-completion-generate-fix-for-code.yml`, `agent-flow-fix-code.yml` |
| **Agent prompts** | `agent-issue-resolution.md`, `agent-apply-fix.md` |
| **Current LLM** | OpenAI o4-mini via CHATGPT_API_SECRET_KEY |
| **Context** | Issue body + comments, file contents, test output, recent commits, feature specs, library docs |

### Option E Implementation

This is Copilot coding agent's **primary strength**. Two paths:

1. **Issue → code**: Assign issue to Copilot (native). Copilot reads the repo, writes code, runs tests, creates draft PR.
2. **Fix failing code**: `@copilot fix the failing tests` on the PR. Copilot iterates.

For cases requiring more control (e.g. sandbox boundaries, specific file restrictions), `agentic-step` wraps the Copilot SDK:

```yaml
- uses: ./.github/actions/agentic-step
  with:
    task: "resolve-issue"
    issue-number: ${{ github.event.issue.number }}
    writable-paths: "sandbox/source/;sandbox/tests/"
    test-command: "npm test"
```

---

## 5. Auto-Merge & Branch Management

Automatic merging of PRs that pass checks, with branch conflict resolution.

| Aspect | Detail |
|--------|--------|
| **What it does** | Monitors PRs with the `automerge` label. When all checks pass, merges the PR. Handles branch conflicts by closing conflicted PRs and deleting stale branches. |
| **Repositories** | agentic-lib (workflow), repository0 (consumer) |
| **Key workflow** | `ci-automerge.yml` |
| **Reusable workflows** | `wfr-github-find-pr-from-pull-request.yml`, `wfr-github-find-pr-in-check-suite.yml`, `wfr-github-merge-pr.yml`, `wfr-github-label-issue.yml` |
| **Triggers** | pull_request, check_suite completed, schedule |
| **Concurrency** | `agentic-lib-merge-main` group prevents parallel merges |
| **Branch patterns** | `agentic-lib-issue-*`, `agentic-lib-formatting`, `agentic-lib-update-dependencies` |

### Option E Implementation

**Retained as-is** with one extension: also match `copilot/*` branches. Copilot coding agent cannot merge its own PRs, so auto-merge remains essential.

```yaml
# Updated branch pattern
if: >
  startsWith(github.head_ref, 'agentic-lib-') ||
  startsWith(github.head_ref, 'copilot/')
```

---

## 6. Discussions Bot

AI agent that responds to GitHub Discussions, creates features, seeds repositories, and provides status updates.

| Aspect | Detail |
|--------|--------|
| **What it does** | Monitors GitHub Discussions. When a discussion is created/edited/answered, generates an AI response. Can seed repositories from discussion missions, create features from suggestions, create issues from requests, declare missions complete, or halt automation. |
| **Repositories** | agentic-lib (workflow + agent prompt), repository0 (consumer) |
| **Key workflow** | `agent-discussions-bot.yml` |
| **Reusable workflow** | `wfr-completion-discussions.yml` |
| **Agent prompt** | `agent-discussion-bot.md` |
| **Triggers** | discussion (created, edited, answered, unanswered, deleted), discussion_comment (created, edited, deleted), schedule (every 28 days) |
| **Actions** | `seed-repository`, `create-feature`, `create-issue`, `nop`, `mission-complete`, `stop` |
| **Context** | Discussion thread, recent commits, file states, stats, build/test output, workflow files |
| **Personality** | Self-aware (refers to itself as the repository), adaptive tone, proactive feature creation |

### Option E Implementation

The discussions bot requires LLM access but not code generation — it's a **conversational agent**. Two approaches:

**Approach A — Copilot SDK agent:**
```yaml
- uses: ./.github/actions/agentic-step
  with:
    task: "respond-to-discussion"
    discussion-url: ${{ github.event.discussion.html_url }}
    instructions: ".github/agents/agent-discussion-bot.md"
    actions: "seed-repository,create-feature,create-issue,nop,mission-complete,stop"
```

The SDK's tool-use capability lets the bot read files, check stats, and post responses.

**Approach B — Copilot CLI:**
```yaml
- run: |
    copilot -p "Respond to this GitHub Discussion: $DISCUSSION_BODY
    You are the repository bot. Follow instructions in .github/agents/agent-discussion-bot.md.
    Available actions: seed-repository, create-feature, create-issue, nop, mission-complete, stop."
```

Approach A is preferred — the SDK gives structured tool access for reading files and posting responses.

---

## 7. Statistics & Observability

Repository health metrics, activity tracking, and telemetry.

| Aspect | Detail |
|--------|--------|
| **What it does** | Collects repository statistics (branches, PRs, issues, commits), publishes them as JSON to S3, renders them on a web dashboard, and maintains an activity log (intenti\u00efn.md) with every workflow action, commit, and LLM usage. |
| **Repositories** | agentic-lib (pipeline + dashboard), repository0 (dashboard copy) |
| **Dashboard** | `public/all.html` — multi-tile grid showing stats for agentic-lib and repository0 |
| **Stats template** | `public/stats.html` — EJS template rendering branch counts, PR age, issue velocity, commit frequency |
| **Activity log** | `intenti\u00efn.md` — chronological log of all agent actions with workflow URLs, LLM token usage, and outcomes |
| **Key workflows** | `publish-stats.yml`, `wfr-github-stats.yml`, `wfr-github-stats-json.yml`, `wfr-github-stats-to-aws.yml` |
| **AWS targets** | `s3://agentic-lib-telemetry-bucket/events/` (raw telemetry), `s3://agentic-lib-public-website-stats-bucket/` (public dashboard) |
| **Schedule** | Daily at 7:29 UTC |

### Option E Implementation

**Retained as-is.** Stats collection and publishing is infrastructure, not LLM-dependent. The only change:

- Replace OpenAI token tracking with **Copilot premium request tracking** in intenti\u00efn.md
- Add Copilot SDK usage metrics to the stats JSON

The `agentic-step` action logs its own usage:
```javascript
// In agentic-step/index.js
const result = await copilotSDK.run(task);
core.setOutput('tokens-used', result.usage.totalTokens);
core.setOutput('model', result.usage.model);
```

---

## 8. Publishing Pipeline

Packages, web content, and documentation publishing.

| Aspect | Detail |
|--------|--------|
| **What it does** | Publishes npm packages (with semantic versioning and GitHub releases), web content to GitHub Pages, and documentation. |
| **Repositories** | agentic-lib (npm + web + stats), repository0 (npm + web) |
| **npm** | `@xn-intenton-z2a/agentic-lib` (v6.10.3-1), `@xn-intenton-z2a/repository0` (v1.2.0-1) |
| **GitHub Pages** | Stats dashboard, library HTML docs |
| **Key workflows** | `publish-packages.yml`, `publish-web.yml`, `wfr-npm-publish.yml`, `wfr-github-publish-web.yml` |
| **Scripts** | `scripts/release-version-to-repository.sh`, `scripts/md-to-html.js`, `scripts/generate-library-index.js` |

### Option E Implementation

**Retained as-is.** Publishing is mechanical, not LLM-dependent. The npm package would be extended to include the `agentic-step` action:

```
@xn-intenton-z2a/agentic-lib
├── .github/actions/agentic-step/   # NEW: Copilot SDK action
│   ├── action.yml
│   └── index.js
├── .github/workflows/              # Simplified set
└── .github/agents/                 # Agent prompts (unchanged)
```

This becomes the **GitHub Marketplace Action** — delivering the "Move JS Steps to a GitHub distributed Action" TODO item.

---

## 9. Website & Brand

The intenti\u00efn public website and brand presence.

| Aspect | Detail |
|--------|--------|
| **What it does** | Minimalist single-page website at xn--intenton-z2a.com. Dark text on foggy background with animated fog layers. Giscus (GitHub Discussions) integration for community interaction. Brand assets in multiple formats and colors. |
| **Repository** | xn--intenton-z2a.com |
| **Domain** | xn--intenton-z2a.com (Punycode for intenti\u00efn) |
| **Front-end** | `public/index.html` — inline CSS/JS, 5 animated fog layers, mouse-triggered text reveal |
| **Community** | Giscus embedded widget connected to GitHub Discussions |
| **Error pages** | Custom 404 for CloudFront distribution and S3 origin |
| **Brand assets** | Logo (mesh design) in black/white/steel, SVG/PNG/JPG/PDF. Social media banners. |
| **Social presence** | LinkedIn, Facebook, Twitter/X, Instagram, LinkTree |
| **Brand TODO** | Linktree link, brand registration, submission box, showcase links, audience dashboard, web analytics, automated feeds, contact bots, domain registration |

### Option E Implementation

**Largely unchanged.** The website is static infrastructure. Copilot-related enhancements:

1. **Showcase page**: Add a page showing live experiment status, powered by the stats JSON already published to S3. This is the "intenti\u00efn.com shows: past experiments as websites" TODO item.
2. **Automated content**: Use Copilot CLI on a schedule to generate social media posts from intenti\u00efn.md activity:
   ```yaml
   - run: copilot -p "Generate a tweet about the latest activity in intentïon based on this log: $(cat intentïon.md | tail -20)"
   ```
3. **Submission box**: The "What is your intenti\u00efn?" feature would create a GitHub Discussion via Giscus, which the discussions bot picks up and processes.

---

## 10. AWS Infrastructure — agentic-lib

The backend cloud infrastructure for telemetry and event processing.

| Aspect | Detail |
|--------|--------|
| **What it does** | Deploys S3 buckets (telemetry + public website), SQS queues (digest + DLQ), Lambda function (Docker-based digest processor), DynamoDB projections table, CloudTrail logging, and IAM roles for GitHub Actions. |
| **Repository** | agentic-lib |
| **CDK stacks** | AgenticLibStack, S3SqsBridgeStack |
| **Language** | Java 11+ (CDK), Node.js 20 (Lambda) |
| **Key resources** | `agentic-lib-telemetry-bucket`, `agentic-lib-public-website-stats-bucket`, `agentic-lib-digest-queue`, `agentic-lib-digest-function`, `agentic-lib-projections-table` |
| **IAM roles** | `agentic-lib-github-actions-role`, `agentic-lib-telemetry-bucket-writer-role`, `agentic-lib-public-website-stats-bucket-writer-role` |
| **22 Java TODOs** | LogGroup retention, table TTLs, lifecycle policies, Lambda timeouts |

### Option E Implementation

**Retained as-is.** AWS infrastructure is independent of the LLM layer. The 22 Java TODOs would be excellent candidates for Copilot coding agent to resolve:

```bash
# Create issue for each TODO, assign to Copilot
gh issue create --title "CDK: Set LogGroup retention policy" --body "In AgenticLibApp.java, set retention to 30 days" --assignee @copilot
```

---

## 11. AWS Infrastructure — Website

The brand website hosting infrastructure.

| Aspect | Detail |
|--------|--------|
| **What it does** | Deploys the intenti\u00efn website via CloudFront + S3 with SSL, Route53 DNS, CloudTrail telemetry, and access log forwarding via Lambda. |
| **Repository** | xn--intenton-z2a.com |
| **CDK stacks** | NetworkStack (DNS/SSL), ApplicationStack (S3/CloudFront), TelemetryStack (CloudTrail) |
| **Language** | Java 21 (CDK), Java 11 (Lambda functions) |
| **Terraform** | IAM roles and state buckets via Terraform/Terragrunt |
| **Environments** | dev (auto-deploy on push), live (manual trigger) |
| **CI/CD** | 9 GitHub Actions workflows for bootstrap, build-deploy, destroy, and access checks |
| **Lambda functions** | `LogS3ObjectEvent`, `LogGzippedS3ObjectEvent` — forward S3/CloudFront access logs to CloudWatch |

### Option E Implementation

**Retained as-is.** Website infrastructure is not LLM-dependent. The 10 pending brand/infra TODOs could be assigned to Copilot coding agent for resolution.

---

## 12. CI/CD & Code Quality

Continuous integration, testing, formatting, linting, and dependency management.

| Aspect | Detail |
|--------|--------|
| **What it does** | Runs tests on push and schedule, auto-formats code (Prettier), lints (ESLint), updates dependencies (npm/Maven), and creates auto-mergeable PRs for fixes. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer), xn--intenton-z2a.com (own CI) |
| **Key workflows** | `ci-test.yml`, `ci-automerge.yml`, `ci-formating.yml`, `ci-update.yml` |
| **Test frameworks** | Vitest (JS), JUnit 5 + Mockito (Java), Supertest (HTTP) |
| **Linting** | ESLint with google, import, promise, security, sonarjs plugins |
| **Formatting** | Prettier |
| **Dependencies** | npm-check-updates (minor/greatest), Maven dependency plugin |

### Option E Implementation

**Retained as-is.** CI/CD is mechanical. One enhancement: add `copilot-setup-steps.yml` to both agentic-lib and repository0 so Copilot coding agent can run tests in its sandbox:

```yaml
# .github/copilot-setup-steps.yml
steps:
  - uses: actions/setup-node@v4
    with:
      node-version: '20'
  - run: npm ci
```

---

## 13. Configuration & Safety

Agent behaviour configuration, sandbox isolation, and access controls.

| Aspect | Detail |
|--------|--------|
| **What it does** | Centralises all agent parameters in `agentic-lib.yml`: file paths with read/write permissions, build/test/main scripts, WIP limits, attempt limits, sandbox reset behaviour, seed files, schedule selection. Ensures agents can only write to allowed paths. |
| **Repositories** | agentic-lib (config + enforcement), repository0 (own config) |
| **Config file** | `.github/agents/agentic-lib.yml` |
| **Sandbox paths** | `sandbox/MISSION.md`, `sandbox/SOURCES.md`, `sandbox/library/`, `sandbox/features/`, `sandbox/source/`, `sandbox/tests/`, `sandbox/docs/`, `sandbox/README.md` |
| **Limits** | featureDevelopmentIssuesWipLimit: 2, maintenanceIssuesWipLimit: 1, attemptsPerBranch: 2-3, attemptsPerIssue: 1-2 |
| **Seeds** | `seeds/zero-MISSION.md`, `seeds/zero-main.js`, `seeds/zero-main.test.js`, `seeds/zero-package.json` |
| **Concurrency groups** | `agentic-lib-main`, `agentic-lib-merge-main`, `agentic-lib-bot`, `agentic-lib-stats` |

### Option E Implementation

Configuration moves into the `agentic-step` action's inputs:

```yaml
- uses: ./.github/actions/agentic-step
  with:
    config: ".github/agents/agentic-lib.yml"
    # Action reads config and enforces:
    # - writable path restrictions
    # - WIP limits (checks open issues before creating new ones)
    # - attempt limits (checks branch/issue history)
    # - sandbox boundaries
```

The Copilot SDK respects tool boundaries set by the action — if a tool for file-write is only given sandbox paths, the SDK cannot write elsewhere.

---

## 14. Template System

repository0 serves as a clonable starting point for new agentic projects.

| Aspect | Detail |
|--------|--------|
| **What it does** | Provides a GitHub template repository pre-configured with all agentic workflows, agent configs, seeds, and a getting-started guide. Users clone it, set their mission, add an OpenAI key, and the autonomous evolution begins. |
| **Repository** | repository0 |
| **Getting started** | `getting-started-guide/` — 14 screenshots walking through setup |
| **Seed files** | Provided by agentic-lib (`seeds/zero-*`) |
| **Consumer workflows** | 31 workflows that call agentic-lib reusable workflows via `workflow_call` |
| **Mission** | Users write `MISSION.md`, the system derives everything from it |
| **CONTRIBUTING.md** | Guidelines for both human and automated contributors |

### Option E Implementation

The template becomes simpler. Instead of 31 consumer workflows calling reusable workflows, the template ships with:

1. `copilot-setup-steps.yml` — Environment setup for Copilot
2. `.github/agents/*.md` — Custom agent prompts
3. `.github/agents/agentic-lib.yml` — Configuration
4. `agent-flow-evolve.yml` — Calls `agentic-step` action to run the evolution
5. `ci-test.yml` — Standard CI
6. `ci-automerge.yml` — Auto-merge (including `copilot/*` branches)
7. `publish-*.yml` — Publishing workflows

From 31 workflows down to ~7-10. The `agentic-step` action (published to GitHub Marketplace) encapsulates the complexity.

The getting-started guide updates to:
1. Create repository from template
2. Write MISSION.md
3. Enable Copilot coding agent (no OpenAI key needed)
4. Watch the evolution begin

---

## 15. Library & Knowledge Management

Automated creation and maintenance of a knowledge library from web sources.

| Aspect | Detail |
|--------|--------|
| **What it does** | Crawls URLs listed in SOURCES.md, extracts technical content, creates/updates library documents in `sandbox/library/`, and generates a searchable HTML index. Library docs are used as context for feature generation and issue resolution. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer) |
| **Key workflows** | `wfr-completion-maintain-library.yml`, `wfr-completion-maintain-sources.yml`, `agent-transformation-source-to-library.yml` |
| **Agent prompts** | `agent-maintain-library.md`, `agent-maintain-sources.md` |
| **Scripts** | `scripts/generate-library-index.js`, `scripts/md-to-html.js` |
| **Limits** | 8-16 source entries, 32-64 library documents (configurable) |

### Option E Implementation

Library maintenance becomes a task for `agentic-step`:

```yaml
- uses: ./.github/actions/agentic-step
  with:
    task: "maintain-library"
    instructions: ".github/agents/agent-maintain-library.md"
    writable-paths: "sandbox/library/;sandbox/SOURCES.md"
```

The Copilot SDK can use MCP tools to fetch URLs, so the web crawling capability is preserved. The separate source-to-library and library-to-feature transformations become internal steps of a single `agentic-step` execution.

---

## 16. Maintenance & Hygiene

Automated cleanup of branches, issues, workflow history, and dependencies.

| Aspect | Detail |
|--------|--------|
| **What it does** | Truncates old workflow run history, archives issue history, sweeps stale branches, recovers stuck in-progress issues, reseeds stale repositories, and updates dependencies. |
| **Repositories** | agentic-lib (workflows), repository0 (consumer) |
| **Key workflows** | `utils-truncate-workflow-history.yml`, `utils-truncate-issue-history.yml`, `ci-update.yml`, `agent-archive-intenti\u00efn.yml` |
| **Reseed** | When progress stalls for a configurable period, the sandbox is reset from seed files |
| **intenti\u00efn archive** | Periodically pushes intenti\u00efn.md to a dated branch for historical record |

### Option E Implementation

**Retained as-is.** These are operational housekeeping workflows, not LLM-dependent. The intenti\u00efn archive workflow continues unchanged. Reseed logic moves into the `agentic-step` action's configuration:

```yaml
# In agentic-lib.yml
reseed:
  enabled: true
  staleAfterDays: 14
  seeds:
    - seeds/zero-MISSION.md
    - seeds/zero-main.js
```

---

## 17. Scripts & Utilities

Shell and Node.js scripts for release management, deployment, and development.

| Aspect | Detail |
|--------|--------|
| **What it does** | Release versioning across repositories, AWS IAM role assumption, npm authentication, schedule activation/deactivation, source export, dependency updates, and cleanup. |
| **Repository** | agentic-lib (21 scripts), xn--intenton-z2a.com (deployment scripts) |
| **Key scripts** | `release-version-to-repository.sh`, `release-to-every-repository.sh`, `aws-assume-agentic-lib-deployment-role.sh`, `activate-schedule.sh`, `deactivate-schedule.sh` |

### Option E Implementation

**Retained as-is.** Scripts are operational tooling. The release scripts would be updated to also publish the `agentic-step` action to GitHub Marketplace.

---

## Option E Architecture Summary

### Before (Current)

```
agentic-lib (59 workflows)
├── 10 transformation workflows (OpenAI completions)
├── 10 flow workflows (orchestration)
├── 23 reusable workflows (wfr-*)
├── 5 CI workflows
├── 3 publishing workflows
├── 2 utility workflows
├── 11 agent configs
└── OpenAI API dependency

repository0 (31 workflows)
├── Calls agentic-lib reusable workflows
└── OpenAI API dependency (via agentic-lib)

xn--intenton-z2a.com (9 workflows)
└── Pure infrastructure, no LLM
```

### After (Option E)

```
agentic-lib
├── .github/actions/agentic-step/     # NEW: Copilot SDK action
│   ├── action.yml
│   ├── index.js                      # Copilot SDK integration
│   ├── config-loader.js              # Reads agentic-lib.yml
│   ├── safety.js                     # WIP limits, attempt tracking, path restrictions
│   └── package.json                  # @github/copilot-sdk dependency
├── .github/workflows/
│   ├── agent-flow-evolve.yml         # Mission → code (replaces 10 transformations)
│   ├── agent-flow-maintain.yml       # Feature + library maintenance
│   ├── agent-flow-review.yml         # Issue review + closure
│   ├── agent-discussions-bot.yml     # Copilot SDK for discussions
│   ├── ci-test.yml                   # Unchanged
│   ├── ci-automerge.yml              # Extended for copilot/* branches
│   ├── ci-formating.yml              # Unchanged
│   ├── ci-update.yml                 # Unchanged
│   ├── publish-stats.yml             # Unchanged (+ Copilot metrics)
│   ├── publish-web.yml               # Unchanged
│   ├── publish-packages.yml          # + Marketplace action publishing
│   ├── utils-truncate-*.yml          # Unchanged
│   └── agent-archive-intentïon.yml   # Unchanged
├── .github/agents/                   # Agent prompts (unchanged content)
├── copilot-setup-steps.yml           # NEW: Copilot environment config
└── NO OpenAI dependency

repository0
├── .github/workflows/
│   ├── agent-flow-evolve.yml         # Calls agentic-step action
│   ├── agent-flow-maintain.yml       # Calls agentic-step action
│   ├── agent-flow-review.yml         # Calls agentic-step action
│   ├── agent-discussions-bot.yml     # Calls agentic-step action
│   ├── ci-test.yml                   # Unchanged
│   ├── ci-automerge.yml              # Extended for copilot/* branches
│   └── publish-*.yml                 # Unchanged
├── .github/agents/                   # Custom agent prompts
├── copilot-setup-steps.yml           # NEW
└── NO OpenAI dependency

xn--intenton-z2a.com (unchanged)
├── .github/workflows/ (9 workflows)
└── Pure infrastructure
```

### Workflow Reduction

| Repository | Before | After | Reduction |
|-----------|--------|-------|-----------|
| agentic-lib | 59 workflows | ~15 workflows + 1 action | -75% |
| repository0 | 31 workflows | ~8 workflows | -74% |
| xn--intenton-z2a.com | 9 workflows | 9 workflows | 0% |
| **Total** | **99 workflows** | **~32 workflows + 1 action** | **-68%** |

### Dependencies Change

| Dependency | Before | After |
|-----------|--------|-------|
| OpenAI API (o4-mini) | Required (paid per token) | Removed |
| GitHub Copilot subscription | Not used | Required (included in plan) |
| @github/copilot-sdk | Not used | New dependency |
| AWS S3/SQS/Lambda | Used | Unchanged |
| GitHub Actions minutes | Heavy (59 workflows) | Lighter (~32 workflows) |

### TODO Items Delivered by Option E

| TODO Item | Status |
|-----------|--------|
| Switch from github script actions to `run: node` | Delivered — agentic-step is a proper Node.js action |
| Move JS Steps to a GitHub distributed Action | Delivered — agentic-step published to Marketplace |
| Convert the actions library JS to an SDK | Delivered — agentic-step wraps Copilot SDK |
