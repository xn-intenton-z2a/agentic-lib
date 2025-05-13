# Overview

Unified command-line interface for sandbox utilities, consolidating core agentic-lib workflows into a single CLI tool. Enables project maintenance, documentation enhancements, dependency audits, AWS integrations, automated validation, and interactive examples for workflow diagrams.

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

# Interactive Examples Generation

This command processes mermaid-workflow blocks in README and generates interactive HTML examples:

1. Read sandbox/README.md and identify all code fences labeled mermaid-workflow.
2. Use markdown-it with GitHub plugin to render each block into HTML, wrapped in a container allowing interactive features (zoom, pan).
3. Strip any pre-existing ## Examples section and append a new Examples section containing all generated snippets.
4. Ensure idempotency by replacing the old Examples section rather than appending duplicates.
5. Log warnings if no blocks found and errors if rendering fails.

# Requirements

- Node.js 20 or higher with ESM support.
- Git CLI for repository operations.
- AWS credentials configured for S3/SQS bridge features.
- A free port or HTTP_PORT environment variable for server mode.

# Testing & Verification

Unit tests must:
- Mock filesystem operations to simulate README with and without mermaid-workflow blocks.
- Verify correct extraction of blocks and rendering of HTML snippets.
- Assert proper removal and regeneration of the Examples section.
- Simulate rendering errors to confirm error handling and exit codes.

Integration tests must:
- Use a temporary workspace with a sample README containing mermaid-workflow diagrams.
- Run the CLI with --generate-interactive-examples and inspect the updated README content.
- Validate logs for info, warn, and error paths.
