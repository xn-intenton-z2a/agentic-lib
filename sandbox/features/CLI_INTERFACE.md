# Overview

The CLI_INTERFACE feature unifies sandbox utilities into a single command-line tool, enabling local event simulation, project validation, documentation generation, dependency audits, AWS integrations, HTTP service hosting, and environment configuration checks. It centralizes core workflows to streamline development and maintenance in sandbox mode, ensuring consistent behavior across automated and manual operations.

# Commands

--help
  Show usage instructions and available command-line options.

--version
  Display current version information and timestamp.

--digest
  Simulate an AWS SQS event for the digest workflow, invoking digestLambdaHandler with a sample payload.

--env-check
  Validate environment variables against the defined configuration schema. List any missing required variables or any extraneous variables. On missing variables, log a JSON report with level "error" and exit with code 1. On extra variables, log a JSON warning. On success, log a JSON info message summarizing the validated variables.

--generate-interactive-examples
  Scan the sandbox README for mermaid-workflow code blocks and render each block into interactive HTML snippets. Maintain or update an idempotent Examples section in README with embedded interactive examples for workflow diagrams.

--fix-features
  Inject mission statement references into feature markdown files missing one under sandbox/features.

--validate-features
  Ensure every markdown file in sandbox/features references the mission statement, failing on any missing references.

--validate-readme
  Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

--features-overview
  Generate a FEATURES_OVERVIEW.md that summarizes each supported CLI option with descriptions in a markdown table.

--audit-dependencies
  Run npm audit with a configurable severity threshold, failing on vulnerabilities at or above that level.

--bridge-s3-sqs
  Upload payloads to S3 and dispatch an SQS message containing the object location and optional message attributes.

--validate-package
  Parse and validate package.json for required fields: name, version, description, main entry point, test script, and Node engine version >= 20.

--validate-tests
  Read coverage/coverage-summary.json and ensure coverage metrics meet minimum thresholds: statements, branches, functions, and lines each at least 80%.

--validate-lint
  Run ESLint on source and test code, reporting any violations and failing on errors or warnings.

--validate-license
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier.

--serve-http
  Start an HTTP server exposing two endpoints:
    - POST /events: Accept a JSON body, forward it to digestLambdaHandler for processing, and respond with status 200 and a JSON summary. On invalid JSON, respond with status 400 and error details.
    - GET /health: Return status 200 with a JSON payload { status: "ok" } indicating service availability.
  Support graceful shutdown on SIGINT and SIGTERM, ensuring in-flight requests complete before exit.

--status-report
  Perform a full project health check by running audit-dependencies, validate-lint, validate-tests, validate-package, validate-readme, validate-features, and env-check. Aggregate results into a single JSON report with optional --output-file to write to disk. Exit with code 0 if all checks pass, or code 1 if any fail.

--generate-openapi
  Analyze the HTTP server handler definitions and generate an OpenAPI v3 specification. By default write openapi.json to sandbox/docs/, or to a path specified by --output-file. Ensure idempotent generation and validate the spec before writing.

--generate-badges
  Generate project status badges for coverage, lint, dependency audit, feature validation, environment check, and version. Read coverage summary, lint results, audit output, validation statuses, and env-check logs. Construct shield.io badge markdown and insert or update a Badges section in the README or specified documentation file.

# Requirements

Node.js 20 or higher. File system write permissions for sandbox/README.md and sandbox/docs/. Network permissions for HTTP binding on the configured port.

# Testing & Verification

Unit tests should cover:
- Env-check flag behavior: missing/extra variables, success path
- Status-report aggregation logic with mocked flags
- Serve-http endpoints for /health and /events
- Logging structure for the new commands

Integration tests should simulate CLI invocation for --env-check and --status-report, and confirm exit codes and JSON output.
