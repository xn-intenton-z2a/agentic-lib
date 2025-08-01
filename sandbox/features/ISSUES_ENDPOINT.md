# Objective
Provide HTTP endpoints on the MCP server to list and create GitHub issues programmatically by leveraging existing agentic-lib core functions. Clients can retrieve open issues or create new ones via simple JSON-based requests.

# Endpoints

## GET /issues
- Description: Retrieve all open issues in the repository.
- Request: No query parameters.
- Behavior:
  • Call listIssues() from src/lib/main.js to fetch an array of issue objects.
  • On success: Respond HTTP 200 with JSON array of issues, each including number, title, body, state, and url.
  • On error: Log with logError and respond HTTP 500 with JSON { error: string }.

## POST /issues
- Description: Create a new GitHub issue in the repository.
- Request:  JSON body { title: string, body?: string }.
- Validation:
  • title must be a non-empty string; otherwise respond HTTP 400 with JSON { error: "Title is required" }.
- Behavior:
  • Call createIssue({ title, body }) from src/lib/main.js.
  • On success: Respond HTTP 201 with JSON of the created issue (number, title, body, state, url).
  • On error: Log with logError and respond HTTP 500 with JSON { error: string }.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock listIssues() to return a fixed array; send GET /issues and assert HTTP 200 and matching JSON.
- Mock createIssue() to return a sample issue; send POST /issues with valid body and assert HTTP 201 and JSON.
- Send POST /issues with missing or empty title and assert HTTP 400 and error message.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app) in Vitest hooks.
- Perform GET /issues and assert status 200 and array structure.
- Perform POST /issues with valid body and assert status 201 and created issue fields.
- Perform POST /issues with invalid body and assert status 400 and error JSON.

# Documentation

## sandbox/docs/API.md
Add under Endpoints:

### GET /issues
- Description: List open repository issues.
- Example:
  ```bash
  curl http://localhost:3000/issues
  ```
- Response:
  ```json
  [ { "number": 1, "title": "Bug", "body": "...", "state": "open", "url": "..." } ]
  ```

### POST /issues
- Description: Create a new issue.
- Request:
  ```bash
  curl -X POST http://localhost:3000/issues \
       -H 'Content-Type: application/json' \
       -d '{ "title": "New issue", "body": "Details" }'
  ```
- Success Response (201):
  ```json
  { "number": 2, "title": "New issue", "body": "Details", "state": "open", "url": "..." }
  ```
- Error (400):
  ```json
  { "error": "Title is required" }
  ```

## sandbox/README.md
Under "MCP HTTP API" add:

- **/issues** (GET): List open GitHub issues.
- **/issues** (POST): Create a new issue. Body: `{ title: string, body?: string }`.
  Example:
  ```bash
  curl -X POST http://localhost:3000/issues \
       -H 'Content-Type: application/json' \
       -d '{ "title": "New issue" }'
  ```