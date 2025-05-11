# Simulate Workflow

## Purpose
Extend the existing dry-run engine to expose a lightweight HTTP API endpoint for workflow simulation, enabling programmatic access over HTTP as well as the existing CLI and library interfaces.

## Value Proposition
- Allow other services and dashboards to integrate workflow simulation without invoking CLI or embedding code.
- Support interactive web clients or automation systems to fetch simulation plans or Graphviz DOT graphs.
- Maintain backward compatibility with existing CLI and library usages while adding an HTTP layer.

## Success Criteria
1. A new HTTP server can be started via a `--serve-api [port]` CLI flag or by calling a new `startSimulationServer(port)` export.
2. The server listens on the specified port and exposes a GET `/simulate-workflow` endpoint.
3. The endpoint accepts query parameters:
   - `file` (required): path to workflow YAML file.
   - `recursive` (optional, boolean, default false): whether to resolve nested reusable workflows.
   - `graph` (optional, boolean, default false): whether to return Graphviz DOT representation.
4. The endpoint returns HTTP 200 with a JSON body containing the same keys as the library API (`triggers`, `jobs`, `calls`) and, if requested, an additional `dot` field.
5. Errors (file read or parse failures) return HTTP 400 with a JSON error message and HTTP 500 for unexpected failures.
6. Existing CLI flags `--simulate-workflow`, `--recursive`, and `--graph` continue to work unchanged.
7. Tests cover server startup, valid simulation requests, missing parameters, error responses, and graph output paths.

## Implementation Details
1. Add a dependency on Express or use Node.js built-in `http` module to spawn a server in `sandbox/source/main.js` alongside the CLI logic.
2. Implement and export `startSimulationServer(port: number): Promise<http.Server>` that:
   - Initializes the HTTP server,
   - Registers the `/simulate-workflow` route,
   - Parses query parameters,
   - Invokes the existing `simulateWorkflow(filePath, { recursive, graph })` (update signature to accept an options object) to retrieve results,
   - Serializes the result or error into JSON responses with appropriate status codes.
3. Update `simulateWorkflow` signature to accept an optional options object `{ recursive?, graph? }` (default false) for use in both CLI and HTTP layers.
4. Update CLI entrypoint to parse a new `--serve-api [port]` flag; if present, call `startSimulationServer(port)` and log a startup message, then keep the process running.
5. Retain JSON logging format for errors and info, adjusting log levels for HTTP requests.

## Testing
- Create new tests in `sandbox/tests/simulate-workflow-api.test.js` using built-in Node.js HTTP client or a lightweight testing helper:
  - Verify that GET `/simulate-workflow?file=...` returns expected JSON for a simple workflow.
  - Test recursive and graph flags in query string.
  - Test missing `file` parameter returns HTTP 400 with error message.
  - Simulate file read errors and invalid YAML to confirm HTTP 400 or 500 codes.
- Mock filesystem reads with Vitest mocks for nested workflows and error conditions.

## Documentation
- Update `sandbox/docs/SIMULATE_WORKFLOW.md` with an **HTTP API** section describing the new endpoint, parameters, and example responses.
- Update `sandbox/README.md` to include instructions for the new `--serve-api` flag and code snippet for using `startSimulationServer` in a Node.js project.
- Ensure all new API surfaces are documented with examples and acceptance criteria.
