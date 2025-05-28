# Objective
Add GitHub issue management capabilities to the MCP HTTP server by implementing endpoints to list and create issues. This feature enables remote clients to programmatically inspect and create issues in the repository, directly supporting the mission of interacting with issues via the MCP API.

# Endpoints

## GET /issues
- Description: Retrieve a list of open issues from the configured GitHub repository.
- Behavior:
  • Read `GITHUB_API_BASE_URL` and `GITHUB_API_TOKEN` from environment.
  • Perform a GET request to `${GITHUB_API_BASE_URL}/repos/{owner}/{repo}/issues` with authorization header.
  • Return HTTP 200 and JSON array of issues, each containing `id`, `number`, `title`, `state`, and `html_url`.
  • On error, logError and return HTTP 502 with JSON `{ error: 'Failed to fetch issues' }`.

## POST /issues
- Description: Create a new issue in the configured GitHub repository.
- Request:
  • Content-Type: application/json
  • Body: `{ title: string, body?: string }`
- Behavior:
  • Validate that `title` is a non-empty string; return HTTP 400 if invalid.
  • Perform a POST request to `${GITHUB_API_BASE_URL}/repos/{owner}/{repo}/issues` with authorization header and JSON body.
  • Return HTTP 201 and JSON representation of the created issue on success.
  • On error, logError and return HTTP 502 with JSON `{ error: 'Failed to create issue' }`.

# Implementation Details
1. In `sandbox/source/server.js`:
   - Import `fetch` (built-in in Node 20).
   - Add route handlers for `GET /issues` and `POST /issues` before error handlers.
   - Read `GITHUB_API_BASE_URL` and `GITHUB_API_TOKEN` from `process.env`; fail-fast if missing at startup.
   - Use `logInfo`/`logError` for request start and error conditions.
2. Do not introduce any new files; update only `sandbox/source/server.js`, test files, docs, and README.

# Testing

## Unit Tests (`sandbox/tests/server.unit.test.js`)
- Mock `fetch` to simulate GitHub API responses.
- Test `GET /issues` returns HTTP 200 and correct JSON array when `fetch` resolves with sample issues.
- Test `GET /issues` returns HTTP 502 and error JSON when `fetch` rejects.
- Test `POST /issues` with valid input returns HTTP 201 and created issue JSON when `fetch` resolves.
- Test `POST /issues` with missing or empty `title` returns HTTP 400 with validation error.
- Test `POST /issues` returns HTTP 502 and error JSON when `fetch` rejects.

## Integration Tests (`sandbox/tests/server.integration.test.js`)
- Start the server via `createServer(app)` in Vitest hooks.
- Set environment variables `GITHUB_API_BASE_URL` and `GITHUB_API_TOKEN` to a mock server or intercept via `msw` or similar.
- For `GET /issues`, stub external API and verify response shape and status.
- For `POST /issues`, send valid and invalid bodies and verify status codes and responses.

# Documentation

## `sandbox/docs/API.md`
Add under Endpoints:

### GET /issues
- Description: List open issues.
- Example:
  ```bash
  curl -H "Authorization: Bearer $GITHUB_API_TOKEN" http://localhost:3000/issues
  ```
- Response:
  ```json
  [ { "id": 123, "number": 45, "title": "Bug report", "state": "open", "html_url": "..." }, ... ]
  ```

### POST /issues
- Description: Create a new issue.
- Example:
  ```bash
  curl -X POST -H "Content-Type: application/json" -H "Authorization: Bearer $GITHUB_API_TOKEN" \
       -d '{"title":"New bug","body":"Steps to reproduce"}' http://localhost:3000/issues
  ```
- Response (HTTP 201):
  ```json
  { "id": 124, "number": 46, "title": "New bug", "state": "open", "html_url": "..." }
  ```

## `sandbox/README.md`
- Under **MCP HTTP API**, add:
  - `/issues` (GET) – list open issues; requires `Authorization: Bearer $GITHUB_API_TOKEN` header.
  - `/issues` (POST) – create a new issue; requires JSON body with `title` and optional `body`.
