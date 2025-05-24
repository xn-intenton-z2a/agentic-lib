# Mission Statement

**agentic‑lib** Is a JavaScript library which can be used as a drop in JS implementation or wholesale replacement for 
the steps, jobs, and re-usable workflows below in this repository. It is designed to be used in a GitHub Actions 
workflow to enable your repository to operate in an “agentic” manner. In our system, autonomous workflows communicate
through branches and issues to continuously review, fix, update, and evolve your code. Each workflow is designed to be
invoked using GitHub’s `workflow_call` event, so they can be composed together like an SDK.
## Maintain Feature at 2025-05-24T22:20:51.279Z

Maintained feature HTTP_SERVER.

Feature spec:

# HTTP Server Mode

## Objective

Provide an HTTP API mode for the CLI to support health checks and configuration inspection when running with the --serve flag.

## Endpoints

### GET /health
- Returns HTTP 200 with a JSON body:
  {
    "status": "ok",
    "uptime": <seconds-of-process-uptime>
  }

### GET /config
- Returns HTTP 200 with the current application configuration as loaded from environment variables or .env file.
  {
    "GITHUB_API_BASE_URL": <string>,
    "OPENAI_API_KEY": <string>
  }

## Requirements

- Add a new command line flag --serve to the existing CLI. When provided, start an Express server and skip other CLI processing.
- Use the PORT environment variable or default to 3000.
- Mount two routes: /health and /config.
- Log all incoming HTTP requests with logInfo.
- Ensure the server cleanly handles shutdown on SIGINT and SIGTERM.

## Success Criteria & Verification

- Manual: Running node sandbox/source/main.js --serve starts a listening server on the configured port.
- Automated: Write supertest-based tests to validate /health and /config responses.
- All existing tests continue passing.

## User Scenarios

- As a CI operator, I can deploy agentic-lib in HTTP mode to poll /health before invoking agentic workflows.
- As a developer, I can query /config on a running instance to verify correct environment variable loading.


Git diff:

```diff
diff --git a/sandbox/features/FEATURE.md b/sandbox/features/FEATURE.md
deleted file mode 100644
index 577d98c2..00000000
--- a/sandbox/features/FEATURE.md
+++ /dev/null
@@ -1 +0,0 @@
- as mentioned in reply \n\n// New [sandbox/features/HTTP_SERVER.md]:\n# HTTP Server Mode

## Objective

Provide an HTTP API mode for the CLI to support health checks and configuration inspection when running with the --serve flag.

## Endpoints

### GET /health
- Returns HTTP 200 with a JSON body:
  {
    "status": "ok",
    "uptime": <seconds-of-process-uptime>
  }

### GET /config
- Returns HTTP 200 with the current application configuration as loaded from environment variables or .env file.
  {
    "GITHUB_API_BASE_URL": <string>,
    "OPENAI_API_KEY": <string>
  }

## Requirements

- Add a new command line flag --serve to the existing CLI. When provided, start an Express server and skip other CLI processing.
- Use the PORT environment variable or default to 3000.
- Mount two routes: /health and /config.
- Log all incoming HTTP requests with logInfo.
- Ensure the server cleanly handles shutdown on SIGINT and SIGTERM.

## Success Criteria & Verification

- Manual: Running node sandbox/source/main.js --serve starts a listening server on the configured port.
- Automated: Write supertest-based tests to validate /health and /config responses.
- All existing tests continue passing.

## User Scenarios

- As a CI operator, I can deploy agentic-lib in HTTP mode to poll /health before invoking agentic workflows.
- As a developer, I can query /config on a running instance to verify correct environment variable loading.
```

LLM API Usage:

```json
{"prompt_tokens":6167,"completion_tokens":1013,"total_tokens":7180,"prompt_tokens_details":{"cached_tokens":0,"audio_tokens":0},"completion_tokens_details":{"reasoning_tokens":640,"audio_tokens":0,"accepted_prediction_tokens":0,"rejected_prediction_tokens":0}}
```
---

