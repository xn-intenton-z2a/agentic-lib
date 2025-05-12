# Overview
Extend the unified sandbox CLI and HTTP API to support API key based authentication for secure remote invocation, while retaining all existing validation, maintenance, example generation, and auditing commands. Provide commands to generate and validate tokens and enforce token checks on all protected endpoints.

# CLI Flags
• --generate-interactive-examples  Scan sandbox/README.md for mermaid-workflow blocks and render interactive HTML Examples section.

• --fix-features                  Inject mission statement references into sandbox/features markdown files missing one.

• --validate-features             Ensure sandbox/features markdown files reference the mission statement, fail on missing.

• --validate-readme               Verify sandbox/README.md contains links to MISSION.md, CONTRIBUTING.md, LICENSE.md, and repository URL.

• --validate-package              Parse and validate package.json for required fields (name, version semver, description, main, scripts.test, engines.node >=20). Emit JSON errors.

• --validate-tests                Run coverage summary check, enforce at least 80% for statements, branches, functions, and lines.

• --validate-lint                 Run ESLint on sandbox/source and sandbox/tests, report JSON errors on violations.

• --validate-license              Ensure LICENSE.md exists, non-empty, and first non-empty line matches approved SPDX identifier.

• --audit-dependencies            Run npm audit --json, enforce severity threshold from AUDIT_SEVERITY, report JSON errors for vulnerabilities.

• --features-overview             Generate a markdown summary of all CLI flags to sandbox/docs/FEATURES_OVERVIEW.md, log JSON info.

• --validate-all                  Run all validation and audit routines in sequence and emit a final JSON summary.

• --bridge-s3-sqs                 Upload payload to S3 and send SQS message with given bucket, key, payload, and optional attributes.

• --branch-sweeper                Auto-prune inactive Git branches based on configuration or inline overrides.

• --generate-api-token            Create a new API key token with configurable TTL (default 24h). Logs JSON with token and expiry timestamp.

• --validate-api-token            Validate a supplied API token (--token <value>) against stored secrets, log JSON status and expiry.

• --api-token <token>             Global flag or environment variable SANDBOX_API_TOKEN to supply a token for authenticated operations.

# HTTP API Server
When invoked with --serve or HTTP_MODE=server, start an HTTP server on --port (default 3000) with CORS enabled. All endpoints except /health require a valid Bearer token matching SANDBOX_API_TOKEN or generated tokens store:

GET /health
  Respond with 200 and { status: "ok" } without authentication.

POST /execute
  Require Authorization: Bearer <token>. Accept { command: string, args: string[] }. Validate flag support, run corresponding CLI logic, return { logs, exitCode } in JSON. Return 401 if token missing or invalid.

GET /metrics
  Require Authorization: Bearer <token>. Return { uptime, totalRequests, successCount, failureCount } from in-memory counters. Increment counters per request.

# Success Criteria
- All existing CLI flags operate unchanged and produce correct JSON logs.
- New token management flags generate and validate tokens correctly, with TTL enforcement.
- HTTP endpoints enforce authentication on protected routes, returning 401 on missing or invalid token.
- Health endpoint remains open for basic liveness checks.
- Tests cover token generation, validation, missing or invalid token scenarios, and protected endpoint behavior.

# Dependencies & Constraints
- No new files created or deleted; changes limited to sandbox/source/main.js, sandbox/tests, sandbox/README.md, sandbox/docs, and package.json dependencies.
- Store tokens in-memory or simple JSON file under sandbox/source for TTL management; no external database.
- Remain compatible with Node 20 ESM, vitest tests, and existing sandbox mode constraints.
