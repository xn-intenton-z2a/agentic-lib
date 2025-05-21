# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-21T22:30:43Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-21T22-30Z

## Maintain Feature at 2025-05-21T22:30:54.613Z

Maintained feature HTTP_SERVER.

Feature spec:

# Purpose
Enhance the CLI to run as an HTTP server exposing health and version endpoints to support real-time monitoring and integration with orchestration tooling.

# Specification

When the CLI is invoked with a new --server flag, the application must:

1. Initialize an Express HTTP server on a configurable port (default 3000).
2. Expose a GET /health endpoint returning JSON with status, uptime, and optional verbose stats if VERBOSE_STATS is enabled.
3. Expose a GET /version endpoint returning JSON with the library version and build timestamp read from package.json.
4. Allow the port to be overridden via an environment variable SERVER_PORT.
5. Log incoming HTTP requests at info level using existing logInfo utility.
6. Gracefully shut down on SIGINT/SIGTERM, logging shutdown events and current callCount.

# Success Criteria & Requirements

- The server starts when --server is passed and does not conflict with existing CLI flags.
- GET /health returns 200 and a body: {"status":"ok","uptime":<seconds>,"callCount":<number>}
- GET /version returns 200 and a body: {"version":"x.y.z","timestamp":"ISO8601"}
- Tests simulate HTTP requests to both endpoints and validate responses and status codes.
- No additional dependencies beyond Express and existing utilities.

# Test Cases & Verification

1. Invoke main with ["--server"] and send HTTP GET /health; expect 200 and correct JSON schema.
2. Send GET /version; expect version matching package.json and valid timestamp.
3. Environment variable override of SERVER_PORT reflected in the listening port.
4. Simulate SIGINT and verify the server closes and logs shutdown.

# Usage Example

CLI mode:

  node src/lib/main.js --server

Then visit http://localhost:3000/health or /version in the browser or curl:

  curl http://localhost:3000/health


Git diff:

```diff
\n\n// New [sandbox/features/HTTP_SERVER.md]:\n# Purpose
Enhance the CLI to run as an HTTP server exposing health and version endpoints to support real-time monitoring and integration with orchestration tooling.

# Specification

When the CLI is invoked with a new --server flag, the application must:

1. Initialize an Express HTTP server on a configurable port (default 3000).
2. Expose a GET /health endpoint returning JSON with status, uptime, and optional verbose stats if VERBOSE_STATS is enabled.
3. Expose a GET /version endpoint returning JSON with the library version and build timestamp read from package.json.
4. Allow the port to be overridden via an environment variable SERVER_PORT.
5. Log incoming HTTP requests at info level using existing logInfo utility.
6. Gracefully shut down on SIGINT/SIGTERM, logging shutdown events and current callCount.

# Success Criteria & Requirements

- The server starts when --server is passed and does not conflict with existing CLI flags.
- GET /health returns 200 and a body: {"status":"ok","uptime":<seconds>,"callCount":<number>}
- GET /version returns 200 and a body: {"version":"x.y.z","timestamp":"ISO8601"}
- Tests simulate HTTP requests to both endpoints and validate responses and status codes.
- No additional dependencies beyond Express and existing utilities.

# Test Cases & Verification

1. Invoke main with ["--server"] and send HTTP GET /health; expect 200 and correct JSON schema.
2. Send GET /version; expect version matching package.json and valid timestamp.
3. Environment variable override of SERVER_PORT reflected in the listening port.
4. Simulate SIGINT and verify the server closes and logs shutdown.

# Usage Example

CLI mode:

  node src/lib/main.js --server

Then visit http://localhost:3000/health or /version in the browser or curl:

  curl http://localhost:3000/health
```

LLM API Usage:

```json
{"prompt_tokens":5902,"completion_tokens":912,"total_tokens":6814,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":448,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-21T22:32:00.610Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1556 with title:

Implement HTTP server mode with /health and /version endpoints

And description:

Overview
--------
Add a new HTTP server mode to the CLI, enabled by the existing --server flag, to support real-time monitoring and integration with orchestration tooling. When invoked with --server, the application should spin up an Express HTTP server exposing both health and version endpoints, complete with logging and graceful shutdown.

Detailed Tasks
--------------
1. Update src/lib/main.js
   - Import and initialize an Express application when --server is passed.
   - Determine port from environment variable SERVER_PORT (fallback to 3000 or a --port flag override).
   - Expose GET /health:
     • Return 200 with JSON { status: 'ok', uptime: <process.uptime()>, callCount: <globalThis.callCount> }.
     • Increment globalThis.callCount on each request.
     • Conditionally include verbose stats when VERBOSE_STATS is true.
   - Expose GET /version:
     • Read version from package.json and timestamp = new Date().toISOString().
     • Return 200 with JSON { version: 'x.y.z', timestamp: 'ISO8601' }.
   - Use existing logInfo() to log every incoming request at info level, including method and URL.
   - Attach handlers for SIGINT and SIGTERM:
     • On shutdown, stop accepting new connections, close the server, log shutdown event with current callCount, then exit process(0).
   - Ensure no conflicts with existing CLI flags and preserve current CLI behavior when --server is absent.

2. Update tests/unit/main.test.js
   - Import supertest and reference the Express app returned by main() in server mode.
   - Write tests to:
     • Launch main(['--server']) on an ephemeral port and verify:
       - GET /health returns 200 and correct JSON schema with status, uptime > 0, callCount starts at 1 after first request.
       - GET /version returns 200 with version matching package.json and a valid ISO8601 timestamp.
     • Override SERVER_PORT in the test environment and verify the server listens on that port.
     • Simulate SIGINT by sending a signal to the running server and assert that:
       - The server closes the socket.
       - logInfo is called with a shutdown message including current callCount.

3. Update sandbox/README.md
   - Document the new --server flag usage.
   - Describe environment variable SERVER_PORT and default port behavior.
   - Show example curl commands for /health and /version.
   - Explain logging behavior and graceful shutdown.
   - Link to MISSION.md and CONTRIBUTING.md.

Verification
------------
- Run `npm test` and ensure all existing tests plus new HTTP server tests pass.
- Start the server manually: `node src/lib/main.js --server` and validate endpoints via curl:
  ```bash
  curl http://localhost:3000/health
  curl http://localhost:3000/version
  ```
- Set SERVER_PORT to a custom port and confirm the server honors it.
- Send SIGINT (Ctrl+C) to the process and observe a clean shutdown log including callCount.

No new files should be created; only modify:
- src/lib/main.js
- tests/unit/main.test.js
- sandbox/README.md
- (optional) package.json to bump version if desired, but no additional dependencies are required beyond Express and Supertest.

LLM API Usage:

```json
{"prompt_tokens":6554,"completion_tokens":1856,"total_tokens":8410,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1088,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-21T22:32:44.671Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

Overview
--------
Enable a new HTTP server mode in the CLI, activated by the --server flag, to support real-time monitoring and integration with orchestration tools. When invoked, the application must start an Express server exposing health and version endpoints, logging incoming requests, and shutting down gracefully on signals.

Acceptance Criteria
-------------------
1. Startup Behavior
   • Running `node src/lib/main.js --server` without additional flags starts an Express HTTP server listening on port 3000 by default.
   • If the environment variable `SERVER_PORT` is set, the server listens on that port instead.
2. GET /health Endpoint
   • Responds with HTTP 200 and JSON body:
     ```json
     {
       "status": "ok",
       "uptime": <number: process.uptime() in seconds>,
       "callCount": <integer: number of requests served>
     }
     ```
   • The first request to /health returns `callCount: 1`, and `callCount` increments by 1 on each subsequent request.
   • If `VERBOSE_STATS` is true, the response includes additional metrics (e.g., memory usage).
3. GET /version Endpoint
   • Responds with HTTP 200 and JSON body:
     ```json
     {
       "version": "<string: version from package.json>",
       "timestamp": "<string: valid ISO8601 timestamp>"
     }
     ```
4. Request Logging
   • Every incoming HTTP request to any endpoint logs a JSON info-level entry via `logInfo()` with at least the fields:
     - `level`: "info"
     - `timestamp`: ISO8601 timestamp
     - `message`: "Incoming request"
     - `method`: HTTP method
     - `url`: request URL
5. Graceful Shutdown
   • On receiving `SIGINT` or `SIGTERM`, the server stops accepting new connections, closes existing ones, logs an info-level shutdown message including the final `callCount`, and exits with code 0.
6. Regression Safety
   • Invoking the CLI without `--server` must preserve existing behavior for `--help`, `--version`, and `--digest` flags.

Implementation Scope
--------------------
- Modify `src/lib/main.js` to detect `--server` and initialize Express.
- Update or add tests in `tests/unit/main.test.js` using Supertest to verify endpoint behavior, environment override, logging, and shutdown.
- Update `sandbox/README.md` to document `--server`, `SERVER_PORT`, example curl commands, logging format, and graceful shutdown instructions.

Verification Steps
------------------
1. Run `npm test` to ensure new tests for /health and /version pass alongside existing tests.
2. Manually launch:
   ```bash
   SERVER_PORT=4000 node src/lib/main.js --server
   curl http://localhost:4000/health
   curl http://localhost:4000/version
   ```
3. Confirm JSON responses meet schema and `callCount` increments.
4. Send Ctrl+C and verify shutdown log and exit code 0.

LLM API Usage:

```json
{"prompt_tokens":7194,"completion_tokens":1687,"total_tokens":8881,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":960,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-21T22:34:55.138Z

fixApplied: false

Add HTTP server mode with health and version endpoints logging and graceful shutdown

Git Diff:

```

```
mainOutput:
```


```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1556 with title: ""]

LLM API Usage:

```json

```
---

