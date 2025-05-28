# Objective
Provide API key authentication middleware for the MCP HTTP server to restrict access to authorized clients and secure all endpoints.

# Middleware Configuration

- Read a single API key from environment variable MCP_API_KEY at startup.
- Require each HTTP request to include header Authorization: Bearer <MCP_API_KEY>.
- Reject requests that omit the header or supply an incorrect token.

# Implementation

1. In sandbox/source/server.js, before registering any routes, add an authentication middleware:
   • Read Authorization header from request.
   • If missing or not matching process.env.MCP_API_KEY, respond with HTTP 401 and JSON { error: "Unauthorized" }.
2. Validate MCP_API_KEY on server startup:
   • If process.env.MCP_API_KEY is undefined, logError and exit process.
3. Ensure the middleware applies globally so that /health, /mission, /features, /invoke, /stats, and /openapi.json all require valid credentials.

# Success Criteria & Requirements

- The server fails to start if MCP_API_KEY is not defined in environment.
- Any request without a valid Bearer token returns HTTP 401 and JSON { error: "Unauthorized" }.
- Requests with correct token are routed to existing handlers and return normal responses.
- No additional external dependencies required.

# Testing

## Unit Tests (sandbox/tests/server.unit.test.js)
- Mock process.env.MCP_API_KEY to a known value.
- Test GET /health, POST /invoke, GET /stats, GET /openapi.json with:
  • No Authorization header: expect 401 Unauthorized.
  • Invalid token: expect 401 Unauthorized.
  • Valid token: expect 200 and correct response body.

## Integration Tests (sandbox/tests/server.integration.test.js)
- Start server with MCP_API_KEY set in environment.
- Perform authorized and unauthorized requests across all endpoints:
  • Verify endpoints return 200 when provided a correct Bearer token.
  • Verify endpoints return 401 when header is missing or incorrect.

# Documentation

- Update sandbox/docs/API.md:
  • In each endpoint section, add an Authentication subsection:
    Authorization: Bearer <API_KEY>
- Update sandbox/README.md:
  • In the "MCP HTTP API" section, add instructions and examples showing how to include Authorization header for curl and fetch, e.g.:
    ```bash
    curl -H "Authorization: Bearer $MCP_API_KEY" http://localhost:3000/health
    ```