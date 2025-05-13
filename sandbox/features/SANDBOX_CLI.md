# Overview

The Sandbox CLI serves as a unified tool for automating repository maintenance and sandbox environment operations in both local and remote contexts. It offers a comprehensive set of commands for formatting, validation, auditing, dependency management, interactive example generation, and more, accessible via CLI flags or RESTful HTTP endpoints.

# HTTP API Endpoints

The CLI can run an embedded HTTP server to expose its commands as a service. Configuration:

• Port: configurable via SANDBOX_PORT environment variable (default 3000)
• Base path: /

Endpoints:

## GET /health
Returns 200 OK with JSON { status: "ok" } to signal service availability.

## POST /run
Accepts JSON { command: string, args?: string[] }.

• Validates that the `command` corresponds to a supported CLI flag (without the leading dashes).
• Invokes the flag internally and streams a JSON response with fields:
  - level: info|warn|error
  - message: human-readable description
  - data: any command-specific details (e.g., updated counts)

Error handling:

• Unknown commands return 400 BAD REQUEST with JSON { level: "error", message: "Unsupported command" }.
• Server errors return 500 INTERNAL SERVER ERROR with error details.

# Commands

All commands support both direct CLI invocation and remote HTTP calls. Flags:

• --format-code
  Formats JavaScript, TypeScript, and Markdown files in sandbox/source, sandbox/tests, sandbox/docs using Prettier.

• --generate-interactive-examples
  Scans sandbox/README.md for mermaid-workflow fenced code blocks, renders interactive HTML snippets, and maintains a single, idempotent ## Examples section.

• --fix-features
  Injects mission statement references into markdown files under sandbox/features missing one.

• --validate-features
  Verifies markdown files in sandbox/features reference the mission statement.

• --validate-readme
  Ensures sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

• --audit-dependencies
  Runs npm audit --json, filters by AUDIT_SEVERITY (env var), and fails if any vulnerabilities meet or exceed threshold.

• --update-dependencies [--interactive] [--install]
  Scans root package.json for outdated dependencies, prompts for upgrades if interactive, updates package.json, and optionally installs.

• --validate-package
  Validates required fields in package.json (name, version, description, main, scripts.test, engines.node >=20).

• --validate-tests
  Reads coverage/coverage-summary.json, enforcing at least 80% for statements, branches, functions, and lines.

• --validate-lint
  Executes ESLint on sandbox/source and sandbox/tests, enforcing zero warnings and errors.

• --validate-license
  Ensures LICENSE.md exists and its first non-empty line matches a valid SPDX identifier.

• --features-overview
  Generates a markdown summary of all sandbox CLI flags in sandbox/docs/FEATURES_OVERVIEW.md and logs the result.

• --bridge-s3-sqs
  Uploads payload to S3 and sends an SQS message with the object location and optional attributes.

• --serve-http
  Starts an HTTP server exposing the above commands via GET /health and POST /run on the configured port.

• --validate-all
  Executes all validation commands in sequence: validate-features, validate-readme, validate-package, validate-tests, validate-lint, validate-license, audit-dependencies. Stops on first failure and returns a consolidated exit code.

# Requirements

• Node 20+ runtime with ESM support.
• Dev dependencies: prettier, npm-check-updates for formatting and dependency scanning.
• Permissions to write sandbox/source, sandbox/tests, sandbox/docs, sandbox/features, and sandbox/README.md.
• Environment variables:
  - AUDIT_SEVERITY: low|moderate|high|critical (default moderate)
  - SANDBOX_PORT: TCP port for HTTP server (default 3000)

# Verification & Acceptance

• Unit tests cover all command flags, including HTTP server endpoints, by mocking underlying operations and validating JSON responses and exit codes.
• Integration tests ensure POST /run correctly routes commands and streams structured logs.
• CI pipeline includes HTTP endpoint health checks and complete validation workflow via both CLI and REST API.