# Objective
Extend the MCP HTTP server to provide GitHub issue management endpoints, allowing clients to list and create repository issues programmatically using existing agentic-lib core functions.

# Endpoints

## GET /issues
- Description: Retrieve a list of open issues in the repository.
- Request: No parameters.
- Behavior:
  • Call listIssues() from src/lib/main.js to fetch issues.
  • On success: respond HTTP 200 with JSON array of issue objects, each containing at least: number, title, body, state, and url.
  • On error: logError and respond HTTP 500 with JSON { "error": <message> }.

## POST /issues
- Description: Create a new GitHub issue in the repository.
- Request: Content-Type application/json. Body must include:
  • title: non-empty string (required)
  • body: optional string
- Behavior:
  • Validate presence of title; if missing or empty, respond HTTP 400 with JSON { "error": "Title is required" }.
  • Call createIssue({ title, body }) from src/lib/main.js.
  • On success: respond HTTP 201 with JSON object of the created issue (number, title, body, state, url).
  • On error: logError and respond HTTP 500 with JSON { "error": <message> }.

# Implementation Details
1. Import `listIssues` and `createIssue` from `src/lib/main.js` in `sandbox/source/server.js`.
2. Add route handler for GET `/issues` above the catch-all error middleware.
3. Add JSON validation for POST `/issues`, reusing Zod or simple check for title.
4. Use existing `logInfo` for request logging and `logError` for errors.
5. Only modify `sandbox/source/server.js`, add or update tests in `sandbox/tests`, and update `sandbox/docs/API.md` and `sandbox/README.md`.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `listIssues()` to return a fixed array; test GET `/issues` returns HTTP 200 and correct JSON.
- Mock `createIssue()` to return a sample issue; test POST `/issues` with valid payload returns HTTP 201 and JSON matching the mock.
- Test POST `/issues` without title or with empty title returns HTTP 400 and correct error JSON.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server with `createServer(app)` in Vitest hooks.
- Test GET `/issues` end-to-end: expect HTTP 200 and an array of issues.
- Test POST `/issues` with valid JSON: expect HTTP 201 and correct issue fields.
- Test POST `/issues` with invalid JSON (missing title): expect HTTP 400 and error message.

# Documentation

## `sandbox/docs/API.md`
- Under **Endpoints**, add sections for GET `/issues` and POST `/issues`, describing request, response examples, and error cases.

## `sandbox/README.md`
- In the **MCP HTTP API** section, add bullets:
  - `/issues` – list open repository issues (GET)
  - `/issues` – create a new issue (POST) with JSON payload `{ title, body? }`
  - Include sample cURL and JavaScript `fetch` examples.
