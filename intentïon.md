# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
# Activity Log

## Discussions activity at 2025-05-19T12:20:50.119Z

Hello @Antony-at-Polycode 👋

I’m seeding the repository now as requested. The mission detail is left blank per your instructions. You can review the new initial scaffolding and let me know if you’d like to refine the mission statement or adjust anything else!

[Posted on "https://github.com/xn-intenton-z2a/agentic-lib/discussions/1318#discussioncomment-13193239" by the repository bot which took the action "seed-repository" with the detail "".]

LLM API Usage:

```json
{"prompt_tokens":75369,"completion_tokens":85,"total_tokens":75454,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":0,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}```

---

2025-05-19T12:22:03Z - Archiving intentïon to branch https://github.com/xn-intenton-z2a/agentic-lib/tree/intention-2025-05-19T12-21Z

## Maintain Feature at 2025-05-19T12:22:30.791Z

Maintained feature HEALTH_CHECK.

Git diff:

```diff --git a/prompt.txt b/prompt.txt
index acb1772e..539656e1 100644
--- a/prompt.txt
+++ b/prompt.txt
@@ -1,275 +1,77 @@
 
-You are providing updates to the README.md file and other documentation files to ensure they accurately reflect the current state of the codebase and emphasize content that delivers substantial user value and addresses core implementation needs.
-
-The README is the primary focus, but other documentation files can be updated as well if needed. Source files (srcFiles) and test files (testFiles) should NOT be updated.
-
-When updating the README:
-1. Preserve existing README content that delivers substantial user value, even if it describes features not yet implemented
-2. Update the README if it conflicts with current source code, tests, or documentation, prioritizing content that directly enhances the product's primary purpose
-3. If documentation files are out of date compared to the source code or tests, update them to be consistent, focusing on high-impact information that enables immediate application rather than superficial descriptions
-4. Ensure documentation clearly communicates the core functionality and value proposition of the product, prioritizing content that helps users solve real problems
-
-Apply the contributing guidelines to your response and when suggesting enhancements consider the tone and direction of the contributing guidelines. Focus on documentation improvements that deliver measurable value to users rather than cosmetic changes or excessive detail on edge cases.
-
-You may only change the files provided in the prompt context. You can update multiple files by specifying their paths and contents in the updatedFiles object. Each file will be checked against the allowedFilepathPatterns before being written.
+Please generate the name and specification for a software feature which will be added or updated to action the supplied feature prompt.
+Prioritize features that deliver substantial user impact and core functionality that solves real problems. Focus on capabilities that directly enhance the product's primary purpose rather than cosmetic improvements, excessive validation, or polishing. Aim for achievable, high-impact outcomes within a single repository, not a grandiose vision or bloated feature set.
+
+You may only create features to only change the source file, test file, README file and dependencies file content. You may not create features that request new files, delete existing files, or change the other files provided in the prompt context.
+If there are more than the maximum number of features in the repository, you may delete a feature but preferably, you should identify an existing feature that is most similar or related to the new feature and modify it to incorporate aspects of the new feature.
+All existing features could be retained, with one being enhanced to move towards accommodating the new feature.
+
+Avoid code examples in the feature that themselves quote or escape.
+Don't use any Markdown shell or code escape sequences in the feature text.
+Don't use any quote escape sequences in the feature text.
+
+Generally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape
+sequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.
+
+The feature will be iterated upon to incrementally deliver measurable value to users. Each iteration should focus on core functionality that addresses user needs rather than superficial enhancements. New features should be thematically distinct from other features.
+If a significant feature of the repository is not present in the current feature set, please add it either to a new feature or an existing feature.
+Before adding a new feature ensure that this feature is distinct from any other feature in the repository, otherwise update an existing feature.
+When updating an existing feature, ensure that the existing aspects are not omitted in the response, provide the full feature spec.
+The feature name should be one or two words in SCREAMING_SNAKECASE.
+Use library documents for inspiration and as resources for the detail of the feature.
+Consider the contents of the library documents for similar products and avoid duplication where we can use a library.
+Any new feature should not be similar to any of the rejected features and steer existing features away from the rejected features.
+The feature spec should be a detailed description of the feature, compatible with the guidelines in CONTRIBUTING.md.
+You may also just update a feature spec to bring it to a high standard matching other features in the repository.
+A feature can be added based on a behaviour already present in the repository described within the guidelines in CONTRIBUTING.md.
+Features must be achievable in a single software repository not part of a corporate initiative.
+The feature spec should be a multiline markdown with a few level 1 headings.
+The feature must be compatible with the mission statement in MISSION.md and ideally realise part of the value in the mission.
+The feature must be something that can be realised in a single source file (as below), ideally just as a library, CLI tool or possibly an HTTP API in combination with infrastructure as code deployment.
+
+
+If there are more than the maximum number of 1 features in the repository, you must merge 
+similar features into a single feature and name the features to be deleted.
+All significant features of the repository should be present in the feature set before new features are 
+added and features can be consolidated to make room below the maximum of 1 features.
 
 Consider the following when refining your response:
-  * Current feature names and specifications in the repository
-  * Source file content (for context only)
-  * Test file content (for context only)
-  * Documentation file content
-  * README file content
-  * MISSION file content
-  * Contributing file content
-  * Dependencies file content
-  * Dependency install output
-  * Issue details (if any)
-  * Build output
-  * Test output
-  * Main execution output
-  * Agent configuration file content
-
-Current feature names and specifications (for context, read only):
+* Feature prompt details
+* Current feature names and specifications in the repository
+* Rejected feature names
+* Source file content
+* Test file content
+* Documentation file content
+* README file content
+* MISSION file content
+* Contributing file content
+* Dependencies file content
+* Library documents
+* Dependency list
+
+Feature prompt:
+FEATURE_PROMPT_START
+
+FEATURE_PROMPT_END            
+
+Current feature names and specifications:
 CURRENT_FEATURES_START
-find: ‘features/’: No such file or directory
+find: ‘sandbox/features/’: No such file or directory
 none
 CURRENT_FEATURES_END
 
-Source files (for context only, DO NOT UPDATE):
-SOURCE_FILES_START
-File: sandbox/source/main.js
-#!/usr/bin/env node
-// sandbox/source/main.js
-
-// Initialize global callCount to support test mocks that reference it
-if (typeof globalThis.callCount === "undefined") {
-  globalThis.callCount = 0;
-}
-
-import { fileURLToPath } from "url";
-import { readFile } from "fs/promises";
-import path from "path";
-import { z } from "zod";
-import dotenv from "dotenv";
-import { randomUUID } from "crypto";
-
-// ---------------------------------------------------------------------------------------------------------------------
-// Environment configuration from .env file or environment variables or test values.
-// ---------------------------------------------------------------------------------------------------------------------
-
-dotenv.config();
-
-if (process.env.VITEST || process.env.NODE_ENV === "development") {
-  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || "https://api.github.com.test/";
-  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || "key-test";
-}
-
-const configSchema = z.object({
-  GITHUB_API_BASE_URL: z.string().optional(),
-  OPENAI_API_KEY: z.string().optional(),
-});
-
-export const config = configSchema.parse(process.env);
-
-// Global verbose mode flag
-const VERBOSE_MODE = false;
-// Global verbose stats flag
-const VERBOSE_STATS = false;
-
-// Helper function to format log entries
-function formatLogEntry(level, message, additionalData = {}) {
-  return {
-    level,
-    timestamp: new Date().toISOString(),
-    message,
-    ...additionalData,
-  };
-}
-
-export function logConfig() {
-  const logObj = formatLogEntry("info", "Configuration loaded", {
-    config: {
-      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,
-      OPENAI_API_KEY: config.OPENAI_API_KEY,
-    },
-  });
-  console.log(JSON.stringify(logObj));
-}
-logConfig();
-
-export function logInfo(message) {
-  const additionalData = VERBOSE_MODE ? { verbose: true } : {};
-  const logObj = formatLogEntry("info", message, additionalData);
-  console.log(JSON.stringify(logObj));
-}
-
-export function logError(message, error) {
-  const additionalData = { error: error ? error.toString() : undefined };
-  if (VERBOSE_MODE && error && error.stack) {
-    additionalData.stack = error.stack;
-  }
-  const logObj = formatLogEntry("error", message, additionalData);
-  console.error(JSON.stringify(logObj));
-}
-
-export function createSQSEventFromDigest(digest) {
-  return {
-    Records: [
-      {
-        eventVersion: "2.0",
-        eventSource: "aws:sqs",
-        eventTime: new Date().toISOString(),
-        eventName: "SendMessage",
-        body: JSON.stringify(digest),
-      },
-    ],
-  };
-}
-
-export async function digestLambdaHandler(sqsEvent) {
-  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);
-
-  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];
-
-  const batchItemFailures = [];
-
-  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {
-    try {
-      const digest = JSON.parse(sqsEventRecord.body);
-      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);
-    } catch (error) {
-      const recordId =
-        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${randomUUID()}`;
-      logError(`Error processing record ${recordId} at index ${index}`, error);
-      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);
-      batchItemFailures.push({ itemIdentifier: recordId });
-    }
-  }
-
-  return {
-    batchItemFailures,
-    handler: "src/lib/main.digestLambdaHandler",
-  };
-}
-
-// ---------------------------------------------------------------------------------------------------------------------
-// CLI Helper Functions
-// ---------------------------------------------------------------------------------------------------------------------
-
-function generateUsage() {
-  return `
-Usage:
-  --help                     Show this help message and usage instructions.
-  --mission                  Show the project mission statement.
-  --digest                   Run a full bucket replay simulating an SQS event.
-  --version                  Show version information with current timestamp.
-`;
-}
-
-function processHelp(args) {
-  if (args.includes("--help")) {
-    console.log(generateUsage());
-    return true;
-  }
-  return false;
-}
-
-async function processMission(args) {
-  if (args.includes("--mission")) {
-    try {
-      const missionPath = path.resolve(process.cwd(), "MISSION.md");
-      const content = await readFile(missionPath, "utf8");
-      console.log(content);
-    } catch (error) {
-      logError("Failed to read mission file", error);
-    }
-    return true;
-  }
-  return false;
-}
-
-async function processVersion(args) {
-  if (args.includes("--version")) {
-    try {
-      const { readFileSync } = await import("fs");
-      const packageJsonPath = new URL("../../package.json", import.meta.url);
-      const packageJson = JSON.parse(readFileSync(packageJsonPath, "utf8"));
-      const versionInfo = {
-        version: packageJson.version,
-        timestamp: new Date().toISOString(),
-      };
-      console.log(JSON.stringify(versionInfo));
-    } catch (error) {
-      logError("Failed to retrieve version", error);
-    }
-    return true;
-  }
-  return false;
-}
-
-async function processDigest(args) {
-  if (args.includes("--digest")) {
-    const exampleDigest = {
-      key: "events/1.json",
-      value: "12345",
-      lastModified: new Date().toISOString(),
-    };
-    const sqsEvent = createSQSEventFromDigest(exampleDigest);
-    await digestLambdaHandler(sqsEvent);
-    return true;
-  }
-  return false;
-}
+Library documents:
+LIBRARY_DOCUMENTS_START
 
-// ---------------------------------------------------------------------------------------------------------------------
-// Main CLI
-// ---------------------------------------------------------------------------------------------------------------------
+LIBRARY_DOCUMENTS_END
 
-export async function main(args = process.argv.slice(2)) {
-  if (await processMission(args)) {
-    if (VERBOSE_STATS) {
-      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
-    }
-    return;
-  }
-  if (processHelp(args)) {
-    if (VERBOSE_STATS) {
-      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
-    }
-    return;
-  }
-  if (await processVersion(args)) {
-    if (VERBOSE_STATS) {
-      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
-    }
-    return;
-  }
-  if (await processDigest(args)) {
-    if (VERBOSE_STATS) {
-      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
-    }
-    return;
-  }
-
-  console.log("No command argument supplied.");
-  console.log(generateUsage());
-  if (VERBOSE_STATS) {
-    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));
-  }
-}
-
-if (process.argv[1] === fileURLToPath(import.meta.url)) {
-  (async () => {
-    try {
-      await main();
-    } catch (err) {
-      logError("Fatal error in main execution", err);
-      process.exit(1);
-    }
-  })();
-}
+Rejected feature names:
+REJECTED_FEATURES_START
 
+REJECTED_FEATURES_END
 
+Source files:
+SOURCE_FILES_START
 File: src/lib/main.js
 #!/usr/bin/env node
 // src/lib/main.js
@@ -498,40 +300,8 @@ if (process.argv[1] === fileURLToPath(import.meta.url)) {
 
 SOURCE_FILES_END
 
-Test files (for context only, DO NOT UPDATE):
+Test files:
 TEST_FILES_START
-File: sandbox/tests/main.mission.test.js
-import { describe, test, expect, vi, beforeEach } from "vitest";
-
-// Mock fs/promises for readFile
-vi.mock("fs/promises", () => ({
-  readFile: vi.fn(),
-}));
-
-import path from "path";
-import { main } from "../source/main.js";
-import { readFile } from "fs/promises";
-
-describe("--mission flag", () => {
-  beforeEach(() => {
-    vi.clearAllMocks();
-  });
-
-  test("should read and print mission statement and exit early", async () => {
-    const sampleMarkdown = "# Sample Mission";
-    readFile.mockResolvedValue(sampleMarkdown);
-    const consoleSpy = vi.spyOn(console, "log").mockImplementation(() => {});
-
-    await main(["--mission"]);
-
-    expect(readFile).toHaveBeenCalledWith(path.resolve(process.cwd(), "MISSION.md"), "utf8");
-    expect(consoleSpy).toHaveBeenCalledWith(sampleMarkdown);
-
-    consoleSpy.mockRestore();
-  });
-});
-
-
 File: tests/unit/main.test.js
 import { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from "vitest";
 
@@ -603,118 +373,19 @@ describe("Index Module Exports", () => {
 
 TEST_FILES_END
 
-Documentation files (to be updated if necessary):
+Documentation files:
 DOCS_FILES_START
-File: sandbox/docs/USAGE.md
-# CLI Usage
-
-The **agentic-lib** library provides both a sandbox CLI and a core CLI for interacting with its features.
-
-## Sandbox CLI
-
-Use the sandbox CLI to experiment locally:
-
-```bash
-node sandbox/source/main.js [options]
-```
-
-Available options:
-
-- `--help`     Show this help message and usage instructions.
-- `--mission`  Show the project mission statement.
-- `--digest`   Run a full bucket replay simulating an SQS event.
-- `--version`  Show version information with current timestamp.
-
-**Example: Show the mission statement**
-
-```bash
-node sandbox/source/main.js --mission
-```
-
-## Core CLI
-
-Use the core CLI for production workflows:
-
-```bash
-node src/lib/main.js [options]
-```
-
-Available options:
-
-- `--help`     Show this help message and usage instructions.
-- `--mission`  Show the project mission statement.
-- `--digest`   Run a full bucket replay simulating an SQS event.
-- `--version`  Show version information with current timestamp.
-
-**Example: Show the mission statement**
-
-```bash
-node src/lib/main.js --mission
-```
-
-## Links
-
-- Mission Statement: [MISSION.md](../MISSION.md)
-- Contributing Guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)
+File: sandbox/docs
 
 
 DOCS_FILES_END
 
-README file (primary focus, to be updated): sandbox/README.md
+README file: sandbox/README.md
 README_FILE_START
-# agentic-lib
-
-Agentic-lib is a JavaScript library designed to power automated GitHub workflows in an “agentic” manner, enabling autonomous workflows to communicate through branches and issues. It can be used as a drop-in JS implementation or replacement for steps, jobs, and reusable workflows in your repository.
-
-**Mission:** [Mission Statement](../MISSION.md)
-
-**Contributing:** [Contributing Guidelines](../CONTRIBUTING.md)  
-**License:** [MIT License](../LICENSE-MIT)
-
-**Repository:** https://github.com/xn-intenton-z2a/agentic-lib
-
----
-
-# Usage
-
-## Sandbox CLI
-
-Use the sandbox CLI to experiment locally:
-
-```bash
-node sandbox/source/main.js [options]
-```
-
-**Example: Show the mission statement**
-
-```bash
-node sandbox/source/main.js --mission
-```
-
-## Core CLI
-
-Use the core CLI for production workflows:
-
-```bash
-node src/lib/main.js [options]
-```
-
-**Example: Show the mission statement**
-
-```bash
-node src/lib/main.js --mission
-```
-
-## Options
-
-- `--help`                     Show this help message and usage instructions.
-- `--mission`                  Show the project mission statement.
-- `--digest`                   Run a full bucket replay simulating an SQS event.
-- `--version`                  Show version information with current timestamp.
 
 README_FILE_END
 
-MISSION file (for context, read only): MISSION.md
+MISSION file: MISSION.md
 MISSION_FILE_START
 # Mission Statement
 
@@ -726,7 +397,7 @@ invoked using GitHub’s `workflow_call` event, so they can be composed together
 
 MISSION_FILE_END
 
-Contributing file (for context, read only): CONTRIBUTING.md
+Contributing file: CONTRIBUTING.md
 CONTRIBUTING_FILE_START
 # agentic‑lib
 
@@ -806,11 +477,11 @@ paths:
 
 CONTRIBUTING_FILE_END
 
-Dependencies file (for context, read only): package.json
+Dependencies file: package.json
 DEPENDENCIES_FILE_START
 {
   "name": "@xn-intenton-z2a/agentic-lib",
-  "version": "6.7.1-0",
+  "version": "6.7.3-0",
   "description": "Agentic-lib Agentic Coding Systems SDK powering automated GitHub workflows.",
   "type": "module",
   "main": "src/lib/main.js",
@@ -877,74 +548,43 @@ DEPENDENCIES_FILE_START
   }
 }
 
-DEPENDENCIES_FILE_END   
-
-Dependencies install from command: npm install
-DEPENDENCIES_INSTALL_START
-npm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.
-npm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead
-npm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported
-npm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead
-npm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported
-npm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead
-npm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.
-
-added 605 packages, and audited 606 packages in 5s
-
-162 packages are looking for funding
-  run `npm fund` for details
-
-found 0 vulnerabilities
-DEPENDENCIES_INSTALL_END    
-
-Build output from command: npm run build
-BUILD_OUTPUT_START
-
-> @xn-intenton-z2a/agentic-lib@6.7.1-0 build
-> echo "Nothing to build"
-
-Nothing to build
-BUILD_OUTPUT_END      
-
-Test output from command: npm test
-TEST_OUTPUT_START
-
-> @xn-intenton-z2a/agentic-lib@6.7.1-0 test
-> vitest tests/unit/*.test.js sandbox/tests/*.test.js
-
-
-[1m[46m RUN [49m[22m [36mv3.1.3 [39m[90m/home/runner/work/agentic-lib/agentic-lib[39m
-
- [32m✓[39m tests/unit/module-index.test.js [2m([22m[2m1 test[22m[2m)[22m[32m 3[2mms[22m[39m
-[90mstdout[2m | tests/unit/main.test.js
-[22m[39m{"level":"info","timestamp":"2025-05-19T08:52:28.471Z","message":"Configuration loaded","config":{"GITHUB_API_BASE_URL":"https://api.github.com.test/","OPENAI_API_KEY":"key-test"}}
-
-[90mstdout[2m | sandbox/tests/main.mission.test.js
-[22m[39m{"level":"info","timestamp":"2025-05-19T08:52:28.471Z","message":"Configuration loaded","config":{"GITHUB_API_BASE_URL":"https://api.github.com.test/","OPENAI_API_KEY":"key-test"}}
-
- [32m✓[39m tests/unit/main.test.js [2m([22m[2m1 test[22m[2m)[22m[32m 74[2mms[22m[39m
- [32m✓[39m sandbox/tests/main.mission.test.js [2m([22m[2m1 test[22m[2m)[22m[32m 5[2mms[22m[39m
-
-[2m Test Files [22m [1m[32m3 passed[39m[22m[90m (3)[39m
-[2m      Tests [22m [1m[32m3 passed[39m[22m[90m (3)[39m
-[2m   Start at [22m 08:52:28
-[2m   Duration [22m 397ms[2m (transform 133ms, setup 0ms, collect 179ms, tests 82ms, environment 1ms, prepare 295ms)[22m
-TEST_OUTPUT_END            
-
-Main execution output from command: npm run start
-MAIN_OUTPUT_START
-
-> @xn-intenton-z2a/agentic-lib@6.7.1-0 start
-> node src/lib/main.js
-
-{"level":"info","timestamp":"2025-05-19T08:52:28.690Z","message":"Configuration loaded","config":{}}
-No command argument supplied.
-
-Usage:
-  --help                     Show this help message and usage instructions.
-  --digest                   Run a full bucket replay simulating an SQS event.
-  --version                  Show version information with current timestamp.
-MAIN_OUTPUT_END    
+DEPENDENCIES_FILE_END
+
+Dependencies list from command: npm list
+DEPENDENCIES_LIST_START
+@xn-intenton-z2a/agentic-lib@6.7.3-0 /home/runner/work/agentic-lib/agentic-lib
+├── @aws-sdk/client-lambda@3.812.0
+├── @microsoft/eslint-formatter-sarif@3.1.0
+├── @vitest/coverage-v8@3.1.3
+├── @xn-intenton-z2a/s3-sqs-bridge@0.24.0
+├── aws-cdk@2.1016.0
+├── chalk@5.4.1
+├── change-case@5.4.4
+├── dayjs@1.11.13
+├── dotenv@16.5.0
+├── ejs@3.1.10
+├── eslint-config-google@0.14.0
+├── eslint-config-prettier@8.10.0
+├── eslint-plugin-import@2.31.0
+├── eslint-plugin-prettier@5.4.0
+├── eslint-plugin-promise@7.2.1
+├── eslint-plugin-react@7.37.5
+├── eslint-plugin-security@3.0.1
+├── eslint-plugin-sonarjs@3.0.2
+├── eslint@9.27.0
+├── figlet@1.8.1
+├── js-yaml@4.1.0
+├── lodash@4.17.21
+├── markdown-it-github@0.5.0
+├── markdown-it@14.1.0
+├── minimatch@10.0.1
+├── npm-check-updates@18.0.1
+├── openai@4.100.0
+├── prettier@3.5.3
+├── seedrandom@3.0.5
+├── vitest@3.1.3
+└── zod@3.24.4
+DEPENDENCIES_LIST_END    
 
 Agent configuration file:
 AGENT_CONFIG_FILE_START
@@ -1032,57 +672,10 @@ intentionBot:
 
 AGENT_CONFIG_FILE_END
 
-Please produce updated versions of the README and documentation files to ensure they accurately reflect the current state of the codebase.
-Remember:
-1. The README is the primary focus, but other documentation files can be updated as well if needed
-2. Source files (srcFiles) and test files (testFiles) should NOT be updated
-3. Preserve existing README content even if it describes features not yet implemented
-4. Update the README if it conflicts with current source code, tests, or documentation
-5. If documentation files are out of date compared to the source code or tests, update them to be consistent
-
-If there are no changes required, please provide the original content and state that no changes are necessary in the message.
-
-Paths in (updatedFile01Filepath, updatedFile02Filepath, etc...) must begin with one of: sandbox/SOURCES.md;sandbox/library/;sandbox/features/;sandbox/tests/;sandbox/source/;sandbox/docs/;sandbox/README.md
-
 Answer strictly with a JSON object following this schema:
 {
-  "message": "A short sentence explaining the changes applied (or why no changes were applied) suitable for a commit message or PR text.",
-  "updatedFile01Filepath": "sandbox/README.md",
-  "updatedFile01Contents": "The entire new content of the README file, with all necessary changes applied, if any.",
-  "updatedFile02Filepath":  "sandbox/docs/USAGE.md",
-  "updatedFile02Contents": "The entire new content of the file, with all necessary changes applied, if any.",
-  "updatedFile03Filepath": "unused",
-  "updatedFile03Contents": "unused",
-  "updatedFile04Filepath": "unused",
-  "updatedFile04Contents": "unused",
-  "updatedFile05Filepath": "unused",
-  "updatedFile05Contents": "unused",
-  "updatedFile06Filepath": "unused",
-  "updatedFile06Contents": "unused",
-  "updatedFile07Filepath": "unused",
-  "updatedFile07Contents": "unused",
-  "updatedFile08Filepath": "unused",
-  "updatedFile08Contents": "unused",
-  "updatedFile09Filepath": "unused",
-  "updatedFile09Contents": "unused",
-  "updatedFile10Filepath": "unused",
-  "updatedFile10Contents": "unused",
-  "updatedFile11Filepath": "unused",
-  "updatedFile11Contents": "unused",
-  "updatedFile12Filepath": "unused",
-  "updatedFile12Contents": "unused",
-  "updatedFile13Filepath": "unused",
-  "updatedFile13Contents": "unused",
-  "updatedFile14Filepath": "unused",
-  "updatedFile14Contents": "unused",
-  "updatedFile15Filepath": "unused",
-  "updatedFile15Contents": "unused",
-  "updatedFile16Filepath": "unused",
-  "updatedFile16Contents": "unused"
+  "featureName": "The feature name as one or two words in SCREAMING_SNAKECASE.",
+  "featureSpec": "The feature specification as multiline markdown with a few level 1 headings.",
+  "featureNamesToBeDeleted": "The comma separated list of feature names to be deleted or 'none' if no feature is to be deleted."
 }
-
-You can include up to 16 files using the updatedFileXXName and updatedFileXXContents pairs (where XX is a number from 01 to 16)
-Where a file name and contents slot is not used, populate tha name with "unused" and the contents with "unused".
-Never truncate the files, when returning a file, always return the entire file content.
-
 Ensure valid JSON.
diff --git a/request.json b/request.json
index da950739..d9c3ce39 100644
--- a/request.json
+++ b/request.json
@@ -3,189 +3,39 @@
   "messages": [
     {
       "role": "system",
-      "content": "You are a documentation updater that returns updated README and documentation file contents to ensure they accurately reflect the current state of the codebase. You can update multiple files by specifying their paths and contents in the updatedFiles object. Answer strictly with a JSON object that adheres to the provided function schema."
+      "content": "You are maintaining a feature set by providing expert contemporary insight into both the product market and you will perform a detailed analysis of the current state of the repository and current feature set in search of value opportunities and unique selling points. Answer strictly with a JSON object following the provided function schema."
     },
     {
       "role": "user",
-      "content": "\nYou are providing updates to the README.md file and other documentation files to ensure they accurately reflect the current state of the codebase and emphasize content that delivers substantial user value and addresses core implementation needs.\n\nThe README is the primary focus, but other documentation files can be updated as well if needed. Source files (srcFiles) and test files (testFiles) should NOT be updated.\n\nWhen updating the README:\n1. Preserve existing README content that delivers substantial user value, even if it describes features not yet implemented\n2. Update the README if it conflicts with current source code, tests, or documentation, prioritizing content that directly enhances the product's primary purpose\n3. If documentation files are out of date compared to the source code or tests, update them to be consistent, focusing on high-impact information that enables immediate application rather than superficial descriptions\n4. Ensure documentation clearly communicates the core functionality and value proposition of the product, prioritizing content that helps users solve real problems\n\nApply the contributing guidelines to your response and when suggesting enhancements consider the tone and direction of the contributing guidelines. Focus on documentation improvements that deliver measurable value to users rather than cosmetic changes or excessive detail on edge cases.\n\nYou may only change the files provided in the prompt context. You can update multiple files by specifying their paths and contents in the updatedFiles object. Each file will be checked against the allowedFilepathPatterns before being written.\n\nConsider the following when refining your response:\n  * Current feature names and specifications in the repository\n  * Source file content (for context only)\n  * Test file content (for context only)\n  * Documentation file content\n  * README file content\n  * MISSION file content\n  * Contributing file content\n  * Dependencies file content\n  * Dependency install output\n  * Issue details (if any)\n  * Build output\n  * Test output\n  * Main execution output\n  * Agent configuration file content\n\nCurrent feature names and specifications (for context, read only):\nCURRENT_FEATURES_START\nfind: ‘features/’: No such file or directory\nnone\nCURRENT_FEATURES_END\n\nSource files (for context only, DO NOT UPDATE):\nSOURCE_FILES_START\nFile: sandbox/source/main.js\n#!/usr/bin/env node\n// sandbox/source/main.js\n\n// Initialize global callCount to support test mocks that reference it\nif (typeof globalThis.callCount === \"undefined\") {\n  globalThis.callCount = 0;\n}\n\nimport { fileURLToPath } from \"url\";\nimport { readFile } from \"fs/promises\";\nimport path from \"path\";\nimport { z } from \"zod\";\nimport dotenv from \"dotenv\";\nimport { randomUUID } from \"crypto\";\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Environment configuration from .env file or environment variables or test values.\n// ---------------------------------------------------------------------------------------------------------------------\n\ndotenv.config();\n\nif (process.env.VITEST || process.env.NODE_ENV === \"development\") {\n  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || \"https://api.github.com.test/\";\n  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || \"key-test\";\n}\n\nconst configSchema = z.object({\n  GITHUB_API_BASE_URL: z.string().optional(),\n  OPENAI_API_KEY: z.string().optional(),\n});\n\nexport const config = configSchema.parse(process.env);\n\n// Global verbose mode flag\nconst VERBOSE_MODE = false;\n// Global verbose stats flag\nconst VERBOSE_STATS = false;\n\n// Helper function to format log entries\nfunction formatLogEntry(level, message, additionalData = {}) {\n  return {\n    level,\n    timestamp: new Date().toISOString(),\n    message,\n    ...additionalData,\n  };\n}\n\nexport function logConfig() {\n  const logObj = formatLogEntry(\"info\", \"Configuration loaded\", {\n    config: {\n      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,\n      OPENAI_API_KEY: config.OPENAI_API_KEY,\n    },\n  });\n  console.log(JSON.stringify(logObj));\n}\nlogConfig();\n\nexport function logInfo(message) {\n  const additionalData = VERBOSE_MODE ? { verbose: true } : {};\n  const logObj = formatLogEntry(\"info\", message, additionalData);\n  console.log(JSON.stringify(logObj));\n}\n\nexport function logError(message, error) {\n  const additionalData = { error: error ? error.toString() : undefined };\n  if (VERBOSE_MODE && error && error.stack) {\n    additionalData.stack = error.stack;\n  }\n  const logObj = formatLogEntry(\"error\", message, additionalData);\n  console.error(JSON.stringify(logObj));\n}\n\nexport function createSQSEventFromDigest(digest) {\n  return {\n    Records: [\n      {\n        eventVersion: \"2.0\",\n        eventSource: \"aws:sqs\",\n        eventTime: new Date().toISOString(),\n        eventName: \"SendMessage\",\n        body: JSON.stringify(digest),\n      },\n    ],\n  };\n}\n\nexport async function digestLambdaHandler(sqsEvent) {\n  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);\n\n  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];\n\n  const batchItemFailures = [];\n\n  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {\n    try {\n      const digest = JSON.parse(sqsEventRecord.body);\n      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);\n    } catch (error) {\n      const recordId =\n        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${randomUUID()}`;\n      logError(`Error processing record ${recordId} at index ${index}`, error);\n      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);\n      batchItemFailures.push({ itemIdentifier: recordId });\n    }\n  }\n\n  return {\n    batchItemFailures,\n    handler: \"src/lib/main.digestLambdaHandler\",\n  };\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// CLI Helper Functions\n// ---------------------------------------------------------------------------------------------------------------------\n\nfunction generateUsage() {\n  return `\nUsage:\n  --help                     Show this help message and usage instructions.\n  --mission                  Show the project mission statement.\n  --digest                   Run a full bucket replay simulating an SQS event.\n  --version                  Show version information with current timestamp.\n`;\n}\n\nfunction processHelp(args) {\n  if (args.includes(\"--help\")) {\n    console.log(generateUsage());\n    return true;\n  }\n  return false;\n}\n\nasync function processMission(args) {\n  if (args.includes(\"--mission\")) {\n    try {\n      const missionPath = path.resolve(process.cwd(), \"MISSION.md\");\n      const content = await readFile(missionPath, \"utf8\");\n      console.log(content);\n    } catch (error) {\n      logError(\"Failed to read mission file\", error);\n    }\n    return true;\n  }\n  return false;\n}\n\nasync function processVersion(args) {\n  if (args.includes(\"--version\")) {\n    try {\n      const { readFileSync } = await import(\"fs\");\n      const packageJsonPath = new URL(\"../../package.json\", import.meta.url);\n      const packageJson = JSON.parse(readFileSync(packageJsonPath, \"utf8\"));\n      const versionInfo = {\n        version: packageJson.version,\n        timestamp: new Date().toISOString(),\n      };\n      console.log(JSON.stringify(versionInfo));\n    } catch (error) {\n      logError(\"Failed to retrieve version\", error);\n    }\n    return true;\n  }\n  return false;\n}\n\nasync function processDigest(args) {\n  if (args.includes(\"--digest\")) {\n    const exampleDigest = {\n      key: \"events/1.json\",\n      value: \"12345\",\n      lastModified: new Date().toISOString(),\n    };\n    const sqsEvent = createSQSEventFromDigest(exampleDigest);\n    await digestLambdaHandler(sqsEvent);\n    return true;\n  }\n  return false;\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Main CLI\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport async function main(args = process.argv.slice(2)) {\n  if (await processMission(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (processHelp(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processVersion(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processDigest(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n\n  console.log(\"No command argument supplied.\");\n  console.log(generateUsage());\n  if (VERBOSE_STATS) {\n    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n  }\n}\n\nif (process.argv[1] === fileURLToPath(import.meta.url)) {\n  (async () => {\n    try {\n      await main();\n    } catch (err) {\n      logError(\"Fatal error in main execution\", err);\n      process.exit(1);\n    }\n  })();\n}\n\n\nFile: src/lib/main.js\n#!/usr/bin/env node\n// src/lib/main.js\n\n// Initialize global callCount to support test mocks that reference it\nif (typeof globalThis.callCount === \"undefined\") {\n  globalThis.callCount = 0;\n}\n\nimport { fileURLToPath } from \"url\";\nimport { z } from \"zod\";\nimport dotenv from \"dotenv\";\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Environment configuration from .env file or environment variables or test values.\n// ---------------------------------------------------------------------------------------------------------------------\n\ndotenv.config();\n\nif (process.env.VITEST || process.env.NODE_ENV === \"development\") {\n  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || \"https://api.github.com.test/\";\n  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || \"key-test\";\n}\n\nconst configSchema = z.object({\n  GITHUB_API_BASE_URL: z.string().optional(),\n  OPENAI_API_KEY: z.string().optional(),\n});\n\nexport const config = configSchema.parse(process.env);\n\n// Global verbose mode flag\nconst VERBOSE_MODE = false;\n// Global verbose stats flag\nconst VERBOSE_STATS = false;\n\n// Helper function to format log entries\nfunction formatLogEntry(level, message, additionalData = {}) {\n  return {\n    level,\n    timestamp: new Date().toISOString(),\n    message,\n    ...additionalData,\n  };\n}\n\nexport function logConfig() {\n  const logObj = formatLogEntry(\"info\", \"Configuration loaded\", {\n    config: {\n      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,\n      OPENAI_API_KEY: config.OPENAI_API_KEY,\n    },\n  });\n  console.log(JSON.stringify(logObj));\n}\nlogConfig();\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Utility functions\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport function logInfo(message) {\n  const additionalData = VERBOSE_MODE ? { verbose: true } : {};\n  const logObj = formatLogEntry(\"info\", message, additionalData);\n  console.log(JSON.stringify(logObj));\n}\n\nexport function logError(message, error) {\n  const additionalData = { error: error ? error.toString() : undefined };\n  if (VERBOSE_MODE && error && error.stack) {\n    additionalData.stack = error.stack;\n  }\n  const logObj = formatLogEntry(\"error\", message, additionalData);\n  console.error(JSON.stringify(logObj));\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// AWS Utility functions\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport function createSQSEventFromDigest(digest) {\n  return {\n    Records: [\n      {\n        eventVersion: \"2.0\",\n        eventSource: \"aws:sqs\",\n        eventTime: new Date().toISOString(),\n        eventName: \"SendMessage\",\n        body: JSON.stringify(digest),\n      },\n    ],\n  };\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// SQS Lambda Handlers\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport async function digestLambdaHandler(sqsEvent) {\n  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);\n\n  // If event.Records is an array, use it. Otherwise, treat the event itself as one record.\n  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];\n\n  // Array to collect the identifiers of the failed records\n  const batchItemFailures = [];\n\n  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {\n    try {\n      const digest = JSON.parse(sqsEventRecord.body);\n      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);\n    } catch (error) {\n      // If messageId is missing, generate a fallback identifier including record index\n      const recordId =\n        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;\n      logError(`Error processing record ${recordId} at index ${index}`, error);\n      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);\n      batchItemFailures.push({ itemIdentifier: recordId });\n    }\n  }\n\n  // Return the list of failed messages so that AWS SQS can attempt to reprocess them.\n  return {\n    batchItemFailures,\n    handler: \"src/lib/main.digestLambdaHandler\",\n  };\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// CLI Helper Functions\n// ---------------------------------------------------------------------------------------------------------------------\n\n// Function to generate CLI usage instructions\nfunction generateUsage() {\n  return `\nUsage:\n  --help                     Show this help message and usage instructions.\n  --digest                   Run a full bucket replay simulating an SQS event.\n  --version                  Show version information with current timestamp.\n`;\n}\n\n// Process the --help flag\nfunction processHelp(args) {\n  if (args.includes(\"--help\")) {\n    console.log(generateUsage());\n    return true;\n  }\n  return false;\n}\n\n// Process the --version flag\nasync function processVersion(args) {\n  if (args.includes(\"--version\")) {\n    try {\n      const { readFileSync } = await import(\"fs\");\n      const packageJsonPath = new URL(\"../../package.json\", import.meta.url);\n      const packageJson = JSON.parse(readFileSync(packageJsonPath, \"utf8\"));\n      const versionInfo = {\n        version: packageJson.version,\n        timestamp: new Date().toISOString(),\n      };\n      console.log(JSON.stringify(versionInfo));\n    } catch (error) {\n      logError(\"Failed to retrieve version\", error);\n    }\n    return true;\n  }\n  return false;\n}\n\n// Process the --digest flag\nasync function processDigest(args) {\n  if (args.includes(\"--digest\")) {\n    const exampleDigest = {\n      key: \"events/1.json\",\n      value: \"12345\",\n      lastModified: new Date().toISOString(),\n    };\n    const sqsEvent = createSQSEventFromDigest(exampleDigest);\n    await digestLambdaHandler(sqsEvent);\n    return true;\n  }\n  return false;\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Main CLI\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport async function main(args = process.argv.slice(2)) {\n  if (processHelp(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processVersion(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processDigest(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n\n  console.log(\"No command argument supplied.\");\n  console.log(generateUsage());\n  if (VERBOSE_STATS) {\n    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n  }\n}\n\n// if (import.meta.url.endsWith(process.argv[1])) {\nif (process.argv[1] === fileURLToPath(import.meta.url)) {\n  main().catch((err) => {\n    logError(\"Fatal error in main execution\", err);\n    process.exit(1);\n  });\n}\n\n\nSOURCE_FILES_END\n\nTest files (for context only, DO NOT UPDATE):\nTEST_FILES_START\nFile: sandbox/tests/main.mission.test.js\nimport { describe, test, expect, vi, beforeEach } from \"vitest\";\n\n// Mock fs/promises for readFile\nvi.mock(\"fs/promises\", () => ({\n  readFile: vi.fn(),\n}));\n\nimport path from \"path\";\nimport { main } from \"../source/main.js\";\nimport { readFile } from \"fs/promises\";\n\ndescribe(\"--mission flag\", () => {\n  beforeEach(() => {\n    vi.clearAllMocks();\n  });\n\n  test(\"should read and print mission statement and exit early\", async () => {\n    const sampleMarkdown = \"# Sample Mission\";\n    readFile.mockResolvedValue(sampleMarkdown);\n    const consoleSpy = vi.spyOn(console, \"log\").mockImplementation(() => {});\n\n    await main([\"--mission\"]);\n\n    expect(readFile).toHaveBeenCalledWith(path.resolve(process.cwd(), \"MISSION.md\"), \"utf8\");\n    expect(consoleSpy).toHaveBeenCalledWith(sampleMarkdown);\n\n    consoleSpy.mockRestore();\n  });\n});\n\n\nFile: tests/unit/main.test.js\nimport { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from \"vitest\";\n\n// Ensure that the global callCount is reset before tests that rely on it\nbeforeAll(() => {\n  globalThis.callCount = 0;\n});\n\n// Reset callCount before each test in agenticHandler tests\nbeforeEach(() => {\n  globalThis.callCount = 0;\n});\n\n// Clear all mocks after each test to tidy up\nafterEach(() => {\n  vi.clearAllMocks();\n});\n\n// Use dynamic import for the module to ensure mocks are applied correctly\nlet agenticLib;\n\n// Default mock for openai used by tests that don't override it\nvi.mock(\"openai\", () => {\n  return {\n    Configuration: (config) => config,\n    OpenAIApi: class {\n      async createChatCompletion() {\n        const dummyResponse = { fixed: \"true\", message: \"dummy success\", refinement: \"none\" };\n        return {\n          data: {\n            choices: [{ message: { content: JSON.stringify(dummyResponse) } }]\n          }\n        };\n      }\n    }\n  };\n});\n\n// Re-import the module after setting up the default mock\nbeforeAll(async () => {\n  agenticLib = await import(\"../../src/lib/main.js\");\n});\n\ndescribe(\"Main Module Import\", () => {\n  test(\"should be non-null\", async () => {\n    const mainModule = await import(\"../../src/lib/main.js\");\n    expect(mainModule).not.toBeNull();\n  });\n});\n\n\nFile: tests/unit/module-index.test.js\n// tests/unit/module-index.test.js\n// src/lib/main.js\n//\n// This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib\n// This file is licensed under the MIT License. For details, see LICENSE-MIT\n//\n\nimport { describe, test, expect } from \"vitest\";\nimport anything from \"@src/index.js\";\n\ndescribe(\"Index Module Exports\", () => {\n  test(\"module index should be defined\", () => {\n    expect(anything).toBeUndefined();\n  });\n});\n\n\nTEST_FILES_END\n\nDocumentation files (to be updated if necessary):\nDOCS_FILES_START\nFile: sandbox/docs/USAGE.md\n# CLI Usage\n\nThe **agentic-lib** library provides both a sandbox CLI and a core CLI for interacting with its features.\n\n## Sandbox CLI\n\nUse the sandbox CLI to experiment locally:\n\n```bash\nnode sandbox/source/main.js [options]\n```\n\nAvailable options:\n\n- `--help`     Show this help message and usage instructions.\n- `--mission`  Show the project mission statement.\n- `--digest`   Run a full bucket replay simulating an SQS event.\n- `--version`  Show version information with current timestamp.\n\n**Example: Show the mission statement**\n\n```bash\nnode sandbox/source/main.js --mission\n```\n\n## Core CLI\n\nUse the core CLI for production workflows:\n\n```bash\nnode src/lib/main.js [options]\n```\n\nAvailable options:\n\n- `--help`     Show this help message and usage instructions.\n- `--mission`  Show the project mission statement.\n- `--digest`   Run a full bucket replay simulating an SQS event.\n- `--version`  Show version information with current timestamp.\n\n**Example: Show the mission statement**\n\n```bash\nnode src/lib/main.js --mission\n```\n\n## Links\n\n- Mission Statement: [MISSION.md](../MISSION.md)\n- Contributing Guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)\n\n\nDOCS_FILES_END\n\nREADME file (primary focus, to be updated): sandbox/README.md\nREADME_FILE_START\n# agentic-lib\n\nAgentic-lib is a JavaScript library designed to power automated GitHub workflows in an “agentic” manner, enabling autonomous workflows to communicate through branches and issues. It can be used as a drop-in JS implementation or replacement for steps, jobs, and reusable workflows in your repository.\n\n**Mission:** [Mission Statement](../MISSION.md)\n\n**Contributing:** [Contributing Guidelines](../CONTRIBUTING.md)  \n**License:** [MIT License](../LICENSE-MIT)\n\n**Repository:** https://github.com/xn-intenton-z2a/agentic-lib\n\n---\n\n# Usage\n\n## Sandbox CLI\n\nUse the sandbox CLI to experiment locally:\n\n```bash\nnode sandbox/source/main.js [options]\n```\n\n**Example: Show the mission statement**\n\n```bash\nnode sandbox/source/main.js --mission\n```\n\n## Core CLI\n\nUse the core CLI for production workflows:\n\n```bash\nnode src/lib/main.js [options]\n```\n\n**Example: Show the mission statement**\n\n```bash\nnode src/lib/main.js --mission\n```\n\n## Options\n\n- `--help`                     Show this help message and usage instructions.\n- `--mission`                  Show the project mission statement.\n- `--digest`                   Run a full bucket replay simulating an SQS event.\n- `--version`                  Show version information with current timestamp.\n\nREADME_FILE_END\n\nMISSION file (for context, read only): MISSION.md\nMISSION_FILE_START\n# Mission Statement\n\n**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for \nthe steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions \nworkflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate\nthrough branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be\ninvoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.\n\nMISSION_FILE_END\n\nContributing file (for context, read only): CONTRIBUTING.md\nCONTRIBUTING_FILE_START\n# agentic‑lib\n\nThis document outlines our guidelines for human and automated contributions, ensuring that our core library remains \nrobust, testable, and efficient in powering our reusable GitHub Workflows.\n\n## How to Contribute\n\nThe guidelines below apply to human or automated contributions:\n\n1. **Report Issues or Ideas:**\n    - Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision.\n    - Clear descriptions and reproducible steps are highly appreciated.\n\n2. **Submit Pull Requests:**\n    - Implement your changes and push them to a new branch, ensuring you follow the \n      existing coding style and standards.\n    - Add tests to cover any new functionality.\n    - Update documentation if your changes affect usage or workflow behavior.\n    - Submit your pull request for review.\n\n## Guidelines\n\n- **Features:**\n    - Clear Objective & Scope: Define the feature with a concise description outlining its purpose, scope, and the specific problem it solves for the end user.\n    - Value Proposition: Articulate the tangible benefits of the feature, including improved functionality, performance, or user experience.\n    - Success Criteria & Requirements: List measurable success criteria and requirements, including performance benchmarks, usability standards, and stability expectations, to guide development and testing.\n    - Testability & Stability: Ensure the feature can be verified through both automated tests and user acceptance criteria. Specify any necessary rollback or fail-safe mechanisms to maintain system stability.\n    - Dependencies & Constraints: Identify any dependencies (external libraries, APIs, etc.), assumptions, and limitations that could impact feature delivery or future enhancements.\n    - User Scenarios & Examples: Provide illustrative use cases or scenarios that demonstrate how the feature will be used in real-world situations, making it easier for both developers and stakeholders to understand its impact.\n    - Verification & Acceptance: Define clear verification steps and acceptance criteria to ensure the feature meets its intended requirements. This should include detailed plans for unit tests, integration tests, manual user acceptance tests, and code reviews. Specify measurable outcomes that must be achieved for the feature to be considered successfully delivered and stable.\n\n- **Code Quality:**\n    - Ensure there are tests that cover your changes and any likely new cases they introduce.\n    - When making a change remain consistent with the existing code style and structure.\n    - When adding new functionality, consider if some unused or superseded code should be removed.\n\n- **Compatibility:**\n    - Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.\n    - Tests use vitest and competing test frameworks should not be added.\n    - Mocks in tests must not interfere with other tests.\n\n- **Testing:**\n    - The command `npm test` should invoke the tests added for the new functionality (and pass).\n    - If you add new functionality, ensure it is covered by tests.\n\n- **Documentation:**\n    - When making a change to the main source file, review the readme to see if it needs to be updated and if so, update it.\n    - Where the source exports a function, consider that part of the API of the library and document it in the readme.\n    - Where the source stands-up an HTTP endpoint, consider that part of the API of the library and document it in the readme.\n    - Include usage examples including inline code usage and CLI and HTTP invocation, API references.\n\n- **README:**\n    - The README should begin with something inspired by the mission statement and describe the current state of the repository (rather than the journey)\n    - The README should include a link to MISSION.md, CONTRIBUTING.md, LICENSE.md.\n    - The README should include a link to the intentïon `agentic-lib` GitHub Repository which is https://github.com/xn-intenton-z2a/agentic-lib.\n\n## Sandbox mode\n\nPlease note that the automation features of this repository are in sandbox mode. This means that\nautomated changes should only be applied to the sandbox paths which are shown below:\n```yaml\npaths:\n  targetTestsPath:\n    path: 'sandbox/tests/'\n    permissions: [ 'write' ]\n  targetSourcePath:\n    path: 'sandbox/source/'\n    permissions: [ 'write' ]\n  documentationPath:\n    path: 'sandbox/docs/'\n    permissions: [ 'write' ]\n  readmeFilepath:\n    path: 'sandbox/README.md'\n    permissions: [ 'write' ]\n```\n\nCONTRIBUTING_FILE_END\n\nDependencies file (for context, read only): package.json\nDEPENDENCIES_FILE_START\n{\n  \"name\": \"@xn-intenton-z2a/agentic-lib\",\n  \"version\": \"6.7.1-0\",\n  \"description\": \"Agentic-lib Agentic Coding Systems SDK powering automated GitHub workflows.\",\n  \"type\": \"module\",\n  \"main\": \"src/lib/main.js\",\n  \"scripts\": {\n    \"build\": \"echo \\\"Nothing to build\\\"\",\n    \"formatting\": \"prettier --check\",\n    \"formatting-fix\": \"prettier --write\",\n    \"linting\": \"eslint\",\n    \"linting-json\": \"eslint --format=@microsoft/eslint-formatter-sarif\",\n    \"linting-fix\": \"eslint --fix\",\n    \"update-to-minor\": \"npx npm-check-updates --upgrade --enginesNode --target minor --verbose --install always\",\n    \"update-to-greatest\": \"npx npm-check-updates --upgrade --enginesNode --target greatest --verbose --install always --reject \\\"alpha\\\"\",\n    \"test\": \"vitest tests/unit/*.test.js sandbox/tests/*.test.js\",\n    \"test:unit\": \"vitest --coverage tests/unit/*.test.js sandbox/tests/*.test.js\",\n    \"start\": \"node src/lib/main.js\"\n  },\n  \"keywords\": [],\n  \"author\": \"https://github.com/xn-intenton-z2a\",\n  \"license\": \"GPL-3.0, MIT\",\n  \"dependencies\": {\n    \"@aws-sdk/client-lambda\": \"^3.804.0\",\n    \"@xn-intenton-z2a/s3-sqs-bridge\": \"^0.24.0\",\n    \"chalk\": \"^5.4.1\",\n    \"change-case\": \"^5.4.4\",\n    \"dayjs\": \"^1.11.13\",\n    \"dotenv\": \"^16.5.0\",\n    \"ejs\": \"^3.1.10\",\n    \"figlet\": \"^1.8.1\",\n    \"js-yaml\": \"^4.1.0\",\n    \"lodash\": \"^4.17.21\",\n    \"minimatch\": \"^10.0.1\",\n    \"openai\": \"^4.97.0\",\n    \"seedrandom\": \"^3.0.5\",\n    \"zod\": \"^3.24.4\"\n  },\n  \"devDependencies\": {\n    \"@microsoft/eslint-formatter-sarif\": \"^3.1.0\",\n    \"@vitest/coverage-v8\": \"^3.1.3\",\n    \"aws-cdk\": \"^2.1013.0\",\n    \"eslint\": \"^9.25.0\",\n    \"eslint-config-google\": \"^0.14.0\",\n    \"eslint-config-prettier\": \"^8.10.0\",\n    \"eslint-plugin-import\": \"^2.31.0\",\n    \"eslint-plugin-prettier\": \"^5.4.0\",\n    \"eslint-plugin-promise\": \"^7.2.1\",\n    \"eslint-plugin-react\": \"^7.37.5\",\n    \"eslint-plugin-security\": \"^3.0.1\",\n    \"eslint-plugin-sonarjs\": \"^3.0.2\",\n    \"figlet\": \"^1.8.1\",\n    \"markdown-it\": \"^14.1.0\",\n    \"markdown-it-github\": \"^0.5.0\",\n    \"npm-check-updates\": \"^18.0.1\",\n    \"prettier\": \"^3.5.3\",\n    \"vitest\": \"^3.1.3\"\n  },\n  \"engines\": {\n    \"node\": \">=20.0.0\"\n  },\n  \"files\": [\n    \"package.json\"\n  ],\n  \"publishConfig\": {\n    \"registry\": \"https://npm.pkg.github.com\"\n  }\n}\n\nDEPENDENCIES_FILE_END   \n\nDependencies install from command: npm install\nDEPENDENCIES_INSTALL_START\nnpm warn deprecated inflight@1.0.6: This module is not supported, and leaks memory. Do not use it. Check out lru-cache if you want a good and tested way to coalesce async requests by a key value, which is much more comprehensive and powerful.\nnpm warn deprecated @humanwhocodes/config-array@0.13.0: Use @eslint/config-array instead\nnpm warn deprecated rimraf@3.0.2: Rimraf versions prior to v4 are no longer supported\nnpm warn deprecated @humanwhocodes/object-schema@2.0.3: Use @eslint/object-schema instead\nnpm warn deprecated glob@7.2.3: Glob versions prior to v9 are no longer supported\nnpm warn deprecated node-domexception@1.0.0: Use your platform's native DOMException instead\nnpm warn deprecated eslint@8.57.1: This version is no longer supported. Please see https://eslint.org/version-support for other options.\n\nadded 605 packages, and audited 606 packages in 5s\n\n162 packages are looking for funding\n  run `npm fund` for details\n\nfound 0 vulnerabilities\nDEPENDENCIES_INSTALL_END    \n\nBuild output from command: npm run build\nBUILD_OUTPUT_START\n\n> @xn-intenton-z2a/agentic-lib@6.7.1-0 build\n> echo \"Nothing to build\"\n\nNothing to build\nBUILD_OUTPUT_END      \n\nTest output from command: npm test\nTEST_OUTPUT_START\n\n> @xn-intenton-z2a/agentic-lib@6.7.1-0 test\n> vitest tests/unit/*.test.js sandbox/tests/*.test.js\n\n\n\u001b[1m\u001b[46m RUN \u001b[49m\u001b[22m \u001b[36mv3.1.3 \u001b[39m\u001b[90m/home/runner/work/agentic-lib/agentic-lib\u001b[39m\n\n \u001b[32m✓\u001b[39m tests/unit/module-index.test.js \u001b[2m(\u001b[22m\u001b[2m1 test\u001b[22m\u001b[2m)\u001b[22m\u001b[32m 3\u001b[2mms\u001b[22m\u001b[39m\n\u001b[90mstdout\u001b[2m | tests/unit/main.test.js\n\u001b[22m\u001b[39m{\"level\":\"info\",\"timestamp\":\"2025-05-19T08:52:28.471Z\",\"message\":\"Configuration loaded\",\"config\":{\"GITHUB_API_BASE_URL\":\"https://api.github.com.test/\",\"OPENAI_API_KEY\":\"key-test\"}}\n\n\u001b[90mstdout\u001b[2m | sandbox/tests/main.mission.test.js\n\u001b[22m\u001b[39m{\"level\":\"info\",\"timestamp\":\"2025-05-19T08:52:28.471Z\",\"message\":\"Configuration loaded\",\"config\":{\"GITHUB_API_BASE_URL\":\"https://api.github.com.test/\",\"OPENAI_API_KEY\":\"key-test\"}}\n\n \u001b[32m✓\u001b[39m tests/unit/main.test.js \u001b[2m(\u001b[22m\u001b[2m1 test\u001b[22m\u001b[2m)\u001b[22m\u001b[32m 74\u001b[2mms\u001b[22m\u001b[39m\n \u001b[32m✓\u001b[39m sandbox/tests/main.mission.test.js \u001b[2m(\u001b[22m\u001b[2m1 test\u001b[22m\u001b[2m)\u001b[22m\u001b[32m 5\u001b[2mms\u001b[22m\u001b[39m\n\n\u001b[2m Test Files \u001b[22m \u001b[1m\u001b[32m3 passed\u001b[39m\u001b[22m\u001b[90m (3)\u001b[39m\n\u001b[2m      Tests \u001b[22m \u001b[1m\u001b[32m3 passed\u001b[39m\u001b[22m\u001b[90m (3)\u001b[39m\n\u001b[2m   Start at \u001b[22m 08:52:28\n\u001b[2m   Duration \u001b[22m 397ms\u001b[2m (transform 133ms, setup 0ms, collect 179ms, tests 82ms, environment 1ms, prepare 295ms)\u001b[22m\nTEST_OUTPUT_END            \n\nMain execution output from command: npm run start\nMAIN_OUTPUT_START\n\n> @xn-intenton-z2a/agentic-lib@6.7.1-0 start\n> node src/lib/main.js\n\n{\"level\":\"info\",\"timestamp\":\"2025-05-19T08:52:28.690Z\",\"message\":\"Configuration loaded\",\"config\":{}}\nNo command argument supplied.\n\nUsage:\n  --help                     Show this help message and usage instructions.\n  --digest                   Run a full bucket replay simulating an SQS event.\n  --version                  Show version information with current timestamp.\nMAIN_OUTPUT_END    \n\nAgent configuration file:\nAGENT_CONFIG_FILE_START\n# Which agentic-lib workflow schedule should be used?\nschedule: schedule-3\n\n# Mapping for from symbolic keys to filepaths for access by agentic-lib workflows with limits and access permissions\npaths:\n  # Filepaths for elaborator workflows\n  missionFilepath:\n    path: 'MISSION.md'\n  librarySourcesFilepath:\n    path: 'sandbox/SOURCES.md'\n    permissions: [ 'write' ]\n    limit: 8\n  libraryDocumentsPath:\n    path: 'sandbox/library/'\n    permissions: [ 'write' ]\n    limit: 32\n  featuresPath:\n    path: 'sandbox/features/'\n    permissions: [ 'write' ]\n    limit: 1\n\n  # Filepaths for engineer workflows\n  contributingFilepath:\n    path: 'CONTRIBUTING.md'\n  targetTestsPath:\n    path: 'sandbox/tests/'\n    permissions: [ 'write' ]\n  otherTestsPaths:\n    paths: [ 'tests/unit/' ]\n  targetSourcePath:\n    path: 'sandbox/source/'\n    permissions: [ 'write' ]\n  otherSourcePaths:\n    paths: [ 'src/lib/' ]\n  dependenciesFilepath:\n    path: 'package.json'\n  documentationPath:\n    path: 'sandbox/docs/'\n    permissions: [ 'write' ]\n\n  # Filepaths for maintainer workflows\n  formattingFilepath:\n    path: '.prettierrc'\n  lintingFilepath:\n    path: 'eslint.config.js'\n  readmeFilepath:\n    path: 'sandbox/README.md'\n    permissions: [ 'write' ]\n\n# Execution commands\nbuildScript: 'npm run build'\ntestScript: 'npm test'\nmainScript: 'npm run start'\n\n# How many issues should be available to be picked up?\nfeatureDevelopmentIssuesWipLimit: 2\nmaintenanceIssuesWipLimit: 1\n\n# How many attempts should be made to work on an issue?\nattemptsPerBranch: 2\nattemptsPerIssue: 2\n\n# Web publishing\ndocRoot: 'public'\n\n# Sandbox configuration\nsandbox:\n  sandboxReset: 'true'\n  sandboxPath: 'sandbox'\n\n# Repository seeding\n#seeding:\n#  repositoryReseed: 'true'\n#  missionFilepath: 'seeds/zero-MISSION.md'\n#  sourcePath: 'seeds/zero-main.js'\n#  testsPath: 'seeds/zero-main.test.js'\n#  dependenciesFilepath: 'seeds/zero-package.json'\n#  readmeFilepath: 'seeds/zero-README.md'\n\nintentionBot:\n  intentionFilepath: 'intentïon.md'\n\nAGENT_CONFIG_FILE_END\n\nPlease produce updated versions of the README and documentation files to ensure they accurately reflect the current state of the codebase.\nRemember:\n1. The README is the primary focus, but other documentation files can be updated as well if needed\n2. Source files (srcFiles) and test files (testFiles) should NOT be updated\n3. Preserve existing README content even if it describes features not yet implemented\n4. Update the README if it conflicts with current source code, tests, or documentation\n5. If documentation files are out of date compared to the source code or tests, update them to be consistent\n\nIf there are no changes required, please provide the original content and state that no changes are necessary in the message.\n\nPaths in (updatedFile01Filepath, updatedFile02Filepath, etc...) must begin with one of: sandbox/SOURCES.md;sandbox/library/;sandbox/features/;sandbox/tests/;sandbox/source/;sandbox/docs/;sandbox/README.md\n\nAnswer strictly with a JSON object following this schema:\n{\n  \"message\": \"A short sentence explaining the changes applied (or why no changes were applied) suitable for a commit message or PR text.\",\n  \"updatedFile01Filepath\": \"sandbox/README.md\",\n  \"updatedFile01Contents\": \"The entire new content of the README file, with all necessary changes applied, if any.\",\n  \"updatedFile02Filepath\":  \"sandbox/docs/USAGE.md\",\n  \"updatedFile02Contents\": \"The entire new content of the file, with all necessary changes applied, if any.\",\n  \"updatedFile03Filepath\": \"unused\",\n  \"updatedFile03Contents\": \"unused\",\n  \"updatedFile04Filepath\": \"unused\",\n  \"updatedFile04Contents\": \"unused\",\n  \"updatedFile05Filepath\": \"unused\",\n  \"updatedFile05Contents\": \"unused\",\n  \"updatedFile06Filepath\": \"unused\",\n  \"updatedFile06Contents\": \"unused\",\n  \"updatedFile07Filepath\": \"unused\",\n  \"updatedFile07Contents\": \"unused\",\n  \"updatedFile08Filepath\": \"unused\",\n  \"updatedFile08Contents\": \"unused\",\n  \"updatedFile09Filepath\": \"unused\",\n  \"updatedFile09Contents\": \"unused\",\n  \"updatedFile10Filepath\": \"unused\",\n  \"updatedFile10Contents\": \"unused\",\n  \"updatedFile11Filepath\": \"unused\",\n  \"updatedFile11Contents\": \"unused\",\n  \"updatedFile12Filepath\": \"unused\",\n  \"updatedFile12Contents\": \"unused\",\n  \"updatedFile13Filepath\": \"unused\",\n  \"updatedFile13Contents\": \"unused\",\n  \"updatedFile14Filepath\": \"unused\",\n  \"updatedFile14Contents\": \"unused\",\n  \"updatedFile15Filepath\": \"unused\",\n  \"updatedFile15Contents\": \"unused\",\n  \"updatedFile16Filepath\": \"unused\",\n  \"updatedFile16Contents\": \"unused\"\n}\n\nYou can include up to 16 files using the updatedFileXXName and updatedFileXXContents pairs (where XX is a number from 01 to 16)\nWhere a file name and contents slot is not used, populate tha name with \"unused\" and the contents with \"unused\".\nNever truncate the files, when returning a file, always return the entire file content.\n\nEnsure valid JSON.\n"
+      "content": "\nPlease generate the name and specification for a software feature which will be added or updated to action the supplied feature prompt.\nPrioritize features that deliver substantial user impact and core functionality that solves real problems. Focus on capabilities that directly enhance the product's primary purpose rather than cosmetic improvements, excessive validation, or polishing. Aim for achievable, high-impact outcomes within a single repository, not a grandiose vision or bloated feature set.\n\nYou may only create features to only change the source file, test file, README file and dependencies file content. You may not create features that request new files, delete existing files, or change the other files provided in the prompt context.\nIf there are more than the maximum number of features in the repository, you may delete a feature but preferably, you should identify an existing feature that is most similar or related to the new feature and modify it to incorporate aspects of the new feature.\nAll existing features could be retained, with one being enhanced to move towards accommodating the new feature.\n\nAvoid code examples in the feature that themselves quote or escape.\nDon't use any Markdown shell or code escape sequences in the feature text.\nDon't use any quote escape sequences in the feature text.\n\nGenerally, the whole document might need to be extracted and stored as JSON so be careful to avoid any JSON escape\nsequences in any part of the document. Use spacing to make it readable and avoid complex Markdown formatting.\n\nThe feature will be iterated upon to incrementally deliver measurable value to users. Each iteration should focus on core functionality that addresses user needs rather than superficial enhancements. New features should be thematically distinct from other features.\nIf a significant feature of the repository is not present in the current feature set, please add it either to a new feature or an existing feature.\nBefore adding a new feature ensure that this feature is distinct from any other feature in the repository, otherwise update an existing feature.\nWhen updating an existing feature, ensure that the existing aspects are not omitted in the response, provide the full feature spec.\nThe feature name should be one or two words in SCREAMING_SNAKECASE.\nUse library documents for inspiration and as resources for the detail of the feature.\nConsider the contents of the library documents for similar products and avoid duplication where we can use a library.\nAny new feature should not be similar to any of the rejected features and steer existing features away from the rejected features.\nThe feature spec should be a detailed description of the feature, compatible with the guidelines in CONTRIBUTING.md.\nYou may also just update a feature spec to bring it to a high standard matching other features in the repository.\nA feature can be added based on a behaviour already present in the repository described within the guidelines in CONTRIBUTING.md.\nFeatures must be achievable in a single software repository not part of a corporate initiative.\nThe feature spec should be a multiline markdown with a few level 1 headings.\nThe feature must be compatible with the mission statement in MISSION.md and ideally realise part of the value in the mission.\nThe feature must be something that can be realised in a single source file (as below), ideally just as a library, CLI tool or possibly an HTTP API in combination with infrastructure as code deployment.\n\n\nIf there are more than the maximum number of 1 features in the repository, you must merge \nsimilar features into a single feature and name the features to be deleted.\nAll significant features of the repository should be present in the feature set before new features are \nadded and features can be consolidated to make room below the maximum of 1 features.\n\nConsider the following when refining your response:\n* Feature prompt details\n* Current feature names and specifications in the repository\n* Rejected feature names\n* Source file content\n* Test file content\n* Documentation file content\n* README file content\n* MISSION file content\n* Contributing file content\n* Dependencies file content\n* Library documents\n* Dependency list\n\nFeature prompt:\nFEATURE_PROMPT_START\n\nFEATURE_PROMPT_END            \n\nCurrent feature names and specifications:\nCURRENT_FEATURES_START\nfind: ‘sandbox/features/’: No such file or directory\nnone\nCURRENT_FEATURES_END\n\nLibrary documents:\nLIBRARY_DOCUMENTS_START\n\nLIBRARY_DOCUMENTS_END\n\nRejected feature names:\nREJECTED_FEATURES_START\n\nREJECTED_FEATURES_END\n\nSource files:\nSOURCE_FILES_START\nFile: src/lib/main.js\n#!/usr/bin/env node\n// src/lib/main.js\n\n// Initialize global callCount to support test mocks that reference it\nif (typeof globalThis.callCount === \"undefined\") {\n  globalThis.callCount = 0;\n}\n\nimport { fileURLToPath } from \"url\";\nimport { z } from \"zod\";\nimport dotenv from \"dotenv\";\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Environment configuration from .env file or environment variables or test values.\n// ---------------------------------------------------------------------------------------------------------------------\n\ndotenv.config();\n\nif (process.env.VITEST || process.env.NODE_ENV === \"development\") {\n  process.env.GITHUB_API_BASE_URL = process.env.GITHUB_API_BASE_URL || \"https://api.github.com.test/\";\n  process.env.OPENAI_API_KEY = process.env.OPENAI_API_KEY || \"key-test\";\n}\n\nconst configSchema = z.object({\n  GITHUB_API_BASE_URL: z.string().optional(),\n  OPENAI_API_KEY: z.string().optional(),\n});\n\nexport const config = configSchema.parse(process.env);\n\n// Global verbose mode flag\nconst VERBOSE_MODE = false;\n// Global verbose stats flag\nconst VERBOSE_STATS = false;\n\n// Helper function to format log entries\nfunction formatLogEntry(level, message, additionalData = {}) {\n  return {\n    level,\n    timestamp: new Date().toISOString(),\n    message,\n    ...additionalData,\n  };\n}\n\nexport function logConfig() {\n  const logObj = formatLogEntry(\"info\", \"Configuration loaded\", {\n    config: {\n      GITHUB_API_BASE_URL: config.GITHUB_API_BASE_URL,\n      OPENAI_API_KEY: config.OPENAI_API_KEY,\n    },\n  });\n  console.log(JSON.stringify(logObj));\n}\nlogConfig();\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Utility functions\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport function logInfo(message) {\n  const additionalData = VERBOSE_MODE ? { verbose: true } : {};\n  const logObj = formatLogEntry(\"info\", message, additionalData);\n  console.log(JSON.stringify(logObj));\n}\n\nexport function logError(message, error) {\n  const additionalData = { error: error ? error.toString() : undefined };\n  if (VERBOSE_MODE && error && error.stack) {\n    additionalData.stack = error.stack;\n  }\n  const logObj = formatLogEntry(\"error\", message, additionalData);\n  console.error(JSON.stringify(logObj));\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// AWS Utility functions\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport function createSQSEventFromDigest(digest) {\n  return {\n    Records: [\n      {\n        eventVersion: \"2.0\",\n        eventSource: \"aws:sqs\",\n        eventTime: new Date().toISOString(),\n        eventName: \"SendMessage\",\n        body: JSON.stringify(digest),\n      },\n    ],\n  };\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// SQS Lambda Handlers\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport async function digestLambdaHandler(sqsEvent) {\n  logInfo(`Digest Lambda received event: ${JSON.stringify(sqsEvent)}`);\n\n  // If event.Records is an array, use it. Otherwise, treat the event itself as one record.\n  const sqsEventRecords = Array.isArray(sqsEvent.Records) ? sqsEvent.Records : [sqsEvent];\n\n  // Array to collect the identifiers of the failed records\n  const batchItemFailures = [];\n\n  for (const [index, sqsEventRecord] of sqsEventRecords.entries()) {\n    try {\n      const digest = JSON.parse(sqsEventRecord.body);\n      logInfo(`Record ${index}: Received digest: ${JSON.stringify(digest)}`);\n    } catch (error) {\n      // If messageId is missing, generate a fallback identifier including record index\n      const recordId =\n        sqsEventRecord.messageId || `fallback-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;\n      logError(`Error processing record ${recordId} at index ${index}`, error);\n      logError(`Invalid JSON payload. Error: ${error.message}. Raw message: ${sqsEventRecord.body}`);\n      batchItemFailures.push({ itemIdentifier: recordId });\n    }\n  }\n\n  // Return the list of failed messages so that AWS SQS can attempt to reprocess them.\n  return {\n    batchItemFailures,\n    handler: \"src/lib/main.digestLambdaHandler\",\n  };\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// CLI Helper Functions\n// ---------------------------------------------------------------------------------------------------------------------\n\n// Function to generate CLI usage instructions\nfunction generateUsage() {\n  return `\nUsage:\n  --help                     Show this help message and usage instructions.\n  --digest                   Run a full bucket replay simulating an SQS event.\n  --version                  Show version information with current timestamp.\n`;\n}\n\n// Process the --help flag\nfunction processHelp(args) {\n  if (args.includes(\"--help\")) {\n    console.log(generateUsage());\n    return true;\n  }\n  return false;\n}\n\n// Process the --version flag\nasync function processVersion(args) {\n  if (args.includes(\"--version\")) {\n    try {\n      const { readFileSync } = await import(\"fs\");\n      const packageJsonPath = new URL(\"../../package.json\", import.meta.url);\n      const packageJson = JSON.parse(readFileSync(packageJsonPath, \"utf8\"));\n      const versionInfo = {\n        version: packageJson.version,\n        timestamp: new Date().toISOString(),\n      };\n      console.log(JSON.stringify(versionInfo));\n    } catch (error) {\n      logError(\"Failed to retrieve version\", error);\n    }\n    return true;\n  }\n  return false;\n}\n\n// Process the --digest flag\nasync function processDigest(args) {\n  if (args.includes(\"--digest\")) {\n    const exampleDigest = {\n      key: \"events/1.json\",\n      value: \"12345\",\n      lastModified: new Date().toISOString(),\n    };\n    const sqsEvent = createSQSEventFromDigest(exampleDigest);\n    await digestLambdaHandler(sqsEvent);\n    return true;\n  }\n  return false;\n}\n\n// ---------------------------------------------------------------------------------------------------------------------\n// Main CLI\n// ---------------------------------------------------------------------------------------------------------------------\n\nexport async function main(args = process.argv.slice(2)) {\n  if (processHelp(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processVersion(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n  if (await processDigest(args)) {\n    if (VERBOSE_STATS) {\n      console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n    }\n    return;\n  }\n\n  console.log(\"No command argument supplied.\");\n  console.log(generateUsage());\n  if (VERBOSE_STATS) {\n    console.log(JSON.stringify({ callCount: globalThis.callCount, uptime: process.uptime() }));\n  }\n}\n\n// if (import.meta.url.endsWith(process.argv[1])) {\nif (process.argv[1] === fileURLToPath(import.meta.url)) {\n  main().catch((err) => {\n    logError(\"Fatal error in main execution\", err);\n    process.exit(1);\n  });\n}\n\n\nSOURCE_FILES_END\n\nTest files:\nTEST_FILES_START\nFile: tests/unit/main.test.js\nimport { describe, test, expect, vi, beforeAll, beforeEach, afterEach } from \"vitest\";\n\n// Ensure that the global callCount is reset before tests that rely on it\nbeforeAll(() => {\n  globalThis.callCount = 0;\n});\n\n// Reset callCount before each test in agenticHandler tests\nbeforeEach(() => {\n  globalThis.callCount = 0;\n});\n\n// Clear all mocks after each test to tidy up\nafterEach(() => {\n  vi.clearAllMocks();\n});\n\n// Use dynamic import for the module to ensure mocks are applied correctly\nlet agenticLib;\n\n// Default mock for openai used by tests that don't override it\nvi.mock(\"openai\", () => {\n  return {\n    Configuration: (config) => config,\n    OpenAIApi: class {\n      async createChatCompletion() {\n        const dummyResponse = { fixed: \"true\", message: \"dummy success\", refinement: \"none\" };\n        return {\n          data: {\n            choices: [{ message: { content: JSON.stringify(dummyResponse) } }]\n          }\n        };\n      }\n    }\n  };\n});\n\n// Re-import the module after setting up the default mock\nbeforeAll(async () => {\n  agenticLib = await import(\"../../src/lib/main.js\");\n});\n\ndescribe(\"Main Module Import\", () => {\n  test(\"should be non-null\", async () => {\n    const mainModule = await import(\"../../src/lib/main.js\");\n    expect(mainModule).not.toBeNull();\n  });\n});\n\n\nFile: tests/unit/module-index.test.js\n// tests/unit/module-index.test.js\n// src/lib/main.js\n//\n// This file is part of the Example Suite for `agentic-lib` see: https://github.com/xn-intenton-z2a/agentic-lib\n// This file is licensed under the MIT License. For details, see LICENSE-MIT\n//\n\nimport { describe, test, expect } from \"vitest\";\nimport anything from \"@src/index.js\";\n\ndescribe(\"Index Module Exports\", () => {\n  test(\"module index should be defined\", () => {\n    expect(anything).toBeUndefined();\n  });\n});\n\n\nTEST_FILES_END\n\nDocumentation files:\nDOCS_FILES_START\nFile: sandbox/docs\n\n\nDOCS_FILES_END\n\nREADME file: sandbox/README.md\nREADME_FILE_START\n\nREADME_FILE_END\n\nMISSION file: MISSION.md\nMISSION_FILE_START\n# Mission Statement\n\n**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for \nthe steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions \nworkflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate\nthrough branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be\ninvoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.\n\nMISSION_FILE_END\n\nContributing file: CONTRIBUTING.md\nCONTRIBUTING_FILE_START\n# agentic‑lib\n\nThis document outlines our guidelines for human and automated contributions, ensuring that our core library remains \nrobust, testable, and efficient in powering our reusable GitHub Workflows.\n\n## How to Contribute\n\nThe guidelines below apply to human or automated contributions:\n\n1. **Report Issues or Ideas:**\n    - Open an issue on GitHub to share bug reports, feature requests, or any improvements you envision.\n    - Clear descriptions and reproducible steps are highly appreciated.\n\n2. **Submit Pull Requests:**\n    - Implement your changes and push them to a new branch, ensuring you follow the \n      existing coding style and standards.\n    - Add tests to cover any new functionality.\n    - Update documentation if your changes affect usage or workflow behavior.\n    - Submit your pull request for review.\n\n## Guidelines\n\n- **Features:**\n    - Clear Objective & Scope: Define the feature with a concise description outlining its purpose, scope, and the specific problem it solves for the end user.\n    - Value Proposition: Articulate the tangible benefits of the feature, including improved functionality, performance, or user experience.\n    - Success Criteria & Requirements: List measurable success criteria and requirements, including performance benchmarks, usability standards, and stability expectations, to guide development and testing.\n    - Testability & Stability: Ensure the feature can be verified through both automated tests and user acceptance criteria. Specify any necessary rollback or fail-safe mechanisms to maintain system stability.\n    - Dependencies & Constraints: Identify any dependencies (external libraries, APIs, etc.), assumptions, and limitations that could impact feature delivery or future enhancements.\n    - User Scenarios & Examples: Provide illustrative use cases or scenarios that demonstrate how the feature will be used in real-world situations, making it easier for both developers and stakeholders to understand its impact.\n    - Verification & Acceptance: Define clear verification steps and acceptance criteria to ensure the feature meets its intended requirements. This should include detailed plans for unit tests, integration tests, manual user acceptance tests, and code reviews. Specify measurable outcomes that must be achieved for the feature to be considered successfully delivered and stable.\n\n- **Code Quality:**\n    - Ensure there are tests that cover your changes and any likely new cases they introduce.\n    - When making a change remain consistent with the existing code style and structure.\n    - When adding new functionality, consider if some unused or superseded code should be removed.\n\n- **Compatibility:**\n    - Ensure your code runs on Node 20 and adheres to ECMAScript Module (ESM) standards.\n    - Tests use vitest and competing test frameworks should not be added.\n    - Mocks in tests must not interfere with other tests.\n\n- **Testing:**\n    - The command `npm test` should invoke the tests added for the new functionality (and pass).\n    - If you add new functionality, ensure it is covered by tests.\n\n- **Documentation:**\n    - When making a change to the main source file, review the readme to see if it needs to be updated and if so, update it.\n    - Where the source exports a function, consider that part of the API of the library and document it in the readme.\n    - Where the source stands-up an HTTP endpoint, consider that part of the API of the library and document it in the readme.\n    - Include usage examples including inline code usage and CLI and HTTP invocation, API references.\n\n- **README:**\n    - The README should begin with something inspired by the mission statement and describe the current state of the repository (rather than the journey)\n    - The README should include a link to MISSION.md, CONTRIBUTING.md, LICENSE.md.\n    - The README should include a link to the intentïon `agentic-lib` GitHub Repository which is https://github.com/xn-intenton-z2a/agentic-lib.\n\n## Sandbox mode\n\nPlease note that the automation features of this repository are in sandbox mode. This means that\nautomated changes should only be applied to the sandbox paths which are shown below:\n```yaml\npaths:\n  targetTestsPath:\n    path: 'sandbox/tests/'\n    permissions: [ 'write' ]\n  targetSourcePath:\n    path: 'sandbox/source/'\n    permissions: [ 'write' ]\n  documentationPath:\n    path: 'sandbox/docs/'\n    permissions: [ 'write' ]\n  readmeFilepath:\n    path: 'sandbox/README.md'\n    permissions: [ 'write' ]\n```\n\nCONTRIBUTING_FILE_END\n\nDependencies file: package.json\nDEPENDENCIES_FILE_START\n{\n  \"name\": \"@xn-intenton-z2a/agentic-lib\",\n  \"version\": \"6.7.3-0\",\n  \"description\": \"Agentic-lib Agentic Coding Systems SDK powering automated GitHub workflows.\",\n  \"type\": \"module\",\n  \"main\": \"src/lib/main.js\",\n  \"scripts\": {\n    \"build\": \"echo \\\"Nothing to build\\\"\",\n    \"formatting\": \"prettier --check\",\n    \"formatting-fix\": \"prettier --write\",\n    \"linting\": \"eslint\",\n    \"linting-json\": \"eslint --format=@microsoft/eslint-formatter-sarif\",\n    \"linting-fix\": \"eslint --fix\",\n    \"update-to-minor\": \"npx npm-check-updates --upgrade --enginesNode --target minor --verbose --install always\",\n    \"update-to-greatest\": \"npx npm-check-updates --upgrade --enginesNode --target greatest --verbose --install always --reject \\\"alpha\\\"\",\n    \"test\": \"vitest tests/unit/*.test.js sandbox/tests/*.test.js\",\n    \"test:unit\": \"vitest --coverage tests/unit/*.test.js sandbox/tests/*.test.js\",\n    \"start\": \"node src/lib/main.js\"\n  },\n  \"keywords\": [],\n  \"author\": \"https://github.com/xn-intenton-z2a\",\n  \"license\": \"GPL-3.0, MIT\",\n  \"dependencies\": {\n    \"@aws-sdk/client-lambda\": \"^3.804.0\",\n    \"@xn-intenton-z2a/s3-sqs-bridge\": \"^0.24.0\",\n    \"chalk\": \"^5.4.1\",\n    \"change-case\": \"^5.4.4\",\n    \"dayjs\": \"^1.11.13\",\n    \"dotenv\": \"^16.5.0\",\n    \"ejs\": \"^3.1.10\",\n    \"figlet\": \"^1.8.1\",\n    \"js-yaml\": \"^4.1.0\",\n    \"lodash\": \"^4.17.21\",\n    \"minimatch\": \"^10.0.1\",\n    \"openai\": \"^4.97.0\",\n    \"seedrandom\": \"^3.0.5\",\n    \"zod\": \"^3.24.4\"\n  },\n  \"devDependencies\": {\n    \"@microsoft/eslint-formatter-sarif\": \"^3.1.0\",\n    \"@vitest/coverage-v8\": \"^3.1.3\",\n    \"aws-cdk\": \"^2.1013.0\",\n    \"eslint\": \"^9.25.0\",\n    \"eslint-config-google\": \"^0.14.0\",\n    \"eslint-config-prettier\": \"^8.10.0\",\n    \"eslint-plugin-import\": \"^2.31.0\",\n    \"eslint-plugin-prettier\": \"^5.4.0\",\n    \"eslint-plugin-promise\": \"^7.2.1\",\n    \"eslint-plugin-react\": \"^7.37.5\",\n    \"eslint-plugin-security\": \"^3.0.1\",\n    \"eslint-plugin-sonarjs\": \"^3.0.2\",\n    \"figlet\": \"^1.8.1\",\n    \"markdown-it\": \"^14.1.0\",\n    \"markdown-it-github\": \"^0.5.0\",\n    \"npm-check-updates\": \"^18.0.1\",\n    \"prettier\": \"^3.5.3\",\n    \"vitest\": \"^3.1.3\"\n  },\n  \"engines\": {\n    \"node\": \">=20.0.0\"\n  },\n  \"files\": [\n    \"package.json\"\n  ],\n  \"publishConfig\": {\n    \"registry\": \"https://npm.pkg.github.com\"\n  }\n}\n\nDEPENDENCIES_FILE_END\n\nDependencies list from command: npm list\nDEPENDENCIES_LIST_START\n@xn-intenton-z2a/agentic-lib@6.7.3-0 /home/runner/work/agentic-lib/agentic-lib\n├── @aws-sdk/client-lambda@3.812.0\n├── @microsoft/eslint-formatter-sarif@3.1.0\n├── @vitest/coverage-v8@3.1.3\n├── @xn-intenton-z2a/s3-sqs-bridge@0.24.0\n├── aws-cdk@2.1016.0\n├── chalk@5.4.1\n├── change-case@5.4.4\n├── dayjs@1.11.13\n├── dotenv@16.5.0\n├── ejs@3.1.10\n├── eslint-config-google@0.14.0\n├── eslint-config-prettier@8.10.0\n├── eslint-plugin-import@2.31.0\n├── eslint-plugin-prettier@5.4.0\n├── eslint-plugin-promise@7.2.1\n├── eslint-plugin-react@7.37.5\n├── eslint-plugin-security@3.0.1\n├── eslint-plugin-sonarjs@3.0.2\n├── eslint@9.27.0\n├── figlet@1.8.1\n├── js-yaml@4.1.0\n├── lodash@4.17.21\n├── markdown-it-github@0.5.0\n├── markdown-it@14.1.0\n├── minimatch@10.0.1\n├── npm-check-updates@18.0.1\n├── openai@4.100.0\n├── prettier@3.5.3\n├── seedrandom@3.0.5\n├── vitest@3.1.3\n└── zod@3.24.4\nDEPENDENCIES_LIST_END    \n\nAgent configuration file:\nAGENT_CONFIG_FILE_START\n# Which agentic-lib workflow schedule should be used?\nschedule: schedule-3\n\n# Mapping for from symbolic keys to filepaths for access by agentic-lib workflows with limits and access permissions\npaths:\n  # Filepaths for elaborator workflows\n  missionFilepath:\n    path: 'MISSION.md'\n  librarySourcesFilepath:\n    path: 'sandbox/SOURCES.md'\n    permissions: [ 'write' ]\n    limit: 8\n  libraryDocumentsPath:\n    path: 'sandbox/library/'\n    permissions: [ 'write' ]\n    limit: 32\n  featuresPath:\n    path: 'sandbox/features/'\n    permissions: [ 'write' ]\n    limit: 1\n\n  # Filepaths for engineer workflows\n  contributingFilepath:\n    path: 'CONTRIBUTING.md'\n  targetTestsPath:\n    path: 'sandbox/tests/'\n    permissions: [ 'write' ]\n  otherTestsPaths:\n    paths: [ 'tests/unit/' ]\n  targetSourcePath:\n    path: 'sandbox/source/'\n    permissions: [ 'write' ]\n  otherSourcePaths:\n    paths: [ 'src/lib/' ]\n  dependenciesFilepath:\n    path: 'package.json'\n  documentationPath:\n    path: 'sandbox/docs/'\n    permissions: [ 'write' ]\n\n  # Filepaths for maintainer workflows\n  formattingFilepath:\n    path: '.prettierrc'\n  lintingFilepath:\n    path: 'eslint.config.js'\n  readmeFilepath:\n    path: 'sandbox/README.md'\n    permissions: [ 'write' ]\n\n# Execution commands\nbuildScript: 'npm run build'\ntestScript: 'npm test'\nmainScript: 'npm run start'\n\n# How many issues should be available to be picked up?\nfeatureDevelopmentIssuesWipLimit: 2\nmaintenanceIssuesWipLimit: 1\n\n# How many attempts should be made to work on an issue?\nattemptsPerBranch: 2\nattemptsPerIssue: 2\n\n# Web publishing\ndocRoot: 'public'\n\n# Sandbox configuration\nsandbox:\n  sandboxReset: 'true'\n  sandboxPath: 'sandbox'\n\n# Repository seeding\n#seeding:\n#  repositoryReseed: 'true'\n#  missionFilepath: 'seeds/zero-MISSION.md'\n#  sourcePath: 'seeds/zero-main.js'\n#  testsPath: 'seeds/zero-main.test.js'\n#  dependenciesFilepath: 'seeds/zero-package.json'\n#  readmeFilepath: 'seeds/zero-README.md'\n\nintentionBot:\n  intentionFilepath: 'intentïon.md'\n\nAGENT_CONFIG_FILE_END\n\nAnswer strictly with a JSON object following this schema:\n{\n  \"featureName\": \"The feature name as one or two words in SCREAMING_SNAKECASE.\",\n  \"featureSpec\": \"The feature specification as multiline markdown with a few level 1 headings.\",\n  \"featureNamesToBeDeleted\": \"The comma separated list of feature names to be deleted or 'none' if no feature is to be deleted.\"\n}\nEnsure valid JSON.\n"
     }
   ],
   "tools": [
     {
       "type": "function",
       "function": {
-        "name": "applyReadmeUpdate",
-        "description": "Return updated versions of README and documentation files along with a commit message. Use the provided file contents and supporting context to generate the updates.",
+        "name": "generate_feature",
+        "description": "Elaborate on the supplied prompt and project files to create the featureName and featureSpec of a repository feature, and the feature names to be deleted. Return an object with featureName (string), featureSpec (string), and featureNamesToBeDeleted (string).",
         "parameters": {
           "type": "object",
           "properties": {
-            "message": {
+            "featureName": {
               "type": "string",
-              "description": "A short sentence explaining the changes applied (or why no changes were applied) suitable for a commit message or PR text."
+              "description": "The feature name as one or two words in SCREAMING_SNAKECASE."
             },
-            "updatedFile01Filepath": {
+            "featureSpec": {
               "type": "string",
-              "description": "Path to the first file to update"
+              "description": "The feature specification as multiline markdown with a few level 1 headings."
             },
-            "updatedFile01Contents": {
+            "featureNamesToBeDeleted": {
               "type": "string",
-              "description": "The entire new content of the first file, with all necessary changes applied"
-            },
-            "updatedFile02Filepath": {
-              "type": "string",
-              "description": "Path to the second file to update"
-            },
-            "updatedFile02Contents": {
-              "type": "string",
-              "description": "The entire new content of the second file, with all necessary changes applied"
-            },
-            "updatedFile03Filepath": {
-              "type": "string",
-              "description": "Path to the third file to update"
-            },
-            "updatedFile03Contents": {
-              "type": "string",
-              "description": "The entire new content of the third file, with all necessary changes applied"
-            },
-            "updatedFile04Filepath": {
-              "type": "string",
-              "description": "Path to the fourth file to update"
-            },
-            "updatedFile04Contents": {
-              "type": "string",
-              "description": "The entire new content of the fourth file, with all necessary changes applied"
-            },
-            "updatedFile05Filepath": {
-              "type": "string",
-              "description": "Path to the fifth file to update"
-            },
-            "updatedFile05Contents": {
-              "type": "string",
-              "description": "The entire new content of the fifth file, with all necessary changes applied"
-            },
-            "updatedFile06Filepath": {
-              "type": "string",
-              "description": "Path to the sixth file to update"
-            },
-            "updatedFile06Contents": {
-              "type": "string",
-              "description": "The entire new content of the sixth file, with all necessary changes applied"
-            },
-            "updatedFile07Filepath": {
-              "type": "string",
-              "description": "Path to the seventh file to update"
-            },
-            "updatedFile07Contents": {
-              "type": "string",
-              "description": "The entire new content of the seventh file, with all necessary changes applied"
-            },
-            "updatedFile08Filepath": {
-              "type": "string",
-              "description": "Path to the eighth file to update"
-            },
-            "updatedFile08Contents": {
-              "type": "string",
-              "description": "The entire new content of the eighth file, with all necessary changes applied"
-            },
-            "updatedFile09Filepath": {
-              "type": "string",
-              "description": "Path to the ninth file to update"
-            },
-            "updatedFile09Contents": {
-              "type": "string",
-              "description": "The entire new content of the ninth file, with all necessary changes applied"
-            },
-            "updatedFile10Filepath": {
-              "type": "string",
-              "description": "Path to the tenth file to update"
-            },
-            "updatedFile10Contents": {
-              "type": "string",
-              "description": "The entire new content of the tenth file, with all necessary changes applied"
-            },
-            "updatedFile11Filepath": {
-              "type": "string",
-              "description": "Path to the eleventh file to update"
-            },
-            "updatedFile11Contents": {
-              "type": "string",
-              "description": "The entire new content of the eleventh file, with all necessary changes applied"
-            },
-            "updatedFile12Filepath": {
-              "type": "string",
-              "description": "Path to the twelfth file to update"
-            },
-            "updatedFile12Contents": {
-              "type": "string",
-              "description": "The entire new content of the twelfth file, with all necessary changes applied"
-            },
-            "updatedFile13Filepath": {
-              "type": "string",
-              "description": "Path to the thirteenth file to update"
-            },
-            "updatedFile13Contents": {
-              "type": "string",
-              "description": "The entire new content of the thirteenth file, with all necessary changes applied"
-            },
-            "updatedFile14Filepath": {
-              "type": "string",
-              "description": "Path to the fourteenth file to update"
-            },
-            "updatedFile14Contents": {
-              "type": "string",
-              "description": "The entire new content of the fourteenth file, with all necessary changes applied"
-            },
-            "updatedFile15Filepath": {
-              "type": "string",
-              "description": "Path to the fifteenth file to update"
-            },
-            "updatedFile15Contents": {
-              "type": "string",
-              "description": "The entire new content of the fifteenth file, with all necessary changes applied"
-            },
-            "updatedFile16Filepath": {
-              "type": "string",
-              "description": "Path to the sixteenth file to update"
-            },
-            "updatedFile16Contents": {
-              "type": "string",
-              "description": "The entire new content of the sixteenth file, with all necessary changes applied"
+              "description": "The comma separated list of feature names to be deleted or 'none' if no feature is to be deleted."
             }
           },
           "required": [
-            "message",
-            "updatedFile01Filepath",
-            "updatedFile01Contents",
-            "updatedFile02Filepath",
-            "updatedFile02Contents",
-            "updatedFile03Filepath",
-            "updatedFile03Contents",
-            "updatedFile04Filepath",
-            "updatedFile04Contents",
-            "updatedFile05Filepath",
-            "updatedFile05Contents",
-            "updatedFile06Filepath",
-            "updatedFile06Contents",
-            "updatedFile07Filepath",
-            "updatedFile07Contents",
-            "updatedFile08Filepath",
-            "updatedFile08Contents",
-            "updatedFile09Filepath",
-            "updatedFile09Contents",
-            "updatedFile10Filepath",
-            "updatedFile10Contents",
-            "updatedFile11Filepath",
-            "updatedFile11Contents",
-            "updatedFile12Filepath",
-            "updatedFile12Contents",
-            "updatedFile13Filepath",
-            "updatedFile13Contents",
-            "updatedFile14Filepath",
-            "updatedFile14Contents",
-            "updatedFile15Filepath",
-            "updatedFile15Contents",
-            "updatedFile16Filepath",
-            "updatedFile16Contents"
+            "featureName",
+            "featureSpec",
+            "featureNamesToBeDeleted"
           ],
           "additionalProperties": false
         },
diff --git a/result.json b/result.json
index 3f73d9d4..88e700d6 100644
--- a/result.json
+++ b/result.json
@@ -1,35 +1,5 @@
 {
-  "message": "Clarify core CLI options, add configuration sections, and note sandbox-only mission flag",
-  "updatedFile01Filepath": "sandbox/README.md",
-  "updatedFile01Contents": "# agentic-lib\n\nAgentic-lib is a JavaScript library designed to power automated GitHub workflows in an “agentic” manner, enabling autonomous workflows to communicate through branches and issues. It can be used as a drop-in JS implementation or replacement for steps, jobs, and reusable workflows in your repository.\n\n**Mission:** [Mission Statement](../MISSION.md)\n\n**Contributing:** [Contributing Guidelines](../CONTRIBUTING.md)  \n**License:** [MIT License](../LICENSE-MIT)\n\n**Repository:** https://github.com/xn-intenton-z2a/agentic-lib\n\n---\n\n# Usage\n\n## Sandbox CLI\n\nUse the sandbox CLI to experiment locally:\n\n```bash\nnode sandbox/source/main.js [options]\n```\n\n**Example: Show the mission statement**\n\n```bash\nnode sandbox/source/main.js --mission\n```\n\n## Core CLI\n\nUse the core CLI for production workflows:\n\n```bash\nnode src/lib/main.js [options]\n```\n\n**Example: Show version information**\n\n```bash\nnode src/lib/main.js --version\n```\n\n## Options\n\n- `--help`                     Show this help message and usage instructions.\n- `--mission`                  Show the project mission statement. (Sandbox CLI only)\n- `--digest`                   Run a full bucket replay simulating an SQS event.\n- `--version`                  Show version information with current timestamp.\n\n## Configuration\n\nBefore using the CLI, configure the following environment variables:\n\n- `OPENAI_API_KEY` (required): Your OpenAI API key.\n- `GITHUB_API_BASE_URL` (optional): Override the GitHub API base URL. Defaults to `https://api.github.com/`.\n\nIn sandbox mode (when `NODE_ENV` is set to `development` or `VITEST` is set), default values are applied for testing:\n\n- `OPENAI_API_KEY=key-test`\n- `GITHUB_API_BASE_URL=https://api.github.com.test/`\n",
-  "updatedFile02Filepath": "sandbox/docs/USAGE.md",
-  "updatedFile02Contents": "# CLI Usage\n\nThe **agentic-lib** library provides both a sandbox CLI and a core CLI for interacting with its features.\n\n## Sandbox CLI\n\nUse the sandbox CLI to experiment locally:\n\n```bash\nnode sandbox/source/main.js [options]\n```\n\nAvailable options:\n\n- `--help`     Show this help message and usage instructions.\n- `--mission`  Show the project mission statement.\n- `--digest`   Run a full bucket replay simulating an SQS event.\n- `--version`  Show version information with current timestamp.\n\n**Example: Show the mission statement**\n\n```bash\nnode sandbox/source/main.js --mission\n```\n\n## Core CLI\n\nUse the core CLI for production workflows:\n\n```bash\nnode src/lib/main.js [options]\n```\n\nAvailable options:\n\n- `--help`     Show this help message and usage instructions.\n- `--digest`   Run a full bucket replay simulating an SQS event.\n- `--version`  Show version information with current timestamp.\n\n**Example: Show version information**\n\n```bash\nnode src/lib/main.js --version\n```\n\n## Configuration\n\nBefore using the CLI, configure the following environment variables:\n\n- `OPENAI_API_KEY` (required): Your OpenAI API key.\n- `GITHUB_API_BASE_URL` (optional): Override the GitHub API base URL. Defaults to `https://api.github.com/`.\n\nIn sandbox mode (when `NODE_ENV` is set to `development` or `VITEST` is set), default values are applied for testing:\n\n- `OPENAI_API_KEY=key-test`\n- `GITHUB_API_BASE_URL=https://api.github.com.test/`\n\n## Links\n\n- Mission Statement: [MISSION.md](../MISSION.md)\n- Contributing Guidelines: [CONTRIBUTING.md](../CONTRIBUTING.md)\n",
-  "updatedFile03Filepath": "unused",
-  "updatedFile03Contents": "unused",
-  "updatedFile04Filepath": "unused",
-  "updatedFile04Contents": "unused",
-  "updatedFile05Filepath": "unused",
-  "updatedFile05Contents": "unused",
-  "updatedFile06Filepath": "unused",
-  "updatedFile06Contents": "unused",
-  "updatedFile07Filepath": "unused",
-  "updatedFile07Contents": "unused",
-  "updatedFile08Filepath": "unused",
-  "updatedFile08Contents": "unused",
-  "updatedFile09Filepath": "unused",
-  "updatedFile09Contents": "unused",
-  "updatedFile10Filepath": "unused",
-  "updatedFile10Contents": "unused",
-  "updatedFile11Filepath": "unused",
-  "updatedFile11Contents": "unused",
-  "updatedFile12Filepath": "unused",
-  "updatedFile12Contents": "unused",
-  "updatedFile13Filepath": "unused",
-  "updatedFile13Contents": "unused",
-  "updatedFile14Filepath": "unused",
-  "updatedFile14Contents": "unused",
-  "updatedFile15Filepath": "unused",
-  "updatedFile15Contents": "unused",
-  "updatedFile16Filepath": "unused",
-  "updatedFile16Contents": "unused"
+  "featureName": "HEALTH_CHECK",
+  "featureSpec": "# Objective\nAdd a new CLI flag --health that outputs a JSON health report including service status, version, uptime, and call count\n\n# Value Proposition\nAllow users and monitoring systems to quickly verify that agentic-lib and its dependencies are loaded and functioning correctly by injecting a simple health endpoint in the CLI. This can be used in automated scripts or CI pipelines to assert library readiness.\n\n# Success Criteria & Requirements\n• Recognize --health in process arguments alongside existing flags\n• When invoked, read the version from package.json\n• Compute uptime in seconds using process.uptime()\n• Read globalThis.callCount for the number of operations performed\n• Output a single JSON object with the following keys:\n  status: always \"ok\"\n  version: package version string\n  uptime: number (seconds)\n  callCount: number\n  timestamp: ISO formatted string representing current time\n• Immediately exit after output without error or side effects\n\n# User Scenarios & Examples\nUser runs node src/lib/main.js --health\nExpect output:\n{\n  status: \"ok\",\n  version: \"6.7.3-0\",\n  uptime: 12.34,\n  callCount: 0,\n  timestamp: \"2024-06-15T12:00:00.000Z\"\n}\n\n# Verification & Acceptance\n• Add unit tests that invoke main with [\"--health\"] and capture console output to validate JSON structure and data types\n• Ensure output contains correct version matching package.json\n• Test stability by verifying exit without error and no invocation of other handlers\n• Update README to document --health flag under CLI usage section",
+  "featureNamesToBeDeleted": "none"
 }
\ No newline at end of file
```

LLM API Usage:

```json
{"prompt_tokens":6030,"completion_tokens":2049,"total_tokens":8079,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":1664,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

## Feature to Issue at 2025-05-19T12:23:15.846Z

Generated feature development issue with title Add --mission CLI flag to output library mission statement.

LLM API Usage:

```json
{"prompt_tokens":6391,"completion_tokens":1388,"total_tokens":7779,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":896,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

## Feature to enhanced Issue at 2025-05-19T12:24:56.192Z

Updated feature development issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1518 with enhanced description:

Title: Add --health-check CLI Command to Report System Health Status

Objective:
Implement a new `--health-check` CLI flag in `src/lib/main.js` that outputs a single JSON object summarizing the runtime health of the tool and returns immediately.

Testable Acceptance Criteria:

1. CLI Behavior
   - Invoking `node src/lib/main.js --health-check` writes exactly one line to stdout containing a valid JSON string.
   - The JSON object must include all of the following fields:
     - `level`: string, exactly "info".
     - `handler`: string, exactly "health-check".
     - `timestamp`: string, valid ISO 8601 timestamp.
     - `config`: object, matching the parsed `config` schema (`GITHUB_API_BASE_URL` and `OPENAI_API_KEY` keys present if set, otherwise omitted).
     - `uptime`: number, equal to `process.uptime()` at time of invocation (greater than or equal to zero).
     - `callCount`: number, equal to `globalThis.callCount` at time of invocation.
   - The process should return early (exit `main`) after printing this message; no other usage instructions or logs should appear.

2. Usage Documentation
   - `generateUsage()` output must include a new line: `--health-check             Output system health and configuration status in JSON.`
   - Updated CLI usage in `sandbox/README.md` to show example:
     ```bash
     $ node src/lib/main.js --health-check
     {"level":"info","handler":"health-check","timestamp":"2025-...","config":{...},"uptime":0.0,"callCount":0}
     ```

3. Automated Tests
   - In `tests/unit/main.test.js`, add a suite for `--health-check`:
     - Spy on `console.log`.
     - Call `await main(["--health-check"])`.
     - Assert only one `console.log` call occurred.
     - Parse the logged JSON and verify all required fields and types.
     - Confirm no additional console output.

Verification Steps:
- Run `npm test` and confirm the new health-check tests pass.
- Execute `node src/lib/main.js --health-check` manually and validate JSON output structure.
- Confirm usage text (`--help` or no args) now includes `--health-check` in the printed instructions.


LLM API Usage:

```json
{"prompt_tokens":6986,"completion_tokens":1020,"total_tokens":8006,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":448,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

## Issue to Ready Issue at 2025-05-19T12:26:10.929Z

Enhanced issue https://github.com/xn-intenton-z2a/agentic-lib/issues/1517 with action enhance and updated description:

Title: Add --mission CLI Flag to Output Library Mission Statement

Description:
Implement a new `--mission` CLI flag in `src/lib/main.js` that reads and prints the contents of `MISSION.md` when invoked. This provides users a quick and discoverable way to view the library’s mission statement directly from the CLI, aligning CLI usability with the project’s mission-driven philosophy.

Acceptance Criteria:
1. Code Changes:
   - Introduce a `processMission(args)` helper function similar to existing `processHelp`, `processVersion`, and `processDigest`:
     • It detects the `--mission` flag in the `args` array.
     • Reads the raw contents of `MISSION.md` from the project root.
     • Calls `console.log` once with the exact file contents (no extra formatting).
     • Returns `true` to short-circuit further flag processing.
   - Integrate `processMission` into the `main(args)` workflow, invoked before the default usage fallback.

2. Unit Tests (`tests/unit/main.test.js`):
   - Mock the `fs` module or use `vi.spyOn` to simulate reading `MISSION.md`, returning a dummy mission string (e.g., "Dummy Mission Statement").
   - Verify that calling `main(['--mission'])`:
     • Does not output help, version, or digest messages.
     • Calls `console.log` exactly once with the dummy mission string.
   - Add a negative test: calling `main(['--not-mission'])` should **not** invoke `console.log` with mission content and should fall back to default usage output.

3. Documentation (`sandbox/README.md`):
   - Update the CLI Usage section to include `--mission` alongside `--help`, `--digest`, and `--version`:
     ```bash
     --mission                  Show the library's mission statement.
     ```
   - Add a short example in the README:
     ```bash
     $ agentic-lib --mission
     # prints contents of MISSION.md
     ```

Verification Steps:
- Run `npm test` and ensure all tests pass, including the new `--mission` tests.
- Execute manually:
  ```bash
  node src/lib/main.js --mission
  ```
  → Should output the full mission statement exactly as in `MISSION.md`.
- Confirm that `sandbox/README.md` lists and documents the new flag correctly.


LLM API Usage:

```json
{"prompt_tokens":7242,"completion_tokens":960,"total_tokens":8202,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":384,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```

---

