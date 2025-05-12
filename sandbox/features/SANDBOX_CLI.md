# Sandbox CLI

> See our [Mission Statement](../../MISSION.md)

## Overview

The Sandbox CLI provides a unified command-line and HTTP interface for automating repository maintenance tasks in the sandbox environment. It supports feature validation, example generation, dependency auditing, and more to ensure compliance with the mission of autonomous, agentic workflows.

## Value Proposition

Automates repetitive maintenance operations, enforces project standards, and accelerates development by integrating core quality checks, documentation updates, and remote-triggerable HTTP endpoints into a single, easy-to-use tool.

## Scope

Includes the following commands and modes:

- --generate-interactive-examples: Injects rendered HTML examples into README from mermaid-workflow blocks.
- --fix-features: Prepends mission references to feature markdown files missing them.
- --validate-features: Verifies feature markdown files reference the mission statement.
- --validate-readme: Ensures README contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and the repo URL.
- --features-overview: Generates a markdown summary of all CLI flags under sandbox/docs.
- --audit-dependencies: Runs npm audit with configurable severity threshold.
- --bridge-s3-sqs: Uploads to S3 and dispatches an SQS message for payloads.
- --validate-package: Validates root package.json fields against schema requirements.
- --validate-tests: Checks code coverage metrics meet 80% thresholds.
- --validate-lint: Runs ESLint on source and tests, reporting any violations.
- --validate-license: Confirms LICENSE.md exists and contains a valid SPDX identifier.
- --serve-http: Starts an HTTP server exposing endpoints to trigger any of the above commands remotely.
  - GET /health: Returns 200 OK JSON status.
  - POST /run: Accepts JSON body { command: string, args: string[] } to invoke corresponding CLI processing and returns structured JSON result.

## Requirements

- Node 20+ runtime with ESM support.
- Breadth of file system permissions for sandbox paths: source, tests, docs, features, README.
- Dependencies: markdown-it, markdown-it-github, zod, child_process, fs/promises, http (built-in).

## User Scenarios

1. A maintainer runs `node sandbox/source/main.js --serve-http` and invokes POST /run with `{ command: "--validate-features" }` from an external automation tool.
2. A contributor updates README workflows and regenerates examples via an HTTP request instead of manual CLI invocation.
3. The CI pipeline triggers dependency audits via HTTP hooks to centralize logs in a monitoring dashboard.

## Verification & Acceptance

- Unit tests cover the new --serve-http flag, health check, and POST /run endpoint normal, error, and edge cases in sandbox/tests.
- README usage section demonstrates HTTP endpoint usage with sample cURL commands and outputs.
- Automated CI job starts the HTTP server, runs endpoint tests, and confirms exit codes and log formats.
