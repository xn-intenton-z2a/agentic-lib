# Overview

Unified command-line interface for sandbox utilities, consolidating core agentic-lib workflows into a single CLI tool. Enables project maintenance, documentation enhancements, dependency audits, AWS integrations, automated validation, interactive examples for workflow diagrams, HTTP event ingestion, status reporting, OpenAPI specification generation, and automated badge generation for project health indicators.

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
  Confirm LICENSE.md exists and its first non-empty line begins with a valid SPDX identifier.

--serve-http  
  Start an HTTP server exposing endpoints for local event ingestion (POST /events) and health checks (GET /health), with graceful shutdown handling.

--status-report  
  Perform a full project health check by running audit-dependencies, validate-lint, validate-tests, validate-package, validate-readme, and validate-features. Aggregate results into a JSON report with optional --output-file to write to disk.

--generate-openapi  
  Analyze the HTTP server handler definitions and generate an OpenAPI v3 specification. By default write openapi.json to sandbox/docs/, or to a path specified by --output-file. Ensure idempotent generation and validate the spec before writing.

--generate-badges  
  Generate project status badges for coverage, lint, dependency audit, feature validation, and version. Read coverage summary, lint results, audit output, and validation statuses. Construct shield.io badge markdown and insert or update a Badges section in the README or specified documentation file.

# Badge Generation

Read coverage metrics, lint and audit results, and validation statuses. Build badge image URLs using shield.io conventions. Update a dedicated Badges section in sandbox/README.md or an alternate documentation file. Ensure idempotent updates that replace existing badges without altering other content.

# Requirements

Node.js 20 or higher. Access to shield.io badge generation URLs. File system write permissions for sandbox/README.md or target documentation files.

# Testing & Verification

Unit tests must mock badge URL generation, supply sample coverage, lint, and audit inputs, and verify that README updates contain the expected badge markdown. Integration tests should run the CLI with --generate-badges, inspect the README for valid shield.io badge links, and confirm idempotent behavior when run multiple times.