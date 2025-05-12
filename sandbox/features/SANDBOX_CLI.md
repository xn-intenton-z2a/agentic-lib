# Overview
Provide a unified sandbox CLI that bundles validation, maintenance, example generation, auditing, and remote invocation capabilities into a single tool.  It maintains alignment with the mission statement and supports both direct CLI usage and an HTTP server mode for integration into automated workflows.

# CLI Flags
• --validate-features
  Ensure every markdown file under sandbox/features/ includes a mission statement reference.  Log errors (file path) on missing references and exit with status 1, or log success and exit 0.

• --validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, USAGE.md, and the agentic-lib repository URL.  Report missing references as errors and exit 1, or log success and exit 0.

• --validate-package
  Parse package.json and validate required fields (name, semver version, description, main, scripts.test, engines.node >=20).  Emit JSON errors for missing/invalid fields and exit 1, or log success and exit 0.

• --validate-tests
  Run tests with coverage, parse coverage-summary.json, and enforce at least 80% on statements, branches, functions, and lines.  Log JSON errors for failures and exit 1, or log coverage details and exit 0.

• --validate-lint
  Run ESLint against sandbox/source/ and sandbox/tests/, emit JSON errors for violations, or log success and exit 0.

• --validate-license
  Ensure LICENSE.md exists, is non-empty, and its first non-empty line matches an approved SPDX identifier.  Log errors and exit 1 on failure, or success and exit 0.

• --audit-dependencies
  Execute npm audit --json, apply severity threshold (AUDIT_SEVERITY, default moderate), log JSON errors for vulnerabilities at or above threshold, and exit 1 on issues or log success and exit 0.

• --generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow code blocks, render each to HTML with markdown-it and the GitHub plugin, maintain an idempotent ## Examples section, and log updated block count or warnings and exit 0.

• --fix-features
  Inject mission statement references into markdown files under sandbox/features/ that lack one, log modified filenames, and exit 0, or log errors and exit 1 if write fails.

• --features-overview
  Generate a markdown summary of all CLI flags and their descriptions, write to sandbox/docs/FEATURES_OVERVIEW.md, log the overview content, and exit 0 or log errors on write failures and exit 1.

• --bridge-s3-sqs
  Upload payload to S3 and dispatch an SQS message via the s3-sqs-bridge library.  Require --bucket and --key, accept --payload-file or inline --payload, optional --message-attributes, log JSON info on success or errors and exit 1.

• --branch-sweeper
  Auto-prune inactive Git branches based on configuration (.branch-sweeper.json or inline overrides).  Support --days-inactive, --branch-prefix, and --dry-run modes.  Log JSON details for each evaluated branch and summary counts, exit 0 on success or 1 on error.

• --validate-all
  Run all validation and audit flags in sequence, collect per-flag JSON logs, emit a final summary JSON with overall status, and exit 0 if all pass or 1 otherwise.

# HTTP API Server
When invoked with --serve or HTTP_MODE=server, start an HTTP server on --port (default 3000) with CORS enabled:

GET /health
  Respond 200 with { status: 'ok' }.

POST /execute
  Accept { command: string, args: string[] }, validate the command against supported flags, invoke the corresponding CLI handler, capture JSON logs and exit code, respond 200 with success and output logs if code 0, or 500 with error details and logs if non-zero.

GET /metrics
  Maintain in-memory counters for total requests, successes, and failures.  Respond 200 with { uptime, totalRequests, successCount, failureCount } and update counters per request.