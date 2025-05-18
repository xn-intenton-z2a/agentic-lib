# Mission Alignment

AGENTIC_CORE consolidates all essential core capabilities of agentic-lib into a single coherent feature, fully realizing the mission to enable autonomous, continuous agentic interactions. It now includes an OpenAI Chat Utility to empower conversational agentic workflows.

# Feature Overview

- Environment Configuration
  Load and validate environment variables using dotenv and Zod to ensure consistent, reproducible conditions in autonomous workflows.
- Structured Logging Helpers
  Export logInfo and logError functions producing JSON-formatted logs with levels, timestamps, messages, and optional context for transparent audit trails.
- OpenAI Chat Utilities
  Export async chatCompletion function to call the OpenAI API with a messages array, process responses, and return parsed JSON content.
- AWS SQS Utilities & Lambda Handler
  Provide createSQSEventFromDigest to craft mock SQS events and digestLambdaHandler to process records with error handling, failure reporting, and support for AWS batchItemFailures semantics.
- CLI Interface
  Support --help, --version, and --digest flags in main CLI, enabling users to display usage instructions, version information with timestamp, and simulate SQS digest events.
- HTTP Server
  startServer function exposing critical endpoints: /health, /metrics, /openapi.json, /docs, all supporting CORS, Basic Auth when configured, and integrated rate-limit headers.

# OpenAI Chat Utilities

The chatCompletion function accepts an array of message objects and optional model parameters, uses the OpenAIApi client to request a chat completion, logs the request and response via logInfo, and returns the parsed JSON content. On API errors or invalid responses it logs detailed errors via logError and throws descriptive exceptions.

# Configuration & Environment Variables

- GITHUB_API_BASE_URL (optional)
- OPENAI_API_KEY (required for chatCompletion)
- PORT
- CORS_ALLOWED_ORIGINS
- RATE_LIMIT_REQUESTS
- METRICS_USER, METRICS_PASS
- DOCS_USER, DOCS_PASS

# Success Criteria & Acceptance

- chatCompletion returns correctly parsed JSON object when OpenAI API returns valid content.
- chatCompletion logs both request payload and response content via logInfo.
- chatCompletion throws and logs errors when API key is missing, invalid, or API call fails.
- Existing environment validation, logging, SQS utilities, CLI, and HTTP server functionality remain unaffected and continue to pass existing tests.

# Testability & Stability

- Vitest tests should cover chatCompletion success path by mocking OpenAIApi to return known content, and error path by simulating API failures.
- Ensure missing OPENAI_API_KEY triggers startup validation error before chatCompletion invocation.
- Maintain fail-safe mechanisms: unexpected errors in chatCompletion are captured and reported without crashing other features.