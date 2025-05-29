# Objective
Extend the existing MCP HTTP server to support GitHub issue management alongside the core agentic-lib commands. Remote clients can now list open issues and create new ones programmatically via HTTP endpoints, reusing existing library functions.

# Endpoints

## GET /issues
- Description: Retrieve all open issues in the repository.
- Behavior:
  • Call listIssues() from src/lib/main.js.
  • On success: HTTP 200 and JSON array of issue objects with fields: number, title, body, state.
  • On error: logError and return HTTP 500 with JSON `{ error: <message> }`.

## POST /issues
- Description: Create a new GitHub issue.
- Request:
  • Content-Type: application/json
  • Body: `{ title: string, body?: string }`.
- Validation:
  • `title` is required and non-empty; otherwise HTTP 400 with JSON `{ error: "Title is required" }`.
- Behavior:
  • Call createIssue({ title, body }) from src/lib/main.js.
  • On success: HTTP 201 and JSON of created issue (number, title, body, state, url).
  • On error: logError and return HTTP 500 with JSON `{ error: <message> }`.

# Implementation Details
1. Import `listIssues` and `createIssue` from `src/lib/main.js` in `sandbox/source/server.js`.
2. Add validation middleware for POST /issues to enforce request schema.
3. Insert route handlers before existing error middleware, using `logInfo` for request logging and `logError` for failures.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock listIssues() to return a fixed array, verify GET /issues returns HTTP 200 and correct JSON.
- Mock createIssue() to return a sample issue, test POST /issues with valid payload returns HTTP 201 and JSON.
- Test POST /issues with missing title returns HTTP 400 and correct error JSON.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start server with Supertest.
- GET /issues: assert 200 and array structure matches real `sandbox/MISSION.md` or stub.
- POST /issues: send valid JSON, assert 201 and returned issue fields.
- POST /issues with invalid body: assert 400 and error message.

# Documentation

## `sandbox/docs/API.md`
- Add under Endpoints:
  ### GET /issues
  ...description and response example...
  ### POST /issues
  ...request schema, sample cURL and fetch examples, response example...

## `sandbox/README.md`
- In "MCP HTTP API" section, add:
  - `/issues` – list open issues
  - `/issues` (POST) – create a new issue