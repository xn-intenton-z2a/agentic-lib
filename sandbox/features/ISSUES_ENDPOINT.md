# Objective
Provide HTTP endpoints to list and create GitHub issues via the MCP server, enabling clients to interact with repository issues programmatically using existing agentic-lib functions.

# Endpoints

## GET /issues
- Description: Retrieve a list of open issues in the repository.
- Behavior:
  • Call listIssues() imported from src/lib/main.js to fetch issue data.
  • On success: respond HTTP 200 with JSON array of issue objects, each containing number, title, body, state, and url.
  • On error: log error and respond HTTP 500 with JSON { error: <message> }.

## POST /issues
- Description: Create a new GitHub issue in the repository.
- Request: JSON body { title: string, body?: string }.
- Validation: title must be non-empty; invalid payload returns HTTP 400 with JSON { error: "Title is required" }.
- Behavior:
  • Call createIssue() imported from src/lib/main.js with provided title and body.
  • On success: respond HTTP 201 with JSON of the created issue (number, title, body, state, url).
  • On error: log error and respond HTTP 500 with JSON { error: <message> }.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock listIssues() to return a fixed array; send GET /issues and assert HTTP 200 and correct JSON output.
- Mock createIssue() to return a sample issue; send POST /issues with valid payload and assert HTTP 201 and the returned issue fields.
- Send POST /issues with missing or empty title and assert HTTP 400 and correct error message.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start the server via createServer(app) in Vitest async hooks.
- Perform GET /issues and assert status 200 and array of issues.
- Perform POST /issues with valid JSON and assert status 201 and correct fields.
- Perform POST /issues with invalid JSON (missing title) and assert status 400 and error response.

# Documentation

## sandbox/docs/API.md
Add under Endpoints:

### GET /issues
- Description: List open repository issues.
- Example:
  curl http://localhost:3000/issues
- Response:
  [ { number: 1, title: "Bug", body: "Details", state: "open", url: "..." } ]

### POST /issues
- Description: Create a new issue.
- Request:
  curl -X POST http://localhost:3000/issues \
       -H 'Content-Type: application/json' \
       -d '{ "title": "New issue", "body": "Details" }'
- Success (201):
  { number: 2, title: "New issue", body: "Details", state: "open", url: "..." }
- Error (400):
  { error: "Title is required" }

## sandbox/README.md
In the "MCP HTTP API" section, add:
- `/issues` (GET): List open GitHub issues.
- `/issues` (POST): Create a new issue. Body: { title: string, body?: string }.
  Example:
  curl -X POST http://localhost:3000/issues \
       -H 'Content-Type: application/json' \
       -d '{ "title": "New issue" }'
