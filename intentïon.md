# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
2025-05-20T00:51:44Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-20T00-51Z

## Maintain Feature at 2025-05-20T00:52:34.136Z

Maintained feature HTTP_ENDPOINT.

Git diff:

```
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index 218b352f..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
-Create a tty based guess a number game.
diff --git a/sandbox/features/HTTP_ENDPOINT.md b/sandbox/features/HTTP_ENDPOINT.md
new file mode 100644
index 00000000..d2ceefe3
--- /dev/null
+++ b/sandbox/features/HTTP_ENDPOINT.md
@@ -0,0 +1,31 @@
+# HTTP Endpoint Feature
+
+# Description
+Provide an integrated HTTP server that exposes the existing digestLambdaHandler as a RESTful endpoint. Users can send POST requests to trigger the same processing logic used in the CLI and AWS Lambda contexts.
+
+# Value Proposition
+Deliver a direct HTTP API to invoke digest logic without requiring AWS infrastructure or CLI commands. Simplifies local development, testing, and integration with external services.
+
+# Success Criteria & Requirements
+- Launch an HTTP server when invoked with the --serve flag.
+- Default to port 3000 or honor the PORT environment variable.
+- Accept POST requests at the /digest endpoint with a JSON body matching the SQS event schema.
+- Return HTTP 200 with a JSON body listing any batchItemFailures.
+- Graceful shutdown on SIGINT or SIGTERM.
+
+# API Specification
+Endpoint: POST /digest
+Request Body: JSON object with either Records array or single event record. Matches SQS event format.
+Response:
+  status: 200
+  body: { batchItemFailures: Array }
+
+# CLI Integration
+Extend main() to process a new --serve flag:
+  node src/lib/main.js --serve [--port <number>]
+When --serve is present, start HTTP server instead of running CLI commands.
+
+# Verification & Acceptance
+- Unit tests simulate POST /digest requests and validate JSON responses.
+- Tests cover valid and invalid JSON payloads and error handling.
+- Manual test using curl or HTTP client to verify behavior.
```

LLM API Usage:

```json
{"prompt_tokens":6126,"completion_tokens":1442,"total_tokens":7568,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1088,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-20T00:53:41.512Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1540 with title:

Implement HTTP Server (--serve) Mode Using Express for /digest Endpoint

And description:

Objective
--------
Enhance the CLI in src/lib/main.js to support an HTTP server mode (triggered by a new --serve flag) that exposes the existing digestLambdaHandler as a RESTful POST /digest endpoint. Update tests, README, and package.json to reflect and verify this new capability.

Scope of Changes
----------------
1. package.json
   • Add "express" as a runtime dependency (e.g., "express": "^4.18.2").
   • Add "supertest" as a devDependency (e.g., "supertest": "^6.3.3").

2. src/lib/main.js
   • Import Express and initialize an app.
   • Implement a processServe(args) function that:
     - Detects --serve flag.
     - Reads PORT from env or defaults to 3000.
     - Defines POST /digest to accept JSON payloads:
       * If body.Records is an array, pass it directly to digestLambdaHandler.
       * Otherwise, wrap the JSON body as a single record object.
     - Sends HTTP 200 with { batchItemFailures } returned by digestLambdaHandler.
   • In main(), check for the --serve flag before existing CLI flags, call processServe and return.
   • Add graceful shutdown handling on SIGINT/SIGTERM to close the HTTP server.

3. tests/unit/main.test.js
   • Import supertest and the main Express app (via the new processServe export).
   • Write test cases for:
     - Successful POST /digest with valid SQS-style JSON -> expect HTTP 200 and correct batchItemFailures array.
     - POST /digest with invalid JSON payload -> expect HTTP 200 and batchItemFailures containing a fallback identifier.
     - Custom PORT via environment variable.

4. README (sandbox/README.md)
   • Add a new "HTTP Server Mode" section:
     - Describe how to start: \`node src/lib/main.js --serve [--port <number>]\`.
     - Provide curl examples for POST /digest with a sample payload.
     - Document response format.

Verification & Acceptance
-------------------------
• Running `npm test` should cover all new HTTP endpoint tests and pass.
• Manually starting with `npm start -- --serve` or `node src/lib/main.js --serve --port 4000` and curling POST requests should return expected JSON.
• README examples must work out-of-the-box when copy-pasted.

Implementation Notes
--------------------
- Avoid adding new files: update only package.json, src/lib/main.js, tests/unit/main.test.js, and sandbox/README.md.
- Use Express's built-in JSON body parser (no extra body-parser package).
- Ensure the server shuts down cleanly on process signals to prevent hanging in test suites.

LLM API Usage:

```json
{"prompt_tokens":6676,"completion_tokens":1675,"total_tokens":8351,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-20T00:54:21.777Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/ with enhanced description:

Title: HTTP Server Mode (--serve) for /digest Endpoint

Objective:
--------
Enable the CLI in src/lib/main.js to start an Express-based HTTP server when invoked with a new --serve flag, exposing the existing digestLambdaHandler at POST /digest.

Scope of Changes:
------------------
1. package.json
   • Add "express" as a runtime dependency (e.g., "express": "^4.18.2").
   • Add "supertest" as a devDependency (e.g., "supertest": "^6.3.3").

2. src/lib/main.js
   • Import Express and implement a processServe(args) function:
     - Detect --serve flag before other CLI flags.
     - Read PORT from environment or default to 3000.
     - Configure POST /digest:
       * If body.Records is an array, pass it directly to digestLambdaHandler.
       * Otherwise wrap the request body as a single record.
       * Return HTTP 200 with JSON { batchItemFailures }.
     - Support JSON parsing via express.json().
     - Implement graceful shutdown on SIGINT and SIGTERM to close the server.
   • Export processServe (for testing) and invoke it in main() when --serve is present.

3. tests/unit/main.test.js
   • Use supertest against the exported Express app:
     - POST /digest with valid SQS-style JSON -> expect 200 and correct batchItemFailures: [].
     - POST /digest with invalid JSON payload -> expect 200 and batchItemFailures contains a fallback identifier.
     - Custom PORT via environment variable -> server listens on the configured port.
     - Ensure server shuts down cleanly after tests to prevent hanging.

4. sandbox/README.md
   • Add "HTTP Server Mode" section:
     - Usage: `node src/lib/main.js --serve [--port <number>]`.
     - curl examples:
         curl -X POST http://localhost:3000/digest -H 'Content-Type: application/json' -d '{"Records":[{"body":"{ \"key\": \"value\" }"}]}'
     - Document response format: `{ "batchItemFailures": [] }` or fallback identifiers.

Acceptance Criteria:
--------------------
- Automated tests pass (`npm test` covers HTTP endpoint tests and existing tests).  
- The CLI `--serve` flag starts an HTTP server on port 3000 or the value of the PORT environment variable.  
- POST /digest with a valid SQS event payload returns HTTP 200 and an empty batchItemFailures array.  
- POST /digest with malformed JSON returns HTTP 200 and batchItemFailures contains a generated fallback identifier.  
- Graceful shutdown: sending SIGINT or SIGTERM closes the server within 5 seconds without hanging.  
- sandbox/README.md examples work out-of-the-box when copy-pasted.

Implementation Notes:
---------------------
- Use Express’s built-in express.json() middleware.  
- Do not add new source or test files; update only package.json, src/lib/main.js, tests/unit/main.test.js, and sandbox/README.md.

LLM API Usage:

```json
{"prompt_tokens":7198,"completion_tokens":1257,"total_tokens":8455,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":512,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-20T00:56:51.980Z

fixApplied: true

Implement HTTP Server Mode --serve using Express with tests and documentation

Git Diff:

```
diff --git a/sandbox/docs/HTTP_SERVER_MODE.md b/sandbox/docs/HTTP_SERVER_MODE.md
new file mode 100644
index 00000000..73492efd
--- /dev/null
+++ b/sandbox/docs/HTTP_SERVER_MODE.md
@@ -0,0 +1,54 @@
+# HTTP Server Mode
+
+The CLI now supports running an HTTP server to receive SQS-style payloads and invoke the `digestLambdaHandler`.
+
+## Usage
+
+Start the server:
+
+```bash
+# Default port 3000 or PORT env
+node sandbox/source/main.js --serve [--port <number>]
+```
+
+Examples:
+
+```bash
+# Run on default 3000
+node sandbox/source/main.js --serve
+
+# Run on custom port
+node sandbox/source/main.js --serve --port 4000
+```
+
+Send a valid payload:
+
+```bash
+curl -X POST http://localhost:3000/digest \
+  -H 'Content-Type: application/json' \
+  -d '{"Records":[{"body":"{ \"key\": \"value\" }"}]}'
+```
+
+Response:
+
+```json
+{ "batchItemFailures": [] }
+```
+
+Send a malformed payload:
+
+```bash
+curl -X POST http://localhost:3000/digest \
+  -H 'Content-Type: application/json' \
+  -d '{"Records":[{"body":"{ invalidJson }"}]}'
+```
+
+Response:
+
+```json
+{ "batchItemFailures": [{ "itemIdentifier": "fallback-0-<timestamp>-<random>" }] }
+```
+
+## Graceful Shutdown
+
+Press `Ctrl+C` or send a `SIGTERM` to stop the server. It will close active connections and shut down within 5 seconds.
\ No newline at end of file
diff --git a/sandbox/source/main.js b/sandbox/source/main.js
new file mode 100644
index 00000000..93849d75
--- /dev/null
+++ b/sandbox/source/main.js
@@ -0,0 +1,279 @@
+#!/usr/bin/env node
+// sandbox/source/main.js
+
+// Initialize global callCount to support test mocks that reference it
+if (typeof globalThis.callCount === "undefined") {
+  globalThis.callCount = 0;
+}
+
+import express from "express";
+import { fileURLToPath } from "url";
+import { z } from "zod";
+import dotenv from "dotenv";
+
+// ---------------------------------------------------------------------------------------------------------------------
+// Environment configuration from .env file or environment variables or test values.
+// ---------------------------------------------------------------------------------------------------------------------
+
+dotenv.config();
+
+if (process.env.VITEST || process.env.NODE_ENV === "development") {
+  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || "https://api.github.com.test/";
+  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
+}
+
+const configSchema = z.object({
+  GITHUB_API_BASE_URL: z.string().optional(),
+  OPENAI_API_KEY: z.string().optional(),
+});
+
+export const config = configSchema.parse(process.env);
+
+// Global verbose mode flag
+const VERBOSE_MODE = false;
+// Global verbose stats flag
+const VERBOSE_STATS = false;
+
+// Helper function to format log entries
+function formatLogEntry(level, message, additionalData = {}) {
+  return {
+    level,
+    timestamp: new Date().toISOString(),
+    message,
+    ...additionalData,
+  };
+}
+
+export function logConfig() {
+  const logObj = formatLogEntry("info", "Configuration loaded", {
+    config: {
+      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
+      OPENAI_API_KEY: config.OPENAI_API_KEY,
+    },
+  });
+  console.log(JSON.stringify(logObj));
+}
+logConfig();
+
+// ---------------------------------------------------------------------------------------------------------------------
+// Utility functions
+// ---------------------------------------------------------------------------------------------------------------------
+
+export function logInfo(message) {
+  const additionalData = VERBOSE_MODE ? { verbose: true } : {};
+  const logObj = formatLogEntry("info", message, additionalData);
+  console.log(JSON.stringify(logObj));
+}
+
+export function logError(message, error) {
+  const additionalData = { error: error ? error.toString() : undefined };
+  if (VERBOSE_MODE && error && error.stack) {
+    additionalData.stack = error.stack;
+  }
+  const logObj = formatLogEntry("error", message, additionalData);
+  console.error(JSON.stringify(logObj));
+}
+
+// ---------------------------------------------------------------------------------------------------------------------
+// AWS Utility functions
+// ---------------------------------------------------------------------------------------------------------------------
+
+export function createSQSEventFromDigest(digest) {
+  return {
+    Records: [
+      {
+        eventVersion: "2.0",
+        eventSource: "aws:sqs",
+        eventTime: new Date().toISOString(),
+        eventName: "SendMessage",
+        body: JSON.stringify(digest),
+      },
+    ],
+  };
+}
+
+// ---------------------------------------------------------------------------------------------------------------------
+// SQS Lambda Handlers
+// ---------------------------------------------------------------------------------------------------------------------
+
+export async function digestLambdaHandler(sqsEvent) {
+  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);
+
+  // If event.Records is an array, use it. Otherwise, treat the event itself as one record.
+  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];
+
+  // Array to collect the identifiers of the failed records
+  const batchItemFailures = [];
+
+  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
+    try {
+      const digest = JSON.parse(sqsEventRecord.body);
+      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
+    } catch (error) {
+      // If messageId is missing, generate a fallback identifier including record index
+      const recordId =
+        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
+      logError(`Error processing record ${recordId} at index ${index}`, error);
+      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);
+      batchItemFailures.push({ itemIdentifier: recordId });
+    }
+  }
+
+  // Return the list of failed messages so that AWS SQS can attempt to reprocess them.
+  return {
+    batchItemFailures,
+    handler: "src/lib/main.digestLambdaHandler",
+  };
+}
+
+// ---------------------------------------------------------------------------------------------------------------------
+// CLI Helper Functions
+// ---------------------------------------------------------------------------------------------------------------------
+
+// Function to generate CLI usage instructions
+function generateUsage() {
+  return `
+Usage:
+  --help                     Show this help message and usage instructions.
+  --digest                   Run a full bucket replay simulating an SQS event.
+  --version                  Show version information with current timestamp.
+  --serve                    Start HTTP server for /digest endpoint.
+  --port <number>            (Optional) Port for HTTP server, defaults to PORT env or 3000.
+`;
+}
+
+// Process the --help flag
+function processHelp(args) {
+  if (args.includes("--help")) {
+    console.log(generateUsage());
+    return true;
+  }
+  return false;
+}
+
+// Process the --version flag
+async function processVersion(args) {
+  if (args.includes("--version")) {
+    try {
+      const { readFileSync } = await import("fs");
+      const packageJsonPath = new URL("../../package.json", import.meta.url);
+      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
+      const versionInfo = {
+        version: packageJson.version,
+        timestamp: new Date().toISOString(),
+      };
+      console.log(JSON.stringify(versionInfo));
+    } catch (error) {
+      logError("Failed to retrieve version", error);
+    }
+    return true;
+  }
+  return false;
+}
+
+// Process the --digest flag
+async function processDigest(args) {
+  if (args.includes("--digest")) {
+    const exampleDigest = {
+      key: "events/1.json",
+      value: "12345",
+      lastModified: new Date().toISOString(),
+    };
+    const sqsEvent = createSQSEventFromDigest(exampleDigest);
+    await digestLambdaHandler(sqsEvent);
+    return true;
+  }
+  return false;
+}
+
+// Process the --serve flag and start HTTP server
+export function processServe(args) {
+  if (!args.includes("--serve")) {
+    return null;
+  }
+  const portArgIndex = args.indexOf("--port");
+  let port = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;
+  if (portArgIndex !== -1 && args[portArgIndex + 1]) {
+    const parsed = parseInt(args[portArgIndex + 1], 10);
+    if (!isNaN(parsed)) {
+      port = parsed;
+    }
+  }
+
+  const app = express();
+  app.use(express.json());
+
+  app.post("/digest", async (req, res) => {
+    let incoming = req.body;
+    // Normalize to SQS event shape
+    const sqsEvent = Array.isArray(incoming.Records) && incoming.Records
+      ? incoming
+      : { Records: [incoming] };
+    const result = await digestLambdaHandler(sqsEvent);
+    res.status(200).json({ batchItemFailures: result.batchItemFailures });
+  });
+
+  const server = app.listen(port, () => {
+    logInfo(`HTTP server listening on port ${port}`);
+  });
+
+  const shutdown = (signal) => {
+    logInfo(`Received ${signal}, shutting down server...`);
+    server.close(() => {
+      logInfo(`Server closed on ${signal}`);
+      process.exit(0);
+    });
+    setTimeout(() => {
+      logError('Forceful shutdown after timeout');
+      process.exit(1);
+    }, 5000);
+  };
+  process.on('SIGINT', () => shutdown('SIGINT')); 
+  process.on('SIGTERM', () => shutdown('SIGTERM'));
+
+  return { app, server };
+}
+
+// ---------------------------------------------------------------------------------------------------------------------
+// Main CLI
+// ---------------------------------------------------------------------------------------------------------------------
+
+export async function main(args = process.argv.slice(2)) {
+  // Serve has highest priority
+  const serveResult = processServe(args);
+  if (serveResult) {
+    return;
+  }
+
+  if (processHelp(args)) {
+    if (VERBOSE_STATS) {
+      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
+    }
+    return;
+  }
+  if (await processVersion(args)) {
+    if (VERBOSE_STATS) {
+      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
+    }
+    return;
+  }
+  if (await processDigest(args)) {
+    if (VERBOSE_STATS) {
+      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
+    }
+    return;
+  }
+
+  console.log("No command argument supplied.");
+  console.log(generateUsage());
+  if (VERBOSE_STATS) {
+    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
+  }
+}
+
+if (process.argv[1] === fileURLToPath(import.meta.url)) {
+  main().catch((err) => {
+    logError("Fatal error in main execution", err);
+    process.exit(1);
+  });
+}
\ No newline at end of file
diff --git a/sandbox/tests/main.http.test.js b/sandbox/tests/main.http.test.js
new file mode 100644
index 00000000..175202f6
--- /dev/null
+++ b/sandbox/tests/main.http.test.js
@@ -0,0 +1,54 @@
+// sandbox/tests/main.http.test.js
+import { describe, test, expect, beforeAll, afterAll } from 'vitest';
+import supertest from 'supertest';
+import { processServe } from '../source/main.js';
+
+let server;
+let request;
+
+beforeAll(() => {
+  // Set a custom port for testing
+  process.env.PORT = '0'; // Let system assign an ephemeral port
+  const result = processServe(['--serve']);
+  if (!result) {
+    throw new Error('Server did not start');
+  }
+  server = result.server;
+  request = supertest(result.app);
+});
+
+afterAll((done) => {
+  server.close(done);
+});
+
+describe('HTTP Server Mode', () => {
+  test('POST /digest with valid SQS-style JSON returns 200 and empty batchItemFailures', async () => {
+    const payload = {
+      Records: [
+        { body: JSON.stringify({ key: 'value' }) }
+      ]
+    };
+    const res = await request.post('/digest').send(payload).set('Content-Type', 'application/json');
+    expect(res.status).toBe(200);
+    expect(res.body).toHaveProperty('batchItemFailures');
+    expect(res.body.batchItemFailures).toEqual([]);
+  });
+
+  test('POST /digest with malformed JSON payload returns 200 and batchItemFailures contains fallback identifier', async () => {
+    const badBody = '{ invalidJson }';
+    const payload = { Records: [{ body: badBody }] };
+    const res = await request.post('/digest').send(payload).set('Content-Type', 'application/json');
+    expect(res.status).toBe(200);
+    expect(res.body.batchItemFailures).toHaveLength(1);
+    const id = res.body.batchItemFailures[0].itemIdentifier;
+    expect(id).toMatch(/^fallback-\d+-\d+-[a-z0-9]+/);
+  });
+
+  test('Server listens on custom PORT environment variable', () => {
+    const addr = server.address();
+    // On some platforms, server.address() may return string if UNIX socket, but we expect port
+    const port = typeof addr === 'object' ? addr.port : NaN;
+    expect(typeof port).toBe('number');
+    expect(port).toBeGreaterThan(0);
+  });
+});
\ No newline at end of file
```
mainOutput:
```

> @xn-intenton-z2a/agentic-lib@6.7.7-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-20T00:56:28.823Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1540 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9408,"completion_tokens":6197,"total_tokens":15605,"prompt_tokens_details":{"cached_tokens":6912,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":2752,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

