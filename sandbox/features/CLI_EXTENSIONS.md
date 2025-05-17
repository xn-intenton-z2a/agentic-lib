# Objective & Scope

Extend the existing CLI driver to support an additional streaming chat mode in addition to interactive chat and HTTP server. Preserve all current flags (--help, --version, --digest, --chat, --serve) and add a --stream flag that invokes the OpenAI streaming API, emitting partial responses as they arrive.

# Value Proposition

- Allows users to receive incremental responses for long-running or detailed prompts without waiting for full completion.
- Provides low-latency feedback loops in CLI workflows, improving conversational experience and debugging capabilities.
- Maintains consistency with existing CLI modes and leverages the same OpenAI client and server architecture.
- Aligns with the mission to power autonomous workflows with real-time interaction and observability.

# Success Criteria & Requirements

1. Introduce a --stream [message] flag:
   • If a message argument is provided, call OpenAIApi.createChatCompletion with stream: true and the supplied prompt.
   • If the flag is provided without an argument, read from stdin until EOF, then stream the accumulated prompt.
   • As streaming chunks arrive, print each chunk’s content to stdout without buffering the full response.
   • On completion, exit with code 0. On API errors or network errors, emit an error log and exit with non-zero code.

2. Backward compatibility:
   • All existing flags (--help, --version, --digest, --chat, --serve) continue to function without regression.
   • Global callCount and VERBOSE_STATS behavior remain unchanged and surface after streaming if enabled.

3. Implementation details:
   • Use the OpenAI client’s streaming interface by setting stream: true in the request payload.
   • Pipe the response data events to process.stdout as they arrive, handling JSON chunks or plain text.
   • Ensure proper resource cleanup on completion or error to avoid hanging streams.

# Testability & Stability

- Unit tests for processStream function:
  • Mock openai.OpenAIApi.createChatCompletion to simulate a ReadableStream of chunks.
  • Verify that partial data chunks are written to stdout in order and that end-of-stream triggers exit.
  • Simulate API errors to assert non-zero exit code and error logging via logError.

- Integration tests:
  • CLI invocation with --stream "hello" asserting stdout contains incremental messages in sequence.
  • CLI invocation reading stdin for --stream without argument, piping input and verifying streaming output.
  • Ensure VERBOSE_STATS output appears after streaming when enabled.

# Dependencies & Constraints

- No new dependencies; reuse openai streaming support and built-in stream handling.
- Compatible with Node 20, ESM modules, linting, and formatting rules.
- Streaming mode must not interfere with existing synchronous CLI flags or HTTP server.

# User Scenarios & Examples

Streaming chat in one shot:

npx agentic-lib --stream "Tell me a joke in five parts"

Live-streaming chat via stdin:

echo "Explain recursive functions" | npx agentic-lib --stream

# Verification & Acceptance

- All new streaming tests pass with coverage above 90%.
- Manual CLI streaming produces partial JSON or text chunks in real time.
- No regressions in existing chat, help, version, digest, or serve behaviors.
