# Purpose & Scope

Implement persistent storage and reporting of key workflow metrics directly in the CLI. Track totalIssues and successfulCommits in a local metrics file and expose a --stats flag to display those metrics, as well as a --verbose-stats mode to append metrics after any primary command output.

# Value Proposition

By making metrics visible and persistent, users can:

- Monitor automated workflow health and conversion rates over time without leaving the terminal.
- Surface key indicators of workflow performance: how many issues were processed and how many successful commits were made.
- Automate passing of metrics into CI dashboards or further reporting tools.

# Success Criteria & Requirements

1. Metrics Storage
   - On first run, create .agentic_metrics.json in project root with zeroed properties: totalIssues: 0, successfulCommits: 0.
   - When --digest completes successfully, increment successfulCommits and totalIssues by one and persist updates.
   - When CLI is invoked with --stats or --verbose-stats, read the JSON file and calculate conversionRate as successfulCommits / totalIssues.

2. CLI Flags
   - --stats: Print a JSON object with totalIssues, successfulCommits, conversionRate to stdout and exit.
   - --verbose-stats: When used alongside any other flag, append the same JSON metrics object after the primary command output.
   - If metrics file is missing or corrupted, automatically reinitialize it to zeros and warn the user in verbose mode.

# Dependencies & Constraints

- Use Node.js fs/promises to read and write .agentic_metrics.json atomically.
- Ensure compatibility with Node 20 and ESM standards. No new external dependencies beyond built-in modules.
- Tests should mock fs operations to avoid real file I/O.

# User Scenarios & Examples

Scenario 1: Inspect metrics on demand
  node src/lib/main.js --stats
  => { totalIssues: 5, successfulCommits: 4, conversionRate: 0.8 }

Scenario 2: Run digest with appended metrics
  node src/lib/main.js --digest --verbose-stats
  =>  Logged digest output
     { totalIssues: 6, successfulCommits: 5, conversionRate: 0.8333 }

# Verification & Acceptance

- Unit tests validate file creation, increment logic, JSON output and error handling for corrupted metrics file.
- Integration test runs --digest then --stats and confirms persisted values.
- Manual CLI test combining flags confirms metrics display and order of output.