# Sandbox CLI

> See our [Mission Statement](../../MISSION.md)

## Overview

The Sandbox CLI provides a unified command-line and HTTP interface for automating repository maintenance and sandbox environment tasks. It consolidates feature validation, example generation, dependency auditing, dependency updates, code formatting, and mission compliance into a single tool with both CLI and remote invocation capabilities.

## HTTP API Support

The CLI can run an HTTP server to expose its commands as RESTful endpoints, enabling integration with external automation tools and CI/CD pipelines. It must support:

- **GET /health**
  - Returns HTTP 200 OK with JSON { status: "ok" } to signal service availability.

- **POST /run**
  - Accepts a JSON body { command: string, args?: string[] }.
  - Invokes the corresponding CLI command internally and streams a structured JSON result including level, message, and any command-specific data.
  - Handles invalid commands with HTTP 400 and error details.

## Commands

- `--format-code`
  Formats JavaScript, TypeScript, and Markdown files in sandbox/source/, sandbox/tests/, and sandbox/docs/ using Prettier according to project configuration.

- `--generate-interactive-examples`
  Scans sandbox/README.md for mermaid-workflow fenced code blocks, renders each to interactive HTML, and maintains an idempotent ## Examples section.

- `--fix-features`
  Ensures markdown files in sandbox/features/ include a mission statement reference.

- `--validate-features`
  Verifies all sandbox/features/*.md reference the mission statement.

- `--validate-readme`
  Checks sandbox/README.md for links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repository URL.

- `--audit-dependencies`
  Runs npm audit --json, filters vulnerabilities by AUDIT_SEVERITY, and reports or fails based on threshold.

- `--update-dependencies [--interactive] [--install]`
  Scans root package.json for outdated dependencies using npm-check-updates and updates versions. With --interactive prompts each upgrade; with --install applies changes.

- `--validate-package`
  Validates required fields in package.json meet schema and version constraints.

- `--validate-tests`
  Reads coverage/coverage-summary.json and enforces at least 80% for statements, branches, functions, and lines.

- `--validate-lint`
  Executes ESLint on sandbox/source/ and sandbox/tests/, reporting violations and enforcing zero warnings.

- `--validate-license`
  Ensures LICENSE.md exists and its first non-empty line matches a valid SPDX identifier.

- `--features-overview`
  Generates a markdown summary of all sandbox CLI flags in sandbox/docs/FEATURES_OVERVIEW.md and logs it.

- `--bridge-s3-sqs`
  Uploads payload to S3 and dispatches an SQS message with the object location and optional attributes.

- `--serve-http`
  Starts an HTTP server exposing the above commands via REST API on a configurable port.

## Requirements

- Node 20+ runtime with ESM support.
- Dev dependency: prettier for formatting, npm-check-updates for dependency scanning.
- File system write permissions for sandbox paths: sandbox/source/, sandbox/tests/, sandbox/docs/, and sandbox/features/.
- Dependencies: markdown-it, markdown-it-github, ncu, prettier, child_process, fs/promises, built-in http.

## User Scenarios

1. A maintainer runs format-code to ensure consistent styling across source, tests, and documentation:
   node sandbox/source/main.js --format-code
2. A CI job invokes POST /run with { command: "--format-code" } to integrate formatting into pipelines.

## Verification & Acceptance

- Unit tests cover the --format-code flag by mocking Prettier API and verifying file writes.
- CLI tests ensure formatting command exits with code 0 on success and logs level info messages.
- Documentation in sandbox/README.md and sandbox/docs/USAGE.md includes examples for the --format-code command.
- CI pipeline executes formatting tests, verifies file modifications and exit codes.