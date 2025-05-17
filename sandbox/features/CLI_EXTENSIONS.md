# Objective & Scope

Extend the existing CLI driver to support two new modes: interactive chat and HTTP server. Maintain all current flags (--help, --version, --digest) while integrating --chat and --serve capabilities to transform the library into both a chat client and a lightweight HTTP service.

# Value Proposition

- Empowers users to interact directly with the OpenAI Chat API from the CLI for instant conversational assistance.
- Provides a self-hosted HTTP interface for health checks, metrics, OpenAPI spec, and interactive documentation.
- Leverages existing modules with no additional external dependencies.
- Aligns with the mission to power autonomous workflows through both CLI and HTTP interfaces.

# Success Criteria & Requirements

1. Introduce a --chat [message] flag:
   • If a message is supplied, send it to OpenAI.createChatCompletion as a single prompt and output the response content as JSON.
   • If the flag is provided without an argument, read from stdin until EOF, then send the collected text.
   • On success, print to stdout and exit with code 0. On API errors, return a non-zero exit code.

2. Introduce a --serve flag:
   • When invoked, import and call startServer from sandbox/source/server.js.
   • Respect optional port override via --port <number> or PORT environment variable (default 3000).
   • Serve endpoints: /health, /metrics, /openapi.json, /docs.
   • Exit non-zero if the server fails to start.

3. Preserve global callCount. If VERBOSE_STATS is enabled, surface callCount and uptime after each operation.

4. Ensure existing flags (--help, --version, --digest) continue to function without regression.

# Testability & Stability

- Unit tests for processChat and processServe functions:
  • Mock openai.OpenAIApi to simulate chat responses.
  • Mock sandbox/source/server.js startServer to verify invocation.
- Integration tests:
  • CLI invocation with --chat "hello" asserting valid JSON output.
  • CLI invocation reading stdin for --chat without argument.
  • CLI invocation with --serve, then GET /health and /metrics to verify responses.
- Ensure tests run under vitest without network calls or port collisions.

# Dependencies & Constraints

- No new dependencies; use openai, http, and existing modules.
- Compatible with Node 20, ESM modules, linting, and formatting rules.
- CLI operations must not block each other or leak resources.

# User Scenarios & Examples

Single-shot chat:

npx agentic-lib --chat "What is the best practice for rate limiting?"

Streaming chat via stdin:

echo "Summarize today's logs" | npx agentic-lib --chat

Server mode:

npx agentic-lib --serve --port 4000
curl http://localhost:4000/health

# Verification & Acceptance

- All new tests pass with coverage above 90%.
- Manual CLI runs produce valid JSON for chat and HTML or text for HTTP endpoints.
- No regressions in existing help, version, or digest behaviors.