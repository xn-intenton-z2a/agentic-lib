# Overview

Unified CLI interface consolidating sandbox environment utilities and core agentic-lib features into a single command-line tool. Provides maintenance workflows, validation checks, dependency management, AWS integrations, autonomous event handling, HTTP server mode for local event ingestion, and a consolidated status reporting command.

# Commands

• --help
  Show usage instructions and available command-line options.

• --version
  Display current version information and timestamp.

• --digest
  Simulate an AWS SQS event for a digest workflow, invoking the digestLambdaHandler with a sample payload.

• --generate-interactive-examples
  Scan sandbox/README.md for mermaid-workflow blocks and render them into interactive HTML snippets in an idempotent Examples section.

• --fix-features
  Inject mission statement references into markdown files under sandbox/features that lack one.

• --validate-features
  Ensure all markdown files in sandbox/features reference the mission statement, failing on any missing references.

• --validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

• --features-overview
  Generate a FEATURES_OVERVIEW.md summarizing each supported CLI flag with descriptions.

• --audit-dependencies
  Run npm audit with a configurable severity threshold and fail on vulnerabilities at or above that level.

• --bridge-s3-sqs
  Upload payloads to S3 and dispatch an SQS message with the object location and optional message attributes.

• --validate-package
  Parse and validate the root package.json for required fields including name, version, description, main, scripts.test, and engines.node >=20.0.0.

• --validate-tests
  Read coverage/coverage-summary.json and ensure statements, branches, functions, and lines metrics each meet at least 80% coverage.

• --validate-lint
  Run ESLint on sandbox source and tests, reporting any violations and failing on errors or warnings.

• --validate-license
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0).

• --serve-http
  Start a lightweight HTTP server exposing a POST /events endpoint that accepts AWS SQS event payloads and invokes the digestLambdaHandler.

• --status-report
  Run a full project health check by sequentially executing audit-dependencies, validate-lint, validate-tests, validate-package, validate-readme, and validate-features commands. Aggregate results into a single JSON report. Exit with code 0 if all checks pass, or non-zero if any check fails. Supports --output-file <path> to write the report to a file.

# Requirements

Node.js 20 or higher with ESM support. Git CLI for release operations. AWS credentials and region for S3/SQS bridge. Free port for HTTP server (default 3000).

# Verification & Testing

Unit tests should simulate each underlying command flag, mock filesystem and child_process calls, capture JSON logs, and verify status-report aggregates correct pass/fail statuses. Integration tests can invoke the CLI with --status-report and optional --output-file to ensure report structure, exit codes, and file writing behavior are correct.