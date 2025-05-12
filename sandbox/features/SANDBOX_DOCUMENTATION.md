# SANDBOX CLI Documentation

## Overview
Provide a unified CLI tool in sandbox mode that validates key repository artifacts (documentation, examples, manifest, linting, test coverage, license, dependencies) and enables bridging from S3 to SQS. Additionally, support an HTTP API server for remote workflow invocation and health monitoring.

## --validate-features
 • Ensure every markdown file under `sandbox/features/` contains a reference to the mission statement (`MISSION.md` or `# Mission`).
 • Log errors with file path and exit status 1 if any file is missing a reference.
 • Log info and exit status 0 when all files pass validation.

## --validate-readme
 • Verify `sandbox/README.md` includes links to `MISSION.md`, `CONTRIBUTING.md`, `LICENSE.md`, `sandbox/docs/USAGE.md`, and the agentic-lib repository URL.
 • Report missing or malformed references as errors and exit status 1.
 • Log info and exit status 0 on success.

## --validate-package
 • Parse root `package.json` and confirm required fields:
   - name, version (semver), description, main, scripts.test, engines.node >=20
 • For each missing or invalid field, emit a JSON error and exit status 1.
 • On success log JSON info and exit status 0.

## --validate-tests
 • Execute tests with coverage reporting and parse `coverage/coverage-summary.json`.
 • Ensure statements, branches, functions, and lines coverage are each at least 80%.
 • Log JSON errors for any metric below threshold and exit status 1.
 • On success log JSON info with coverage details and exit status 0.

## --validate-lint
 • Locate ESLint configuration and run ESLint against `sandbox/source/` and `sandbox/tests/`.
 • Parse findings and emit JSON errors for violations (file, line, column, ruleId, message).
 • On zero errors log JSON info and exit status 0.

## --validate-license
 • Read `LICENSE.md`, ensure it exists, is non-empty, and its first non-empty line matches a valid SPDX identifier (`MIT`, `ISC`, `Apache-2.0`, `GPL-3.0`).
 • On failure emit JSON error and exit status 1.
 • On success log JSON info and exit status 0.

## --audit-dependencies
 • Run `npm audit --json` and parse results.
 • Apply a severity threshold from `AUDIT_SEVERITY` (default: moderate).
 • Emit JSON errors for each vulnerability at or above threshold and exit status 1.
 • On no issues log JSON info and exit status 0.

## --bridge-s3-sqs
 • Parse `--bucket`, `--key`, optional `--payload-file` or inline `--payload`, and optional `--message-attributes`.
 • Upload payload to S3 and send an SQS message via the s3-sqs-bridge library.
 • On missing args or AWS errors emit JSON error and exit status 1.
 • On success log JSON info with bucket, key, messageId and exit status 0.

## --serve
 • When invoked with `--serve` flag or `HTTP_MODE=server`, start an HTTP server on the port from `--port` or `PORT` (default 3000).
 • Support CORS by sending `Access-Control-Allow-Origin: *` on all requests.

### GET /health
 • Respond with HTTP 200 and JSON `{ status: 'ok' }`.

### POST /execute
 • Accept JSON body `{ command: string, args: string[] }`.
 • Validate `command` is one of the supported CLI flags: validate-features, validate-readme, validate-package, validate-tests, validate-lint, validate-license, audit-dependencies, bridge-s3-sqs.
 • Invoke the corresponding process function in sandbox CLI and capture its JSON logs and exit code.
 • Respond HTTP 200 with `{ success: true, output: [<JSON log entries>] }` if exit code is 0.
 • Respond HTTP 500 with `{ success: false, error: <error details>, output: [<JSON logs>] }` if exit code is non-zero.
 • Ensure no terminal exit occurs; the server remains running.
