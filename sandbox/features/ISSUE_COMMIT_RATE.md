# Purpose & Scope

Add built-in metrics tracking and reporting to measure the ratio of issues handled by agentic-lib workflows that result in committed code. This feature will instrument key points in the digestLambdaHandler and CLI to capture when an issue triggers a code commit, persist rolling metrics, and expose a new CLI command for retrieving current conversion statistics.

# Value Proposition

By providing visibility into how many issues lead to actual code changes, project maintainers can:

- Identify bottlenecks in automated workflows
- Prioritize improvements to parts of the system that underperform
- Demonstrate the tangible impact of agentic workflows on project health

# Success Criteria & Requirements

1. **Metrics Collection**
   - Increment an internal counter each time an SQS digest event leads to a simulated or real commit.
   - Increment a total issues handled counter at the start of each digestLambdaHandler invocation.
2. **Persistence**
   - Store metrics in a JSON file named `.agentic_metrics.json` at the project root.
   - Initialize metrics file with zeroed counters if it does not exist.
3. **CLI Reporting**
   - Introduce a new flag `--stats` in the main CLI that reads and prints current conversion rate and raw counts.
   - Output format must be JSON with keys: totalIssues, successfulCommits, conversionRate.
4. **Logging Integration**
   - When `--verbose-stats` is set, log metrics automatically at the end of each CLI invocation.

# Dependencies & Constraints

- No external databases or services; metrics persist locally.
- File I/O must be synchronous to avoid race conditions when CLI exits.
- Must remain compatible with existing Node 20 ESM environment.

# User Scenarios & Examples

- **Scenario 1:** Developer runs `agentic-lib --digest --stats` to simulate a bucket replay and immediately view updated metrics.
- **Scenario 2:** On CI, `agentic-lib --version --verbose-stats` outputs version info and current issue-to-commit conversion statistics.

# Verification & Acceptance

- Unit tests cover metric file initialization, counter increments, and JSON output for `--stats` flag.
- Simulate multiple digest events and verify `.agentic_metrics.json` reflects correct counts.
- Manual test: run CLI with and without flags to confirm metrics print and logging integration.
