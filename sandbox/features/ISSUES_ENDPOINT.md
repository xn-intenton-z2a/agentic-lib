# Objective
Provide HTTP endpoints to list and create GitHub issues via the MCP server, enabling clients to interact with repository issues programmatically through the existing agentic-lib core functions.

# Endpoints

## GET /issues
- Description: Retrieve a list of open issues in the repository.
- Request: No parameters.
- Behavior: Import and call the library function listIssues() from src/lib/main.js, which returns an array of issue objects.
- Response: HTTP 200 with JSON array of issues, each containing at minimum: number, title, body, state.
- Error handling: On failure, log error and return HTTP 500 with JSON { error: <message> }.

## POST /issues
- Description: Create a new issue in the repository.
- Request: JSON body { title: string, body?: string }.
- Validation: title must be non-empty; otherwise return HTTP 400 with JSON { error: "Title is required" }.
- Behavior: Import and call createIssue({ title, body }) from src/lib/main.js to perform GitHub API call.
- Response: HTTP 201 with JSON of the created issue object including number, title, body, state, url.
- Error handling: On validation failure return HTTP 400; on library error log and return HTTP 500 with JSON { error: <message> }.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock listIssues and createIssue to return predetermined values.
- Test GET /issues returns HTTP 200 and the mocked array.
- Test POST /issues with valid payload returns HTTP 201 and mocked issue.
- Test POST /issues without title returns HTTP 400 and correct error message.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server via createServer(app).
- Test GET /issues returns an array of issues.
- Test POST /issues creates an issue and returns HTTP 201 and correct fields.
- Mock actual library functions in integration to isolate behavior.

# Documentation & README
- Update sandbox/docs/API.md under Endpoints:
  ### GET /issues
  - Description, response example.
  ### POST /issues
  - Request schema, sample cURL and fetch example, response example.
- Update sandbox/README.md in "MCP HTTP API" section to reference the new issue endpoints with usage instructions.

# Dependencies & Constraints
- Use existing library exports listIssues and createIssue in src/lib/main.js; if not present, define and export them there.
- Maintain Node 20 ESM compatibility.
- Keep implementation confined to sandbox/source/server.js, sandbox/tests/, and sandbox/docs/, and sandbox/README.md.
