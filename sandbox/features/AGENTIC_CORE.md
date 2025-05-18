# Config Endpoint

## Purpose

Provide a programmatic way to inspect the running server configuration at runtime. This endpoint helps users and automated agents verify and troubleshoot environment variable settings without accessing logs or process internals.

## HTTP Server Changes

- Add GET /config endpoint to return the effective configuration object as JSON. The payload includes:
  - port: number
  - corsAllowedOrigins: string
  - rateLimitRequests: number
  - metricsUser: string or null
  - docsUser: string or null
  - Any additional config properties defined in environment schema
- No authentication required but respects CORS_ALLOWED_ORIGINS header.
- Update OpenAPI spec with new /config path.

## Tests

- Add new tests in sandbox/tests/server.test.js:
  - GET /config returns 200 and JSON with expected keys and types.
  - Response includes numeric and string values matching process.env defaults or overrides.
  - CORS header present for allowed origins.

## Documentation

- Update sandbox/docs/SERVER.md:
  - Document GET /config endpoint under Endpoints section.
  - Include example response JSON and usage notes.
- Update sandbox/README.md Key Features section to mention Config Endpoint.

## Success Criteria

- Automated tests pass covering /config endpoint behavior.
- OpenAPI schema includes /config with correct response schema.
- README and docs reflect new endpoint.

## Dependencies & Constraints

- No new dependencies required.
- Implementation must follow existing handler pattern.

## Verification & Acceptance

- Unit tests verify structure and status code.
- Manual request to http://<host>/config returns current config.
