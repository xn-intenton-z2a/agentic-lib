# Iteration Benchmarks

Self-contained guide for running agentic-lib pipeline benchmarks on repository0. A Claude Code session can execute these benchmarks end-to-end and produce a numbered report file.

```text
Please read ITERATION_BENCHMARKS_SIMPLE.md and ask for any permissions that may be required before you start executing the tests so that benchmarks can be gathered without asking for further permissions.
Please perform the exercises in ITERATION_BENCHMARKS_SIMPLE.md and create a report in the project root similar to _developers/archive/BENCHMARK_REPORT_007.md
The session should run hands free but you can stary working on a fix plan like _developers/archive/PLAN_BENCHMARK_007_FIXES.md and work on those fixes in a branch test, merge then use your release and init skill to have repository0 use it.
Re-use the same branch for multiple fixes as part of the same benchmarking session and keep updating what has been found and/or fixed in the fixes plan document. 

```

## Quick Start

To run a benchmark, say: **"Create a report for ITERATION_BENCHMARKS.md"**

The operator should:
1. Read this file
2. Pick the next report number (check for existing `BENCHMARK_REPORT_NNN.md` files)
3. Pick a scenario from the Scenario Matrix (or all of them)
4. Execute the scenario using the procedures below
5. Write results to `BENCHMARK_REPORT_NNN.md` in the project root

---

## Target Repository

| Field | Value |
|-------|-------|
| Repository | `xn-intenton-z2a/repository0` |
| GitHub CLI flag | `-R xn-intenton-z2a/repository0` |
| Website | `https://xn-intenton-z2a.github.io/repository0/` |
| Config file | `agentic-lib.toml` |
| Activity log | `intenti\u00f6n.md` |

## Permissions Granted

The operator has pre-approved these operations (no confirmation needed):

- All `gh` read commands (pr list, issue list, run list, api GET, etc.)
- `gh workflow run` dispatches on repository0
- `gh api` mutations on repository0 (issues, PRs)
- Reading/writing report files in this project root
- Pushing branches and opening PRs on agentic-lib

---

## Mission Seeds

Each mission is a self-contained MISSION.md in `src/seeds/missions/`. Missions are categorised by complexity.

### 7-8 kyu — Trivial (1-2 transforms expected)

| Mission | Functions | Acceptance Criteria | Notes |
|---------|-----------|-------------------|-------|
| `7-kyu-understand-fizz-buzz` | `fizzBuzz(n)`, `fizzBuzzSingle(n)` | 8 criteria | Simplest. If this fails, something fundamental is broken. |

### 6 kyu — Simple (2-4 transforms expected)

| Mission | Functions | Acceptance Criteria | Notes |
|---------|-----------|-------------------|-------|
| `6-kyu-understand-hamming-distance` | `hammingDistance(a,b)`, `hammingDistanceBits(x,y)` | 7 criteria | Unicode support, BigInt, input validation. |
| `6-kyu-understand-roman-numerals` | `toRoman(n)`, `fromRoman(s)` | 9 criteria | Round-trip property, subtractive notation. |

### 4-5 kyu — Medium (4-8 transforms expected)

| Mission | Functions | Acceptance Criteria | Notes |
|---------|-----------|-------------------|-------|
| `5-kyu-apply-string-utils` | 10 functions (slugify, truncate, camelCase, etc.) | 7 criteria | Bag-of-functions. Many independent functions to implement. |
| `4-kyu-apply-dense-encoding` | encode/decode, createEncoding, listEncodings | 6 criteria | Multiple encoding schemes, round-trip correctness. |
| `4-kyu-apply-cron-engine` | parseCron, nextRun, matches, etc. | 8 criteria | DST handling, special strings, validation. |

---

## Profiles

Profiles control context quality, budget, and limits. Set in `agentic-lib.toml` via `[tuning] profile = "..."`. The default distributed profile is **`max`**.

| Profile | Budget | Reasoning | Read Chars | Test Output | Feature Issues | Use Case |
|---------|--------|-----------|-----------|-------------|----------------|----------|
| `min` | 16 | low | 20,000 | 4,000 | 1 | Fast, cheap. CI testing. |
| `med` | 32 | medium | 50,000 | 10,000 | 2 | Balanced. Middle ground. |
| `max` | 128 | high | 100,000 | 20,000 | 4 | Thorough. Default for consumers. |

## Models

| Model | Notes |
|-------|-------|
| `gpt-5-mini` | Fast, cheap, supports reasoning-effort. Default. |
| `claude-sonnet-4` | Strong code quality. Note: reasoning-effort is auto-skipped for this model. |
| `gpt-4.1` | High capability, large context. |

---

## Scenario Matrix

Standard scenarios for benchmarking. Pick one or more per report.

| ID | Mission | Model | Profile     | Budget | Purpose                                          |
|----|---------|-------|-------------|--------|--------------------------------------------------|
| S1 | 7-kyu-understand-fizz-buzz | gpt-5-mini | med | 32 | Baseline. Default config on simplest mission.    |
| S2 | 7-kyu-understand-fizz-buzz | gpt-5-mini | max         | 128 | Profile comparison (max vs med).         |
| S3 | 6-kyu-understand-hamming-distance | gpt-5-mini | med | 32 | Medium complexity baseline.                      |
| S4 | 6-kyu-understand-hamming-distance | claude-sonnet-4 | max | 128 | Model comparison (gpt-5-mini vs claude-sonnet-4). |
| S5 | 6-kyu-understand-roman-numerals | gpt-5-mini | med | 32 | Medium complexity baseline.                              |
| S6 | 6-kyu-understand-roman-numerals | claude-sonnet-4 | max | 128 | Model comparison (gpt-5-mini vs claude-sonnet-4). |

---

## Procedure

### Step 1: Init repository0 with purge

Init now **automatically dispatches `agentic-lib-workflow`** after completing (controlled by `run-workflow` input, default `true`). No separate Step 2 dispatch is needed.

```bash
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0 \
  -f mode=purge \
  -f mission-seed=MISSION_NAME \
  -f schedule=off
```

To override defaults (e.g. set a specific model or profile, or skip the auto-dispatch):

```bash
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0 \
  -f mode=purge \
  -f mission-seed=MISSION_NAME \
  -f schedule=off \
  -f model=gpt-5-mini \
  -f profile=max \
  -f run-workflow=false
```

Wait for init to complete:

```bash
gh run list -R xn-intenton-z2a/repository0 -w agentic-lib-init -L 1
```

Record the init run ID and completion time.

### Step 2: (Optional) Manual dispatch or schedule

Init auto-dispatches `agentic-lib-workflow` by default. Use this step only if you set `run-workflow=false` above, or want to set a recurring schedule:

```bash
# Manual single dispatch
gh workflow run agentic-lib-workflow -R xn-intenton-z2a/repository0

# Or set a schedule for continuous iteration
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/repository0 \
  -f frequency=hourly
```

### Step 3: Monitor iterations

For each iteration, collect data from these sources. The **primary** source of truth is the persistent state file and individual agent log files on the `agentic-lib-logs` branch — these contain accurate cumulative metrics. The GitHub API provides supplementary context (issues, PRs, source code).

#### 3a: Read the persistent state file

The state file tracks cumulative counters across all workflow runs:

```bash
# Read agentic-lib-state.toml from the logs branch
gh api "repos/xn-intenton-z2a/repository0/contents/agentic-lib-state.toml" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d
```

Key fields: `log-sequence` (total tasks executed), `cumulative-transforms`, `total-tokens`, `total-duration-ms`, `transformation-budget-used`/`cap`, `mission-complete`, `mission-failed`.

#### 3b: Read individual agent log files

Each agentic-step invocation writes a standalone log file with a sequence number. List all logs, then read the latest:

```bash
# List all log files on the logs branch
gh api repos/xn-intenton-z2a/repository0/git/trees/agentic-lib-logs \
  -q '.tree[].path' | grep '^agent-log-' | sort

# Read the latest log file (replace FILENAME with the last entry)
gh api "repos/xn-intenton-z2a/repository0/contents/FILENAME" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d
```

Each log contains: Sequence, Task, Outcome, Model, Tokens, Duration, Mission Metrics table (with per-task and cumulative values), and a Narrative.

#### 3c: Download and view the screenshot

The `SCREENSHOT_INDEX.png` on the logs branch is a Playwright screenshot of the deployed website after each test cycle:

```bash
# Download the screenshot for visual inspection
gh api "repos/xn-intenton-z2a/repository0/contents/SCREENSHOT_INDEX.png" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d > /tmp/screenshot.png
```

The operator should view this image (use the Read tool on the downloaded file) to assess the website's visual state — does it render correctly? Does it show the mission-specific content?

#### 3d: Fetch the live website

The repository's GitHub Pages deployment is the user-facing product. Fetch it to assess the front-end:

```bash
# Fetch the live website HTML
curl -sL https://xn-intenton-z2a.github.io/repository0/ > /tmp/website.html
```

Check: Does the page load? Does it contain mission-specific content (function demos, interactive elements)? Does it match the screenshot?

#### 3e: GitHub API context (supplementary)

```bash
# Latest workflow runs
gh run list -R xn-intenton-z2a/repository0 -w agentic-lib-workflow -L 5

# Source code size
gh api repos/xn-intenton-z2a/repository0/contents/src/lib/main.js \
  -q '.content' | base64 -d | wc -l

# Test files
gh api repos/xn-intenton-z2a/repository0/contents/tests/unit \
  -q '.[].name' 2>/dev/null || echo "no test dir"

# Recent commits
gh api repos/xn-intenton-z2a/repository0/commits \
  -q '.[0:5] | .[] | .sha[0:8] + " " + (.commit.message | split("\n")[0])'

# Issues (all states)
gh api 'repos/xn-intenton-z2a/repository0/issues?state=all&per_page=10&sort=created&direction=desc' \
  -q '.[] | select(.pull_request == null) | "#\(.number) \(.state) \(.title)"'

# PRs (all states)
gh api 'repos/xn-intenton-z2a/repository0/pulls?state=all&per_page=10&sort=created&direction=desc' \
  -q '.[] | "#\(.number) \(.state) merged=\(.merged_at // "no") \(.title)"'

# Mission complete signal
gh api repos/xn-intenton-z2a/repository0/contents/MISSION_COMPLETE.md \
  -q '.name' 2>/dev/null || echo "not yet"

# Mission failed signal
gh api repos/xn-intenton-z2a/repository0/contents/MISSION_FAILED.md \
  -q '.name' 2>/dev/null || echo "not yet"

# Activity log (last 30 lines)
gh api repos/xn-intenton-z2a/repository0/contents/intenti%C3%B6n.md \
  -q '.content' 2>/dev/null | base64 -d | tail -30
```

### Step 4: Determine outcome

An iteration is complete when one of:
- `MISSION_COMPLETE.md` exists (supervisor declared mission complete)
- `MISSION_FAILED.md` exists (supervisor declared mission failed)
- Transformation budget is exhausted (check activity log limits table)
- 3+ consecutive nop iterations with no transform (manual convergence detection)
- Schedule is set to off

### Step 5: Verify acceptance criteria

For each acceptance criterion in the mission seed, verify the final codebase, website, and screenshot:

```bash
# Read source to check function exports
gh api repos/xn-intenton-z2a/repository0/contents/src/lib/main.js \
  -q '.content' | base64 -d

# Read tests to check coverage
gh api repos/xn-intenton-z2a/repository0/contents/tests/unit \
  -q '.[].name'

# Read README
gh api repos/xn-intenton-z2a/repository0/contents/README.md \
  -q '.content' | base64 -d | head -50

# Download and view the final screenshot
gh api "repos/xn-intenton-z2a/repository0/contents/SCREENSHOT_INDEX.png" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d > /tmp/screenshot-final.png

# Fetch the live website for front-end verification
curl -sL https://xn-intenton-z2a.github.io/repository0/ > /tmp/website-final.html
```

**Include in the report:** A description of the screenshot (what's visible, any rendering issues) and a summary of the website HTML content (does it include mission-specific elements like function demos, interactive widgets, or documentation).

### Step 6: Stop the schedule

```bash
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/repository0 \
  -f frequency=off
```

---

## Report Template

Reports are saved as `BENCHMARK_REPORT_NNN.md` in the project root (this directory). Use zero-padded 3-digit numbers starting from 001.

Use this template exactly for consistency across reports:

```markdown
# Benchmark Report NNN

**Date**: YYYY-MM-DD
**Operator**: Claude Code (model-id)
**agentic-lib version**: X.Y.Z (check package.json or npm)
**Previous report**: BENCHMARK_REPORT_MMM.md (or "none")

---

## Scenarios Run

| ID | Mission | Model | Profile | Budget | Outcome |
|----|---------|-------|---------|--------|---------|
| S? | name | model | profile | N | mission-complete / mission-failed / converged / budget-exhausted / timeout |

---

## Scenario S?: mission-name / model / profile

### Configuration

| Parameter | Value |
|-----------|-------|
| Mission seed | mission-name |
| Model | model |
| Profile | profile |
| Budget | N |
| Init run | [#ID](url) |
| Init time | HH:MM UTC |
| Schedule | off / hourly / continuous |

### Iterations

| # | Run ID | Time | Duration | Transform? | PR | Source Lines | Tests | What Happened |
|---|--------|------|----------|------------|-----|-------------|-------|---------------|
| 1 | ID | HH:MM | Xmin | YES/NO | #N or -- | N | N | Description |

### Acceptance Criteria

| Criterion | Status | Evidence |
|-----------|--------|----------|
| criterion text | PASS / FAIL / NOT TESTED | file:line or description |

### Issues

| Issue | State | Title |
|-------|-------|-------|
| #N | open/closed | title |

### State File (final)

```toml
# Paste the final agentic-lib-state.toml contents here
```

### Website & Screenshot

**Screenshot:** Description of the SCREENSHOT_INDEX.png — what is visible, does the page render correctly, any visual issues.

**Website (GitHub Pages):** Summary of the live website HTML. Does it contain mission-specific content? Interactive elements? Function demos? Does it match the screenshot?

### Scenario Summary

| Metric | Value |
|--------|-------|
| Total iterations | N |
| Transforms | N |
| Convergence | Iteration N / NOT converged |
| Final source lines | N |
| Final test count | N |
| Acceptance criteria | N/M PASS |
| Mission complete | YES / NO |
| Time (init to outcome) | ~Xmin |
| Total tokens | N (from state file) |
| Total duration | Ns (from state file) |

---

## Findings

### FINDING-N: Title (POSITIVE / CONCERN / REGRESSION)

Description of what was observed and why it matters.

---

## Comparison with Previous Reports

| Metric | Report MMM | This Report |
|--------|-----------|-------------|
| metric | value | value |

---

## Recommendations

Numbered list of actionable next steps based on findings.
```

---

## Conventions

- **Iteration numbering**: Start at 1 for the first workflow run after init. If two runs fire concurrently, label them 1a and 1b.
- **Transform?**: YES if the dev job produced a merged PR with code changes. NO if maintain-only, review-only, or nop.
- **Source lines**: Count of `src/lib/main.js` lines. If multi-file, note the total.
- **Tests**: Count of test lines or test count, whichever is available. Note which.
- **Duration**: Wall-clock time from workflow start to completion.
- **Convergence**: Detected when 2+ consecutive iterations produce no transform.
- **Time format**: Use UTC throughout.
- **Run IDs**: Link to `https://github.com/xn-intenton-z2a/repository0/actions/runs/RUN_ID`.

## What to Watch For

These are the known patterns to look for and report on:

1. **Mission complete declaration** — Does the supervisor use `mission-complete`? Does it write MISSION_COMPLETE.md? Does it set schedule to off?
2. **Mission failed declaration** — Does the supervisor detect budget exhaustion or stuck pipeline and use `mission-failed`?
3. **Issue churn** — Are near-identical issues created each cycle? The dedup guard should prevent this.
4. **Test/code consistency** — Do tests match the implementation? Does the pre-merge test gate catch mismatches?
5. **State file accuracy** — Does `agentic-lib-state.toml` on the `agentic-lib-logs` branch show correct cumulative values? Does `log-sequence` increment across iterations? Do transforms, tokens, and duration accumulate correctly?
6. **Agent log quality** — Do individual agent-log files contain meaningful narratives? Are sequence numbers sequential? Do Mission Metrics tables show both per-task and cumulative values?
7. **Recently-closed issues in context** — Does the supervisor see them and avoid re-creating resolved issues?
8. **Discussions bot actions** — If the bot is tested, does it execute create-issue, request-supervisor, stop?
9. **Screenshot assessment** — Does `SCREENSHOT_INDEX.png` show a functional website? Does it reflect the mission's implemented features? Compare across iterations for visual regression.
10. **Website front-end** — Does the GitHub Pages deployment render correctly? Does it include mission-specific interactive content (function demos, forms, visualizations)?
11. **Profile impact** — How does min vs med vs max affect outcome quality and iteration count?
12. **Model impact** — How do different models compare on the same mission?
