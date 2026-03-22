# Iteration Benchmarks

Self-contained guide for running agentic-lib pipeline benchmarks concurrently across 4 repositories. A Claude Code session can execute these benchmarks end-to-end and produce a numbered report file.

```text
Please read ITERATION_BENCHMARKS_SIMPLE.md and ask for any permissions that may be required before you start executing the tests so that benchmarks can be gathered without asking for further permissions.
Please perform the exercises in ITERATION_BENCHMARKS_SIMPLE.md and create a report in the project root similar to _developers/archive/BENCHMARK_REPORT_018.md
The session should run hands free but you can start working on a fix plan like _developers/archive/PLAN_BENCHMARK_015_FIXES.md and work on those fixes in a branch test, merge then use your release and init skill to have all 4 repos use it.
Re-use the same branch for multiple fixes as part of the same benchmarking session and keep updating what has been found and/or fixed in the fixes plan document.

```

And if we do the benchmark by running `scripts/all-repositories-benchmarks-simple.sh `:
```
Please could prepare the report for this ITERATION_BENCHMARKS_SIMPLE.md using the latest individual repository reports generated each of the workflows run from       
  scripts/all-repositories-benchmarks-simple.sh 
```

## Quick Start

To run a benchmark, say: **"Create a report for ITERATION_BENCHMARKS_SIMPLE.md"**

The operator should:
1. Read this file
2. Pick the next report number (check for existing `BENCHMARK_REPORT_NNN.md` files)
3. Execute the full procedure (save state, init all 4, monitor, collect, restore)
4. Write results to `BENCHMARK_REPORT_NNN.md` in the project root

---

## Target Repositories

All 4 repos run concurrently, one scenario per repo.

| Short Name | Repository | GitHub CLI Flag | Website |
|-----------|-----------|----------------|---------|
| `repository0-random` | `xn-intenton-z2a/repository0` | `-R xn-intenton-z2a/repository0-random` | `https://xn-intenton-z2a.github.io/repository0-random/` |
| `string-utils` | `xn-intenton-z2a/repository0-string-utils` | `-R xn-intenton-z2a/repository0-string-utils` | `https://xn-intenton-z2a.github.io/repository0-string-utils/` |
| `dense-encoder` | `xn-intenton-z2a/repository0-dense-encoder` | `-R xn-intenton-z2a/repository0-dense-encoder` | `https://xn-intenton-z2a.github.io/repository0-dense-encoder/` |
| `plot-code-lib` | `xn-intenton-z2a/repository0-plot-code-lib` | `-R xn-intenton-z2a/repository0-plot-code-lib` | `https://xn-intenton-z2a.github.io/repository0-plot-code-lib/` |

**Shell variable for loops** (used throughout this guide):

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"
```

## Permissions Granted

The operator has pre-approved these operations (no confirmation needed):

- All `gh` read commands on all 4 repos (pr list, issue list, run list, api GET, etc.)
- `gh workflow run` dispatches on all 4 repos
- `gh api` mutations on all 4 repos (issues, PRs)
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
| `gpt-4.1` | High capability, large context. |

---

## Objective

Establish "on-sight" doability benchmarks — the number of `agentic-lib-workflow` runs needed to reach mission-complete for each kyu tier, running all scenarios concurrently across 4 repos at `max` profile:

| Kyu | Target runs to mission-complete | Rationale |
|-----|--------------------------------|-----------|
| 8, 7, 6 | **1 run** | Simple missions should complete in a single workflow cycle (init auto-dispatches the first run). |
| 5, 4 | **3 runs** | Medium missions may need a review/maintain cycle and a second transform. Init + 2 manual dispatches. |

A scenario **passes** if it reaches mission-complete within the target run count. A scenario **fails** if it exceeds the target or hits budget exhaustion / mission-failed.

---

## Scenario Matrix

4 concurrent scenarios, one per repo. All use `gpt-5-mini` model and `max` profile.

| ID | Repo | Mission | Profile | Budget | Target Runs | Purpose |
|----|------|---------|---------|--------|-------------|---------|
| S1 | repository0-random | 6-kyu-understand-roman-numerals | max | 128 | 1 | 6-kyu with round-trip property, subtractive notation |
| S2 | repository0-string-utils | 5-kyu-apply-string-utils | max | 128 | 3 | Name affinity. 5-kyu medium complexity |
| S3 | repository0-dense-encoder | 6-kyu-understand-hamming-distance | max | 128 | 1 | 6-kyu with Unicode/BigInt edge cases |
| S4 | repository0-plot-code-lib | 6-kyu-understand-roman-numerals | max | 128 | 1 | 6-kyu with round-trip property |

---

## Procedure

### Step 0: Save Original State

Before overwriting repos with benchmark scenarios, record each repo's current configuration for later restoration.

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  echo "=== $REPO ==="
  gh api "repos/xn-intenton-z2a/$REPO/contents/agentic-lib.toml" \
    --jq '.content' | base64 -d | grep -A5 '^\[init\]'
  gh api "repos/xn-intenton-z2a/$REPO/contents/agentic-lib.toml" \
    --jq '.content' | base64 -d | grep -A2 '^\[schedule\]'
  echo ""
done
```

Record the results in this table (pre-filled with known state as of 2026-03-21):

| Repo | Original Mission Seed | Original Mission Type | Original Schedule | Original Model | Original Profile |
|------|-----------------------|----------------------|-------------------|----------------|------------------|
| repository0-random | 7-kyu-understand-fizz-buzz | 7-kyu-understand-fizz-buzz | off | gpt-5-mini | max |
| repository0-string-utils | 5-kyu-apply-string-utils | 5-kyu-apply-string-utils | hourly | gpt-5-mini | max |
| repository0-dense-encoder | 4-kyu-apply-dense-encoding | 4-kyu-apply-dense-encoding | hourly | gpt-5-mini | max |
| repository0-plot-code-lib | 7-kyu-understand-fizz-buzz | 7-kyu-understand-fizz-buzz | continuous | gpt-5-mini | max |

**Important**: Verify the table above against live data before proceeding. The pre-filled values may be stale.

### Step 1: Concurrent Init (all 4 repos)

Init now **automatically dispatches `agentic-lib-workflow`** after completing (controlled by `run-workflow` input, default `true`). Always pass `-f schedule=off` to prevent residual crons from interfering.

All 4 `gh workflow run` calls return immediately (they're async dispatches), so they run concurrently:

```bash
# S1: repository0-random — roman-numerals / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-random \
  -f mode=purge -f mission-seed=6-kyu-understand-roman-numerals \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# S2: repository0-string-utils — string-utils / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-string-utils \
  -f mode=purge -f mission-seed=5-kyu-apply-string-utils \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# S3: repository0-dense-encoder — hamming-distance / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-dense-encoder \
  -f mode=purge -f mission-seed=6-kyu-understand-hamming-distance \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true

# S4: repository0-plot-code-lib — roman-numerals / max
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mode=purge -f mission-seed=6-kyu-understand-roman-numerals \
  -f schedule=off -f model=gpt-5-mini -f profile=max -f run-workflow=true
```

Wait for all init workflows to complete:

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  echo -n "$REPO: "
  gh run list -R xn-intenton-z2a/$REPO -w agentic-lib-init -L 1 \
    --json status,conclusion --jq '.[0] | "\(.status) \(.conclusion)"'
done
```

Record each init run ID and completion time.

### Step 2: Manual dispatch for subsequent cycles

Init auto-dispatches the **first** `agentic-lib-workflow` run per repo. For subsequent cycles (when `schedule=off`), dispatch manually to repos that haven't completed:

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  COMPLETE=$(gh api "repos/xn-intenton-z2a/$REPO/contents/MISSION_COMPLETE.md" \
    -q '.name' 2>/dev/null || echo "no")
  FAILED=$(gh api "repos/xn-intenton-z2a/$REPO/contents/MISSION_FAILED.md" \
    -q '.name' 2>/dev/null || echo "no")
  if [ "$COMPLETE" = "no" ] && [ "$FAILED" = "no" ]; then
    echo "Dispatching $REPO..."
    gh workflow run agentic-lib-workflow -R xn-intenton-z2a/$REPO
  else
    echo "Skipping $REPO (complete=$COMPLETE, failed=$FAILED)"
  fi
done
```

**Tip**: Before each dispatch round, verify schedules are still off. If a previous run's director set a schedule, reset it:

```bash
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/REPO_NAME -f frequency=off
```

### Step 3: Monitor all repos

For each iteration round, collect data from all 4 repos. The **primary** source of truth is the persistent state file and individual agent log files on the `agentic-lib-logs` branch.

#### 3a: Dashboard check (quick status of all 4)

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  COMPLETE=$(gh api "repos/xn-intenton-z2a/$REPO/contents/MISSION_COMPLETE.md" \
    -q '.name' 2>/dev/null || echo "no")
  FAILED=$(gh api "repos/xn-intenton-z2a/$REPO/contents/MISSION_FAILED.md" \
    -q '.name' 2>/dev/null || echo "no")
  LAST_RUN=$(gh run list -R xn-intenton-z2a/$REPO -w agentic-lib-workflow -L 1 \
    --json status,conclusion --jq '.[0] | "\(.status)/\(.conclusion)"' 2>/dev/null || echo "none")
  echo "$REPO: complete=$COMPLETE failed=$FAILED last_run=$LAST_RUN"
done
```

#### 3b: Read persistent state files

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  echo "=== $REPO ==="
  gh api "repos/xn-intenton-z2a/$REPO/contents/agentic-lib-state.toml" \
    --jq '.content' -H "Accept: application/vnd.github.v3+json" \
    --method GET -f ref=agentic-lib-logs 2>/dev/null | base64 -d || echo "no state file"
  echo ""
done
```

Key fields: `log-sequence`, `cumulative-transforms`, `total-tokens`, `transformation-budget-used`/`cap`, `mission-complete`, `mission-failed`.

#### 3c: Read individual agent log files

```bash
# List log files for a specific repo
gh api repos/xn-intenton-z2a/REPO_NAME/git/trees/agentic-lib-logs \
  -q '.tree[].path' | grep '^agent-log-' | sort

# Read a specific log file
gh api "repos/xn-intenton-z2a/REPO_NAME/contents/FILENAME" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d
```

#### 3d: Download and view screenshots

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  gh api "repos/xn-intenton-z2a/$REPO/contents/SCREENSHOT_INDEX.png" \
    --jq '.content' -H "Accept: application/vnd.github.v3+json" \
    --method GET -f ref=agentic-lib-logs 2>/dev/null | base64 -d > "/tmp/screenshot-$REPO.png" \
    && echo "$REPO: screenshot saved" || echo "$REPO: no screenshot"
done
```

View each screenshot to assess the website's visual state.

#### 3e: Fetch live websites

```bash
REPOS="repository0-random repository0-string-utils repository0-dense-encoder repository0-plot-code-lib"

for REPO in $REPOS; do
  curl -sL "https://xn-intenton-z2a.github.io/$REPO/" > "/tmp/website-$REPO.html" \
    && echo "$REPO: website fetched" || echo "$REPO: no website"
done
```

#### 3f: GitHub API context (per-repo, use as needed)

```bash
REPO=REPO_NAME

# Latest workflow runs
gh run list -R xn-intenton-z2a/$REPO -w agentic-lib-workflow -L 5

# Source code size
gh api repos/xn-intenton-z2a/$REPO/contents/src/lib/main.js \
  -q '.content' | base64 -d | wc -l

# Test files
gh api repos/xn-intenton-z2a/$REPO/contents/tests/unit \
  -q '.[].name' 2>/dev/null || echo "no test dir"

# Recent commits
gh api repos/xn-intenton-z2a/$REPO/commits \
  -q '.[0:5] | .[] | .sha[0:8] + " " + (.commit.message | split("\n")[0])'

# Issues (all states)
gh api "repos/xn-intenton-z2a/$REPO/issues?state=all&per_page=10&sort=created&direction=desc" \
  -q '.[] | select(.pull_request == null) | "#\(.number) \(.state) \(.title)"'

# PRs (all states)
gh api "repos/xn-intenton-z2a/$REPO/pulls?state=all&per_page=10&sort=created&direction=desc" \
  -q '.[] | "#\(.number) \(.state) merged=\(.merged_at // "no") \(.title)"'

# Activity log
gh api repos/xn-intenton-z2a/$REPO/contents/intenti%C3%B6n.md \
  -q '.content' 2>/dev/null | base64 -d | tail -30
```

### Step 4: Determine outcome (per-repo)

A scenario is complete when one of:
- `MISSION_COMPLETE.md` exists (supervisor declared mission complete)
- `MISSION_FAILED.md` exists (supervisor declared mission failed)
- Transformation budget is exhausted (check state file)
- 3+ consecutive nop iterations with no transform (manual convergence detection)
- Schedule is set to off by the director

### Step 5: Verify acceptance criteria (per-repo)

For each repo, verify the final codebase, website, and screenshot against the mission's acceptance criteria:

```bash
REPO=REPO_NAME

# Read source
gh api repos/xn-intenton-z2a/$REPO/contents/src/lib/main.js \
  -q '.content' | base64 -d

# Read tests
gh api repos/xn-intenton-z2a/$REPO/contents/tests/unit -q '.[].name'

# Read README
gh api repos/xn-intenton-z2a/$REPO/contents/README.md \
  -q '.content' | base64 -d | head -50

# Download final screenshot
gh api "repos/xn-intenton-z2a/$REPO/contents/SCREENSHOT_INDEX.png" \
  --jq '.content' -H "Accept: application/vnd.github.v3+json" \
  --method GET -f ref=agentic-lib-logs | base64 -d > "/tmp/screenshot-final-$REPO.png"

# Fetch final website
curl -sL "https://xn-intenton-z2a.github.io/$REPO/" > "/tmp/website-final-$REPO.html"
```

**Include in the report:** A description of each screenshot and a summary of each website's HTML content.

### Step 6: Restore Original State

After collecting all benchmark data, restore each repo to its pre-benchmark configuration. Use the values recorded in Step 0.

```bash
# Restore repository0-random — fizz-buzz / off
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-random \
  -f mode=purge -f mission-seed=7-kyu-understand-fizz-buzz \
  -f schedule=off -f model=gpt-5-mini -f profile=max

# Restore repository0-string-utils — string-utils / hourly
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-string-utils \
  -f mode=purge -f mission-seed=5-kyu-apply-string-utils \
  -f schedule=off -f model=gpt-5-mini -f profile=max
# Then set schedule:
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/repository0-string-utils \
  -f frequency=hourly

# Restore repository0-dense-encoder — dense-encoding / hourly
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-dense-encoder \
  -f mode=purge -f mission-seed=4-kyu-apply-dense-encoding \
  -f schedule=off -f model=gpt-5-mini -f profile=max
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/repository0-dense-encoder \
  -f frequency=hourly

# Restore repository0-plot-code-lib — fizz-buzz / continuous
gh workflow run agentic-lib-init -R xn-intenton-z2a/repository0-plot-code-lib \
  -f mode=purge -f mission-seed=7-kyu-understand-fizz-buzz \
  -f schedule=off -f model=gpt-5-mini -f profile=max
gh workflow run agentic-lib-schedule -R xn-intenton-z2a/repository0-plot-code-lib \
  -f frequency=continuous
```

**Verify restoration**: After all init+schedule workflows complete, re-run the Step 0 commands to confirm each repo is back to its original state.

---

## Report Template

Reports are saved as `BENCHMARK_REPORT_NNN.md` in the project root. Use zero-padded 3-digit numbers.

```markdown
# Benchmark Report NNN

**Date**: YYYY-MM-DD
**Operator**: Claude Code (model-id)
**agentic-lib version**: X.Y.Z
**Previous report**: BENCHMARK_REPORT_MMM.md (or "none")

---

## Dashboard

| ID | Repo | Mission | Profile | Iterations | Transforms | Outcome | Time |
|----|------|---------|---------|------------|------------|---------|------|
| S1 | repository0-random | roman-numerals | max | N | N | ... | Xmin |
| S2 | repository0-string-utils | string-utils | max | N | N | ... | Xmin |
| S3 | repository0-dense-encoder | hamming | max | N | N | ... | Xmin |
| S4 | repository0-plot-code-lib | roman | max | N | N | ... | Xmin |

---

## Scenario S?: mission-name / repo / profile

### Configuration

| Parameter | Value |
|-----------|-------|
| Repo | repo-name |
| Mission seed | mission-name |
| Model | model |
| Profile | max |
| Budget | 128 |
| Init run | [#ID](url) |
| Init time | HH:MM UTC |

### Iterations

| # | Run ID | Time | Duration | Transform? | PR | Source Lines | Tests | What Happened |
|---|--------|------|----------|------------|-----|-------------|-------|---------------|
| 1 | ID | HH:MM | Xmin | YES/NO | #N or -- | N | N | Description |

### Acceptance Criteria

| Criterion | Status | Evidence |
|-----------|--------|----------|
| criterion text | PASS / FAIL / NOT TESTED | file:line or description |

### State File (final)

\```toml
# Paste the final agentic-lib-state.toml contents here
\```

### Website & Screenshot

**Screenshot:** Description of SCREENSHOT_INDEX.png.

**Website (GitHub Pages):** Summary of the live website HTML.

### Scenario Summary

| Metric | Value |
|--------|-------|
| Total iterations | N |
| Transforms | N |
| Final source lines | N |
| Final test count | N |
| Acceptance criteria | N/M PASS |
| Mission complete | YES / NO |
| Time (init to outcome) | ~Xmin |
| Total tokens | N |

---

## Findings

### FINDING-N: Title (POSITIVE / CONCERN / REGRESSION)

Description.

---

## Comparison with Previous Reports

Compare against baseline reports (archived in `_developers/archive/`):
- **BENCHMARK_REPORT_018.md** (v7.4.53, 2026-03-22)

| Metric | Prior Report | This Report |
|--------|-------------|-------------|
| metric | value | value |

---

## Recommendations

Numbered list of actionable next steps.

---

## Restoration Checklist

| Repo | Restored? | Verified? |
|------|-----------|-----------|
| repository0-random | YES / NO | YES / NO |
| repository0-string-utils | YES / NO | YES / NO |
| repository0-dense-encoder | YES / NO | YES / NO |
| repository0-plot-code-lib | YES / NO | YES / NO |
```

---

## Conventions

- **Iteration numbering**: Start at 1 for the first workflow run after init per repo. If two runs fire concurrently on the same repo, label them 1a and 1b.
- **Transform?**: YES if the dev job produced a merged PR with code changes. NO if maintain-only, review-only, or nop.
- **Source lines**: Count of `src/lib/main.js` lines. If multi-file, note the total.
- **Tests**: Count of test lines or test count, whichever is available.
- **Duration**: Wall-clock time from workflow start to completion.
- **Time format**: Use UTC throughout.
- **Run IDs**: Link to `https://github.com/xn-intenton-z2a/REPO_NAME/actions/runs/RUN_ID`.
- **Repo shortnames**: Use the short names from the Target Repositories table in prose (e.g. "dense-encoder" not "repository0-dense-encoder").

## What to Watch For

1. **Mission complete declaration** — Does the supervisor write MISSION_COMPLETE.md and set schedule to off?
2. **Mission failed declaration** — Does the supervisor detect budget exhaustion or stuck pipeline?
3. **Issue churn** — Are near-identical issues created each cycle? The dedup guard should prevent this.
4. **Test/code consistency** — Do tests match the implementation?
5. **State file accuracy** — Does `agentic-lib-state.toml` show correct cumulative values?
6. **Agent log quality** — Do individual agent-log files contain meaningful narratives?
7. **Screenshot assessment** — Does `SCREENSHOT_INDEX.png` show a functional website?
8. **Website front-end** — Does the GitHub Pages deployment render correctly with mission-specific content?
9. **Concurrent interference** — Any signs that 4 simultaneous runs cause GitHub API rate limiting or runner contention?
10. **Restoration completeness** — After restoring, is each repo back to its original state?
