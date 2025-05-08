# Purpose & Scope

Enable a unified report of agentic workflow commit metrics and structured test console output summaries

This feature will:
- Instrument key points in the digestLambdaHandler to capture each issue handled and any resulting commit events
- Persist rolling commit conversion metrics in a local file
- Introduce a new CLI flag --summarize-tests that runs vitest with a json reporter, parses the results, and emits a structured summary

# Value Proposition

By providing both commit conversion rates and test suite outcomes in machine readable form, project maintainers can:
- Monitor how many issues processed by agentic workflows yield actual code changes
- Quickly assess test suite health and trends across runs
- Integrate these reports into dashboards or CI pipelines for automated alerts or visualizations

# Success Criteria & Requirements

1. Metrics Collection
   - increment an internal counter when digestLambdaHandler processes an event
   - increment a commit counter whenever a simulated or real commit occurs
2. Persistence
   - store metrics in .agentic_metrics.json at repository root
   - initialize file with zeroed counters if missing
3. CLI Reporting
   - existing flag --stats prints json keys totalIssues, successfulCommits, conversionRate
   - new flag --summarize-tests invokes vitest with json reporter, reads results file, and outputs json with keys totalTests, passed, failed, skipped, durationMs
4. Logging Integration
   - when --verbose-stats is enabled, log both metrics and test summary at end of each CLI run

# Dependencies & Constraints

- vitest must be installed as a dev dependency
- use child_process spawn or execSync to run vitest with reporter json
- file I O may be synchronous to ensure consistency at exit
- remain compatible with Node 20 ESM environment

# User Scenarios & Examples

Scenario 1: Developer runs agentic-lib --digest --stats to simulate a bucket replay and view updated commit metrics

Scenario 2: On CI pipeline, developer runs agentic-lib --summarize-tests to receive a json summary of the full test suite for further processing

# Verification & Acceptance

- unit tests cover metrics file initialization, counter increments, and correct json for --stats flag
- unit or integration tests mock child_process to simulate vitest json output and verify correct parsing and json output for --summarize-tests flag
- manual test: run CLI with both flags and confirm that metrics and test summary are printed as expected