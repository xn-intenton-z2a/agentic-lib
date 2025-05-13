# Overview

Unified command-line interface for sandbox utilities, consolidating core agentic-lib workflows into a single CLI tool. Enables project maintenance, documentation enhancements, dependency audits, AWS integrations, automated validation, interactive examples for workflow diagrams, HTTP event ingestion, status reporting, and OpenAPI specification generation.

# Commands

--help
  Show usage instructions and available command-line options.

--version
  Display current version information and timestamp.

--digest
  Simulate an AWS SQS event for the digest workflow, invoking the digestLambdaHandler with a sample payload.

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
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier (MIT, ISC, Apache-2.0, or GPL-3.0).

--serve-http
  Start an HTTP server exposing endpoints for local event ingestion (POST /events) and health checks (GET /health), with graceful shutdown handling.

--status-report
  Perform a full project health check by running audit-dependencies, validate-lint, validate-tests, validate-package, validate-readme, and validate-features. Aggregate results into a JSON report with optional --output-file to write to disk.

--generate-openapi
  Analyze the HTTP server handler definitions and generate an OpenAPI v3 specification. By default write openapi.json to sandbox/docs/, or to a path specified by --output-file. Ensure idempotent generation and validate the spec before writing.

# OpenAPI Specification Generation

This command inspects the internal mapping of HTTP endpoints and constructs a compliant OpenAPI v3 document.

1. Read the definitions for POST /events and GET /health from the serve-http implementation.
2. Compose an OpenAPI document with paths, request and response schemas, content types, and operation identifiers.
3. Allow overriding the output path via --output-file <path>. Default path is sandbox/docs/openapi.json.
4. Validate the generated document structure. Fail with error if validation fails.
5. Overwrite existing spec file to maintain idempotency.
6. Log info on success with number of endpoints described and output path.

# Requirements

- Node.js 20 or higher with ESM support.
- JSON schema validation library available or use built-in checks.
- File system write permissions for sandbox/docs/.

# Testing & Verification

Unit tests must:
- Mock the serve-http handler definitions and verify correct extraction of endpoints.
- Simulate generation with default and custom output paths and assert file writing calls with valid JSON content.
- Verify idempotent behavior by running twice without changes to inputs.
- Simulate specification validation failures and assert proper error logging and exit codes.

Integration tests must:
- Spin up the CLI with --serve-http in test mode to expose endpoint definitions.
- Run CLI with --generate-openapi and inspect sandbox/docs/openapi.json for valid OpenAPI structure.
- Validate logs for info and error paths.
