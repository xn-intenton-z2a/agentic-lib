# Sandbox CLI

> See our [Mission Statement](../../MISSION.md)

## Overview

The Sandbox CLI provides a unified command-line and HTTP interface for automating repository maintenance and sandbox environment tasks. It consolidates feature validation, example generation, dependency auditing, dependency updates, and mission compliance into a single tool with both CLI and remote invocation capabilities.

## HTTP API Support

The CLI can run an HTTP server to expose its commands as RESTful endpoints, enabling integration with external automation tools and CI/CD pipelines. It must support:

- **GET /health**
  - Returns HTTP 200 OK with JSON `{ status: "ok" }` to signal service availability.

- **POST /run**
  - Accepts a JSON body `{ command: string, args?: string[] }`.
  - Invokes the corresponding CLI command internally and streams a structured JSON result including `level`, `message`, and any command-specific data.
  - Handles invalid commands with HTTP 400 and error details.

## Commands

- `--generate-interactive-examples`
  Scans `sandbox/README.md` for ```mermaid-workflow``` blocks, renders each to interactive HTML, and maintains an idempotent `## Examples` section.

- `--fix-features`
  Ensures markdown files in `sandbox/features/` include a mission reference, prepending one to those missing it.

- `--validate-features`
  Verifies all `sandbox/features/*.md` reference the mission statement.

- `--validate-readme`
  Checks `sandbox/README.md` for links to `MISSION.md`, `CONTRIBUTING.md`, `LICENSE.md`, and the repository URL.

- `--audit-dependencies`
  Runs `npm audit --json`, filters vulnerabilities by `AUDIT_SEVERITY`, and reports or fails based on threshold.

- `--update-dependencies [--interactive] [--install]`
  Scans the root `package.json` for outdated dependencies using npm-check-updates, updates dependency versions in `package.json`. With `--interactive`, prompts the user to confirm each upgrade. With `--install`, runs `npm install` after updating to apply changes.

- `--validate-package`
  Validates required fields in `package.json` meet schema and version constraints.

- `--validate-tests`
  Reads `coverage/coverage-summary.json` and enforces at least 80% for statements, branches, functions, and lines.

- `--validate-lint`
  Executes ESLint on source and tests, reporting violations and enforcing zero warnings.

- `--validate-license`
  Ensures `LICENSE.md` exists and its first non-empty line matches a valid SPDX identifier.

- `--serve-http`
  Starts an HTTP server exposing the above commands via REST API on a configurable port.

## Requirements

- Node 20+ runtime with ESM support.
- Dev dependency: `npm-check-updates` for scanning and updating dependencies.
- File system write permissions for sandbox paths: `sandbox/source/`, `sandbox/tests/`, `sandbox/docs/`, and `sandbox/features/`.
- Dependencies: `markdown-it`, `markdown-it-github`, `ncu` (npm-check-updates), `child_process`, `fs/promises`, built-in `http`.

## User Scenarios

1. A CI job invokes `POST /run` at `http://localhost:3000/run` with `{ command: "--audit-dependencies" }` to centralize audit logs.
2. A maintainer uses `GET /health` to verify the CLI service is available before triggering automated workflows.
3. A contributor triggers `POST /run` with `{ command: "--generate-interactive-examples" }` to update examples without a local CLI install.
4. A maintainer runs `node sandbox/source/main.js --update-dependencies --install` to automatically bump dependency versions in `package.json` and install them in one step.

## Verification & Acceptance

- Unit tests cover the `--update-dependencies` flag for interactive and install modes, ensuring correct prompts and final state.
- CLI tests ensure each existing flag behavior remains unchanged under direct invocation.
- Documentation in `sandbox/README.md` and `sandbox/docs/USAGE.md` includes examples for the `--update-dependencies` command.
- CI pipeline executes update-dependencies tests and verifies correct `package.json` updates, installation behavior, and exit codes.
