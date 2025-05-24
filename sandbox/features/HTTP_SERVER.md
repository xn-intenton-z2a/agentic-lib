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
