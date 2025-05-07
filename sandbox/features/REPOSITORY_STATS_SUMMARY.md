# Objective and Scope

Enhance the existing discussion context summarization feature to include a repository stats summarizer that reports code coverage metrics. This unified feature will:

- Generate AI-powered summaries of discussion threads including CI/CD workflow runs, test failures, and detailed error context with stack traces.
- Retrieve and summarize code coverage metrics from coverage reports (e.g., coverage-summary.json or lcov.info) to surface key insights like statements, branches, functions, and lines coverage percentages.
- Provide a single CLI entrypoint to produce a comprehensive summary combining discussion context and code coverage stats.

# Value Proposition

Developers and maintainers gain:

- Consolidated context for issue and pull request discussions, workflow runs, test failures, and stack traces to accelerate diagnosis.
- Clear visibility into code coverage metrics with highlights of files or modules below threshold and trends versus a baseline.
- A unified CLI command that outputs JSON containing discussionSummary, workflowContext, testConsoleSummary, and coverageMetrics sections.

# Requirements

## CLI Integration

- Add new flag:
  - --include-coverage alias --icv to toggle coverage summarization
- Update existing flags for discussion: --include-context, --sanitize-workflows, --include-tests, --include-stack-traces remain unchanged.
- Update function signature:

  ```js
  summarizeRepositoryStats(discussionNumber, includeContext, sanitizeWorkflows, includeTests, includeStackTraces, includeCoverage)
  ```

## Coverage Data Retrieval

- When includeCoverage is true:
  - Locate coverage-summary.json in the project root or a specified coverage directory.
  - Parse coverage-summary.json to extract overall metrics: statements, branches, functions, lines coverage percentages.
  - Optionally read lcov.info to identify specific files with coverage below 80%.
  - Compute delta versus previous coverage baseline if baseline file coverage-baseline.json exists.

## Summary Generation

- Insert a CoverageMetrics section in the JSON output containing:
  - overallCoverage: object with statements, branches, functions, lines percentages
  - lowCoverageFiles: list of file paths where coverage is below threshold
  - coverageDelta: object showing difference versus baseline if available

- Position CoverageMetrics before DiscussionSummary in the JSON output when includeCoverage is true.

## Documentation and README Updates

- Update README.md under a new "Repository Stats" section to document:
  - --include-coverage flag and usage examples
  - Format of CoverageMetrics section in the CLI output
  - Instructions to generate or locate coverage-summary.json

# Logging and Error Handling

- Use logInfo and logError to track:
  - Start and success/failure of coverage file parsing
  - Missing or malformed coverage summary files
- On error parsing coverage data, skip coverage summary and log a warning.

# Verification and Acceptance

- Unit tests mock file system to supply coverage-summary.json and baseline file for tests covering:
  - correct extraction of percentage metrics
  - identification of low coverage files
  - handling of missing or invalid coverage-summary.json
- CLI tests for:
  ```bash
  node src/lib/main.js --summarize-discussion 42 --include-context --include-tests --include-coverage
  ```
  should verify JSON includes coverageMetrics alongside other sections.
- Manual verification ensures README.md contains the "Repository Stats" section with flag documentation and examples.