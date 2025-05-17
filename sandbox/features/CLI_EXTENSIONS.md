# Objective & Scope

Extend the existing CLI driver to support both interactive chat and HTTP server modes through two new flags. Maintain all current flags (--help, --version, --digest) while integrating --chat and --serve capabilities to transform agentic-lib into both a chat client and a lightweight HTTP service.

# Value Proposition

- Provides users with a built-in chat interface and a self-hosted API for health checks, metrics, OpenAPI, and interactive docs.
- Leverages existing OpenAI SDK and server modules with no new external dependencies.
- Aligns with the mission to power autonomous workflows through both CLI and HTTP interfaces, enabling rapid prototyping and integrations.

# Success Criteria & Requirements

- Introduce a new --chat <message> flag. When provided with a message, send it to OpenAI createChatCompletion and output the response content as JSON. When provided without a message, read from stdin until EOF and then send.
- Introduce a new --serve flag. When invoked, call startServer from sandbox/source/server.js on the configured port, allowing HTTP endpoints /health, /metrics, /openapi.json, and /docs to be served.
- Preserve global callCount. If VERBOSE_STATS is enabled, surface callCount and uptime after each operation.
- Return exit code 0 on success and non-zero on API or server startup errors.

# Testability & Stability

- Add unit tests for processChat and processServe functions, mocking OpenAI API and HTTP server startup.
- Add integration tests invoking CLI with --chat "hello world" and asserting JSON output, and invoking CLI with --serve then performing GET requests to /health and /metrics to verify responses.
- Mock openai.OpenAIApi and http.createServer in vitest to prevent external network calls and port collisions.

# Dependencies & Constraints

- No new dependencies; use openai package and built-in http module.
- Compatible with Node 20, ESM modules, and existing linting and formatting rules.
- CLI operations must remain non-blocking and not interfere with each other.

# User Scenarios & Examples

Single-shot chat:

npx agentic-lib --chat "What is the best practice for rate limiting?"

Server mode:

npx agentic-lib --serve

Then visit http://localhost:3000/health to verify status.

# Verification & Acceptance

- All new tests pass under npm test with coverage above 90%.
- Manual CLI runs produce valid JSON responses for chat and serve expected HTML or text for HTTP endpoints.
- No regressions in help, version, or digest flags and existing server handlers.