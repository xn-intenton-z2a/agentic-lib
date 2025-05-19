# Purpose
Extend the existing CLI to provide both programmatic HTTP access and flexible SQS event injection for local development and automation.

# Value Proposition
Developers and automation systems can integrate with agentic-lib programmatically via HTTP or simulate SQS-driven workflows locally by supplying custom event payloads. This streamlines testing, debugging, and integration in CI/CD pipelines without spawning separate CLI processes or hard-coding example events.

# Success Criteria & Requirements
1. HTTP Server Startup
   • Add a --http flag to main() to launch an HTTP server on a configurable port (default 3000).
   • Support an optional --http-port <port> flag or HTTP_PORT environment variable.
   • When --http is provided, skip CLI flag processing and start server.
2. Runtime Stats Endpoint
   • GET /api/stats returns JSON { callCount: number, uptime: number }.
3. AI Chat Endpoint
   • POST /api/chat accepts JSON { prompt: string, chatJson?: boolean }, invokes OpenAI chat completion, and responds with plain text or raw JSON.
4. GitHub Issue Endpoint
   • POST /api/issue accepts JSON { title: string, body: string, labels?: string[] }, posts to GitHub issues API, and returns issue metadata.
5. CLI Flags Compatibility
   • Preserve existing --stats, --chat, --issue, --help, --version flags unchanged when --http and --sqs-file are absent.
6. SQS Event Injection
   • Add --sqs-file <path> flag to read a JSON file or '-' for STDIN.
   • Parse the file as an SQS event (Records array or single record), invoke digestLambdaHandler for each record, increment global callCount per record.
   • Report success summary with processed record count and any failures to stderr.

# Implementation Details
• Consolidate HTTP server logic and CLI flag parsing in src/lib/main.js.
• Implement serveHttp(args) handling with Node built-in http module; reuse processChat and processIssue in HTTP handlers.
• Extend processDigest to handle both hard-coded example and file input under --sqs-file flag, delegating to digestLambdaHandler.
• Update generateUsage() to document new --http, --http-port, and --sqs-file flags.
• Ensure no new external dependencies; use existing Node 20 built-ins and Zod for argument validation.

# Verification & Acceptance
• Add unit tests in tests/unit/main.test.js to mock http.createServer and file/STDIN reads for --sqs-file.
• Test HTTP endpoints, custom ports, error handling, and fallback to CLI behavior.
• Verify digestLambdaHandler invocation counts and batchItemFailures for malformed records.
• Ensure existing CLI tests for --stats, --chat, and --issue remain green.