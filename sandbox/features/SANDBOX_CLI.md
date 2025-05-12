# Overview
Provide a single, unified sandbox CLI and HTTP API for validation, maintenance, example generation, auditing, and remote invocation. This feature replaces separate validation entrypoints with one coherent tool that supports both direct CLI usage and an embeddable server mode.

# CLI Flags
• --validate-features
  Ensure every markdown file under sandbox/features includes a mission reference. Logs missing files and fails on any errors.

• --validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the agentic-lib repository URL. Reports missing references and exits with failure.

• --validate-package
  Parse package.json and validate required fields (name, semver version, description, main, scripts.test, engines.node >=20). Emits JSON errors for any invalid or missing fields.

• --validate-tests
  Run tests with coverage, parse coverage-summary.json, and enforce at least 80% on statements, branches, functions, and lines. Logs failures in JSON.

• --validate-lint
  Run ESLint on sandbox/source and sandbox/tests, emit JSON errors on violations.

• --validate-license
  Ensure LICENSE.md exists, is non-empty, and its first non-empty line matches an approved SPDX identifier.

• --audit-dependencies
  Execute npm audit --json with configurable severity threshold (AUDIT_SEVERITY). Report vulnerabilities at or above threshold in JSON.

• --generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow code blocks, render each to HTML with markdown-it and the GitHub plugin, maintain an idempotent ## Examples section, and report updated block count.

• --fix-features
  Inject mission references into sandbox/features markdown files missing one, logging modified filenames.

• --features-overview
  Generate a markdown summary of all CLI flags and write to sandbox/docs/FEATURES_OVERVIEW.md, then log the content.

• --validate-all
  Run all validation and audit routines in sequence (--validate-features, --validate-readme, --validate-package, --validate-tests, --validate-lint, --validate-license, --audit-dependencies). Aggregate outputs into a final JSON summary and exit with overall status.

• --bridge-s3-sqs
  Upload payload to S3 and dispatch an SQS message via s3-sqs-bridge. Requires --bucket and --key, accepts --payload-file or --payload inline, optional --message-attributes.

• --branch-sweeper
  Auto-prune inactive Git branches based on configuration or inline overrides. Support days-inactive, branch-prefix, and dry-run.

# HTTP API Server
When invoked with --serve or HTTP_MODE=server, start an HTTP server on --port (default 3000) with CORS enabled:

GET /health
  Respond with 200 and { status: "ok" }.

POST /execute
  Accept { command: string, args: string[] }, validate against supported flags, invoke corresponding CLI logic, and return logs and exit code in JSON (200 on success, 500 on failure).

GET /metrics
  Maintain in-memory counters for total requests, successes, and failures. Respond with { uptime, totalRequests, successCount, failureCount }.

# Success Criteria
- All CLI flags operate as described and produce JSON logs on stdout or stderr.
- HTTP server mode supports health, execute, and metrics endpoints with correct behavior and status codes.
- Tests cover each flag and end-to-end server responses.

# Dependencies & Constraints
- No new files created or deleted; changes limited to sandbox/source/main.js, sandbox/tests, sandbox/README.md, sandbox/docs, and package.json dependencies.
- Must remain compatible with Node 20, ESM modules, and existing test framework (vitest).
