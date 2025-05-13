# Overview

The Sandbox CLI serves as a unified tool for automating repository maintenance and sandbox environment operations in both local and remote contexts. It provides a comprehensive set of commands for formatting, validation, auditing, dependency management, AWS integration, interactive example generation, and more. Commands can be invoked via CLI flags or exposed via an embedded HTTP server.

# HTTP API Endpoints

Configurations:
• Port: SANDBOX_PORT environment variable (default 3000)
• Base path: /

Endpoints:
GET /health: Returns 200 OK with JSON { status: "ok" }.
POST /run: Accepts JSON { command: string, args?: string[] }, validates the command, invokes it, and streams structured JSON logs with level, message, and optional data.

# Commands

• --format-code
Formats JavaScript, TypeScript, and Markdown files in sandbox/source, sandbox/tests, and sandbox/docs using Prettier. Returns JSON logs with level, message, and a list of formatted files.

• --generate-interactive-examples
Scans sandbox/README.md for mermaid-workflow code blocks, renders interactive HTML snippets, and maintains a single, idempotent ## Examples section.

• --fix-features
Injects mission statement references into markdown files under sandbox/features missing one.

• --validate-features
Ensures markdown files in sandbox/features reference the mission statement (MISSION.md or # Mission).

• --validate-readme
Validates that sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

• --audit-dependencies
Runs npm audit --json, filters by AUDIT_SEVERITY, and fails on vulnerabilities meeting or exceeding the threshold.

• --update-dependencies [--interactive] [--install]
Scans package.json for outdated dependencies, prompts for upgrades if interactive, updates package.json, and optionally installs new versions.

• --validate-package
Validates required fields in package.json: name, version (semver), description, main, scripts.test, engines.node >=20.0.0.

• --validate-tests
Enforces at least 80% coverage for statements, branches, functions, and lines based on coverage-summary.json.

• --validate-lint
Executes ESLint on sandbox/source and sandbox/tests, enforcing zero warnings and errors.

• --validate-license
Ensures LICENSE.md exists and its first non-empty line matches a valid SPDX identifier (MIT, ISC, Apache-2.0, GPL-3.0, etc.).

• --features-overview
Generates a markdown summary of all Sandbox CLI flags and writes to sandbox/docs/FEATURES_OVERVIEW.md.

• --bridge-s3-sqs
Uploads payload to S3 and sends an SQS message with the object location and optional attributes.

• --invoke-lambda
Invokes an AWS Lambda function with configurable function name, payload, and qualifier, streaming JSON logs for each step.

• --serve-http
Starts an HTTP server exposing GET /health and POST /run endpoints.

• --validate-all
Executes all validation commands in sequence and stops on the first failure.

# Requirements

• Node.js 20+ runtime with ESM support.
• Dev dependencies: prettier (for formatting), npm-check-updates (for dependency scanning).
• AWS SDK for JavaScript client-lambda for Lambda invocations.
• Permissions to write sandbox/source, sandbox/tests, sandbox/docs, sandbox/features, and sandbox/README.md.
• Environment variables:
  - AUDIT_SEVERITY: low|moderate|high|critical (default: moderate)
  - AWS_REGION: region for AWS operations
  - SANDBOX_PORT: HTTP server port (default: 3000)

# Verification & Acceptance

• Unit tests cover the --format-code command by mocking Prettier API and validating JSON logs and exit codes.
• Integration tests ensure POST /run correctly routes the format-code command and other flags, returning structured responses.
• CI pipeline includes end-to-end tests for code formatting, HTTP endpoint health checks, and the full validation workflow.