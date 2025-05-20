# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-19T23:34:06.174Z

Maintained feature SIMULATE_DIGEST.

Git diff:

```
diff --git a/sandbox/features/SIMULATE_DIGEST.md b/sandbox/features/SIMULATE_DIGEST.md
new file mode 100644
index 00000000..30ec4d44
--- /dev/null
+++ b/sandbox/features/SIMULATE_DIGEST.md
@@ -0,0 +1,41 @@
+# Purpose
+Enhance the CLI to allow the --digest option to accept a file path containing a JSON payload. This enables developers and automated workflows to simulate real SQS events from arbitrary JSON files instead of a hard-coded example.
+
+# Specification
+
+1. Update Usage Instructions
+   • Modify the usage section to show:
+     --digest [<path>]
+   • Explain that the optional path argument points to a JSON file containing the event digest object.
+
+2. ProcessDigest Implementation
+   • When --digest is supplied with a file path:
+     - Read the file synchronously using fs.readFileSync
+     - Parse the file content as JSON; report and exit on parse errors
+     - Use the parsed object to create an SQS event via createSQSEventFromDigest
+     - Invoke digestLambdaHandler on the resulting event
+   • When --digest is supplied without an argument:
+     - Retain existing behavior with the exampleDigest fallback
+
+3. Error Handling
+   • If file reading fails (file not found or permission denied):
+     - Log an error with logError and exit process with non-zero code
+   • If JSON parsing fails:
+     - Log an error with logError including raw file content and error
+     - Exit process with non-zero code
+
+4. Tests and Validation
+   • Create unit tests to cover:
+     - Valid file path and proper dispatch to digestLambdaHandler
+     - Missing file path argument (fallback to default behavior)
+     - File not found or read error scenario
+     - Invalid JSON content scenario
+   • Use vitest mocks for fs and ensure logError is invoked correctly
+
+# Success Criteria & Acceptance
+
+- All new tests pass under npm test
+- generateUsage output mentions the optional file path
+- processDigest reads and parses external JSON files correctly
+- Errors in reading or parsing are surfaced and cause non-zero exit
+- Existing behavior without file argument remains unchanged
```

LLM API Usage:

```json
{"prompt_tokens":6119,"completion_tokens":1476,"total_tokens":7595,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1024,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T23:35:11.707Z

Generated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1537 with title:

SIMULATE_DIGEST: Enable --digest [<path>] for external JSON payloads

And description:

Overview
--------
Enhance the existing `--digest` CLI command so that users can optionally supply a file path pointing to a JSON payload. When provided, the tool should read and parse the external file, create an SQS event from its contents via `createSQSEventFromDigest`, and invoke `digestLambdaHandler`. If no path is supplied, maintain the current exampleDigest fallback.

Tasks
-----
1. **Update Usage Documentation**
   - In `src/lib/main.js`, modify `generateUsage()` to show:
     ```
     --digest [<path>]      Run a full bucket replay simulating an SQS event; optionally read JSON payload from file.
     ```
   - Update any relevant comments in `sandbox/README.md` to reflect the new optional path behavior.

2. **Enhance processDigest**
   - Import `fs.readFileSync` at the top of the file if not already imported.
   - In `processDigest(args)`, detect whether `--digest` is followed by a non-flag argument:
     - If a path is provided: 
       1. Read the file synchronously with `fs.readFileSync(path, 'utf8')`. 
       2. Parse the content with `JSON.parse`; on success, call `createSQSEventFromDigest(parsedJson)` and pass it to `digestLambdaHandler`.
       3. On file read or parse error, call `logError()` with the error details and exit the process with a non-zero code (`process.exit(1)`).
     - If no path is provided or the next token starts with `--`, retain the existing fallback `exampleDigest` logic.

3. **Error Handling**
   - On file-not-found or permission errors: log the error message and raw exception, then `process.exit(1)`.
   - On invalid JSON: log the raw file content and parse error, then `process.exit(1)`.

4. **Unit Tests**
   - In `tests/unit/main.test.js`, add Vitest cases for:
     - **Valid file path**: mock `fs.readFileSync` to return a valid JSON string, spy on `digestLambdaHandler`, and verify it's invoked with the correct event.
     - **Fallback behavior**: call `processDigest` without a path (or with `--digest --version` style args) and confirm `exampleDigest` is used.
     - **File read error**: mock `fs.readFileSync` to throw, spy on `logError` and `process.exit`, and assert correct exit code.
     - **Invalid JSON**: mock `fs.readFileSync` to return malformed JSON, spy on `logError` and `process.exit`, and assert correct exit code.
   - Use Vitest mocks (`vi.mock` / `vi.spyOn`) for `fs`, `logError`, and `process.exit`.

5. **README Update**
   - In `sandbox/README.md`, under "Usage", document the new `[<path>]` option and provide an example:
     ```bash
     node src/lib/main.js --digest ./sampleEvent.json
     ```

6. **Verify & Acceptance**
   - Run `npm test`; all existing tests plus new ones should pass.
   - Manual smoke test: invoke `node src/lib/main.js --digest <valid-json-file>`, observe the Lambda handler receiving the parsed event.

Scope
-----
Only modify:
- `src/lib/main.js` (source implementation)
- `tests/unit/main.test.js` (unit tests)
- `sandbox/README.md` (usage docs)
- `package.json` (if adding any required dependency or adjusting the test script)

No new files should be created or deleted. Focus on delivering the core functionality and high-impact error handling as outlined above.

LLM API Usage:

```json
{"prompt_tokens":6782,"completion_tokens":2098,"total_tokens":8880,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1216,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to enhanced Issue at 2025-05-19T23:36:16.143Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1537 with enhanced description:

Overview
--------
Enhance the existing `--digest` CLI command so users can optionally supply a file path pointing to a JSON payload.

When a path is provided:
- Read the file synchronously (`fs.readFileSync(path, 'utf8')`).
- Parse the content as JSON; on success:
  - Call `createSQSEventFromDigest(parsedObject)` and await `digestLambdaHandler` with the generated event.
- On file read or parse error:
  - Call `logError()` with details (raw content and error message) and exit with `process.exit(1)`.

If no path is provided or the next token is another flag, retain the current fallback behavior using `exampleDigest`.

Testable Acceptance Criteria
----------------------------
- [ ] `generateUsage()` output includes `--digest [<path>]` in the usage instructions.
- [ ] Running `node src/lib/main.js --digest ./payload.json`:
  - Reads and parses `payload.json` correctly.
  - Invokes `createSQSEventFromDigest` with the parsed JSON.
  - Calls `digestLambdaHandler` with an event whose `Records[0].body` matches the JSON payload.
- [ ] Running `node src/lib/main.js --digest` (no path) uses the `exampleDigest` fallback and invokes `digestLambdaHandler` accordingly.
- [ ] On file not found or permission error:
  - `logError` is called with the error object.
  - The process exits with code 1.
- [ ] On invalid JSON content:
  - `logError` is called with the raw file content and parse error.
  - The process exits with code 1.
- [ ] Unit tests in `tests/unit/main.test.js` cover:
  - Valid file path scenario (mock `fs.readFileSync`, spy on `digestLambdaHandler`).
  - Fallback behavior (no path).
  - File read error scenario (mock `fs.readFileSync` to throw, spy on `logError` and `process.exit`).
  - Invalid JSON scenario (mock `fs.readFileSync` to return malformed JSON, spy on `logError` and `process.exit`).
- [ ] All tests pass with `npm test`.

Documentation Updates
---------------------
- [ ] Update `sandbox/README.md` under "Usage" to document the new `--digest [<path>]` option with an example:
  ```bash
  node src/lib/main.js --digest ./sampleEvent.json
  ```

Scope
-----
Only modify:
- `src/lib/main.js` (implementation)
- `tests/unit/main.test.js` (unit tests)
- `sandbox/README.md` (usage docs)

No new files should be created or deleted.

LLM API Usage:

```json
{"prompt_tokens":7630,"completion_tokens":1550,"total_tokens":9180,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":896,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Issue to Code at 2025-05-19T23:40:55.372Z

fixApplied: true

Enable --digest path option and add related tests and documentation

Git Diff:

```
diff --git a/sandbox/README.md b/sandbox/README.md
new file mode 100644
index 00000000..336b2195
--- /dev/null
+++ b/sandbox/README.md
@@ -0,0 +1,32 @@
+# agentic-lib
+
+Agentic-lib is a JavaScript SDK designed to power autonomous workflows in GitHub Actions. It enables your repository to operate in an “agentic” manner by communicating through branches and issues to continuously review, fix, update, and evolve your code.
+
+## CLI Usage
+
+Run the main script with the following options:
+
+  --help                     Show help message and usage instructions.
+  --digest [<path>]          Run a full bucket replay simulating an SQS event, optionally with a JSON file path.
+  --version                  Show version information with current timestamp.
+
+### Examples
+
+Run using a custom JSON payload file:
+
+```bash
+node sandbox/source/main.js --digest ./sampleEvent.json
+```
+
+Run using the default example digest:
+
+```bash
+node sandbox/source/main.js --digest
+```
+
+## Links
+
+- [Mission Statement](../../MISSION.md)
+- [Contributing Guidelines](../../CONTRIBUTING.md)
+- [License](LICENSE-MIT)
+- [Repository](https://github.com/xn-intenton-z2a/agentic-lib)
\ No newline at end of file
diff --git a/sandbox/source/main.js b/sandbox/source/main.js
new file mode 100644
index 00000000..acc600a1
--- /dev/null
+++ b/sandbox/source/main.js
@@ -0,0 +1,246 @@
+#!/usr/bin/env node
+// sandbox/source/main.js
+
+// Initialize global callCount to support test mocks that reference it
+if (typeof globalThis.callCount === "undefined") {
+  globalThis.callCount = 0;
+}
+
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
+    handler: "sandbox/source/main.digestLambdaHandler",
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
+  --digest [<path>]          Run a full bucket replay simulating an SQS event, optionally with a JSON file path.
+  --version                  Show version information with current timestamp.
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
+    const index = args.indexOf("--digest");
+    let digestObj;
+    const { readFileSync } = await import("fs");
+
+    // Check for optional file path argument
+    if (args[index + 1] && !args[index + 1].startsWith("-")) {
+      const filePath = args[index + 1];
+      let raw;
+      try {
+        raw = readFileSync(filePath, "utf8");
+      } catch (error) {
+        logError(`Failed to read digest file at ${filePath}`, error);
+        process.exit(1);
+      }
+      try {
+        digestObj = JSON.parse(raw);
+      } catch (parseError) {
+        logError(`Invalid JSON in digest file at ${filePath}. Raw content: ${raw}`, parseError);
+        process.exit(1);
+      }
+    } else {
+      // Fallback example digest
+      digestObj = {
+        key: "events/1.json",
+        value: "12345",
+        lastModified: new Date().toISOString(),
+      };
+    }
+
+    const sqsEvent = createSQSEventFromDigest(digestObj);
+    await digestLambdaHandler(sqsEvent);
+    return true;
+  }
+  return false;
+}
+
+// ---------------------------------------------------------------------------------------------------------------------
+// Main CLI
+// ---------------------------------------------------------------------------------------------------------------------
+
+export async function main(args = process.argv.slice(2)) {
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
diff --git a/sandbox/tests/main.test.js b/sandbox/tests/main.test.js
new file mode 100644
index 00000000..05ef8598
--- /dev/null
+++ b/sandbox/tests/main.test.js
@@ -0,0 +1,67 @@
+import { describe, test, expect, vi, beforeAll, beforeEach } from "vitest";
+import fs from "fs";
+
+let mainModule;
+
+beforeAll(async () => {
+  mainModule = await import("../source/main.js");
+});
+
+beforeEach(() => {
+  vi.clearAllMocks();
+  // Mock process.exit to throw for easier testing
+  vi.spyOn(process, "exit").mockImplementation((code) => { throw new Error(`process.exit: ${code}`); });
+});
+
+describe("processDigest CLI option", () => {
+  test("fallback behavior with no path uses example digest", async () => {
+    const createSpy = vi.spyOn(mainModule, "createSQSEventFromDigest");
+    const digestSpy = vi.spyOn(mainModule, "digestLambdaHandler").mockResolvedValue();
+
+    await mainModule.main(["--digest"]);
+
+    expect(createSpy).toHaveBeenCalledTimes(1);
+    const arg = createSpy.mock.calls[0][0];
+    expect(arg).toEqual(
+      expect.objectContaining({ key: "events/1.json", value: "12345", lastModified: expect.any(String) })
+    );
+    expect(digestSpy).toHaveBeenCalledTimes(1);
+  });
+
+  test("valid file path scenario", async () => {
+    const fakePayload = { foo: "bar" };
+    const rawJson = JSON.stringify(fakePayload);
+    const readSpy = vi.spyOn(fs, "readFileSync").mockReturnValue(rawJson);
+    const createSpy = vi.spyOn(mainModule, "createSQSEventFromDigest").mockReturnValue({ Records: [{ body: rawJson }] });
+    const digestSpy = vi.spyOn(mainModule, "digestLambdaHandler").mockResolvedValue();
+
+    await mainModule.main(["--digest", "fake.json"]);
+
+    expect(readSpy).toHaveBeenCalledWith("fake.json", "utf8");
+    expect(createSpy).toHaveBeenCalledWith(fakePayload);
+    expect(digestSpy).toHaveBeenCalledWith({ Records: [{ body: rawJson }] });
+  });
+
+  test("file read error scenario", async () => {
+    const readError = new Error("ENOENT");
+    vi.spyOn(fs, "readFileSync").mockImplementation(() => { throw readError; });
+    const logSpy = vi.spyOn(mainModule, "logError").mockImplementation(() => {});
+
+    await expect(mainModule.main(["--digest", "bad.json"]))
+      .rejects.toThrow("process.exit: 1");
+    expect(logSpy).toHaveBeenCalledWith(`Failed to read digest file at bad.json`, readError);
+  });
+
+  test("invalid JSON scenario", async () => {
+    const rawInvalid = "{not: 'json'}";
+    vi.spyOn(fs, "readFileSync").mockReturnValue(rawInvalid);
+    const logSpy = vi.spyOn(mainModule, "logError").mockImplementation(() => {});
+
+    await expect(mainModule.main(["--digest", "bad.json"]))
+      .rejects.toThrow("process.exit: 1");
+    expect(logSpy).toHaveBeenCalledWith(
+      `Invalid JSON in digest file at bad.json. Raw content: ${rawInvalid}`,
+      expect.any(SyntaxError)
+    );
+  });
+});
\ No newline at end of file
```
mainOutput:
```

> @xn-intenton-z2a/agentic-lib@6.7.6-0 start
> node src/lib/main.js

{"level":"info","timestamp":"2025-05-19T23:40:35.251Z","message":"Configuration loaded","config":{}}
No command argument supplied.

Usage:
  --help                     Show this help message and usage instructions.
  --digest                   Run a full bucket replay simulating an SQS event.
  --version                  Show version information with current timestamp.

```
[for issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1537 with title: ""]

LLM API Usage:

```json
{"prompt_tokens":9696,"completion_tokens":10217,"total_tokens":19913,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":6912,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Feature to Issue at 2025-05-19T23:46:49.711Z

Generated feature development issue with title Add --mission CLI flag to display project mission statement.

LLM API Usage:

```json
{"prompt_tokens":6805,"completion_tokens":1943,"total_tokens":8748,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1408,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

## Discussions activity at 2025-05-20T00:02:03.869Z

Hello @Antony-at-Polycode 👋

The repository has already been seeded as requested with a blank mission detail across multiple previous actions. 🎉

Please review the existing scaffolding and let me know if you'd like to refine the mission statement or adjust any of the seeded content. 🚀

[Posted on "https://github.com/xn-intenton-z2a/agentic-lib/discussions/1318#discussioncomment-13200074" by the repository bot which took the action "reply-without-action" with the detail "".]

LLM API Usage:

```json
{"prompt_tokens":35950,"completion_tokens":353,"total_tokens":36303,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":256,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}

```
---

