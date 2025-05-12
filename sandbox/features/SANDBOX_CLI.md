# Overview

Extend the unified sandbox CLI and HTTP API to support full lifecycle token management for secure remote invocation.  In addition to generating and validating tokens, provide commands to list active tokens and revoke tokens before they expire.  Retain all existing validation, maintenance, example generation, and auditing commands without change.

# CLI Flags

• --generate-api-token     Create a new API key token with configurable TTL (default 24h).  Logs JSON with token and expiry timestamp.

• --validate-api-token     Validate a supplied API token (--token <value>) against stored secrets, log JSON status and expiry.

• --list-api-tokens        List all active tokens and their expiry timestamps.  Logs JSON array of { token, expiresAt }.

• --revoke-api-token       Revoke a supplied API token (--token <value>), removing it from the store.  Logs JSON indicating success or error.

• --api-token <token>      Global flag or environment variable SANDBOX_API_TOKEN to supply a token for authenticated operations.

# Token Store Persistence

Persist tokens and their TTL in a simple JSON file under sandbox/source/tokens.json.  On each list, validation, or revocation operation, load the file, purge expired tokens, and write updates back.  Ensure read/write operations handle concurrent invocations safely.

# HTTP API Server

When invoked with --serve or HTTP_MODE=server, start an HTTP server on --port (default 3000) with CORS enabled.  All endpoints except /health require a valid Bearer token matching SANDBOX_API_TOKEN or a generated token.

GET /health
  Respond with 200 and { status: "ok" } without authentication.

POST /execute
  As before: require Authorization: Bearer <token>.  Accept { command: string, args: string[] }, execute CLI logic, return { logs, exitCode } in JSON.

GET /metrics
  As before: require Authorization, return { uptime, totalRequests, successCount, failureCount }.

GET /tokens
  Require Authorization.  Return JSON array of { token, expiresAt } representing all active tokens.

DELETE /tokens
  Require Authorization.  Accept JSON { token: string }.  If token exists, remove it and return 204; if not found, return 404 with error JSON.

# Success Criteria

- All existing CLI flags and HTTP endpoints operate unchanged with correct JSON logs.
- New list and revoke CLI flags work and persist state in tokens.json.
- HTTP endpoints GET /tokens and DELETE /tokens enforce authentication, return expected codes and JSON.
- Tests cover listing tokens, revoking valid and invalid tokens, expired token purge, and endpoint behavior.

# Dependencies & Constraints

- No new files beyond sandbox/source/main.js, sandbox/source/tokens.json, sandbox/tests, sandbox/docs, and sandbox/README.md.
- Use fs/promises for token store operations.
- Remain compatible with Node 20 ESM and existing sandbox constraints.