# Overview
Implement a unified validation entrypoint that executes all individual validation and audit routines in sequence, aggregates their results, and reports a consolidated JSON summary.

# CLI Flags
• --validate-all
  - Runs the following routines in order:
    1 Validate sandbox feature files (--validate-features)
    2 Validate sandbox README links (--validate-readme)
    3 Validate package manifest fields (--validate-package)
    4 Validate test coverage metrics (--validate-tests)
    5 Validate linting rules (--validate-lint)
    6 Validate license file (--validate-license)
    7 Audit npm dependencies (--audit-dependencies)
  - For each routine, capture its JSON log output and exit code.
  - Build a final JSON summary object with entries for each routine:
    {
      "validateFeatures": { "status": 0 or 1, "output": <logs> },
      …
      "auditDependencies": { "status": 0 or 1, "output": <logs> }
    }
  - If any routine returns a non-zero status, exit with code 1. Otherwise exit with code 0.

# HTTP API Server
• The existing POST /execute handler will accept { command: "validate-all" } and invoke the same logic, returning the summary JSON on success (HTTP 200) or error details on failure (HTTP 500).