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

