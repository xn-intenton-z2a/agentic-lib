# Sandbox CLI

> See our [Mission Statement](../../MISSION.md)

## Overview
The Sandbox CLI provides a unified command-line interface for automating repository maintenance tasks in the sandbox environment. It supports feature validation, example generation, dependency auditing, and more to ensure compliance with the mission of autonomous, agentic workflows.

## Value Proposition
Automates repetitive maintenance operations, enforces project standards, and accelerates development by integrating core quality checks and documentation updates into a single, easy-to-use CLI tool.

## Scope
Includes the following commands:
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

## Success Criteria
- Each command returns a zero exit code on success and logs a structured JSON info message.
- Failure cases emit JSON error logs and non-zero exit codes.
- Commands are idempotent where applicable (e.g., examples injection, features overview).

## Requirements
- Node 20+ runtime with ESM support.
- Breadth of file system permissions for sandbox paths: source, tests, docs, features, README.
- Dependencies: markdown-it, markdown-it-github, zod, child_process, fs/promises.

## User Scenarios
1. A maintainer runs `--validate-features` in CI to ensure all feature docs reference the mission.
2. A contributor updates README workflows and regenerates examples via `--generate-interactive-examples`.
3. The CI pipeline executes `--audit-dependencies` to block deployments on high-severity vulnerabilities.

## Verification & Acceptance
- Unit tests cover each flag’s normal, error, and edge cases in sandbox/tests.
- README usage section demonstrates each CLI flag with sample commands and outputs.
- Automated CI job runs all flags and confirms exit codes and log formats.
