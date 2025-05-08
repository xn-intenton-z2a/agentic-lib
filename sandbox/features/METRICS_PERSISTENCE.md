# Purpose & Scope

Implement persistent storage and reporting of key workflow metrics directly in the CLI, with customizable console summary formatting options. Track totalIssues and successfulCommits in a local metrics file and expose formatting flags to control the display style of metrics summaries.

# Value Proposition

By making metrics visible, persistent, and customizable, users can:

- Monitor workflow health and conversion rates over time directly in the terminal.
- Choose their preferred summary format (JSON, table, YAML) for better readability or integration with other tools.
- Enable or disable colored output and select themes for improved clarity in different environments.

# Success Criteria & Requirements

1. Metrics Storage
   - On first run, create .agentic_metrics.json in project root with zeroed properties: totalIssues: 0, successfulCommits: 0.
   - When --digest completes successfully, increment successfulCommits and totalIssues by one and persist updates.
   - When CLI is invoked with --stats or --verbose-stats, read the JSON file and calculate conversionRate as successfulCommits / totalIssues.

2. Formatting Options
   - --stats-format <json|table|yaml>: Select output format for metrics summary. Default is json.
   - --stats-theme <light|dark>: Apply light or dark theme for table or colored output. Default is light.
   - --stats-color <true|false>: Enable or disable colored output globally. Default is true when running in TTY.

3. CLI Flag Integration
   - --stats: Print formatted metrics summary according to formatting options and exit.
   - --verbose-stats: When used alongside any other flag, append the formatted metrics summary after the primary command output.
   - Flag precedence: format flags override default; if invalid value provided, display an error and exit with non-zero code.

# Dependencies & Constraints

- Use Node.js fs/promises to read and write .agentic_metrics.json atomically.
- Use chalk for colored output; use js-yaml for YAML conversion; table formatting implemented with simple string alignment.
- Ensure compatibility with Node 20 and ESM standards. No additional dependencies beyond existing ones.
- Tests should mock fs operations and output streams to avoid real file I/O and terminal TTY detection.

# User Scenarios & Examples

Scenario 1: Inspect metrics in table format
  node src/lib/main.js --stats --stats-format table
  =>
    ┌───────────────┬────────┐
    │ Metric        │ Value  │
    ├───────────────┼────────┤
    │ totalIssues   │ 5      │
    │ successfulCommits │ 4  │
    │ conversionRate│ 0.8    │
    └───────────────┴────────┘

Scenario 2: Dump metrics in YAML without colors
  node src/lib/main.js --stats --stats-format yaml --stats-color false
  =>
    totalIssues: 6
    successfulCommits: 5
    conversionRate: 0.8333

Scenario 3: Append colored JSON summary after digest
  node src/lib/main.js --digest --verbose-stats --stats-theme dark
  =>
    Logged digest output
    {
      "totalIssues": 7,
      "successfulCommits": 6,
      "conversionRate": 0.8571
    }

# Verification & Acceptance

- Unit tests validate metrics file creation, increment logic, formatting flags, and error handling for invalid flag values.
- Integration test runs --digest then --stats with different format flags and confirms output structure and formatting.
- Manual CLI test combining flags confirms that summary respects specified format, theme, and color settings.