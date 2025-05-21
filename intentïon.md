# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-21T23:10:07Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-21T23-09Z

## Maintain Feature at 2025-05-21T23:10:20.195Z

Maintained feature HTTP_SERVER.

Feature spec:

# HTTP SERVER

## Objective

Extend the library with an HTTP server that exposes a POST /digest endpoint. Incoming JSON payloads are forwarded to the existing digestLambdaHandler. This allows external systems or HTTP clients to push digest messages without requiring AWS SQS or CLI invocation.

## Value Proposition

- Provides a lightweight HTTP API for digest handling alongside the CLI and SQS integrations.
- Simplifies testing and local development by using express instead of mocking SQS events.
- Broadens adoption scenarios by allowing any service that can send HTTP POST requests to interact with agentic-lib.

## Requirements & Design

- Add express as an imported dependency and initialize an express application.
- Read PORT from environment or default to 3000.
- Parse incoming requests as JSON and validate that the body matches a simple object schema (object with any fields).
- On POST /digest, call createSQSEventFromDigest on the received JSON, then await digestLambdaHandler with that event.
- Respond with status 200 and JSON body containing batchItemFailures returned by digestLambdaHandler.
- Log request receipt and response using logInfo and logError.
- Only start the HTTP server when the process is launched with a new CLI flag --http or environment variable RUN_HTTP set to true.

## User Scenarios

- A developer runs `node src/lib/main.js --http`. The server starts on port 3000. A curl POST to /digest with a JSON payload returns batch failures if parsing fails or an empty list on success.
- In CI or local testing, supertest can send valid and invalid payloads to confirm correct status codes and failure payloads.

## Verification & Acceptance Criteria

- Unit tests using supertest cover at least:
  - Successful POST with valid JSON returns 200 and an array in property batchItemFailures.
  - POST with invalid JSON returns a 400 with an error message.
  - Server does not start when --http flag or RUN_HTTP is absent.
- README updated with HTTP server usage, examples, and instructions.
- package.json dependencies updated to include express (already present) and supertest tests referenced in test scripts.

Git diff:

```diff
\n\n// New [sandbox/features/HTTP_SERVER.md]:\n# HTTP SERVER

## Objective

Extend the library with an HTTP server that exposes a POST /digest endpoint. Incoming JSON payloads are forwarded to the existing digestLambdaHandler. This allows external systems or HTTP clients to push digest messages without requiring AWS SQS or CLI invocation.

## Value Proposition

- Provides a lightweight HTTP API for digest handling alongside the CLI and SQS integrations.
- Simplifies testing and local development by using express instead of mocking SQS events.
- Broadens adoption scenarios by allowing any service that can send HTTP POST requests to interact with agentic-lib.

## Requirements & Design

- Add express as an imported dependency and initialize an express application.
- Read PORT from environment or default to 3000.
- Parse incoming requests as JSON and validate that the body matches a simple object schema (object with any fields).
- On POST /digest, call createSQSEventFromDigest on the received JSON, then await digestLambdaHandler with that event.
- Respond with status 200 and JSON body containing batchItemFailures returned by digestLambdaHandler.
- Log request receipt and response using logInfo and logError.
- Only start the HTTP server when the process is launched with a new CLI flag --http or environment variable RUN_HTTP set to true.

## User Scenarios

- A developer runs `node src/lib/main.js --http`. The server starts on port 3000. A curl POST to /digest with a JSON payload returns batch failures if parsing fails or an empty list on success.
- In CI or local testing, supertest can send valid and invalid payloads to confirm correct status codes and failure payloads.

## Verification & Acceptance Criteria

- Unit tests using supertest cover at least:
  - Successful POST with valid JSON returns 200 and an array in property batchItemFailures.
  - POST with invalid JSON returns a 400 with an error message.
  - Server does not start when --http flag or RUN_HTTP is absent.
- README updated with HTTP server usage, examples, and instructions.
- package.json dependencies updated to include express (already present) and supertest tests referenced in test scripts.
```

LLM API Usage:

```json
{"prompt_tokens":5926,"completion_tokens":1133,"total_tokens":7059,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-21T23:11:20.453Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1558 with title:

Add Express-based HTTP Server with POST /digest Endpoint

And description:

Overview:

Implement an embeddable HTTP server in `src/lib/main.js` that exposes a POST `/digest` endpoint. Incoming JSON payloads should be converted into SQS-style events and passed to the existing `digestLambdaHandler`. This provides a lightweight HTTP API for digest handling alongside the CLI and SQS integrations.

Scope of Changes:

1. src/lib/main.js
   - Import and initialize an Express app.
   - Read `PORT` from environment (default `3000`).
   - Add a new CLI flag `--http` (and respect `RUN_HTTP=true`) to start the server; do not start by default.
   - Register middleware to parse JSON bodies.
   - Define POST `/digest`:
     • Validate request body is a JSON object.
     • Call `createSQSEventFromDigest(body)` and invoke `await digestLambdaHandler(event)`.
     • On success: respond `200` with `{ batchItemFailures }`.
     • On invalid JSON or handler errors: respond `400` with `{ error: string }`.
     • Use `logInfo`/`logError` for request and error logging.

2. sandbox/tests/http-server.test.js
   - Use Supertest to spin up the server via `node src/lib/main.js --http` import or by exporting an `app` instance for testing.
   - Test cases:
     • Server does not start without `--http` (connection refused or similar behavior).
     • Successful POST `/digest` with valid JSON returns `200` and an array `batchItemFailures`.
     • POST `/digest` with invalid JSON returns `400` and an error message.
   - Cleanly start and stop the server in tests.

3. sandbox/README.md
   - Document how to start the HTTP server (`node src/lib/main.js --http` or `RUN_HTTP=true`).
   - Show example `curl` commands for valid and invalid POST `/digest` requests.
   - Describe response format and error handling.

Acceptance Criteria:

- `npm test` passes all existing and new tests.
- Running `node src/lib/main.js --http` starts the server on the configured port.
- A POST to `/digest` with a valid JSON object returns `{ batchItemFailures: [] }`.
- Invalid payloads return `400` with an error description.
- No modifications to files outside of `src/lib/main.js`, `sandbox/tests/http-server.test.js`, and `sandbox/README.md`.  

Please provide updated file contents for all modified files in one LLM invocation.

LLM API Usage:

```json
{"prompt_tokens":6617,"completion_tokens":1173,"total_tokens":7790,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":576,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-21T23:12:07.385Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

Overview:
Implement an embeddable HTTP server in `src/lib/main.js` that exposes a POST `/digest` endpoint. Incoming JSON payloads will be transformed into SQS-style events and passed to the existing `digestLambdaHandler`, providing a lightweight HTTP API for digest handling in addition to CLI and SQS integrations.

Requirements & Scope:
1. In `src/lib/main.js`:
   - Import and initialize an Express application.
   - Read server port from environment variable `PORT` (default `3000`).
   - Introduce a new CLI flag `--http` and respect environment variable `RUN_HTTP=true` to start the HTTP server. The server must not start by default.
   - Apply JSON body-parsing middleware and validate that the request body is an object.
   - Define POST `/digest` route:
     • Convert the request body into an SQS event via `createSQSEventFromDigest(body)`.
     • Invoke `await digestLambdaHandler(event)`.
     • On successful handling, respond with HTTP 200 and JSON `{ batchItemFailures: [...] }`.
     • On JSON parsing errors or handler failures, respond with HTTP 400 and JSON `{ error: string }`.
     • Log incoming requests and errors using `logInfo` and `logError`.

2. In `sandbox/tests/http-server.test.js`:
   - Use Supertest to import or spin up the Express `app` (exported for testing) when run with `--http` or `RUN_HTTP=true`.
   - Test scenarios:
     a. No server: running without `--http` and without `RUN_HTTP` must refuse connections on default port.
     b. Startup: running with `--http` or `RUN_HTTP=true` starts server on specified port.
     c. Valid payload: POST `/digest` with a well-formed JSON object returns HTTP 200 with body `{ batchItemFailures: [] }`.
     d. Invalid payload: POST `/digest` with malformed JSON or non-object body returns HTTP 400 with `{ error: <message> }`.
   - Ensure clean startup and shutdown of server between tests.

3. In `sandbox/README.md`:
   - Document how to start the HTTP server (`node src/lib/main.js --http` or `RUN_HTTP=true node ...`).
   - Provide example `curl` commands for valid and invalid POST `/digest` requests.
   - Describe expected JSON response formats for success and error cases.

Acceptance Criteria (Testable):
1. Running `node src/lib/main.js` without `--http` or `RUN_HTTP` does not listen on port 3000 (connection refused).
2. Running `node src/lib/main.js --http` or `RUN_HTTP=true node src/lib/main.js` starts the server on the configured port (default 3000). A health check (e.g., GET `/`) may return 404 or usage instructions.
3. POST `/digest` with a valid JSON object returns HTTP 200 and a JSON body containing a `batchItemFailures` array (empty or with entries on failure).
4. POST `/digest` with invalid JSON returns HTTP 400 and a JSON error message.
5. All new and existing tests (`npm test`) pass, including Supertest coverage for the HTTP server.
6. Logs produced by successful and failed requests use `logInfo` and `logError` appropriately.
7. Documentation in `sandbox/README.md` is updated with clear usage instructions and examples.

No files outside `src/lib/main.js`, `sandbox/tests/http-server.test.js`, and `sandbox/README.md` should be modified.

LLM API Usage:

```json
{"prompt_tokens":7092,"completion_tokens":1465,"total_tokens":8557,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-21T23:14:56.911Z

fixApplied: true

Add Express HTTP server support with POST digest endpoint and related tests and documentation

Git Diff:

```
\n\n// New [sandbox/README.md]:\n# agentic-lib HTTP Server

This HTTP API provides a lightweight endpoint for digest processing alongside the existing CLI and AWS Lambda integrations.

## Starting the Server

You can start the HTTP server with the `/digest` endpoint by either passing the `--http` flag to the CLI or setting the `RUN_HTTP` environment variable:

```bash
# Default port 3000
node sandbox/source/main.js --http

# Or using environment variable
RUN_HTTP=true node sandbox/source/main.js

# To use a custom port
PORT=4000 node sandbox/source/main.js --http
```

Once started, the server listens on the specified port and exposes the following endpoint:

### POST /digest

Accepts a JSON object representing a digest and returns the result of the `digestLambdaHandler` in SQS batch format.

#### Request

- Method: `POST`
- URL: `http://localhost:3000/digest`
- Headers: `Content-Type: application/json`
- Body: Any JSON object, for example:

  ```json
  {
    "key": "events/1.json",
    "value": "12345",
    "lastModified": "2025-01-01T00:00:00Z"
  }
  ```

#### Successful Response

- Status: `200 OK`
- Body:
  ```json
  {
    "batchItemFailures": []
  }
  ```

#### Error Responses

- Invalid JSON Payload:
  - Status: `400 Bad Request`
  - Body:
    ```json
    { "error": "Invalid JSON payload" }
    ```

- Non-Object JSON Body:
  - Status: `400 Bad Request`
  - Body:
    ```json
    { "error": "Invalid request body, expected JSON object" }
    ```

- Handler Error:
  - Status: `400 Bad Request`
  - Body:
    ```json
    { "error": "Error handling digest: <message>" }
    ```

## Examples

```bash
curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d '{"key":"events/1.json","value":"12345","lastModified":"2025-01-01T00:00:00Z"}'

# Response:
# { "batchItemFailures": [] }

curl -X POST http://localhost:3000/digest \
  -H "Content-Type: application/json" \
  -d 'not a json'

# Response:
# { "error": "Invalid JSON payload" }
```\n\n// New [sandbox/source/main.js]:\n#!/usr/bin/env node
// sandbox/source/main.js

// Initialize global callCount to support test mocks that reference it
if (typeof globalThis.callCount === "undefined") {
  globalThis.callCount = 0;
}

import { fileURLToPath } from "url";
import { z } from "zod";
import dotenv from "dotenv";
import express from "express";

// ---------------------------------------------------------------------------------------------------------------------
// Environment configuration from .env file or environment variables or test values.
// ---------------------------------------------------------------------------------------------------------------------

dotenv.config();

if (process.env.VITEST || process.env.NODE_ENV === "development") {
  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || "https://api.github.com.test/";
  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
}

const configSchema = z.object({
  GITHUB_API_BASE_URL: z.string().optional(),
  OPENAI_API_KEY: z.string().optional(),
});

export const config = configSchema.parse(process.env);

// Global verbose mode flag
const VERBOSE_MODE = false;
// Global verbose stats flag
const VERBOSE_STATS = false;

// Helper function to format log entries
function formatLogEntry(level, message, additionalData = {}) {
  return {
    level,
    timestamp: new Date().toISOString(),
    message,
    ...additionalData,
  };
}

export function logConfig() {
  const logObj = formatLogEntry("info", "Configuration loaded", {
    config: {
      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
      OPENAI_API_KEY: config.OPENAI_API_KEY,
    },
  });
  console.log(JSON.stringify(logObj));
}
logConfig();

// ---------------------------------------------------------------------------------------------------------------------
// Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function logInfo(message) {
  const additionalData = VERBOSE_MODE ? { verbose: true } : {};
  const logObj = formatLogEntry("info", message, additionalData);
  console.log(JSON.stringify(logObj));
}

export function logError(message, error) {
  const additionalData = { error: error ? error.toString() : undefined };
  if (VERBOSE_MODE && error && error.stack) {
    additionalData.stack = error.stack;
  }
  const logObj = formatLogEntry("error", message, additionalData);
  console.error(JSON.stringify(logObj));
}

// ---------------------------------------------------------------------------------------------------------------------
// AWS Utility functions
// ---------------------------------------------------------------------------------------------------------------------

export function createSQSEventFromDigest(digest) {
  return {
    Records: [
      {
        eventVersion: "2.0",
        eventSource: "aws:sqs",
        eventTime: new Date().toISOString(),
        eventName: "SendMessage",
        body: JSON.stringify(digest),
      },
    ],
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// SQS Lambda Handlers
// ---------------------------------------------------------------------------------------------------------------------

export async function digestLambdaHandler(sqsEvent) {
  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);

  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];
  const batchItemFailures = [];

  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
    try {
      const digest = JSON.parse(sqsEventRecord.body);
      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
    } catch (error) {
      const recordId =
        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      logError(`Error processing record ${recordId} at index ${index}`, error);
      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);
      batchItemFailures.push({ itemIdentifier: recordId });
    }
  }

  return {
    batchItemFailures,
    handler: "sandbox/source/main.digestLambdaHandler",
  };
}

// ---------------------------------------------------------------------------------------------------------------------
// HTTP Server Support
// ---------------------------------------------------------------------------------------------------------------------

/**
 * Create an Express application with a POST /digest endpoint
 */
export function createApp() {
  const app = express();
  app.use(express.json());

  // Handle malformed JSON
  app.use((err, req, res, next) => {
    if (err instanceof SyntaxError && 'body' in err) {
      const errMsg = 'Invalid JSON payload';
      logError(errMsg, err);
      return res.status(400).json({ error: errMsg });
    }
    next();
  });

  app.post('/digest', async (req, res) => {
    logInfo(`HTTP /digest request received: ${JSON.stringify(req.body)}`);
    if (typeof req.body !== 'object' || req.body === null || Array.isArray(req.body)) {
      const errMsg = 'Invalid request body, expected JSON object';
      logError(errMsg);
      return res.status(400).json({ error: errMsg });
    }
    try {
      const event = createSQSEventFromDigest(req.body);
      const result = await digestLambdaHandler(event);
      logInfo(`HTTP /digest response batchItemFailures: ${JSON.stringify(result.batchItemFailures)}`);
      return res.status(200).json({ batchItemFailures: result.batchItemFailures });
    } catch (error) {
      const errMsg = `Error handling digest: ${error.message}`;
      logError(errMsg, error);
      return res.status(400).json({ error: errMsg });
    }
  });

  return app;
}

export const app = createApp();

/**
 * Start the HTTP server on the given port (or PORT env var/default 3000)
 * Returns the server instance for shutdown
 */
export function startHttpServer(port = Number(process.env.PORT) || 3000) {
  const server = app.listen(port, () => {
    logInfo(`HTTP server listening on port ${port}`);
  });
  return server;
}

// ---------------------------------------------------------------------------------------------------------------------
// CLI Helper Functions
// ---------------------------------------------------------------------------------------------------------------------

function generateUsage() {
  return `
Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.
  --http                     Start the HTTP server with POST /digest endpoint.
`;
}

function processHelp(args) {
  if (args.includes("--help")) {
    console.log(generateUsage());
    return true;
  }
  return false;
}

async function processVersion(args) {
  if (args.includes("--version")) {
    try {
      const { readFileSync } = await import("fs");
      const packageJsonPath = new URL("../../package.json", import.meta.url);
      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
      const versionInfo = {
        version: packageJson.version,
        timestamp: new Date().toISOString(),
      };
      console.log(JSON.stringify(versionInfo));
    } catch (error) {
      logError("Failed to retrieve version", error);
    }
    return true;
  }
  return false;
}

async function processDigest(args) {
  if (args.includes("--digest")) {
    const exampleDigest = {
      key: "events/1.json",
      value: "12345",
      lastModified: new Date().toISOString(),
    };
    const sqsEvent = createSQSEventFromDigest(exampleDigest);
    await digestLambdaHandler(sqsEvent);
    return true;
  }
  return false;
}

// ---------------------------------------------------------------------------------------------------------------------
// Main CLI
// ---------------------------------------------------------------------------------------------------------------------

export async function main(args = process.argv.slice(2)) {
  if (processHelp(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (await processVersion(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (await processDigest(args)) {
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }
  if (args.includes("--http") || process.env.RUN_HTTP === 'true') {
    const port = Number(process.env.PORT) || 3000;
    startHttpServer(port);
    if (VERBOSE_STATS) {
      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
    }
    return;
  }

  console.log("No command argument supplied.");
  console.log(generateUsage());
  if (VERBOSE_STATS) {
    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
  }
}

// if (import.meta.url.endsWith(process.argv[1])) {
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main().catch((err) => {
    logError("Fatal error in main execution", err);
    process.exit(1);
  });
}\n\n// New [sandbox/tests/http-server.test.js]:\nimport { describe, test, expect, afterAll } from "vitest";
import request from "supertest";
import http from "http";
import { startHttpServer, app } from "../source/main.js";

let server;
const TEST_PORT = 3001;

afterAll(() => {
  if (server && server.close) {
    server.close();
  }
});

describe("HTTP Server CLI Disabled", () => {
  test("connection refused when no server", async () => {
    await expect(
      new Promise((resolve, reject) => {
        const req = http.request(
          { hostname: 'localhost', port: 3000, path: '/digest', method: 'POST' },
          (res) => resolve(res)
        );
        req.on('error', (err) => reject(err));
        req.end();
      })
    ).rejects.toHaveProperty('code', 'ECONNREFUSED');
  });
});

describe("HTTP Server Behavior", () => {
  test("server starts with startHttpServer and responds 404 on GET /", async () => {
    server = startHttpServer(TEST_PORT);
    await new Promise((resolve) => server.on('listening', resolve));
    await request(`http://localhost:${TEST_PORT}`)
      .get('/')
      .expect(404);
  });

  test("POST /digest with valid payload returns 200 and batchItemFailures array", async () => {
    // Ensure server is up
    if (!server) {
      server = startHttpServer(TEST_PORT);
      await new Promise((resolve) => server.on('listening', resolve));
    }
    const payload = { key: 'events/1.json', value: '12345', lastModified: new Date().toISOString() };
    const res = await request(`http://localhost:${TEST_PORT}`)
      .post('/digest')
      .send(payload)
      .set('Content-Type', 'application/json')
      .expect(200);
    expect(res.body).toHaveProperty('batchItemFailures');
    expect(Array.isArray(res.body.batchItemFailures)).toBe(true);
  });

  test("POST /digest with invalid JSON returns 400 and error message", async () => {
    const res = await request(`http://localhost:${TEST_PORT}`)
      .post('/digest')
      .send('not a json')
      .set('Content-Type', 'application/json')
      .expect(400);
    expect(res.body).toHaveProperty('error');
  });

  test("POST /digest with non-object body returns 400 and error message", async () => {
    const res = await request(`http://localhost:${TEST_PORT}`)
      .post('/digest')
      .send([1,2,3])
      .set('Content-Type', 'application/json')
      .expect(400);
    expect(res.body).toHaveProperty('error');
  });
});
```
mainOutput:
```

> @xn-intenton-z2a/agentic-lib@6.7.13-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-21T23:14:38.302Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1558 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9326,"completion_tokens":7187,"total_tokens":16513,"prompt_tokens_details":{"cached_tokens":4864,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":3328,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-21T23:20:43.615Z

Generated feature development issue with title Enhance sandbox/README.md with Mission-Inspired Introduction and Key Documentation Links.

LLM API Usage:

```json
{"prompt_tokens":6638,"completion_tokens":1377,"total_tokens":8015,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":960,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Ready Issue at 2025-05-21T23:37:40.660Z

Enhanced issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1559 with action enhance and updated description:

### Summary

Populate the sandbox/README.md with a mission-inspired introduction, clear project overview, essential documentation links, and concise usage examples to improve onboarding and align with agentic-lib’s mission.

## Problem Statement
The current sandbox/README.md is empty. New users and contributors lack an entry point to understand the purpose, scope, and usage of the library in the sandbox environment.

## Proposed Solution
1. Add a mission-inspired introduction based on MISSION.md.
2. Provide a brief project description highlighting agentic-lib as a drop-in JS SDK for GitHub Actions workflows.
3. Include direct links to:
   - MISSION.md
   - CONTRIBUTING.md
   - LICENSE.md (MIT and GPL-3.0)
   - GitHub repository (https://github.com/xn-intenton-z2a/agentic-lib)
4. Outline basic usage examples:
   - **CLI invocation**
     ```bash
     node src/lib/main.js --help
     node src/lib/main.js --digest
     node src/lib/main.js --version
     ```
   - **HTTP server endpoint** (when started with `--http` or `RUN_HTTP=true`):
     ```bash
     node src/lib/main.js --http
     curl -X POST http://localhost:3000/digest \
          -H "Content-Type: application/json" \
          -d '{"key":"events/1.json","value":"12345","lastModified":"2025-01-01T00:00:00Z"}'
     ```
5. Reference the HTTP server feature and link to its spec in `sandbox/features/HTTP_SERVER.md`.
6. Add a table of contents and adhere to markdown best practices.

## Acceptance Criteria
1. **Mission Introduction**: README begins with a concise paragraph summarizing agentic-lib’s mission.
2. **Project Overview**: Includes a sentence describing the library’s role as a GitHub Actions SDK.
3. **Documentation Links**: All required links (MISSION.md, CONTRIBUTING.md, LICENSE.md, repo URL) are present and functional.
4. **Usage Examples**: CLI and HTTP server examples are included, with correct commands and expected outputs.
5. **Feature Reference**: HTTP server section clearly references `sandbox/features/HTTP_SERVER.md`.
6. **Structure & Style**: README contains a table of contents, uses headings consistently, and passes markdown linting.
7. **No Other Changes**: Only `sandbox/README.md` is modified.

## Definition of Done
- A pull request updating `sandbox/README.md` is opened.
- All CI checks pass (linting, formatting).
- Manual review confirms readability and correctness of links/examples.

LLM API Usage:

```json
{"prompt_tokens":7404,"completion_tokens":1273,"total_tokens":8677,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

2025-05-21T23:51:42Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-21T23-09Z

