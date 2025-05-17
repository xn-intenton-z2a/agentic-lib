# Objective & Scope
Extend event processing in the library to handle AWS SQS digest events, GitHub webhook events, and GitHub Actions workflow_call events. Provide CLI flags, HTTP endpoints, and auto-dispatch in GitHub Actions mode for flexible invocation and integration.

# Value Proposition
- Unify SQS digest, GitHub webhook, and Actions workflow dispatch in a single feature.
- Automate AI-driven comments on issues and pull requests when OPENAI_API_KEY is configured.
- Support CLI, HTTP API, and seamless GitHub Actions invocation without external wrappers.
- Provide health check endpoint for operational monitoring.

# Success Criteria & Requirements

Configuration Schema

- Extend config schema with detection of GITHUB_ACTIONS (boolean), GITHUB_EVENT_NAME, and GITHUB_EVENT_PATH.
- Validate required environment variables or inputs for each invocation mode.

GitHub Actions Mode

- Detect GITHUB_ACTIONS environment variable set to true.
- Read eventName from GITHUB_EVENT_NAME and payload path from GITHUB_EVENT_PATH.
- Dispatch to digestLambdaHandler for SQS events or gitHubEventHandler for issue and pull_request events.
- Output JSON to stdout containing handler, handledEvents, and failures.
- Exit code 0 for no fatal errors, non-zero on unhandled exceptions.

CLI Support

- Retain --digest flag for SQS digest simulation.
- Add --github-event <type> <payloadFile> to simulate GitHub events.
- Add --actions-simulate flag to mimic Actions mode locally by reading GITHUB_EVENT_* variables.

HTTP Server

- When HTTP_ENABLED is true, start HTTP server on HTTP_PORT.
- POST /events/digest dispatches to digestLambdaHandler.
- POST /events/github dispatches to gitHubEventHandler using X-GitHub-Event header or explicit type field.
- GET /healthz returns 200 with basic service info and version.

# Testability & Stability
- Add unit tests simulating Actions mode with fake environment variables and payload files.
- Add tests for /healthz endpoint returning expected JSON structure.
- Continue mocking fetch and OpenAIApi for event handler tests.

# Dependencies & Constraints
- Use Node 20 native http module; no new dependencies.
- Maintain ESM compatibility and existing coding style.

# User Scenarios & Examples
- GitHub Workflow: set GITHUB_ACTIONS, GITHUB_EVENT_NAME, and GITHUB_EVENT_PATH; run node src/lib/main.js; workflow parses JSON output.
- CLI: node src/lib/main.js --actions-simulate issues path/to/issue.json
- Health: curl http://localhost:3000/healthz

# Verification & Acceptance
- All existing and new tests pass with npm test.
- README updated with GitHub Actions integration section, CLI flags, and HTTP endpoints.
- Backward compatibility maintained for existing digest and webhook workflows.