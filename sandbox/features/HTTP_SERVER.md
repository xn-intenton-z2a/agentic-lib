# HTTP Server Mode

## Overview

Add an HTTP server layer using Express to enable remote invocation of key library operations through REST endpoints. This feature allows users to start a lightweight web service that exposes existing functionality such as digest processing and version reporting, making it easier to integrate with external systems and webhooks.

## Scope & Purpose

- Introduce a new CLI flag `--serve` to launch the HTTP server.
- Support GET `/version` endpoint returning version and timestamp.
- Support POST `/digest` endpoint accepting a JSON payload and invoking the existing `digestLambdaHandler`, returning batch item failures.
- Maintain backward compatibility with existing CLI flags.

## Success Criteria & Requirements

- HTTP server listens on port defined by `PORT` environment variable or defaults to `3000`.
- GET `/version` returns JSON with `version` (from package.json) and `timestamp`.
- POST `/digest` accepts a JSON body, invokes `digestLambdaHandler`, and returns JSON with `batchItemFailures` and handler name.
- Error responses return appropriate HTTP status codes and JSON error message.
- Server logs requests and errors using existing `logInfo` and `logError` utilities.
- Tests cover each endpoint using Supertest.

## Implementation Details

1. Add Express dependency (already present) to the main source file.
2. In main execution flow, detect `--serve` flag and start Express app instead of CLI output.
3. Mount routes:
   - `app.get('/version', async (req, res) => { ... });`
   - `app.post('/digest', async (req, res) => { ... });`
4. Use built-in JSON body parsing middleware.
5. Log incoming requests details and outgoing responses.

## Testing & Verification

- Create new Supertest-based tests under `tests/unit/`:
  - Verify `GET /version` returns correct shape and status 200.
  - Verify `POST /digest` with valid payload returns batch item failures array.
  - Simulate invalid JSON or missing body to confirm error status and message.
- Ensure CLI `--serve` flag triggers server startup without errors in local testing.

## Documentation Updates

- Update README to include HTTP Server Mode section:
  - Usage examples for `npm run start:http` and direct `node src/lib/main.js --serve`.
  - API reference for `/version` and `/digest` endpoints.
